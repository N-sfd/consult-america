import { hrRepository } from "@/lib/hr";
import {
  seedPayPeriods,
  seedPayrollRuns,
  seedPayslips,
} from "@/data/payroll/seed";
import { getActiveCompensation } from "@/lib/self-service/compensation-store";
import { getLeaveTypeById, listLeaveRequests } from "@/lib/self-service/leave-store";
import { listTimeEntries, listTimesheets } from "@/lib/self-service/time-store";
import type { PayPeriod, PayrollRun, Payslip } from "@/types/payroll";
import { ILLUSTRATIVE_WITHHOLDING_RATE } from "@/types/payroll";

const payPeriods: PayPeriod[] = structuredClone(seedPayPeriods);
const payrollRuns: PayrollRun[] = structuredClone(seedPayrollRuns);
const payslips: Payslip[] = structuredClone(seedPayslips);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function listPayPeriods() {
  return [...payPeriods].sort((a, b) =>
    b.periodStart.localeCompare(a.periodStart),
  );
}

export function getPayPeriodById(id: string) {
  return payPeriods.find((p) => p.id === id);
}

export function getCurrentPayPeriod() {
  return payPeriods.find((p) => p.status === "OPEN");
}

export function listPayrollRuns() {
  return [...payrollRuns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPayrollRunById(id: string) {
  return payrollRuns.find((r) => r.id === id);
}

export function getRunForPeriod(payPeriodId: string) {
  return payrollRuns.find((r) => r.payPeriodId === payPeriodId);
}

export function listPayslipsForEmployee(employeeId: string) {
  return payslips
    .filter((p) => p.employeeId === employeeId)
    .sort((a, b) => b.payDate.localeCompare(a.payDate));
}

export function getLatestPayslipForEmployee(employeeId: string) {
  return listPayslipsForEmployee(employeeId)[0];
}

export function getPayslipById(id: string) {
  return payslips.find((p) => p.id === id);
}

export function listPayslipsForRun(runId: string) {
  return payslips.filter((p) => p.runId === runId);
}

/** Approved regular hours + approved paid leave hours whose dates fall inside the period. */
function approvedHoursInPeriod(employeeId: string, period: PayPeriod) {
  let regularHours = 0;
  for (const sheet of listTimesheets(employeeId)) {
    if (sheet.status !== "APPROVED") continue;
    for (const entry of listTimeEntries(sheet.id)) {
      if (entry.workDate >= period.periodStart && entry.workDate <= period.periodEnd) {
        regularHours += entry.hours;
      }
    }
  }

  let paidLeaveHours = 0;
  for (const request of listLeaveRequests(employeeId)) {
    if (request.status !== "APPROVED") continue;
    if (request.startDate > period.periodEnd || request.endDate < period.periodStart) {
      continue;
    }
    const leaveType = getLeaveTypeById(request.leaveTypeId);
    if (leaveType?.paid) paidLeaveHours += request.hours;
  }

  return { regularHours, paidLeaveHours };
}

/**
 * Calculates (or recalculates) the run for a pay period from live compensation
 * + approved time + approved leave. Salaried pay is a flat per-period share of
 * annual salary; hourly pay is rate × (approved regular hours + approved paid
 * leave hours) in the period. Withholding is a single flat illustrative rate —
 * this is a demo calculator, not a tax engine.
 */
export async function calculatePayrollRun(payPeriodId: string) {
  const period = getPayPeriodById(payPeriodId);
  if (!period) throw new Error("Pay period not found");

  const employees = await hrRepository.listEmployees();
  const activeEmployees = employees.filter(
    (e) => e.employmentStatus === "ACTIVE",
  );

  let existing = getRunForPeriod(payPeriodId);
  if (existing && existing.status === "LOCKED") {
    throw new Error("This pay period is already locked");
  }

  const runId = existing?.id ?? createId("run");
  const calculatedAt = nowIso();
  const newPayslips: Payslip[] = [];
  let exceptionCount = 0;

  for (const employee of activeEmployees) {
    const compensation = getActiveCompensation(employee.id, period.periodEnd);
    if (!compensation) {
      exceptionCount += 1;
      continue;
    }

    let grossPay = 0;
    const earnings: Payslip["earnings"] = [];

    if (compensation.compensationType === "SALARY" && compensation.annualSalary) {
      grossPay = round2(compensation.annualSalary / 26);
      earnings.push({ code: "REG", label: "Regular Salary", amount: grossPay });
    } else if (compensation.compensationType === "HOURLY" && compensation.hourlyRate) {
      const { regularHours, paidLeaveHours } = approvedHoursInPeriod(
        employee.id,
        period,
      );
      const regularAmount = round2(regularHours * compensation.hourlyRate);
      const leaveAmount = round2(paidLeaveHours * compensation.hourlyRate);
      grossPay = round2(regularAmount + leaveAmount);
      if (regularHours > 0) {
        earnings.push({
          code: "REG",
          label: "Regular Hours",
          hours: regularHours,
          amount: regularAmount,
        });
      }
      if (paidLeaveHours > 0) {
        earnings.push({
          code: "LEAVE",
          label: "Paid Leave",
          hours: paidLeaveHours,
          amount: leaveAmount,
        });
      }
      if (grossPay === 0) exceptionCount += 1;
    } else {
      exceptionCount += 1;
      continue;
    }

    const withholding = round2(grossPay * ILLUSTRATIVE_WITHHOLDING_RATE);
    const netPay = round2(grossPay - withholding);

    const existingSlip = payslips.find(
      (p) => p.runId === runId && p.employeeId === employee.id,
    );
    const slip: Payslip = {
      id: existingSlip?.id ?? createId("pay"),
      runId,
      payPeriodId,
      employeeId: employee.id,
      payDate: period.payDate,
      earnings,
      deductions: [
        {
          code: "FED_WH",
          label: "Federal & State Withholding (illustrative)",
          amount: withholding,
        },
      ],
      grossPay,
      totalDeductions: withholding,
      netPay,
      createdAt: existingSlip?.createdAt ?? calculatedAt,
    };
    newPayslips.push(slip);
  }

  // Replace this run's payslips with the freshly calculated set.
  for (let i = payslips.length - 1; i >= 0; i -= 1) {
    if (payslips[i].runId === runId) payslips.splice(i, 1);
  }
  payslips.push(...newPayslips);

  const totals = newPayslips.reduce(
    (acc, slip) => ({
      gross: acc.gross + slip.grossPay,
      deductions: acc.deductions + slip.totalDeductions,
      net: acc.net + slip.netPay,
    }),
    { gross: 0, deductions: 0, net: 0 },
  );

  const run: PayrollRun = {
    id: runId,
    payPeriodId,
    status: "CALCULATED",
    employeeCount: newPayslips.length,
    totalGrossPay: round2(totals.gross),
    totalDeductions: round2(totals.deductions),
    totalNetPay: round2(totals.net),
    exceptionCount,
    calculatedAt,
    approvedAt: existing?.approvedAt,
    approvedByEmployeeId: existing?.approvedByEmployeeId,
    lockedAt: existing?.lockedAt,
    createdAt: existing?.createdAt ?? calculatedAt,
    updatedAt: calculatedAt,
  };

  if (existing) {
    Object.assign(existing, run);
  } else {
    payrollRuns.push(run);
  }

  period.status = "PROCESSING";
  period.updatedAt = calculatedAt;

  return getPayrollRunById(runId)!;
}

export function submitRunForReview(runId: string) {
  const run = getPayrollRunById(runId);
  if (!run) throw new Error("Payroll run not found");
  if (run.status !== "CALCULATED") {
    throw new Error("Only a calculated run can be submitted for review");
  }
  run.status = "UNDER_REVIEW";
  run.updatedAt = nowIso();
  return run;
}

export function approvePayrollRun(input: {
  runId: string;
  approverEmployeeId: string;
}) {
  const run = getPayrollRunById(input.runId);
  if (!run) throw new Error("Payroll run not found");
  if (run.status !== "UNDER_REVIEW" && run.status !== "CALCULATED") {
    throw new Error("Only a calculated or under-review run can be approved");
  }
  const actedAt = nowIso();
  run.status = "APPROVED";
  run.approvedAt = actedAt;
  run.approvedByEmployeeId = input.approverEmployeeId;
  run.updatedAt = actedAt;
  return run;
}

export function lockPayrollRun(runId: string) {
  const run = getPayrollRunById(runId);
  if (!run) throw new Error("Payroll run not found");
  if (run.status !== "APPROVED") {
    throw new Error("Only an approved run can be locked");
  }
  const actedAt = nowIso();
  run.status = "LOCKED";
  run.lockedAt = actedAt;
  run.updatedAt = actedAt;

  const period = getPayPeriodById(run.payPeriodId);
  if (period) {
    period.status = "CLOSED";
    period.updatedAt = actedAt;
  }

  return run;
}

/** Test-only: restore payroll store to seed state. */
export function resetPayrollStoreForTests() {
  payPeriods.splice(0, payPeriods.length, ...structuredClone(seedPayPeriods));
  payrollRuns.splice(0, payrollRuns.length, ...structuredClone(seedPayrollRuns));
  payslips.splice(0, payslips.length, ...structuredClone(seedPayslips));
}
