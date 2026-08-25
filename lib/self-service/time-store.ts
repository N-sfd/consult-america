import {
  seedTimeEntries,
  seedTimesheets,
} from "@/data/self-service/seed";
import type {
  TimeEntry,
  Timesheet,
  TimeType,
} from "@/types/self-service";
import {
  findPendingApproval,
  getWorkflowSnapshot,
  listPendingApprovalsFor,
  pushApprovalHistory,
  pushNotification,
  resolvePendingApproval,
  upsertPendingApproval,
} from "@/lib/self-service/workflow-store";

/** Mutable in-memory time store for Phase 4E demos. */
const timesheets: Timesheet[] = structuredClone(seedTimesheets);
const timeEntries: TimeEntry[] = structuredClone(seedTimeEntries);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function listTimesheets(employeeId: string) {
  return timesheets
    .filter((sheet) => sheet.employeeId === employeeId)
    .sort((a, b) => b.periodStart.localeCompare(a.periodStart));
}

export function getTimesheetById(timesheetId: string) {
  return timesheets.find((sheet) => sheet.id === timesheetId);
}

export function getEditableTimesheet(employeeId: string) {
  return (
    timesheets.find(
      (sheet) =>
        sheet.employeeId === employeeId &&
        (sheet.status === "DRAFT" || sheet.status === "REOPENED"),
    ) ?? null
  );
}

export function listTimeEntries(timesheetId: string) {
  return timeEntries
    .filter((entry) => entry.timesheetId === timesheetId)
    .sort((a, b) => a.workDate.localeCompare(b.workDate));
}

export function sumHours(timesheetId: string) {
  return listTimeEntries(timesheetId).reduce(
    (total, entry) => total + entry.hours,
    0,
  );
}

export function datesInPeriod(periodStart: string, periodEnd: string) {
  const dates: string[] = [];
  const cursor = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export type DayHoursInput = {
  workDate: string;
  hours: number;
  timeType?: TimeType;
};

export function saveTimesheetDraft(input: {
  timesheetId: string;
  employeeId: string;
  days: DayHoursInput[];
}) {
  const sheet = getTimesheetById(input.timesheetId);
  if (!sheet) throw new Error("Timesheet not found");
  if (sheet.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot edit another employee's timesheet");
  }
  if (sheet.status !== "DRAFT" && sheet.status !== "REOPENED") {
    throw new Error("Only draft or reopened timesheets can be edited");
  }

  const periodDates = new Set(
    datesInPeriod(sheet.periodStart, sheet.periodEnd),
  );

  for (const day of input.days) {
    if (!periodDates.has(day.workDate)) {
      throw new Error(`Work date ${day.workDate} is outside the timesheet period`);
    }
    if (day.hours < 0) throw new Error("Hours must be zero or greater");
    if (day.hours > 24) throw new Error("Hours cannot exceed 24 in a day");
  }

  for (let i = timeEntries.length - 1; i >= 0; i -= 1) {
    if (timeEntries[i].timesheetId === input.timesheetId) {
      timeEntries.splice(i, 1);
    }
  }

  for (const day of input.days) {
    if (day.hours <= 0) continue;
    timeEntries.push({
      id: createId("te"),
      timesheetId: input.timesheetId,
      employeeId: input.employeeId,
      workDate: day.workDate,
      hours: day.hours,
      timeType: day.timeType ?? "REGULAR",
    });
  }

  sheet.totalHours = sumHours(input.timesheetId);
  sheet.updatedAt = nowIso();

  return { sheet, entries: listTimeEntries(input.timesheetId) };
}

export function submitTimesheet(input: {
  timesheetId: string;
  employeeId: string;
  managerEmployeeId: string;
}) {
  const sheet = getTimesheetById(input.timesheetId);
  if (!sheet) throw new Error("Timesheet not found");
  if (sheet.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot submit another employee's timesheet");
  }
  if (sheet.status !== "DRAFT" && sheet.status !== "REOPENED") {
    throw new Error("Only draft or reopened timesheets can be submitted");
  }

  sheet.totalHours = sumHours(sheet.id);
  if (sheet.totalHours <= 0) {
    throw new Error("Add hours before submitting a timesheet");
  }

  sheet.status = "SUBMITTED";
  sheet.submittedAt = nowIso();
  sheet.updatedAt = nowIso();

  upsertPendingApproval({
    requestType: "TIMESHEET",
    requestId: sheet.id,
    requesterEmployeeId: input.employeeId,
    approverEmployeeId: input.managerEmployeeId,
    summary: `Timesheet ${sheet.periodStart} – ${sheet.periodEnd} · ${sheet.totalHours} hours`,
    submittedAt: sheet.submittedAt,
  });

  pushApprovalHistory({
    requestType: "TIMESHEET",
    requestId: sheet.id,
    action: "SUBMITTED",
    actorEmployeeId: input.employeeId,
    actedAt: sheet.submittedAt,
  });

  pushNotification({
    employeeId: input.managerEmployeeId,
    type: "TIMESHEET_SUBMITTED",
    title: "Timesheet submitted",
    message: `A timesheet for ${sheet.periodStart} – ${sheet.periodEnd} is ready for review.`,
    actionUrl: "/manager/time",
  });

  return sheet;
}

export function listSubmittedTimesheetsForManager(managerEmployeeId: string) {
  const pending = listPendingApprovalsFor(managerEmployeeId, "TIMESHEET");

  return pending
    .map((approval) => {
      const sheet = getTimesheetById(approval.requestId);
      if (!sheet || sheet.status !== "SUBMITTED") return null;
      return { approval, sheet, entries: listTimeEntries(sheet.id) };
    })
    .filter(Boolean) as Array<{
    approval: (typeof pending)[number];
    sheet: Timesheet;
    entries: TimeEntry[];
  }>;
}

export function approveTimesheet(input: {
  timesheetId: string;
  managerEmployeeId: string;
}) {
  return actOnTimesheet({
    ...input,
    action: "APPROVED",
  });
}

export function rejectTimesheet(input: {
  timesheetId: string;
  managerEmployeeId: string;
  comment: string;
}) {
  if (!input.comment.trim()) {
    throw new Error("A comment is required when rejecting a timesheet");
  }
  return actOnTimesheet({
    timesheetId: input.timesheetId,
    managerEmployeeId: input.managerEmployeeId,
    action: "REJECTED",
    comment: input.comment.trim(),
  });
}

export function returnTimesheet(input: {
  timesheetId: string;
  managerEmployeeId: string;
  comment: string;
}) {
  if (!input.comment.trim()) {
    throw new Error("A comment is required when returning a timesheet");
  }
  return actOnTimesheet({
    timesheetId: input.timesheetId,
    managerEmployeeId: input.managerEmployeeId,
    action: "RETURNED",
    comment: input.comment.trim(),
  });
}

function actOnTimesheet(input: {
  timesheetId: string;
  managerEmployeeId: string;
  action: "APPROVED" | "REJECTED" | "RETURNED";
  comment?: string;
}) {
  const sheet = getTimesheetById(input.timesheetId);
  if (!sheet) throw new Error("Timesheet not found");
  if (sheet.status !== "SUBMITTED") {
    throw new Error("Only submitted timesheets can be reviewed");
  }

  const pending = findPendingApproval({
    requestType: "TIMESHEET",
    requestId: sheet.id,
    approverEmployeeId: input.managerEmployeeId,
  });
  if (!pending) {
    throw new Error("No pending timesheet approval found for this manager");
  }

  const actedAt = nowIso();

  if (input.action === "APPROVED") {
    sheet.status = "APPROVED";
    sheet.approvedAt = actedAt;
    sheet.approvedByEmployeeId = input.managerEmployeeId;
    resolvePendingApproval({
      requestType: "TIMESHEET",
      requestId: sheet.id,
      approverEmployeeId: input.managerEmployeeId,
      status: "APPROVED",
      actedAt,
    });
  } else if (input.action === "REJECTED") {
    sheet.status = "REJECTED";
    resolvePendingApproval({
      requestType: "TIMESHEET",
      requestId: sheet.id,
      approverEmployeeId: input.managerEmployeeId,
      status: "REJECTED",
      actedAt,
    });
  } else {
    sheet.status = "REOPENED";
    resolvePendingApproval({
      requestType: "TIMESHEET",
      requestId: sheet.id,
      approverEmployeeId: input.managerEmployeeId,
      status: "CANCELLED",
      actedAt,
    });
  }

  sheet.updatedAt = actedAt;

  pushApprovalHistory({
    requestType: "TIMESHEET",
    requestId: sheet.id,
    action: input.action,
    actorEmployeeId: input.managerEmployeeId,
    comment: input.comment,
    actedAt,
  });

  pushNotification({
    employeeId: sheet.employeeId,
    type: `TIMESHEET_${input.action}`,
    title:
      input.action === "APPROVED"
        ? "Timesheet approved"
        : input.action === "REJECTED"
          ? "Timesheet rejected"
          : "Timesheet returned",
    message:
      input.comment ||
      `Your timesheet for ${sheet.periodStart} – ${sheet.periodEnd} was ${input.action.toLowerCase()}.`,
    actionUrl: "/employee/time",
    createdAt: actedAt,
  });

  return sheet;
}

export function listApprovalHistory(timesheetId: string) {
  return getWorkflowSnapshot()
    .approvalHistory.filter(
      (item) =>
        item.requestType === "TIMESHEET" && item.requestId === timesheetId,
    )
    .sort((a, b) => b.actedAt.localeCompare(a.actedAt));
}

export function getTimeStoreSnapshot() {
  const workflow = getWorkflowSnapshot();
  return {
    timesheets,
    timeEntries,
    approvals: workflow.approvals,
    approvalHistory: workflow.approvalHistory,
    notifications: workflow.notifications,
  };
}

/** Test-only: restore timesheets/entries to seed state. */
export function resetTimeStoreForTests() {
  timesheets.splice(0, timesheets.length, ...structuredClone(seedTimesheets));
  timeEntries.splice(0, timeEntries.length, ...structuredClone(seedTimeEntries));
}
