import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import type {
  HrRequest,
  HrRequestCategory,
  HrRequestStatus,
  LeaveRequest,
  Notification,
  TimeEntry,
  Timesheet,
  TimeType,
} from "@/types/self-service";
import type { PayPeriod, PayrollRun } from "@/types/payroll";

export function workforceDataAvailable() {
  return isSupabaseConfigured() && Boolean(getSupabaseServiceClient());
}

async function resolveProfileIdForEmployee(employeeId: string): Promise<string | null> {
  const client = getSupabaseServiceClient();
  if (!client) return null;
  const { data } = await client
    .from("employee_profiles")
    .select("user_id")
    .eq("id", employeeId)
    .maybeSingle();
  return (data?.user_id as string | null) ?? null;
}

const NOTIFICATION_ACTION_URL: Record<string, (entityId: string) => string> = {
  timesheet: () => "/employee/time",
  leave_request: () => "/employee/leave",
  hr_request: () => "/hr/requests",
  payroll_run: () => "/payroll",
  onboarding_record: () => "/employee",
  employee: (id) => `/workforce/people/${id}`,
  offer: () => "/workforce/candidates",
};

function mapNotificationRow(row: Record<string, unknown>): Notification {
  const entityType = row.entity_type as string | null;
  const entityId = row.entity_id as string | null;
  const actionUrl =
    entityType && entityId ? NOTIFICATION_ACTION_URL[entityType]?.(entityId) : undefined;

  return {
    id: row.id as string,
    userId: row.recipient_profile_id as string,
    employeeId: "",
    type: row.notification_type as string,
    title: row.title as string,
    message: row.message as string,
    actionUrl,
    readAt: (row.read_at as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export type NotificationFilter = "ALL" | "UNREAD" | "READ";

export async function listPersistedNotifications(
  employeeId: string,
  filter: NotificationFilter = "ALL",
): Promise<Notification[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const profileId = await resolveProfileIdForEmployee(employeeId);
  if (!profileId) return [];

  let query = client
    .from("notifications")
    .select("id, recipient_profile_id, notification_type, title, message, entity_type, entity_id, read_at, created_at")
    .eq("recipient_profile_id", profileId)
    .order("created_at", { ascending: false });

  if (filter === "UNREAD") query = query.is("read_at", null);
  if (filter === "READ") query = query.not("read_at", "is", null);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map(mapNotificationRow);
}

export async function countPersistedUnreadNotifications(employeeId: string): Promise<number> {
  const client = getSupabaseServiceClient();
  if (!client) return 0;

  const profileId = await resolveProfileIdForEmployee(employeeId);
  if (!profileId) return 0;

  const { count, error } = await client
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_profile_id", profileId)
    .is("read_at", null);
  if (error) throw new Error(error.message);

  return count ?? 0;
}

/** Self-scoped: the update only ever matches rows for this employee's own profile. */
export async function markPersistedNotificationRead(
  employeeId: string,
  notificationId: string,
): Promise<boolean> {
  const client = getSupabaseServiceClient();
  if (!client) return false;

  const profileId = await resolveProfileIdForEmployee(employeeId);
  if (!profileId) return false;

  const { data, error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("recipient_profile_id", profileId)
    .is("read_at", null)
    .select("id");
  if (error) throw new Error(error.message);

  return (data ?? []).length > 0;
}

export async function markAllPersistedNotificationsRead(employeeId: string): Promise<number> {
  const client = getSupabaseServiceClient();
  if (!client) return 0;

  const profileId = await resolveProfileIdForEmployee(employeeId);
  if (!profileId) return 0;

  const { data, error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_profile_id", profileId)
    .is("read_at", null)
    .select("id");
  if (error) throw new Error(error.message);

  return (data ?? []).length;
}

function dateOnly(value: unknown) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export async function listPersistedHrRequests(): Promise<HrRequest[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("hr_requests")
    .select(
      "id, employee_id, request_number, category, subject, description, priority, status, assigned_to_employee_id, created_at, resolved_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    employeeId: row.employee_id as string,
    requestNumber: row.request_number as string,
    category: row.category as HrRequestCategory,
    subject: row.subject as string,
    description: row.description as string,
    priority: (row.priority as HrRequest["priority"]) ?? "NORMAL",
    status: row.status as HrRequestStatus,
    assignedToEmployeeId: (row.assigned_to_employee_id as string) ?? undefined,
    createdAt: row.created_at as string,
    resolvedAt: (row.resolved_at as string) ?? undefined,
  }));
}

export function filterHrRequestQueue(
  requests: HrRequest[],
  filter: "OPEN" | "ASSIGNED" | "WAITING" | "RESOLVED" | "ALL",
  hrEmployeeId: string,
) {
  return requests.filter((request) => {
    if (filter === "ALL") return true;
    if (filter === "OPEN") {
      return request.status === "OPEN" || request.status === "IN_PROGRESS";
    }
    if (filter === "ASSIGNED") {
      return (
        request.assignedToEmployeeId === hrEmployeeId &&
        request.status !== "RESOLVED" &&
        request.status !== "CLOSED"
      );
    }
    if (filter === "WAITING") return request.status === "WAITING_FOR_EMPLOYEE";
    return request.status === "RESOLVED" || request.status === "CLOSED";
  });
}

export async function listPersistedPayPeriods(): Promise<PayPeriod[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("pay_periods")
    .select("id, period_start, period_end, pay_date, status, created_at, updated_at")
    .order("period_start", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    periodStart: dateOnly(row.period_start),
    periodEnd: dateOnly(row.period_end),
    payDate: dateOnly(row.pay_date),
    status: mapPeriodStatus(String(row.status)),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function listPersistedPayrollRuns(): Promise<PayrollRun[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("payroll_runs")
    .select("id, pay_period_id, status, started_at, completed_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    payPeriodId: row.pay_period_id as string,
    status: mapRunStatus(String(row.status)),
    employeeCount: 0,
    totalGrossPay: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    exceptionCount: 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    calculatedAt: (row.started_at as string) ?? undefined,
    lockedAt: (row.completed_at as string) ?? undefined,
  }));
}

function mapPeriodStatus(status: string): PayPeriod["status"] {
  if (status === "processing") return "PROCESSING";
  if (status === "closed" || status === "paid") return "CLOSED";
  return "OPEN";
}

function mapRunStatus(status: string): PayrollRun["status"] {
  switch (status) {
    case "completed":
      return "LOCKED";
    case "ready":
      return "UNDER_REVIEW";
    case "processing":
      return "CALCULATED";
    case "failed":
      return "OPEN";
    default:
      return "OPEN";
  }
}

function currentWeek() {
  const today = new Date();
  const day = today.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  start.setUTCDate(start.getUTCDate() + mondayOffset);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function mapTimesheetStatus(status: string): Timesheet["status"] {
  if (status === "SUBMITTED" || status === "APPROVED" || status === "REJECTED" || status === "REOPENED") {
    return status;
  }
  return "DRAFT";
}

function mapTimeType(entryType: string | null, timeType: string | null): TimeType {
  if (timeType === "REGULAR" || timeType === "OVERTIME" || timeType === "HOLIDAY" || timeType === "TRAINING" || timeType === "ADMIN") {
    return timeType;
  }
  if (entryType === "overtime") return "OVERTIME";
  if (entryType === "holiday") return "HOLIDAY";
  return "REGULAR";
}

export async function getPersistedTimesheetForEmployee(employeeId: string) {
  const client = getSupabaseServiceClient();
  if (!client) return { current: null as Timesheet | null, entries: [] as TimeEntry[], history: [] as Timesheet[] };

  const week = currentWeek();
  await client.rpc("ensure_timesheet", {
    p_employee_id: employeeId,
    p_period_start: week.start,
    p_period_end: week.end,
  });

  const { data, error } = await client
    .from("timesheets")
    .select("id, employee_id, period_start, period_end, status, total_hours, submitted_at, approved_at, approved_by_employee_id, created_at, updated_at")
    .eq("employee_id", employeeId)
    .order("period_start", { ascending: false });

  if (error) throw new Error(error.message);

  const history = (data ?? []).map((row) => ({
    id: row.id as string,
    employeeId: row.employee_id as string,
    periodStart: dateOnly(row.period_start),
    periodEnd: dateOnly(row.period_end),
    status: mapTimesheetStatus(String(row.status)),
    totalHours: Number(row.total_hours ?? 0),
    submittedAt: (row.submitted_at as string) ?? undefined,
    approvedAt: (row.approved_at as string) ?? undefined,
    approvedByEmployeeId: (row.approved_by_employee_id as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));

  const current =
    history.find((sheet) => sheet.status === "DRAFT" || sheet.status === "REOPENED") ??
    history[0] ??
    null;

  if (!current) return { current, entries: [], history };

  const entriesResult = await client
    .from("time_entries")
    .select("id, timesheet_id, employee_id, work_date, hours, time_type, entry_type, comments")
    .eq("timesheet_id", current.id)
    .order("work_date");

  if (entriesResult.error) throw new Error(entriesResult.error.message);

  const entries = (entriesResult.data ?? []).map((row) => ({
    id: row.id as string,
    timesheetId: row.timesheet_id as string,
    employeeId: row.employee_id as string,
    workDate: dateOnly(row.work_date),
    hours: Number(row.hours ?? 0),
    timeType: mapTimeType(row.entry_type as string | null, row.time_type as string | null),
    comments: (row.comments as string) ?? undefined,
  }));

  return { current, entries, history };
}

export async function listPersistedLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("leave_requests")
    .select("id, employee_id, leave_type_id, start_date, end_date, hours, status, comments, submitted_at, created_at, updated_at")
    .eq("employee_id", employeeId)
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    employeeId: row.employee_id as string,
    leaveTypeId: row.leave_type_id as string,
    startDate: dateOnly(row.start_date),
    endDate: dateOnly(row.end_date),
    hours: Number(row.hours ?? 0),
    status: row.status as LeaveRequest["status"],
    comments: (row.comments as string) ?? undefined,
    submittedAt: (row.submitted_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function countPendingApprovalsFor(managerEmployeeId: string) {
  const client = getSupabaseServiceClient();
  if (!client) return null;

  const { data, error } = await client
    .from("approval_requests")
    .select("request_type")
    .eq("approver_employee_id", managerEmployeeId)
    .eq("status", "PENDING");

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  return {
    pendingApprovals: rows.length,
    pendingTimesheets: rows.filter((row) => row.request_type === "TIMESHEET").length,
    pendingLeave: rows.filter((row) => row.request_type === "LEAVE").length,
  };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

export async function getWorkforceHeadcountSummary() {
  const client = getSupabaseServiceClient();
  if (!client) return null;

  const { data, error } = await client
    .from("workforce_headcount_summary")
    .select("total_employees, active_employees, on_leave_employees, pre_hire_employees, terminated_employees")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    totalEmployees: Number(data.total_employees ?? 0),
    activeEmployees: Number(data.active_employees ?? 0),
    onLeaveEmployees: Number(data.on_leave_employees ?? 0),
    preHireEmployees: Number(data.pre_hire_employees ?? 0),
    terminatedEmployees: Number(data.terminated_employees ?? 0),
  };
}

export async function getRecruitingPipelineSummary() {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("recruiting_pipeline_summary")
    .select("status, application_count");
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    status: row.status as string,
    applicationCount: Number(row.application_count ?? 0),
  }));
}

export type WorkforceActivityItem = {
  id: string;
  title: string;
  detail: string;
  occurredAt: string;
};

function labelFromEventType(eventType: string) {
  return eventType
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

/** Merges the two existing audit trails (workforce ops + recruiting) into
 * one real activity feed — both already carry a human-readable summary, so
 * no denormalized join is needed just to render this list. */
export async function getRecentWorkforceActivity(limit = 6): Promise<WorkforceActivityItem[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const [workforceEvents, recruitingEvents] = await Promise.all([
    client
      .from("workforce_audit_events")
      .select("id, event_type, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    client
      .from("recruiting_activities")
      .select("id, activity_type, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (workforceEvents.error) throw new Error(workforceEvents.error.message);
  if (recruitingEvents.error) throw new Error(recruitingEvents.error.message);

  const merged: WorkforceActivityItem[] = [
    ...(workforceEvents.data ?? []).map((row) => ({
      id: row.id as string,
      title: labelFromEventType(row.event_type as string),
      detail: row.summary as string,
      occurredAt: row.created_at as string,
    })),
    ...(recruitingEvents.data ?? []).map((row) => ({
      id: row.id as string,
      title: labelFromEventType(row.activity_type as string),
      detail: row.summary as string,
      occurredAt: row.created_at as string,
    })),
  ];

  return merged
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Export sources — same persisted tables the UI reads, no separate query path.
// ---------------------------------------------------------------------------

export async function listPersistedTimeEntriesForEmployees(employeeIds: string[]): Promise<TimeEntry[]> {
  const client = getSupabaseServiceClient();
  if (!client || employeeIds.length === 0) return [];

  const { data, error } = await client
    .from("time_entries")
    .select("id, timesheet_id, employee_id, work_date, hours, time_type, entry_type, comments")
    .in("employee_id", employeeIds)
    .order("work_date", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    timesheetId: row.timesheet_id as string,
    employeeId: row.employee_id as string,
    workDate: dateOnly(row.work_date),
    hours: Number(row.hours ?? 0),
    timeType: mapTimeType(row.entry_type as string | null, row.time_type as string | null),
    comments: (row.comments as string) ?? undefined,
  }));
}

export async function listPersistedLeaveRequestsForEmployees(employeeIds: string[]): Promise<LeaveRequest[]> {
  const results = await Promise.all(employeeIds.map((id) => listPersistedLeaveRequests(id)));
  return results.flat();
}

export type PayrollRunSummaryRow = {
  payrollRunId: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  employeeCount: number;
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalGrossAmount: number;
};

export async function listPayrollRunSummaryRows(): Promise<PayrollRunSummaryRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("payroll_run_summary")
    .select("payroll_run_id, status, period_start, period_end, pay_date, employee_count, total_regular_hours, total_overtime_hours, total_gross_amount")
    .order("period_start", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    payrollRunId: row.payroll_run_id as string,
    status: row.status as string,
    periodStart: dateOnly(row.period_start),
    periodEnd: dateOnly(row.period_end),
    payDate: dateOnly(row.pay_date),
    employeeCount: Number(row.employee_count ?? 0),
    totalRegularHours: Number(row.total_regular_hours ?? 0),
    totalOvertimeHours: Number(row.total_overtime_hours ?? 0),
    totalGrossAmount: Number(row.total_gross_amount ?? 0),
  }));
}
