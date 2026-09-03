"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  approvePayrollRun,
  calculatePayrollRun,
  lockPayrollRun,
  submitRunForReview,
} from "@/lib/self-service/payroll-store";
import { requirePayrollActor, requirePermission } from "@/lib/self-service/security";

export type PayrollActionResult = {
  ok: boolean;
  message: string;
  runId?: string;
};

function revalidatePayrollPaths() {
  revalidatePath("/payroll");
  revalidatePath("/payroll/runs");
  revalidatePath("/employee/pay");
}

export async function calculatePayrollRunAction(input: {
  payPeriodId: string;
}): Promise<PayrollActionResult> {
  try {
    const actor = await requirePayrollActor();
    requirePermission(actor, "payroll.run.manage");

    const run = await calculatePayrollRun(input.payPeriodId);

    writeAuditLog({
      eventType: "PAYROLL_RUN_CALCULATED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "PAYROLL",
      resourceType: "PAYROLL_RUN",
      resourceId: run.id,
      summary: `Calculated payroll run for period ${run.payPeriodId}`,
    });

    revalidatePayrollPaths();
    return { ok: true, message: "Payroll calculated.", runId: run.id };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to calculate payroll.",
    };
  }
}

export async function submitRunForReviewAction(input: {
  runId: string;
}): Promise<PayrollActionResult> {
  try {
    const actor = await requirePayrollActor();
    requirePermission(actor, "payroll.run.manage");

    submitRunForReview(input.runId);
    revalidatePayrollPaths();
    return { ok: true, message: "Run submitted for review." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to submit run.",
    };
  }
}

export async function approvePayrollRunAction(input: {
  runId: string;
}): Promise<PayrollActionResult> {
  try {
    const actor = await requirePayrollActor();
    requirePermission(actor, "payroll.run.manage");

    const run = approvePayrollRun({
      runId: input.runId,
      approverEmployeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "PAYROLL_RUN_APPROVED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "PAYROLL",
      resourceType: "PAYROLL_RUN",
      resourceId: run.id,
      summary: `Approved payroll run for period ${run.payPeriodId}`,
    });

    revalidatePayrollPaths();
    return { ok: true, message: "Payroll run approved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to approve run.",
    };
  }
}

export async function lockPayrollRunAction(input: {
  runId: string;
}): Promise<PayrollActionResult> {
  try {
    const actor = await requirePayrollActor();
    requirePermission(actor, "payroll.run.manage");

    const run = lockPayrollRun(input.runId);

    writeAuditLog({
      eventType: "PAYROLL_RUN_LOCKED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "PAYROLL",
      resourceType: "PAYROLL_RUN",
      resourceId: run.id,
      summary: `Locked payroll run for period ${run.payPeriodId}`,
    });

    revalidatePayrollPaths();
    return { ok: true, message: "Payroll run locked. Payslips are final." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to lock run.",
    };
  }
}
