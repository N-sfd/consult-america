import { beforeEach, describe, expect, it } from "vitest";

import {
  approveExpenseClaim,
  cancelExpenseClaim,
  getExpenseClaimById,
  listExpenseClaims,
  rejectExpenseClaim,
  submitExpenseClaim,
} from "@/lib/self-service/expense-store";
import { resetSelfServiceStoresForTests } from "@/lib/self-service/test-reset";
import { findPendingApproval } from "@/lib/self-service/workflow-store";

const EMPLOYEE_ID = "emp-demo-002";
const MANAGER_ID = "emp-demo-001";

describe("expense claims", () => {
  beforeEach(() => {
    resetSelfServiceStoresForTests();
  });

  it("submits a pending claim with a matching approval", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "TRAVEL",
      amount: 125.5,
      expenseDate: "2026-09-01",
      description: "Rideshare to client site",
    });

    expect(claim.status).toBe("PENDING");
    expect(listExpenseClaims(EMPLOYEE_ID)).toContainEqual(claim);

    const pending = findPendingApproval({
      requestType: "EXPENSE",
      requestId: claim.id,
    });
    expect(pending?.approverEmployeeId).toBe(MANAGER_ID);
  });

  it("rejects a non-positive amount", () => {
    expect(() =>
      submitExpenseClaim({
        employeeId: EMPLOYEE_ID,
        managerEmployeeId: MANAGER_ID,
        category: "MEALS",
        amount: 0,
        expenseDate: "2026-09-01",
        description: "Lunch",
      }),
    ).toThrow(/greater than zero/);
  });

  it("lets a manager approve a pending claim", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "SUPPLIES",
      amount: 42,
      expenseDate: "2026-09-02",
      description: "Notebook and pens",
    });

    const approved = approveExpenseClaim({
      expenseClaimId: claim.id,
      managerEmployeeId: MANAGER_ID,
    });

    expect(approved.status).toBe("APPROVED");
    expect(getExpenseClaimById(claim.id)?.status).toBe("APPROVED");
  });

  it("requires a comment to reject a claim", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "OTHER",
      amount: 10,
      expenseDate: "2026-09-02",
      description: "Misc",
    });

    expect(() =>
      rejectExpenseClaim({
        expenseClaimId: claim.id,
        managerEmployeeId: MANAGER_ID,
        comment: "",
      }),
    ).toThrow(/comment is required/);
  });

  it("cancels a pending claim owned by the employee", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "TRAVEL",
      amount: 300,
      expenseDate: "2026-09-03",
      description: "Flight",
    });

    const cancelled = cancelExpenseClaim({
      expenseClaimId: claim.id,
      employeeId: EMPLOYEE_ID,
    });

    expect(cancelled.status).toBe("CANCELLED");
  });

  it("blocks cancelling another employee's claim", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "TRAVEL",
      amount: 300,
      expenseDate: "2026-09-03",
      description: "Flight",
    });

    expect(() =>
      cancelExpenseClaim({
        expenseClaimId: claim.id,
        employeeId: MANAGER_ID,
      }),
    ).toThrow(/Forbidden/);
  });

  it("blocks approving an already-decided claim", () => {
    const claim = submitExpenseClaim({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      category: "TRAVEL",
      amount: 300,
      expenseDate: "2026-09-03",
      description: "Flight",
    });

    approveExpenseClaim({ expenseClaimId: claim.id, managerEmployeeId: MANAGER_ID });

    expect(() =>
      approveExpenseClaim({
        expenseClaimId: claim.id,
        managerEmployeeId: MANAGER_ID,
      }),
    ).toThrow(/pending/);
  });
});
