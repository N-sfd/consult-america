"use server";

import { revalidatePath } from "next/cache";

import { getEmployeeProfile } from "@/lib/self-service";
import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  requireEmployeeActor,
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
  saveTimesheetDraft,
  submitTimesheet,
  type DayHoursInput,
} from "@/lib/self-service/time-store";

export type TimeActionResult = {
  ok: boolean;
  message: string;
};

async function resolveManagerId(employeeId: string) {
  const profile = await getEmployeeProfile(employeeId);
  return profile?.assignment?.managerEmployeeId;
}

function revalidateTimePaths() {
  revalidatePath("/employee/time");
  revalidatePath("/employee");
  revalidatePath("/manager/time");
  revalidatePath("/manager/approvals");
  revalidatePath("/manager");
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
}

export async function saveDraftAction(input: {
  timesheetId: string;
  days: DayHoursInput[];
}): Promise<TimeActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.timesheet.submit");

    const sheet = getTimesheetById(input.timesheetId);
    if (!sheet) throw new Error("Timesheet not found");
    if (sheet.employeeId !== actor.session.employeeId) {
      throw new Error("Forbidden: cannot edit another employee's timesheet");
    }

    saveTimesheetDraft({
      timesheetId: input.timesheetId,
      employeeId: actor.session.employeeId,
      days: input.days,
    });
    revalidatePath("/employee/time");
    revalidatePath("/employee");
    return { ok: true, message: "Draft saved." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to save draft."),
    };
  }
}

export async function submitTimesheetAction(input: {
  timesheetId: string;
}): Promise<TimeActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.timesheet.submit");

    const managerId = await resolveManagerId(actor.session.employeeId);
    if (!managerId) {
      throw new Error("No manager is assigned for timesheet approval");
    }

    const sheet = submitTimesheet({
      timesheetId: input.timesheetId,
      employeeId: actor.session.employeeId,
      managerEmployeeId: managerId,
    });

    writeAuditLog({
      eventType: "TIMESHEET_SUBMITTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "TIMESHEET",
      resourceId: sheet.id,
      summary: `Submitted timesheet ${sheet.periodStart} – ${sheet.periodEnd}`,
    });

    revalidateTimePaths();
    return { ok: true, message: "Timesheet submitted for approval." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to submit timesheet."),
    };
  }
}

export async function approveTimesheetAction(input: {
  timesheetId: string;
}): Promise<TimeActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.timesheet.approve");

    const sheet = getTimesheetById(input.timesheetId);
    if (!sheet) throw new Error("Timesheet not found");
    await requireTeamResource(actor, sheet.employeeId);

    approveTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "TIMESHEET_APPROVED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: sheet.employeeId,
      resourceType: "TIMESHEET",
      resourceId: sheet.id,
      summary: `Approved timesheet ${sheet.periodStart} – ${sheet.periodEnd}`,
    });

    revalidateTimePaths();
    return { ok: true, message: "Timesheet approved." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to approve timesheet."),
    };
  }
}

export async function rejectTimesheetAction(input: {
  timesheetId: string;
  comment: string;
}): Promise<TimeActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.timesheet.approve");

    const sheet = getTimesheetById(input.timesheetId);
    if (!sheet) throw new Error("Timesheet not found");
    await requireTeamResource(actor, sheet.employeeId);

    rejectTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: actor.session.employeeId,
      comment: input.comment,
    });

    writeAuditLog({
      eventType: "TIMESHEET_REJECTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: sheet.employeeId,
      resourceType: "TIMESHEET",
      resourceId: sheet.id,
      summary: `Rejected timesheet ${sheet.periodStart} – ${sheet.periodEnd}`,
    });

    revalidateTimePaths();
    return { ok: true, message: "Timesheet rejected." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to reject timesheet."),
    };
  }
}

export async function returnTimesheetAction(input: {
  timesheetId: string;
  comment: string;
}): Promise<TimeActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.timesheet.approve");

    const sheet = getTimesheetById(input.timesheetId);
    if (!sheet) throw new Error("Timesheet not found");
    await requireTeamResource(actor, sheet.employeeId);

    returnTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: actor.session.employeeId,
      comment: input.comment,
    });

    writeAuditLog({
      eventType: "TIMESHEET_RETURNED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "MANAGER",
      targetEmployeeId: sheet.employeeId,
      resourceType: "TIMESHEET",
      resourceId: sheet.id,
      summary: `Returned timesheet ${sheet.periodStart} – ${sheet.periodEnd}`,
    });

    revalidateTimePaths();
    return { ok: true, message: "Timesheet returned for correction." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to return timesheet."),
    };
  }
}
