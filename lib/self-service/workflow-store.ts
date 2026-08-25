import {
  seedApprovals,
  seedNotifications,
} from "@/data/self-service/seed";
import type {
  ApprovalHistory,
  ApprovalRequest,
  ApprovalRequestType,
  ApprovalStatus,
  Notification,
} from "@/types/self-service";

/** Shared mutable approvals + notifications for time, leave, and later Phase 4H. */
const approvals: ApprovalRequest[] = structuredClone(seedApprovals);
const approvalHistory: ApprovalHistory[] = [
  {
    id: "ah-seed-1",
    requestType: "TIMESHEET",
    requestId: "ts-002-prior",
    action: "SUBMITTED",
    actorEmployeeId: "emp-demo-002",
    actedAt: "2026-08-23T18:00:00.000Z",
  },
  {
    id: "ah-seed-leave-1",
    requestType: "LEAVE",
    requestId: "lr-002-2",
    action: "SUBMITTED",
    actorEmployeeId: "emp-demo-002",
    actedAt: "2026-08-20T10:00:00.000Z",
  },
];
const notifications: Notification[] = structuredClone(seedNotifications);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function listApprovals() {
  return approvals;
}

export function listApprovalHistory() {
  return approvalHistory;
}

export function listNotifications() {
  return notifications;
}

export function listPendingApprovalsFor(
  approverEmployeeId: string,
  requestType?: ApprovalRequestType,
) {
  return approvals.filter(
    (item) =>
      item.approverEmployeeId === approverEmployeeId &&
      item.status === "PENDING" &&
      (requestType ? item.requestType === requestType : true),
  );
}

export function findPendingApproval(input: {
  requestType: ApprovalRequestType;
  requestId: string;
  approverEmployeeId?: string;
}) {
  return approvals.find(
    (item) =>
      item.requestType === input.requestType &&
      item.requestId === input.requestId &&
      item.status === "PENDING" &&
      (input.approverEmployeeId
        ? item.approverEmployeeId === input.approverEmployeeId
        : true),
  );
}

export function upsertPendingApproval(input: {
  requestType: ApprovalRequestType;
  requestId: string;
  requesterEmployeeId: string;
  approverEmployeeId: string;
  summary: string;
  submittedAt: string;
}) {
  const existing = findPendingApproval({
    requestType: input.requestType,
    requestId: input.requestId,
  });

  if (!existing) {
    approvals.push({
      id: createId("apr"),
      requestType: input.requestType,
      requestId: input.requestId,
      requesterEmployeeId: input.requesterEmployeeId,
      approverEmployeeId: input.approverEmployeeId,
      status: "PENDING",
      summary: input.summary,
      submittedAt: input.submittedAt,
    });
  } else {
    existing.summary = input.summary;
    existing.submittedAt = input.submittedAt;
    existing.approverEmployeeId = input.approverEmployeeId;
  }
}

export function resolvePendingApproval(input: {
  requestType: ApprovalRequestType;
  requestId: string;
  approverEmployeeId: string;
  status: Exclude<ApprovalStatus, "PENDING">;
  actedAt: string;
}) {
  const approval = findPendingApproval({
    requestType: input.requestType,
    requestId: input.requestId,
    approverEmployeeId: input.approverEmployeeId,
  });

  if (!approval) {
    throw new Error("No pending approval found for this manager");
  }

  approval.status = input.status;
  approval.actedAt = input.actedAt;
  return approval;
}

export function cancelPendingApproval(input: {
  requestType: ApprovalRequestType;
  requestId: string;
  actedAt: string;
}) {
  const approval = findPendingApproval({
    requestType: input.requestType,
    requestId: input.requestId,
  });
  if (!approval) return null;
  approval.status = "CANCELLED";
  approval.actedAt = input.actedAt;
  return approval;
}

export function pushApprovalHistory(input: {
  requestType: ApprovalRequestType;
  requestId: string;
  action: ApprovalHistory["action"];
  actorEmployeeId: string;
  comment?: string;
  actedAt?: string;
}) {
  const entry: ApprovalHistory = {
    id: createId("ah"),
    requestType: input.requestType,
    requestId: input.requestId,
    action: input.action,
    actorEmployeeId: input.actorEmployeeId,
    comment: input.comment,
    actedAt: input.actedAt ?? nowIso(),
  };
  approvalHistory.push(entry);
  return entry;
}

export function pushNotification(input: {
  employeeId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  createdAt?: string;
}) {
  const entry: Notification = {
    id: createId("ntf"),
    userId: `user-${input.employeeId}`,
    employeeId: input.employeeId,
    type: input.type,
    title: input.title,
    message: input.message,
    actionUrl: input.actionUrl,
    createdAt: input.createdAt ?? nowIso(),
  };
  notifications.push(entry);
  return entry;
}

export function getWorkflowSnapshot() {
  return { approvals, approvalHistory, notifications };
}
