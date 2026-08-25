"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  approveLeaveRequest,
  getLeaveRequestById,
  rejectLeaveRequest,
} from "@/lib/self-service/leave-store";
import {
  approveProfileChange,
  getProfileChangeById,
  rejectProfileChange,
} from "@/lib/self-service/profile-change-store";
import {
  requireManagerActor,
  requirePermission,
  requireTeamResource,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import {
  approveTimesheet,
  getTimesheetById,
  rejectTimesheet,
  returnTimesheet,
} from "@/lib/self-service/time-store";
import { getApprovalById } from "@/lib/self-service/workflow-store";

export type ApprovalActionResult = {
  ok: boolean;
  message: string;
};

export type ApprovalInboxAction = "APPROVED" | "REJECTED" | "RETURNED";

function revalidateApprovalPaths() {
  revalidatePath("/manager/approvals");
  revalidatePath("/manager");
  revalidatePath("/manager/time");
  revalidatePath("/manager/leave");
  revalidatePath("/employee/time");
  revalidatePath("/employee/leave");
  revalidatePath("/employee/profile");
  revalidatePath("/employee");
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
  revalidatePath("/hr/notifications");
}

export async function actOnApprovalAction(input: {
  approvalId: string;
  action: ApprovalInboxAction;
  comment?: string;
}): Promise<ApprovalActionResult> {
  try {
    const actor = requireManagerActor();
    requirePermission(actor, "approval.act");

    const approval = getApprovalById(input.approvalId);
    if (!approval) throw new Error("Approval not found");
    if (approval.approverEmployeeId !== actor.session.employeeId) {
      throw new Error("Forbidden: approval is not assigned to this manager");
    }
    if (approval.status !== "PENDING") {
      throw new Error("Only pending approvals can be acted on");
    }

    await requireTeamResource(actor, approval.requesterEmployeeId);

    const comment = input.comment?.trim() ?? "";

    if (approval.requestType === "TIMESHEET") {
      requirePermission(actor, "team.timesheet.approve");
      const sheet = getTimesheetById(approval.requestId);
      if (!sheet) throw new Error("Timesheet not found");

      if (input.action === "APPROVED") {
        approveTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
        });
        writeAuditLog({
          eventType: "TIMESHEET_APPROVED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: sheet.employeeId,
          resourceType: "TIMESHEET",
          resourceId: sheet.id,
          summary: `Approved timesheet via inbox ${sheet.periodStart} – ${sheet.periodEnd}`,
        });
      } else if (input.action === "REJECTED") {
        rejectTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
          comment,
        });
        writeAuditLog({
          eventType: "TIMESHEET_REJECTED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: sheet.employeeId,
          resourceType: "TIMESHEET",
          resourceId: sheet.id,
          summary: `Rejected timesheet via inbox ${sheet.periodStart} – ${sheet.periodEnd}`,
        });
      } else {
        returnTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
          comment,
        });
        writeAuditLog({
          eventType: "TIMESHEET_RETURNED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: sheet.employeeId,
          resourceType: "TIMESHEET",
          resourceId: sheet.id,
          summary: `Returned timesheet via inbox ${sheet.periodStart} – ${sheet.periodEnd}`,
        });
      }
    } else if (approval.requestType === "LEAVE") {
      requirePermission(actor, "team.leave.approve");
      if (input.action === "RETURNED") {
        throw new Error("Leave requests cannot be returned; reject instead");
      }
      const leave = getLeaveRequestById(approval.requestId);
      if (!leave) throw new Error("Leave request not found");

      if (input.action === "APPROVED") {
        approveLeaveRequest({
          leaveRequestId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
        });
        writeAuditLog({
          eventType: "LEAVE_APPROVED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: leave.employeeId,
          resourceType: "LEAVE_REQUEST",
          resourceId: leave.id,
          summary: `Approved leave via inbox ${leave.startDate} – ${leave.endDate}`,
        });
      } else {
        rejectLeaveRequest({
          leaveRequestId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
          comment,
        });
        writeAuditLog({
          eventType: "LEAVE_REJECTED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: leave.employeeId,
          resourceType: "LEAVE_REQUEST",
          resourceId: leave.id,
          summary: `Rejected leave via inbox ${leave.startDate} – ${leave.endDate}`,
        });
      }
    } else if (approval.requestType === "PROFILE_CHANGE") {
      if (input.action === "RETURNED") {
        throw new Error("Profile changes cannot be returned; reject instead");
      }
      const change = getProfileChangeById(approval.requestId);
      if (!change) throw new Error("Profile change not found");

      if (input.action === "APPROVED") {
        approveProfileChange({
          profileChangeId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
        });
        writeAuditLog({
          eventType: "PROFILE_CHANGE_APPROVED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: change.employeeId,
          resourceType: "PROFILE_CHANGE",
          resourceId: change.id,
          summary: `Approved profile change ${change.changeType}`,
        });
      } else {
        rejectProfileChange({
          profileChangeId: approval.requestId,
          managerEmployeeId: actor.session.employeeId,
          comment,
        });
        writeAuditLog({
          eventType: "PROFILE_CHANGE_REJECTED",
          actorEmployeeId: actor.session.employeeId,
          actorRole: "MANAGER",
          targetEmployeeId: change.employeeId,
          resourceType: "PROFILE_CHANGE",
          resourceId: change.id,
          summary: `Rejected profile change ${change.changeType}`,
        });
      }
    } else {
      throw new Error(
        `${approval.requestType} is not actionable from the approval inbox yet`,
      );
    }

    revalidateApprovalPaths();

    const label =
      input.action === "APPROVED"
        ? "approved"
        : input.action === "REJECTED"
          ? "rejected"
          : "returned for correction";

    return { ok: true, message: `Request ${label}.` };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to update approval."),
    };
  }
}
