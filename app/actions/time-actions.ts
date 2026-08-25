"use server";

import { revalidatePath } from "next/cache";

import { getEmployeeProfile } from "@/lib/self-service";
import {
  approveTimesheet,
  rejectTimesheet,
  returnTimesheet,
  saveTimesheetDraft,
  submitTimesheet,
  type DayHoursInput,
} from "@/lib/self-service/time-store";
import {
  getEmployeeSession,
  getManagerSession,
} from "@/lib/self-service/session";

export type TimeActionResult = {
  ok: boolean;
  message: string;
};

async function resolveManagerId(employeeId: string) {
  const profile = await getEmployeeProfile(employeeId);
  return profile?.assignment?.managerEmployeeId;
}

export async function saveDraftAction(input: {
  timesheetId: string;
  days: DayHoursInput[];
}): Promise<TimeActionResult> {
  try {
    const session = getEmployeeSession();
    saveTimesheetDraft({
      timesheetId: input.timesheetId,
      employeeId: session.employeeId,
      days: input.days,
    });
    revalidatePath("/employee/time");
    revalidatePath("/employee");
    return { ok: true, message: "Draft saved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to save draft.",
    };
  }
}

export async function submitTimesheetAction(input: {
  timesheetId: string;
}): Promise<TimeActionResult> {
  try {
    const session = getEmployeeSession();
    const managerId = await resolveManagerId(session.employeeId);
    if (!managerId) {
      throw new Error("No manager is assigned for timesheet approval");
    }

    submitTimesheet({
      timesheetId: input.timesheetId,
      employeeId: session.employeeId,
      managerEmployeeId: managerId,
    });

    revalidatePath("/employee/time");
    revalidatePath("/employee");
    revalidatePath("/manager/time");
    revalidatePath("/manager/approvals");
    revalidatePath("/manager");
    revalidatePath("/employee/notifications");
    revalidatePath("/manager/notifications");
    return { ok: true, message: "Timesheet submitted for approval." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to submit timesheet.",
    };
  }
}

export async function approveTimesheetAction(input: {
  timesheetId: string;
}): Promise<TimeActionResult> {
  try {
    const session = getManagerSession();
    approveTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: session.employeeId,
    });
    revalidatePath("/manager/time");
    revalidatePath("/manager/approvals");
    revalidatePath("/manager");
    revalidatePath("/employee/time");
    revalidatePath("/employee");
    revalidatePath("/employee/notifications");
    revalidatePath("/manager/notifications");
    return { ok: true, message: "Timesheet approved." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to approve timesheet.",
    };
  }
}

export async function rejectTimesheetAction(input: {
  timesheetId: string;
  comment: string;
}): Promise<TimeActionResult> {
  try {
    const session = getManagerSession();
    rejectTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: session.employeeId,
      comment: input.comment,
    });
    revalidatePath("/manager/time");
    revalidatePath("/manager/approvals");
    revalidatePath("/manager");
    revalidatePath("/employee/time");
    revalidatePath("/employee/notifications");
    revalidatePath("/manager/notifications");
    return { ok: true, message: "Timesheet rejected." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to reject timesheet.",
    };
  }
}

export async function returnTimesheetAction(input: {
  timesheetId: string;
  comment: string;
}): Promise<TimeActionResult> {
  try {
    const session = getManagerSession();
    returnTimesheet({
      timesheetId: input.timesheetId,
      managerEmployeeId: session.employeeId,
      comment: input.comment,
    });
    revalidatePath("/manager/time");
    revalidatePath("/manager/approvals");
    revalidatePath("/manager");
    revalidatePath("/employee/time");
    revalidatePath("/employee/notifications");
    revalidatePath("/manager/notifications");
    return { ok: true, message: "Timesheet returned for correction." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to return timesheet.",
    };
  }
}
