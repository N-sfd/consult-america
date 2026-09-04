"use server";

import { revalidatePath } from "next/cache";

import { getEmployeeProfile } from "@/lib/self-service";
import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  approveExpenseClaim,
  cancelExpenseClaim,
  getExpenseClaimById,
  rejectExpenseClaim,
  submitExpenseClaim,
} from "@/lib/self-service/expense-store";
import {
  requireEmployeeActor,
  requireManagerActor,
  requirePermission,
  requireTeamResource,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import type { ExpenseCategory } from "@/types/self-service";

export type ExpenseActionResult = {
  ok: boolean;
  message: string;
};

async function resolveManagerId(employeeId: string) {
  const profile = await getEmployeeProfile(employeeId);
  return profile?.assignment?.managerEmployeeId;
}

function revalidateExpensePaths() {
  revalidatePath("/employee/expenses");
  revalidatePath("/employee");
  revalidatePath("/manager/approvals");
  revalidatePath("/manager");
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
  revalidatePath("/hr/notifications");
}

export async function submitExpenseAction(input: {
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  expenseDate: string;
  description: string;
  receiptRef?: string;
  comments?: string;
}): Promise<ExpenseActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.expense.submit");

    const managerId = await resolveManagerId(actor.session.employeeId);
    if (!managerId) {
      throw new Error("No manager is assigned for expense approval");
    }

    const claim = submitExpenseClaim({
      employeeId: actor.session.employeeId,
      managerEmployeeId: managerId,
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      expenseDate: input.expenseDate,
      description: input.description,
      receiptRef: input.receiptRef,
      comments: input.comments,
    });

    writeAuditLog({
      eventType: "EXPENSE_SUBMITTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "EXPENSE_CLAIM",
      resourceId: claim.id,
      summary: `Submitted expense claim for $${claim.amount.toFixed(2)}`,
    });

    revalidateExpensePaths();
    return { ok: true, message: "Expense claim submitted for approval." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to submit expense claim."),
    };
  }
}

export async function cancelExpenseAction(input: {
  expenseClaimId: string;
}): Promise<ExpenseActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.expense.submit");

    const claim = cancelExpenseClaim({
      expenseClaimId: input.expenseClaimId,
      employeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "EXPENSE_CANCELLED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "EXPENSE_CLAIM",
      resourceId: claim.id,
      summary: `Cancelled expense claim for $${claim.amount.toFixed(2)}`,
    });

    revalidateExpensePaths();
    return { ok: true, message: "Expense claim cancelled." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to cancel expense claim."),
    };
  }
}

export async function approveExpenseAction(input: {
  expenseClaimId: string;
}): Promise<ExpenseActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.expense.approve");

    const existing = getExpenseClaimById(input.expenseClaimId);
    if (!existing) throw new Error("Expense claim not found");
    await requireTeamResource(actor, existing.employeeId);

    const claim = approveExpenseClaim({
      expenseClaimId: input.expenseClaimId,
      managerEmployeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "EXPENSE_APPROVED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: claim.employeeId,
      resourceType: "EXPENSE_CLAIM",
      resourceId: claim.id,
      summary: `Approved expense claim for $${claim.amount.toFixed(2)}`,
    });

    revalidateExpensePaths();
    return { ok: true, message: "Expense claim approved." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to approve expense claim."),
    };
  }
}

export async function rejectExpenseAction(input: {
  expenseClaimId: string;
  comment: string;
}): Promise<ExpenseActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.expense.approve");

    const existing = getExpenseClaimById(input.expenseClaimId);
    if (!existing) throw new Error("Expense claim not found");
    await requireTeamResource(actor, existing.employeeId);

    const claim = rejectExpenseClaim({
      expenseClaimId: input.expenseClaimId,
      managerEmployeeId: actor.session.employeeId,
      comment: input.comment,
    });

    writeAuditLog({
      eventType: "EXPENSE_REJECTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: claim.employeeId,
      resourceType: "EXPENSE_CLAIM",
      resourceId: claim.id,
      summary: `Rejected expense claim for $${claim.amount.toFixed(2)}`,
    });

    revalidateExpensePaths();
    return { ok: true, message: "Expense claim rejected." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to reject expense claim."),
    };
  }
}
