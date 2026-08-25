"use server";

import { revalidatePath } from "next/cache";

import {
  approveLeaveRequest,
  rejectLeaveRequest,
} from "@/lib/self-service/leave-store";
import {
  approveProfileChange,
  rejectProfileChange,
} from "@/lib/self-service/profile-change-store";
import {
  approveTimesheet,
  rejectTimesheet,
  returnTimesheet,
} from "@/lib/self-service/time-store";
import { getManagerSession } from "@/lib/self-service/session";
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
}

export async function actOnApprovalAction(input: {
  approvalId: string;
  action: ApprovalInboxAction;
  comment?: string;
}): Promise<ApprovalActionResult> {
  try {
    const session = getManagerSession();
    const approval = getApprovalById(input.approvalId);

    if (!approval) throw new Error("Approval not found");
    if (approval.approverEmployeeId !== session.employeeId) {
      throw new Error("Forbidden: approval is not assigned to this manager");
    }
    if (approval.status !== "PENDING") {
      throw new Error("Only pending approvals can be acted on");
    }

    const comment = input.comment?.trim() ?? "";

    if (approval.requestType === "TIMESHEET") {
      if (input.action === "APPROVED") {
        approveTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: session.employeeId,
        });
      } else if (input.action === "REJECTED") {
        rejectTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: session.employeeId,
          comment,
        });
      } else {
        returnTimesheet({
          timesheetId: approval.requestId,
          managerEmployeeId: session.employeeId,
          comment,
        });
      }
    } else if (approval.requestType === "LEAVE") {
      if (input.action === "RETURNED") {
        throw new Error("Leave requests cannot be returned; reject instead");
      }
      if (input.action === "APPROVED") {
        approveLeaveRequest({
          leaveRequestId: approval.requestId,
          managerEmployeeId: session.employeeId,
        });
      } else {
        rejectLeaveRequest({
          leaveRequestId: approval.requestId,
          managerEmployeeId: session.employeeId,
          comment,
        });
      }
    } else if (approval.requestType === "PROFILE_CHANGE") {
      if (input.action === "RETURNED") {
        throw new Error("Profile changes cannot be returned; reject instead");
      }
      if (input.action === "APPROVED") {
        approveProfileChange({
          profileChangeId: approval.requestId,
          managerEmployeeId: session.employeeId,
        });
      } else {
        rejectProfileChange({
          profileChangeId: approval.requestId,
          managerEmployeeId: session.employeeId,
          comment,
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
      message:
        error instanceof Error ? error.message : "Unable to update approval.",
    };
  }
}
