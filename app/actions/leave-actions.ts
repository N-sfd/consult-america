"use server";

import { revalidatePath } from "next/cache";

import { getEmployeeProfile } from "@/lib/self-service";
import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  approveLeaveRequest,
  cancelLeaveRequest,
  getLeaveRequestById,
  rejectLeaveRequest,
  submitLeaveRequest,
} from "@/lib/self-service/leave-store";
import {
  requireEmployeeActor,
  requireManagerActor,
  requirePermission,
  requireTeamResource,
  toActionErrorMessage,
} from "@/lib/self-service/security";

export type LeaveActionResult = {
  ok: boolean;
  message: string;
};

async function resolveManagerId(employeeId: string) {
  const profile = await getEmployeeProfile(employeeId);
  return profile?.assignment?.managerEmployeeId;
}

function revalidateLeavePaths() {
  revalidatePath("/employee/leave");
  revalidatePath("/employee");
  revalidatePath("/manager/leave");
  revalidatePath("/manager/approvals");
  revalidatePath("/manager");
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
  revalidatePath("/hr/notifications");
}

export async function submitLeaveAction(input: {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  partialDay?: boolean;
  hours?: number;
  comments?: string;
}): Promise<LeaveActionResult> {
  try {
    const actor = requireEmployeeActor();
    requirePermission(actor, "self.leave.submit");

    const managerId = await resolveManagerId(actor.session.employeeId);
    if (!managerId) {
      throw new Error("No manager is assigned for leave approval");
    }

    const request = submitLeaveRequest({
      employeeId: actor.session.employeeId,
      managerEmployeeId: managerId,
      leaveTypeId: input.leaveTypeId,
      startDate: input.startDate,
      endDate: input.endDate,
      partialDay: input.partialDay,
      hours: input.hours,
      comments: input.comments,
    });

    writeAuditLog({
      eventType: "LEAVE_REQUESTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "LEAVE_REQUEST",
      resourceId: request.id,
      summary: `Requested leave ${request.startDate} – ${request.endDate}`,
    });

    revalidateLeavePaths();
    return { ok: true, message: "Leave request submitted for approval." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to submit leave request."),
    };
  }
}

export async function cancelLeaveAction(input: {
  leaveRequestId: string;
}): Promise<LeaveActionResult> {
  try {
    const actor = requireEmployeeActor();
    requirePermission(actor, "self.leave.submit");

    const request = cancelLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      employeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "LEAVE_CANCELLED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "LEAVE_REQUEST",
      resourceId: request.id,
      summary: `Cancelled leave ${request.startDate} – ${request.endDate}`,
    });

    revalidateLeavePaths();
    return { ok: true, message: "Leave request cancelled." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to cancel leave request."),
    };
  }
}

export async function approveLeaveAction(input: {
  leaveRequestId: string;
}): Promise<LeaveActionResult> {
  try {
    const actor = requireManagerActor();
    requirePermission(actor, "team.leave.approve");

    const existing = getLeaveRequestById(input.leaveRequestId);
    if (!existing) throw new Error("Leave request not found");
    await requireTeamResource(actor, existing.employeeId);

    const request = approveLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      managerEmployeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "LEAVE_APPROVED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: request.employeeId,
      resourceType: "LEAVE_REQUEST",
      resourceId: request.id,
      summary: `Approved leave ${request.startDate} – ${request.endDate}`,
    });

    revalidateLeavePaths();
    return { ok: true, message: "Leave request approved." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to approve leave."),
    };
  }
}

export async function rejectLeaveAction(input: {
  leaveRequestId: string;
  comment: string;
}): Promise<LeaveActionResult> {
  try {
    const actor = requireManagerActor();
    requirePermission(actor, "team.leave.approve");

    const existing = getLeaveRequestById(input.leaveRequestId);
    if (!existing) throw new Error("Leave request not found");
    await requireTeamResource(actor, existing.employeeId);

    const request = rejectLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      managerEmployeeId: actor.session.employeeId,
      comment: input.comment,
    });

    writeAuditLog({
      eventType: "LEAVE_REJECTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: request.employeeId,
      resourceType: "LEAVE_REQUEST",
      resourceId: request.id,
      summary: `Rejected leave ${request.startDate} – ${request.endDate}`,
    });

    revalidateLeavePaths();
    return { ok: true, message: "Leave request rejected." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to reject leave."),
    };
  }
}
