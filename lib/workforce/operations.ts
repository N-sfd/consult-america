import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { listAuditEvents } from "@/lib/audit/audit-log";
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
  employee_document: () => "/employee/documents",
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

export type AuditTimelineEntry = {
  id: string;
  source: "audit_logs" | "workforce_audit_events" | "recruiting_activities";
  eventType: string;
  summary: string;
  actorRole?: string;
  actorEmployeeId?: string;
  resourceType?: string;
  resourceId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
};

/**
 * Unifies the three real audit trails into one filterable timeline for
 * /workforce/audit: audit_logs (general compliance — employee/document/export/
 * candidate-match events, actor-scoped, correlation id recovered from
 * metadata_json where present), and the workforce_audit_events +
 * recruiting_activities pair getRecentWorkforceActivity already merges for
 * the dashboard feed (both carry a native correlation_id column).
 */
export async function listAuditTimeline(limit = 100): Promise<AuditTimelineEntry[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const [auditLogs, workforceEvents, recruitingEvents] = await Promise.all([
    listAuditEvents(limit),
    client
      .from("workforce_audit_events")
      .select("id, event_type, summary, actor_employee_id, entity_type, entity_id, correlation_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    client
      .from("recruiting_activities")
      .select(
        "id, activity_type, summary, correlation_id, candidate_id, application_id, requisition_id, created_by_user_id, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (workforceEvents.error) throw new Error(workforceEvents.error.message);
  if (recruitingEvents.error) throw new Error(recruitingEvents.error.message);

  const merged: AuditTimelineEntry[] = [
    ...auditLogs.map((row) => ({
      id: row.id,
      source: "audit_logs" as const,
      eventType: row.eventType,
      summary: row.summary,
      actorRole: row.actorRole,
      actorEmployeeId: row.actorEmployeeId,
      resourceType: row.resourceType,
      resourceId: row.resourceId,
      correlationId: row.correlationId,
      metadata: row.metadata,
      occurredAt: row.createdAt,
    })),
    ...(workforceEvents.data ?? []).map((row) => ({
      id: row.id as string,
      source: "workforce_audit_events" as const,
      eventType: row.event_type as string,
      summary: row.summary as string,
      actorEmployeeId: (row.actor_employee_id as string) ?? undefined,
      resourceType: (row.entity_type as string) ?? undefined,
      resourceId: (row.entity_id as string) ?? undefined,
      correlationId: (row.correlation_id as string) ?? undefined,
      occurredAt: row.created_at as string,
    })),
    ...(recruitingEvents.data ?? []).map((row) => {
      const resourceType = row.application_id
        ? "application"
        : row.candidate_id
          ? "candidate"
          : row.requisition_id
            ? "requisition"
            : undefined;
      const resourceId =
        (row.application_id as string) ??
        (row.candidate_id as string) ??
        (row.requisition_id as string) ??
        undefined;
      return {
        id: row.id as string,
        source: "recruiting_activities" as const,
        eventType: row.activity_type as string,
        summary: row.summary as string,
        resourceType,
        resourceId,
        correlationId: (row.correlation_id as string) ?? undefined,
        occurredAt: row.created_at as string,
      };
    }),
  ];

  return merged
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, limit);
}

export type NotificationDeliveryRow = {
  id: string;
  channel: string;
  status: string;
  recipient: string;
  attemptCount: number;
  lastAttemptAt?: string;
  sentAt?: string;
  failedAt?: string;
  failureReason?: string;
  notificationType?: string;
  title?: string;
  entityType?: string;
  entityId?: string;
  correlationId?: string;
  createdAt: string;
};

/**
 * notification_deliveries has zero RLS policies for `authenticated` (service
 * role only, by design — see db/schema/024) so this, like every other read
 * in this file, goes through the service-role client; the actor/permission
 * check happens in the calling page/action before this is ever called.
 */
export async function listNotificationDeliveries(filter?: {
  status?: string;
  channel?: string;
}): Promise<NotificationDeliveryRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  let query = client
    .from("notification_deliveries")
    .select(
      "id, notification_id, channel, status, recipient, attempt_count, last_attempt_at, sent_at, failed_at, failure_reason, created_at",
    )
    .order("created_at", { ascending: false });

  if (filter?.status) query = query.eq("status", filter.status);
  if (filter?.channel) query = query.eq("channel", filter.channel);

  const { data: deliveries, error } = await query.limit(200);
  if (error) throw new Error(error.message);
  if (!deliveries || deliveries.length === 0) return [];

  const notificationIds = [...new Set(deliveries.map((d) => d.notification_id as string))];
  const { data: notifications, error: notifError } = await client
    .from("notifications")
    .select("id, notification_type, title, entity_type, entity_id, correlation_id")
    .in("id", notificationIds);
  if (notifError) throw new Error(notifError.message);

  const notificationById = new Map((notifications ?? []).map((n) => [n.id as string, n]));

  return deliveries.map((row) => {
    const notification = notificationById.get(row.notification_id as string);
    return {
      id: row.id as string,
      channel: row.channel as string,
      status: row.status as string,
      recipient: row.recipient as string,
      attemptCount: Number(row.attempt_count ?? 0),
      lastAttemptAt: (row.last_attempt_at as string) ?? undefined,
      sentAt: (row.sent_at as string) ?? undefined,
      failedAt: (row.failed_at as string) ?? undefined,
      failureReason: (row.failure_reason as string) ?? undefined,
      notificationType: (notification?.notification_type as string) ?? undefined,
      title: (notification?.title as string) ?? undefined,
      entityType: (notification?.entity_type as string) ?? undefined,
      entityId: (notification?.entity_id as string) ?? undefined,
      correlationId: (notification?.correlation_id as string) ?? undefined,
      createdAt: row.created_at as string,
    };
  });
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

export type HealthCheckRow = {
  checkName: string;
  status: "OK" | "DRIFT" | "ERROR";
  summary: string;
  details: unknown;
  checkedAt: string;
};

/**
 * Reads the last known result per check — the actual drift computation
 * only ever runs via `npm run db:audit-drift` (raw pg, CLI-only); this just
 * surfaces what that run last persisted, through the same service-role
 * client every other real-data read in this file uses.
 */
export async function getLatestHealthChecks(): Promise<HealthCheckRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("system_health_checks")
    .select("check_name, status, summary, details, checked_at")
    .order("checked_at", { ascending: false });
  if (error) throw new Error(error.message);

  const latestByName = new Map<string, HealthCheckRow>();
  for (const row of data ?? []) {
    const checkName = row.check_name as string;
    if (latestByName.has(checkName)) continue;
    latestByName.set(checkName, {
      checkName,
      status: row.status as HealthCheckRow["status"],
      summary: row.summary as string,
      details: row.details,
      checkedAt: row.checked_at as string,
    });
  }

  return [...latestByName.values()];
}

const DELIVERY_STATUSES = ["pending", "processing", "sent", "failed", "cancelled"] as const;

/** Cheap per-status counts via Supabase's count-only query, not a row fetch. */
export async function getNotificationDeliveryHealthSummary(): Promise<Record<string, number>> {
  const client = getSupabaseServiceClient();
  const summary: Record<string, number> = {};
  if (!client) return summary;

  await Promise.all(
    DELIVERY_STATUSES.map(async (status) => {
      const { count, error } = await client
        .from("notification_deliveries")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      if (error) throw new Error(error.message);
      summary[status] = count ?? 0;
    }),
  );

  return summary;
}

export type DbConnectivitySummary = {
  configured: boolean;
  tables: Array<{ name: string; ok: boolean; error?: string }>;
};

const HEALTH_PROBE_TABLES = ["employee_profiles", "notifications", "audit_logs"] as const;

/** Lightweight connectivity + table-presence check, adapted from
 * scripts/probe-supabase.ts but through the app's own client so a page can
 * call it directly instead of shelling out. */
export async function getDbConnectivitySummary(): Promise<DbConnectivitySummary> {
  const client = getSupabaseServiceClient();
  if (!client) return { configured: false, tables: [] };

  const tables = await Promise.all(
    HEALTH_PROBE_TABLES.map(async (name) => {
      const { error } = await client.from(name).select("id").limit(1);
      return { name, ok: !error, error: error?.message };
    }),
  );

  return { configured: true, tables };
}

export type PlatformUserRow = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  employeeId?: string;
  candidateId?: string;
  lastActivityAt?: string;
};

/** Read-only platform user/role listing — no grant/revoke path exists yet. */
export async function listPlatformUsers(): Promise<PlatformUserRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const [
    { data: profiles, error: profilesError },
    { data: roleRows, error: rolesError },
    { data: employees },
    { data: candidates },
  ] = await Promise.all([
    client.from("profiles").select("id, email, display_name, status, updated_at").order("display_name"),
    client.from("user_roles").select("user_id, role"),
    client.from("employee_profiles").select("id, user_id"),
    client.from("candidate_profiles").select("id, profile_id"),
  ]);
  if (profilesError) throw new Error(profilesError.message);
  if (rolesError) throw new Error(rolesError.message);

  const rolesByUser = new Map<string, string[]>();
  for (const row of roleRows ?? []) {
    const userId = row.user_id as string;
    if (!rolesByUser.has(userId)) rolesByUser.set(userId, []);
    rolesByUser.get(userId)!.push(row.role as string);
  }

  const employeeByProfile = new Map(
    (employees ?? [])
      .filter((row) => row.user_id)
      .map((row) => [row.user_id as string, row.id as string]),
  );
  const candidateByProfile = new Map(
    (candidates ?? [])
      .filter((row) => row.profile_id)
      .map((row) => [row.profile_id as string, row.id as string]),
  );

  return (profiles ?? []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string,
    status: row.status as string,
    roles: rolesByUser.get(row.id as string) ?? [],
    employeeId: employeeByProfile.get(row.id as string),
    candidateId: candidateByProfile.get(row.id as string),
    lastActivityAt: (row.updated_at as string) ?? undefined,
  }));
}
