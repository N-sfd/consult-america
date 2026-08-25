"use server";

import { revalidatePath } from "next/cache";

import {
  addEmployeeMessage,
  addHrMessage,
  createHrRequest,
  getHrRequestById,
  updateHrRequestStatus,
} from "@/lib/self-service/hr-request-store";
import {
  getEmployeeSession,
  getHrSession,
} from "@/lib/self-service/session";
import type {
  HrRequestCategory,
  HrRequestStatus,
} from "@/types/self-service";

export type HrRequestActionResult = {
  ok: boolean;
  message: string;
  requestId?: string;
};

function revalidateHrPaths(requestId?: string) {
  revalidatePath("/employee/requests");
  revalidatePath("/employee");
  revalidatePath("/hr/requests");
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
  revalidatePath("/hr/notifications");
  if (requestId) {
    revalidatePath(`/employee/requests/${requestId}`);
    revalidatePath(`/hr/requests/${requestId}`);
  }
}

export async function createHrRequestAction(input: {
  category: HrRequestCategory;
  subject: string;
  description: string;
  priority?: "LOW" | "NORMAL" | "HIGH";
}): Promise<HrRequestActionResult> {
  try {
    const session = getEmployeeSession();
    const request = createHrRequest({
      employeeId: session.employeeId,
      category: input.category,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
    });
    revalidateHrPaths(request.id);
    return {
      ok: true,
      message: `Request ${request.requestNumber} created.`,
      requestId: request.id,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to create HR request.",
    };
  }
}

export async function addEmployeeHrMessageAction(input: {
  hrRequestId: string;
  message: string;
}): Promise<HrRequestActionResult> {
  try {
    const session = getEmployeeSession();
    const result = addEmployeeMessage({
      hrRequestId: input.hrRequestId,
      employeeId: session.employeeId,
      message: input.message,
    });
    revalidateHrPaths(result.request.id);
    return { ok: true, message: "Message sent.", requestId: result.request.id };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to send message.",
    };
  }
}

export async function addHrReplyAction(input: {
  hrRequestId: string;
  message: string;
}): Promise<HrRequestActionResult> {
  try {
    const session = getHrSession();
    const result = addHrMessage({
      hrRequestId: input.hrRequestId,
      hrEmployeeId: session.employeeId,
      message: input.message,
    });
    revalidateHrPaths(result.request.id);
    return { ok: true, message: "Reply sent.", requestId: result.request.id };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to send HR reply.",
    };
  }
}

export async function updateHrRequestStatusAction(input: {
  hrRequestId: string;
  status: HrRequestStatus;
}): Promise<HrRequestActionResult> {
  try {
    const session = getHrSession();
    const existing = getHrRequestById(input.hrRequestId);
    if (!existing) throw new Error("HR request not found");

    const request = updateHrRequestStatus({
      hrRequestId: input.hrRequestId,
      hrEmployeeId: session.employeeId,
      status: input.status,
    });
    revalidateHrPaths(request.id);
    return {
      ok: true,
      message: `Status updated to ${input.status.replaceAll("_", " ").toLowerCase()}.`,
      requestId: request.id,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to update status.",
    };
  }
}
