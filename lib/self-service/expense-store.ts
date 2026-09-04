import { seedExpenseClaims } from "@/data/self-service/seed";
import type { ExpenseCategory, ExpenseClaim } from "@/types/self-service";
import { expenseCategoryLabels } from "@/types/self-service";
import {
  cancelPendingApproval,
  findPendingApproval,
  pushApprovalHistory,
  pushNotification,
  resolvePendingApproval,
  upsertPendingApproval,
} from "@/lib/self-service/workflow-store";

const expenseClaims: ExpenseClaim[] = structuredClone(seedExpenseClaims);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function listExpenseClaims(employeeId: string) {
  return expenseClaims
    .filter((claim) => claim.employeeId === employeeId)
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));
}

export function getExpenseClaimById(expenseClaimId: string) {
  return expenseClaims.find((claim) => claim.id === expenseClaimId);
}

function formatExpenseSummary(claim: ExpenseClaim) {
  return `${expenseCategoryLabels[claim.category]} · $${claim.amount.toFixed(2)} · ${claim.expenseDate}`;
}

export function submitExpenseClaim(input: {
  employeeId: string;
  managerEmployeeId: string;
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  expenseDate: string;
  description: string;
  receiptRef?: string;
  comments?: string;
}) {
  if (input.amount <= 0) {
    throw new Error("Expense amount must be greater than zero");
  }
  if (!input.description.trim()) {
    throw new Error("A description is required");
  }

  const submittedAt = nowIso();
  const claim: ExpenseClaim = {
    id: createId("exp"),
    employeeId: input.employeeId,
    category: input.category,
    amount: input.amount,
    currency: input.currency ?? "USD",
    expenseDate: input.expenseDate,
    description: input.description.trim(),
    receiptRef: input.receiptRef,
    status: "PENDING",
    comments: input.comments?.trim() || undefined,
    submittedAt,
    createdAt: submittedAt,
    updatedAt: submittedAt,
  };

  expenseClaims.push(claim);

  upsertPendingApproval({
    requestType: "EXPENSE",
    requestId: claim.id,
    requesterEmployeeId: input.employeeId,
    approverEmployeeId: input.managerEmployeeId,
    summary: formatExpenseSummary(claim),
    submittedAt,
  });

  pushApprovalHistory({
    requestType: "EXPENSE",
    requestId: claim.id,
    action: "SUBMITTED",
    actorEmployeeId: input.employeeId,
    actedAt: submittedAt,
  });

  pushNotification({
    employeeId: input.managerEmployeeId,
    type: "EXPENSE_SUBMITTED",
    title: "Expense claim submitted",
    message: `${formatExpenseSummary(claim)} is ready for review.`,
    actionUrl: "/manager/approvals",
    createdAt: submittedAt,
  });

  return claim;
}

export function cancelExpenseClaim(input: {
  expenseClaimId: string;
  employeeId: string;
}) {
  const claim = getExpenseClaimById(input.expenseClaimId);
  if (!claim) throw new Error("Expense claim not found");
  if (claim.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot cancel another employee's expense claim");
  }
  if (claim.status !== "PENDING") {
    throw new Error("Only pending expense claims can be cancelled");
  }

  const actedAt = nowIso();
  claim.status = "CANCELLED";
  claim.updatedAt = actedAt;

  cancelPendingApproval({
    requestType: "EXPENSE",
    requestId: claim.id,
    actedAt,
  });

  pushApprovalHistory({
    requestType: "EXPENSE",
    requestId: claim.id,
    action: "CANCELLED",
    actorEmployeeId: input.employeeId,
    actedAt,
  });

  return claim;
}

function actOnExpense(input: {
  expenseClaimId: string;
  managerEmployeeId: string;
  action: "APPROVED" | "REJECTED";
  comment?: string;
}) {
  const claim = getExpenseClaimById(input.expenseClaimId);
  if (!claim) throw new Error("Expense claim not found");
  if (claim.status !== "PENDING") {
    throw new Error("Only pending expense claims can be reviewed");
  }

  const pending = findPendingApproval({
    requestType: "EXPENSE",
    requestId: claim.id,
    approverEmployeeId: input.managerEmployeeId,
  });
  if (!pending) {
    throw new Error("No pending expense approval found for this manager");
  }

  const actedAt = nowIso();
  claim.status = input.action;
  claim.updatedAt = actedAt;

  resolvePendingApproval({
    requestType: "EXPENSE",
    requestId: claim.id,
    approverEmployeeId: input.managerEmployeeId,
    status: input.action,
    actedAt,
  });

  pushApprovalHistory({
    requestType: "EXPENSE",
    requestId: claim.id,
    action: input.action,
    actorEmployeeId: input.managerEmployeeId,
    comment: input.comment,
    actedAt,
  });

  pushNotification({
    employeeId: claim.employeeId,
    type: `EXPENSE_${input.action}`,
    title: input.action === "APPROVED" ? "Expense approved" : "Expense rejected",
    message:
      input.comment ||
      `Your ${formatExpenseSummary(claim)} claim was ${input.action.toLowerCase()}.`,
    actionUrl: "/employee/expenses",
    createdAt: actedAt,
  });

  return claim;
}

export function approveExpenseClaim(input: {
  expenseClaimId: string;
  managerEmployeeId: string;
}) {
  return actOnExpense({
    expenseClaimId: input.expenseClaimId,
    managerEmployeeId: input.managerEmployeeId,
    action: "APPROVED",
  });
}

export function rejectExpenseClaim(input: {
  expenseClaimId: string;
  managerEmployeeId: string;
  comment: string;
}) {
  if (!input.comment.trim()) {
    throw new Error("A comment is required when rejecting an expense claim");
  }
  return actOnExpense({
    expenseClaimId: input.expenseClaimId,
    managerEmployeeId: input.managerEmployeeId,
    action: "REJECTED",
    comment: input.comment.trim(),
  });
}

export function getExpenseStoreSnapshot() {
  return { expenseClaims };
}

/** Test-only: restore expense store to seed state. */
export function resetExpenseStoreForTests() {
  expenseClaims.splice(
    0,
    expenseClaims.length,
    ...structuredClone(seedExpenseClaims),
  );
}
