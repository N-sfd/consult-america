/**
 * Phase 4.62 acceptance flow — service-layer verification.
 *
 * Employee time → manager approve
 * Employee leave → manager approve → balance update
 * Employee HR request → HR reply → employee sees thread
 */

import { beforeEach, describe, expect, it } from "vitest";

import {
  addHrMessage,
  createHrRequest,
  listHrRequestMessages,
} from "@/lib/self-service/hr-request-store";
import {
  approveLeaveRequest,
  getLeaveBalance,
  submitLeaveRequest,
} from "@/lib/self-service/leave-store";
import { resetSelfServiceStoresForTests } from "@/lib/self-service/test-reset";
import {
  approveTimesheet,
  getTimesheetById,
  listSubmittedTimesheetsForManager,
  submitTimesheet,
} from "@/lib/self-service/time-store";
import { listPendingApprovalsFor } from "@/lib/self-service/workflow-store";

const EMPLOYEE_ID = "emp-demo-002";
const MANAGER_ID = "emp-demo-001";

describe("Phase 4 acceptance flow", () => {
  beforeEach(() => {
    resetSelfServiceStoresForTests();
  });

  it("submits a timesheet and allows manager approval", () => {
    const sheet = submitTimesheet({
      timesheetId: "ts-002-current",
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
    });
    expect(sheet.status).toBe("SUBMITTED");

    const pending = listSubmittedTimesheetsForManager(MANAGER_ID);
    expect(pending.some((item) => item.sheet.id === "ts-002-current")).toBe(
      true,
    );

    approveTimesheet({
      timesheetId: "ts-002-current",
      managerEmployeeId: MANAGER_ID,
    });

    expect(getTimesheetById("ts-002-current")?.status).toBe("APPROVED");
  });

  it("requests leave, manager approves, and balance is deducted", () => {
    const before = getLeaveBalance({
      employeeId: EMPLOYEE_ID,
      leaveTypeId: "lt-pto",
    });
    expect(before).toBeTruthy();
    const availableBefore = before!.available;
    const usedBefore = before!.used;

    const request = submitLeaveRequest({
      employeeId: EMPLOYEE_ID,
      managerEmployeeId: MANAGER_ID,
      leaveTypeId: "lt-pto",
      startDate: "2026-11-02",
      endDate: "2026-11-03",
      comments: "Acceptance test leave",
    });

    expect(request.status).toBe("PENDING");
    expect(request.hours).toBe(16);

    const pending = listPendingApprovalsFor(MANAGER_ID, "LEAVE");
    expect(pending.some((item) => item.requestId === request.id)).toBe(true);

    approveLeaveRequest({
      leaveRequestId: request.id,
      managerEmployeeId: MANAGER_ID,
    });

    const after = getLeaveBalance({
      employeeId: EMPLOYEE_ID,
      leaveTypeId: "lt-pto",
    });
    expect(after?.used).toBe(usedBefore + 16);
    expect(after?.available).toBe(availableBefore - 16);
  });

  it("creates an HR request and records HR reply in the conversation", () => {
    const request = createHrRequest({
      employeeId: EMPLOYEE_ID,
      category: "GENERAL_HR_QUESTION",
      subject: "Acceptance test question",
      description: "Need clarification on holiday schedule.",
    });

    expect(request.requestNumber).toMatch(/^HR-\d{4}-\d{6}$/);
    expect(request.status).toBe("OPEN");

    addHrMessage({
      hrRequestId: request.id,
      hrEmployeeId: MANAGER_ID,
      message: "Holiday calendar is posted on My Documents.",
    });

    const thread = listHrRequestMessages(request.id);
    expect(thread.length).toBeGreaterThanOrEqual(2);
    expect(thread.some((item) => item.authorRole === "EMPLOYEE")).toBe(true);
    expect(thread.some((item) => item.authorRole === "HR")).toBe(true);
    expect(thread.at(-1)?.message).toContain("Holiday calendar");
  });

  it("rejects overlapping leave requests", () => {
    expect(() =>
      submitLeaveRequest({
        employeeId: EMPLOYEE_ID,
        managerEmployeeId: MANAGER_ID,
        leaveTypeId: "lt-pto",
        // overlaps seeded approved leave Sep 14–16
        startDate: "2026-09-15",
        endDate: "2026-09-15",
      }),
    ).toThrow(/overlaps/i);
  });
});
