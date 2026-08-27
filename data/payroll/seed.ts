import type { PayPeriod, PayrollRun, Payslip } from "@/types/payroll";

const now = "2026-08-01T00:00:00.000Z";

/** Biweekly cadence, 5-day processing lag from period end to pay date. */
export const seedPayPeriods: PayPeriod[] = [
  {
    id: "pp-2026-07-13",
    periodStart: "2026-07-13",
    periodEnd: "2026-07-26",
    payDate: "2026-07-31",
    status: "CLOSED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "pp-2026-07-27",
    periodStart: "2026-07-27",
    periodEnd: "2026-08-09",
    payDate: "2026-08-14",
    status: "CLOSED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "pp-2026-08-10",
    periodStart: "2026-08-10",
    periodEnd: "2026-08-23",
    payDate: "2026-08-28",
    status: "CLOSED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "pp-2026-08-24",
    periodStart: "2026-08-24",
    periodEnd: "2026-09-06",
    payDate: "2026-09-11",
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
  },
];

/** Illustrative: emp-demo-001 $168,000/yr, emp-demo-002 $132,000/yr, ÷26 biweekly, 22% flat withholding. */
export const seedPayrollRuns: PayrollRun[] = [
  {
    id: "run-2026-07-13",
    payPeriodId: "pp-2026-07-13",
    status: "LOCKED",
    employeeCount: 2,
    totalGrossPay: 11538.46,
    totalDeductions: 2538.46,
    totalNetPay: 9000.0,
    exceptionCount: 0,
    calculatedAt: "2026-07-28T12:00:00.000Z",
    approvedAt: "2026-07-29T12:00:00.000Z",
    approvedByEmployeeId: "emp-demo-001",
    lockedAt: "2026-07-30T12:00:00.000Z",
    createdAt: "2026-07-28T12:00:00.000Z",
    updatedAt: "2026-07-30T12:00:00.000Z",
  },
  {
    id: "run-2026-07-27",
    payPeriodId: "pp-2026-07-27",
    status: "LOCKED",
    employeeCount: 2,
    totalGrossPay: 11538.46,
    totalDeductions: 2538.46,
    totalNetPay: 9000.0,
    exceptionCount: 0,
    calculatedAt: "2026-08-11T12:00:00.000Z",
    approvedAt: "2026-08-12T12:00:00.000Z",
    approvedByEmployeeId: "emp-demo-001",
    lockedAt: "2026-08-13T12:00:00.000Z",
    createdAt: "2026-08-11T12:00:00.000Z",
    updatedAt: "2026-08-13T12:00:00.000Z",
  },
  {
    id: "run-2026-08-10",
    payPeriodId: "pp-2026-08-10",
    status: "LOCKED",
    employeeCount: 2,
    totalGrossPay: 11538.46,
    totalDeductions: 2538.46,
    totalNetPay: 9000.0,
    exceptionCount: 0,
    calculatedAt: "2026-08-25T12:00:00.000Z",
    approvedAt: "2026-08-26T12:00:00.000Z",
    approvedByEmployeeId: "emp-demo-001",
    lockedAt: "2026-08-27T09:00:00.000Z",
    createdAt: "2026-08-25T12:00:00.000Z",
    updatedAt: "2026-08-27T09:00:00.000Z",
  },
];

function payslip(input: {
  id: string;
  runId: string;
  payPeriodId: string;
  employeeId: string;
  payDate: string;
  annualSalary: number;
}): Payslip {
  const gross = Math.round((input.annualSalary / 26) * 100) / 100;
  const withholding = Math.round(gross * 0.22 * 100) / 100;
  return {
    id: input.id,
    runId: input.runId,
    payPeriodId: input.payPeriodId,
    employeeId: input.employeeId,
    payDate: input.payDate,
    earnings: [{ code: "REG", label: "Regular Salary", amount: gross }],
    deductions: [
      {
        code: "FED_WH",
        label: "Federal & State Withholding (illustrative)",
        amount: withholding,
      },
    ],
    grossPay: gross,
    totalDeductions: withholding,
    netPay: Math.round((gross - withholding) * 100) / 100,
    createdAt: now,
  };
}

export const seedPayslips: Payslip[] = [
  payslip({
    id: "pay-001-2026-07-13",
    runId: "run-2026-07-13",
    payPeriodId: "pp-2026-07-13",
    employeeId: "emp-demo-001",
    payDate: "2026-07-31",
    annualSalary: 168000,
  }),
  payslip({
    id: "pay-002-2026-07-13",
    runId: "run-2026-07-13",
    payPeriodId: "pp-2026-07-13",
    employeeId: "emp-demo-002",
    payDate: "2026-07-31",
    annualSalary: 132000,
  }),
  payslip({
    id: "pay-001-2026-07-27",
    runId: "run-2026-07-27",
    payPeriodId: "pp-2026-07-27",
    employeeId: "emp-demo-001",
    payDate: "2026-08-14",
    annualSalary: 168000,
  }),
  payslip({
    id: "pay-002-2026-07-27",
    runId: "run-2026-07-27",
    payPeriodId: "pp-2026-07-27",
    employeeId: "emp-demo-002",
    payDate: "2026-08-14",
    annualSalary: 132000,
  }),
  payslip({
    id: "pay-001-2026-08-10",
    runId: "run-2026-08-10",
    payPeriodId: "pp-2026-08-10",
    employeeId: "emp-demo-001",
    payDate: "2026-08-28",
    annualSalary: 168000,
  }),
  payslip({
    id: "pay-002-2026-08-10",
    runId: "run-2026-08-10",
    payPeriodId: "pp-2026-08-10",
    employeeId: "emp-demo-002",
    payDate: "2026-08-28",
    annualSalary: 132000,
  }),
];
