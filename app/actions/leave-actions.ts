"use server";

import { revalidatePath } from "next/cache";

import { getEmployeeProfile } from "@/lib/self-service";
import {
  approveLeaveRequest,
  cancelLeaveRequest,
  rejectLeaveRequest,
  submitLeaveRequest,
} from "@/lib/self-service/leave-store";
import {
  getEmployeeSession,
  getManagerSession,
} from "@/lib/self-service/session";

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
    const session = getEmployeeSession();
    const managerId = await resolveManagerId(session.employeeId);
    if (!managerId) {
      throw new Error("No manager is assigned for leave approval");
    }

    submitLeaveRequest({
      employeeId: session.employeeId,
      managerEmployeeId: managerId,
      leaveTypeId: input.leaveTypeId,
      startDate: input.startDate,
      endDate: input.endDate,
      partialDay: input.partialDay,
      hours: input.hours,
      comments: input.comments,
    });

    revalidateLeavePaths();
    return { ok: true, message: "Leave request submitted for approval." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to submit leave request.",
    };
  }
}

export async function cancelLeaveAction(input: {
  leaveRequestId: string;
}): Promise<LeaveActionResult> {
  try {
    const session = getEmployeeSession();
    cancelLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      employeeId: session.employeeId,
    });
    revalidateLeavePaths();
    return { ok: true, message: "Leave request cancelled." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to cancel leave request.",
    };
  }
}

export async function approveLeaveAction(input: {
  leaveRequestId: string;
}): Promise<LeaveActionResult> {
  try {
    const session = getManagerSession();
    approveLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      managerEmployeeId: session.employeeId,
    });
    revalidateLeavePaths();
    return { ok: true, message: "Leave request approved." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to approve leave.",
    };
  }
}

export async function rejectLeaveAction(input: {
  leaveRequestId: string;
  comment: string;
}): Promise<LeaveActionResult> {
  try {
    const session = getManagerSession();
    rejectLeaveRequest({
      leaveRequestId: input.leaveRequestId,
      managerEmployeeId: session.employeeId,
      comment: input.comment,
    });
    revalidateLeavePaths();
    return { ok: true, message: "Leave request rejected." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to reject leave.",
    };
  }
}
