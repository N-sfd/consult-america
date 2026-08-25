import { hrRepository } from "@/lib/hr";
import {
  getLeaveBalance,
  getLeaveRequestById,
  getLeaveTypeById,
} from "@/lib/self-service/leave-store";
import { getProfileChangeById } from "@/lib/self-service/profile-change-store";
import {
  getTimesheetById,
  listTimeEntries,
} from "@/lib/self-service/time-store";
import {
  getApprovalById,
  listHistoryForRequest,
  listPendingApprovalsFor,
  listRecentDecisionsForApprover,
} from "@/lib/self-service/workflow-store";
import type {
  ApprovalHistory,
  ApprovalRequest,
  ApprovalRequestType,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  ProfileChangeRequest,
  TimeEntry,
  Timesheet,
} from "@/types/self-service";
import { approvalRequestTypeLabels } from "@/types/self-service";

export type TimesheetApprovalDetail = {
  kind: "TIMESHEET";
  sheet: Timesheet;
  entries: TimeEntry[];
};

export type LeaveApprovalDetail = {
  kind: "LEAVE";
  request: LeaveRequest;
  leaveType?: LeaveType;
  balance?: LeaveBalance;
};

export type ProfileChangeApprovalDetail = {
  kind: "PROFILE_CHANGE";
  request: ProfileChangeRequest;
};

export type UnsupportedApprovalDetail = {
  kind: "UNSUPPORTED";
  message: string;
};

export type ApprovalDetail =
  | TimesheetApprovalDetail
  | LeaveApprovalDetail
  | ProfileChangeApprovalDetail
  | UnsupportedApprovalDetail;

export type ApprovalInboxItem = {
  approval: ApprovalRequest;
  requesterName: string;
  typeLabel: string;
  deepLink: string;
  detail: ApprovalDetail;
  history: ApprovalHistory[];
};

function deepLinkFor(type: ApprovalRequestType) {
  switch (type) {
    case "TIMESHEET":
      return "/manager/time";
    case "LEAVE":
      return "/manager/leave";
    case "PROFILE_CHANGE":
      return "/manager/approvals";
    default:
      return "/manager/approvals";
  }
}

function resolveDetail(approval: ApprovalRequest): ApprovalDetail {
  if (approval.requestType === "TIMESHEET") {
    const sheet = getTimesheetById(approval.requestId);
    if (!sheet) {
      return { kind: "UNSUPPORTED", message: "Timesheet not found" };
    }
    return {
      kind: "TIMESHEET",
      sheet,
      entries: listTimeEntries(sheet.id),
    };
  }

  if (approval.requestType === "LEAVE") {
    const request = getLeaveRequestById(approval.requestId);
    if (!request) {
      return { kind: "UNSUPPORTED", message: "Leave request not found" };
    }
    return {
      kind: "LEAVE",
      request,
      leaveType: getLeaveTypeById(request.leaveTypeId),
      balance: getLeaveBalance({
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
      }),
    };
  }

  if (approval.requestType === "PROFILE_CHANGE") {
    const request = getProfileChangeById(approval.requestId);
    if (!request) {
      return { kind: "UNSUPPORTED", message: "Profile change not found" };
    }
    return { kind: "PROFILE_CHANGE", request };
  }

  return {
    kind: "UNSUPPORTED",
    message: `${approvalRequestTypeLabels[approval.requestType]} actions are not available in this inbox yet.`,
  };
}

async function resolveRequesterName(employeeId: string) {
  const employee = await hrRepository.getEmployeeById(employeeId);
  if (!employee) return employeeId;
  const person = await hrRepository.getPersonById(employee.personId);
  if (!person) return employeeId;
  return `${person.firstName} ${person.lastName}`;
}

async function enrichApproval(
  approval: ApprovalRequest,
): Promise<ApprovalInboxItem> {
  return {
    approval,
    requesterName: await resolveRequesterName(approval.requesterEmployeeId),
    typeLabel: approvalRequestTypeLabels[approval.requestType],
    deepLink: deepLinkFor(approval.requestType),
    detail: resolveDetail(approval),
    history: listHistoryForRequest(approval.requestType, approval.requestId),
  };
}

export async function getApprovalInbox(
  managerEmployeeId: string,
  requestType?: ApprovalRequestType | "ALL",
) {
  const pending = listPendingApprovalsFor(
    managerEmployeeId,
    requestType && requestType !== "ALL" ? requestType : undefined,
  ).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return Promise.all(pending.map((item) => enrichApproval(item)));
}

export async function getApprovalInboxItem(
  managerEmployeeId: string,
  approvalId: string,
) {
  const approval = getApprovalById(approvalId);
  if (!approval) return null;
  if (approval.approverEmployeeId !== managerEmployeeId) {
    throw new Error("Forbidden: approval is not assigned to this manager");
  }
  return enrichApproval(approval);
}

export async function getRecentApprovalDecisions(
  managerEmployeeId: string,
  limit = 8,
) {
  const decisions = listRecentDecisionsForApprover(managerEmployeeId, limit);
  return Promise.all(decisions.map((item) => enrichApproval(item)));
}

export const approvalFilterOptions: Array<{
  value: ApprovalRequestType | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All" },
  { value: "TIMESHEET", label: "Timesheet" },
  { value: "LEAVE", label: "Leave" },
  { value: "PROFILE_CHANGE", label: "Profile Change" },
];
