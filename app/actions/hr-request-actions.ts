"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  addEmployeeMessage,
  addHrMessage,
  createHrRequest,
  getHrRequestById,
  updateHrRequestStatus,
} from "@/lib/self-service/hr-request-store";
import {
  requireEmployeeActor,
  requireHrActor,
  requirePermission,
  requireSelfResource,
  toActionErrorMessage,
} from "@/lib/self-service/security";
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
  revalidatePath("/hr/audit");
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
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.hr_request.create");

    const request = createHrRequest({
      employeeId: actor.session.employeeId,
      category: input.category,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
    });

    writeAuditLog({
      eventType: "HR_REQUEST_CREATED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "HR_REQUEST",
      resourceId: request.id,
      summary: `Created ${request.requestNumber}`,
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
      message: toActionErrorMessage(error, "Unable to create HR request."),
    };
  }
}

export async function addEmployeeHrMessageAction(input: {
  hrRequestId: string;
  message: string;
}): Promise<HrRequestActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.hr_request.create");

    const existing = getHrRequestById(input.hrRequestId);
    if (!existing) throw new Error("HR request not found");
    await requireSelfResource(actor, existing.employeeId);

    const result = addEmployeeMessage({
      hrRequestId: input.hrRequestId,
      employeeId: actor.session.employeeId,
      message: input.message,
    });

    writeAuditLog({
      eventType: "HR_REQUEST_EMPLOYEE_MESSAGE",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "HR_REQUEST",
      resourceId: result.request.id,
      summary: `Employee message on ${result.request.requestNumber}`,
    });

    revalidateHrPaths(result.request.id);
    return { ok: true, message: "Message sent.", requestId: result.request.id };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to send message."),
    };
  }
}

export async function addHrReplyAction(input: {
  hrRequestId: string;
  message: string;
}): Promise<HrRequestActionResult> {
  try {
    const actor = await requireHrActor();
    requirePermission(actor, "hr_request.manage");

    const result = addHrMessage({
      hrRequestId: input.hrRequestId,
      hrEmployeeId: actor.session.employeeId,
      message: input.message,
    });

    writeAuditLog({
      eventType: "HR_REQUEST_HR_REPLY",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "HR",
      targetEmployeeId: result.request.employeeId,
      resourceType: "HR_REQUEST",
      resourceId: result.request.id,
      summary: `HR reply on ${result.request.requestNumber}`,
    });

    revalidateHrPaths(result.request.id);
    return { ok: true, message: "Reply sent.", requestId: result.request.id };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to send HR reply."),
    };
  }
}

export async function updateHrRequestStatusAction(input: {
  hrRequestId: string;
  status: HrRequestStatus;
}): Promise<HrRequestActionResult> {
  try {
    const actor = await requireHrActor();
    requirePermission(actor, "hr_request.manage");

    const existing = getHrRequestById(input.hrRequestId);
    if (!existing) throw new Error("HR request not found");

    const request = updateHrRequestStatus({
      hrRequestId: input.hrRequestId,
      hrEmployeeId: actor.session.employeeId,
      status: input.status,
    });

    writeAuditLog({
      eventType: "HR_REQUEST_STATUS_CHANGED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "HR",
      targetEmployeeId: request.employeeId,
      resourceType: "HR_REQUEST",
      resourceId: request.id,
      summary: `${request.requestNumber} → ${input.status}`,
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
      message: toActionErrorMessage(error, "Unable to update status."),
    };
  }
}
