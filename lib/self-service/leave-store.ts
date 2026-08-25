import {
  seedLeaveBalances,
  seedLeaveRequests,
  seedLeaveTypes,
} from "@/data/self-service/seed";
import type {
  LeaveBalance,
  LeaveRequest,
  LeaveType,
} from "@/types/self-service";
import {
  cancelPendingApproval,
  findPendingApproval,
  listPendingApprovalsFor,
  pushApprovalHistory,
  pushNotification,
  resolvePendingApproval,
  upsertPendingApproval,
} from "@/lib/self-service/workflow-store";

const leaveTypes: LeaveType[] = structuredClone(seedLeaveTypes);
const leaveBalances: LeaveBalance[] = structuredClone(seedLeaveBalances);
const leaveRequests: LeaveRequest[] = structuredClone(seedLeaveRequests);

const STANDARD_DAY_HOURS = 8;

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function listLeaveTypes() {
  return leaveTypes.filter((type) => type.status === "ACTIVE");
}

export function getLeaveTypeById(leaveTypeId: string) {
  return leaveTypes.find((type) => type.id === leaveTypeId);
}

export function listLeaveBalances(employeeId: string) {
  return leaveBalances.filter((balance) => balance.employeeId === employeeId);
}

export function getLeaveBalance(input: {
  employeeId: string;
  leaveTypeId: string;
  year?: number;
}) {
  const year = input.year ?? new Date().getFullYear();
  return leaveBalances.find(
    (balance) =>
      balance.employeeId === input.employeeId &&
      balance.leaveTypeId === input.leaveTypeId &&
      balance.year === year,
  );
}

export function listLeaveRequests(employeeId: string) {
  return leaveRequests
    .filter((request) => request.employeeId === employeeId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getLeaveRequestById(leaveRequestId: string) {
  return leaveRequests.find((request) => request.id === leaveRequestId);
}

/** Count Mon–Fri dates inclusive. */
export function countBusinessDays(startDate: string, endDate: string) {
  if (endDate < startDate) return 0;

  let count = 0;
  const cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

export function calculateLeaveHours(input: {
  startDate: string;
  endDate: string;
  partialDay?: boolean;
  hours?: number;
}) {
  if (input.endDate < input.startDate) {
    throw new Error("End date must be on or after the start date");
  }

  const businessDays = countBusinessDays(input.startDate, input.endDate);
  if (businessDays <= 0) {
    throw new Error("Leave must include at least one weekday");
  }

  if (input.partialDay) {
    if (input.startDate !== input.endDate) {
      throw new Error("Partial-day leave must be a single date");
    }
    const hours = input.hours ?? 0;
    if (hours <= 0 || hours > STANDARD_DAY_HOURS) {
      throw new Error(`Partial-day hours must be between 0.5 and ${STANDARD_DAY_HOURS}`);
    }
    return hours;
  }

  return businessDays * STANDARD_DAY_HOURS;
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) {
  return aStart <= bEnd && bStart <= aEnd;
}

function assertNoOverlap(input: {
  employeeId: string;
  startDate: string;
  endDate: string;
  excludeRequestId?: string;
}) {
  const blocking = leaveRequests.find(
    (request) =>
      request.employeeId === input.employeeId &&
      request.id !== input.excludeRequestId &&
      (request.status === "PENDING" || request.status === "APPROVED") &&
      rangesOverlap(
        request.startDate,
        request.endDate,
        input.startDate,
        input.endDate,
      ),
  );

  if (blocking) {
    throw new Error(
      `Leave overlaps an existing ${blocking.status.toLowerCase()} request (${blocking.startDate} – ${blocking.endDate})`,
    );
  }
}

function reservedPendingHours(
  employeeId: string,
  leaveTypeId: string,
  excludeRequestId?: string,
) {
  return leaveRequests
    .filter(
      (request) =>
        request.employeeId === employeeId &&
        request.leaveTypeId === leaveTypeId &&
        request.status === "PENDING" &&
        request.id !== excludeRequestId,
    )
    .reduce((total, request) => total + request.hours, 0);
}

function recalculateAvailable(balance: LeaveBalance) {
  balance.available =
    balance.openingBalance + balance.accrued - balance.used + balance.adjusted;
}

function assertSufficientBalance(input: {
  employeeId: string;
  leaveTypeId: string;
  hours: number;
  excludeRequestId?: string;
}) {
  const leaveType = getLeaveTypeById(input.leaveTypeId);
  if (!leaveType) throw new Error("Leave type not found");

  const balance = getLeaveBalance({
    employeeId: input.employeeId,
    leaveTypeId: input.leaveTypeId,
  });
  if (!balance) {
    throw new Error("No leave balance found for this leave type");
  }

  if (leaveType.allowNegativeBalance) return balance;

  const reserved = reservedPendingHours(
    input.employeeId,
    input.leaveTypeId,
    input.excludeRequestId,
  );
  const remaining = balance.available - reserved;
  if (input.hours > remaining) {
    throw new Error(
      `Insufficient balance. Available ${remaining}h after pending requests; requested ${input.hours}h.`,
    );
  }

  return balance;
}

function formatLeaveSummary(leaveType: LeaveType, request: LeaveRequest) {
  const range =
    request.startDate === request.endDate
      ? request.startDate
      : `${request.startDate} – ${request.endDate}`;
  return `${leaveType.code} · ${range} · ${request.hours} hours`;
}

export function submitLeaveRequest(input: {
  employeeId: string;
  managerEmployeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  partialDay?: boolean;
  hours?: number;
  comments?: string;
}) {
  const leaveType = getLeaveTypeById(input.leaveTypeId);
  if (!leaveType || leaveType.status !== "ACTIVE") {
    throw new Error("Leave type is not available");
  }

  const hours = calculateLeaveHours({
    startDate: input.startDate,
    endDate: input.endDate,
    partialDay: input.partialDay,
    hours: input.hours,
  });

  assertNoOverlap({
    employeeId: input.employeeId,
    startDate: input.startDate,
    endDate: input.endDate,
  });

  assertSufficientBalance({
    employeeId: input.employeeId,
    leaveTypeId: input.leaveTypeId,
    hours,
  });

  const submittedAt = nowIso();
  const request: LeaveRequest = {
    id: createId("lr"),
    employeeId: input.employeeId,
    leaveTypeId: input.leaveTypeId,
    startDate: input.startDate,
    endDate: input.endDate,
    hours,
    status: leaveType.requiresApproval ? "PENDING" : "APPROVED",
    comments: input.comments?.trim() || undefined,
    submittedAt,
    createdAt: submittedAt,
    updatedAt: submittedAt,
  };

  leaveRequests.push(request);

  if (!leaveType.requiresApproval) {
    const balance = getLeaveBalance({
      employeeId: input.employeeId,
      leaveTypeId: input.leaveTypeId,
    });
    if (balance) {
      balance.used += hours;
      recalculateAvailable(balance);
    }
    pushApprovalHistory({
      requestType: "LEAVE",
      requestId: request.id,
      action: "APPROVED",
      actorEmployeeId: input.employeeId,
      actedAt: submittedAt,
      comment: "Auto-approved (approval not required)",
    });
    return request;
  }

  upsertPendingApproval({
    requestType: "LEAVE",
    requestId: request.id,
    requesterEmployeeId: input.employeeId,
    approverEmployeeId: input.managerEmployeeId,
    summary: formatLeaveSummary(leaveType, request),
    submittedAt,
  });

  pushApprovalHistory({
    requestType: "LEAVE",
    requestId: request.id,
    action: "SUBMITTED",
    actorEmployeeId: input.employeeId,
    actedAt: submittedAt,
  });

  pushNotification({
    employeeId: input.managerEmployeeId,
    type: "LEAVE_SUBMITTED",
    title: "Leave request submitted",
    message: `${formatLeaveSummary(leaveType, request)} is ready for review.`,
    actionUrl: "/manager/leave",
    createdAt: submittedAt,
  });

  return request;
}

export function cancelLeaveRequest(input: {
  leaveRequestId: string;
  employeeId: string;
}) {
  const request = getLeaveRequestById(input.leaveRequestId);
  if (!request) throw new Error("Leave request not found");
  if (request.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot cancel another employee's leave");
  }

  if (request.status === "PENDING") {
    const actedAt = nowIso();
    request.status = "CANCELLED";
    request.updatedAt = actedAt;
    cancelPendingApproval({
      requestType: "LEAVE",
      requestId: request.id,
      actedAt,
    });
    pushApprovalHistory({
      requestType: "LEAVE",
      requestId: request.id,
      action: "CANCELLED",
      actorEmployeeId: input.employeeId,
      actedAt,
    });
    return request;
  }

  if (request.status === "APPROVED") {
    if (request.startDate <= todayIsoDate()) {
      throw new Error("Approved leave that has started cannot be cancelled here");
    }

    const actedAt = nowIso();
    request.status = "CANCELLED";
    request.updatedAt = actedAt;

    const balance = getLeaveBalance({
      employeeId: request.employeeId,
      leaveTypeId: request.leaveTypeId,
    });
    if (balance) {
      balance.used = Math.max(0, balance.used - request.hours);
      recalculateAvailable(balance);
    }

    pushApprovalHistory({
      requestType: "LEAVE",
      requestId: request.id,
      action: "CANCELLED",
      actorEmployeeId: input.employeeId,
      actedAt,
    });
    return request;
  }

  throw new Error("Only pending or future approved leave can be cancelled");
}

export function listPendingLeaveForManager(managerEmployeeId: string) {
  const pending = listPendingApprovalsFor(managerEmployeeId, "LEAVE");

  return pending
    .map((approval) => {
      const request = getLeaveRequestById(approval.requestId);
      if (!request || request.status !== "PENDING") return null;
      const leaveType = getLeaveTypeById(request.leaveTypeId);
      const balance = getLeaveBalance({
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
      });
      return { approval, request, leaveType, balance };
    })
    .filter(Boolean) as Array<{
    approval: (typeof pending)[number];
    request: LeaveRequest;
    leaveType?: LeaveType;
    balance?: LeaveBalance;
  }>;
}

export function approveLeaveRequest(input: {
  leaveRequestId: string;
  managerEmployeeId: string;
}) {
  return actOnLeave({
    leaveRequestId: input.leaveRequestId,
    managerEmployeeId: input.managerEmployeeId,
    action: "APPROVED",
  });
}

export function rejectLeaveRequest(input: {
  leaveRequestId: string;
  managerEmployeeId: string;
  comment: string;
}) {
  if (!input.comment.trim()) {
    throw new Error("A comment is required when rejecting leave");
  }
  return actOnLeave({
    leaveRequestId: input.leaveRequestId,
    managerEmployeeId: input.managerEmployeeId,
    action: "REJECTED",
    comment: input.comment.trim(),
  });
}

function actOnLeave(input: {
  leaveRequestId: string;
  managerEmployeeId: string;
  action: "APPROVED" | "REJECTED";
  comment?: string;
}) {
  const request = getLeaveRequestById(input.leaveRequestId);
  if (!request) throw new Error("Leave request not found");
  if (request.status !== "PENDING") {
    throw new Error("Only pending leave requests can be reviewed");
  }

  const pending = findPendingApproval({
    requestType: "LEAVE",
    requestId: request.id,
    approverEmployeeId: input.managerEmployeeId,
  });
  if (!pending) {
    throw new Error("No pending leave approval found for this manager");
  }

  const leaveType = getLeaveTypeById(request.leaveTypeId);
  const actedAt = nowIso();

  if (input.action === "APPROVED") {
    assertSufficientBalance({
      employeeId: request.employeeId,
      leaveTypeId: request.leaveTypeId,
      hours: request.hours,
      excludeRequestId: request.id,
    });

    request.status = "APPROVED";
    const balance = getLeaveBalance({
      employeeId: request.employeeId,
      leaveTypeId: request.leaveTypeId,
    });
    if (balance) {
      balance.used += request.hours;
      recalculateAvailable(balance);
    }

    resolvePendingApproval({
      requestType: "LEAVE",
      requestId: request.id,
      approverEmployeeId: input.managerEmployeeId,
      status: "APPROVED",
      actedAt,
    });
  } else {
    request.status = "REJECTED";
    resolvePendingApproval({
      requestType: "LEAVE",
      requestId: request.id,
      approverEmployeeId: input.managerEmployeeId,
      status: "REJECTED",
      actedAt,
    });
  }

  request.updatedAt = actedAt;

  pushApprovalHistory({
    requestType: "LEAVE",
    requestId: request.id,
    action: input.action,
    actorEmployeeId: input.managerEmployeeId,
    comment: input.comment,
    actedAt,
  });

  pushNotification({
    employeeId: request.employeeId,
    type: `LEAVE_${input.action}`,
    title:
      input.action === "APPROVED" ? "Leave approved" : "Leave rejected",
    message:
      input.comment ||
      `Your ${leaveType?.name ?? "leave"} request for ${request.startDate} – ${request.endDate} was ${input.action.toLowerCase()}.`,
    actionUrl: "/employee/leave",
    createdAt: actedAt,
  });

  return request;
}

export function getLeaveStoreSnapshot() {
  return { leaveTypes, leaveBalances, leaveRequests };
}
