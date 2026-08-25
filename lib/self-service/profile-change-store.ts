import { seedProfileChanges } from "@/data/self-service/seed";
import type { ProfileChangeRequest } from "@/types/self-service";
import {
  findPendingApproval,
  pushApprovalHistory,
  pushNotification,
  resolvePendingApproval,
} from "@/lib/self-service/workflow-store";

const profileChanges: ProfileChangeRequest[] = structuredClone(
  seedProfileChanges,
);

function nowIso() {
  return new Date().toISOString();
}

export function getProfileChangeById(id: string) {
  return profileChanges.find((item) => item.id === id);
}

export function listProfileChanges(employeeId?: string) {
  return profileChanges.filter((item) =>
    employeeId ? item.employeeId === employeeId : true,
  );
}

export function approveProfileChange(input: {
  profileChangeId: string;
  managerEmployeeId: string;
}) {
  return actOnProfileChange({
    ...input,
    action: "APPROVED",
  });
}

export function rejectProfileChange(input: {
  profileChangeId: string;
  managerEmployeeId: string;
  comment: string;
}) {
  if (!input.comment.trim()) {
    throw new Error("A comment is required when rejecting a profile change");
  }
  return actOnProfileChange({
    profileChangeId: input.profileChangeId,
    managerEmployeeId: input.managerEmployeeId,
    action: "REJECTED",
    comment: input.comment.trim(),
  });
}

function actOnProfileChange(input: {
  profileChangeId: string;
  managerEmployeeId: string;
  action: "APPROVED" | "REJECTED";
  comment?: string;
}) {
  const request = getProfileChangeById(input.profileChangeId);
  if (!request) throw new Error("Profile change request not found");
  if (request.status !== "PENDING") {
    throw new Error("Only pending profile changes can be reviewed");
  }

  const pending = findPendingApproval({
    requestType: "PROFILE_CHANGE",
    requestId: request.id,
    approverEmployeeId: input.managerEmployeeId,
  });
  if (!pending) {
    throw new Error("No pending profile approval found for this manager");
  }

  const actedAt = nowIso();
  request.status = input.action;
  request.reviewedByEmployeeId = input.managerEmployeeId;
  request.reviewedAt = actedAt;

  resolvePendingApproval({
    requestType: "PROFILE_CHANGE",
    requestId: request.id,
    approverEmployeeId: input.managerEmployeeId,
    status: input.action,
    actedAt,
  });

  pushApprovalHistory({
    requestType: "PROFILE_CHANGE",
    requestId: request.id,
    action: input.action,
    actorEmployeeId: input.managerEmployeeId,
    comment: input.comment,
    actedAt,
  });

  pushNotification({
    employeeId: request.employeeId,
    type: `PROFILE_CHANGE_${input.action}`,
    title:
      input.action === "APPROVED"
        ? "Profile change approved"
        : "Profile change rejected",
    message:
      input.comment ||
      `Your ${request.changeType.replaceAll("_", " ").toLowerCase()} request was ${input.action.toLowerCase()}.`,
    actionUrl: "/employee/profile",
    createdAt: actedAt,
  });

  return request;
}
