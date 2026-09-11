import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { candidateStageFor } from "@/lib/recruiting/candidate-stage";
import { recruitingRepository } from "@/lib/recruiting";
import { getWorkforceHeadcountSummary } from "@/lib/workforce/operations";
import type {
  FilterOption,
  HrServiceDeskReportData,
  NamedCount,
  OnboardingReportData,
  RecruitingReportData,
  RecruitingReportScope,
  ReportFilters,
  ReportWorkspaceData,
  TimeLeaveReportData,
  WorkforceReportData,
} from "@/lib/reports/types";
import type { ApplicationStatus } from "@/types/recruiting";
import type { ApplicationQueueItem } from "@/lib/recruiting/repository";

function inRange(iso: string | undefined, filters: ReportFilters): boolean {
  if (!iso) return true;
  const day = iso.slice(0, 10);
  if (filters.from && day < filters.from) return false;
  if (filters.to && day > filters.to) return false;
  return true;
}

function bump(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function toNamedCounts(
  map: Map<string, number>,
  labelFor?: (key: string) => string,
): NamedCount[] {
  return [...map.entries()]
    .map(([key, count]) => ({
      key,
      label: labelFor?.(key) ?? key,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function daysBetween(startIso: string, endIso: string): number | null {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

async function loadFilterOptions(): Promise<{
  departments: FilterOption[];
  locations: FilterOption[];
  jobs: FilterOption[];
  recruiters: FilterOption[];
}> {
  const client = getSupabaseServiceClient();
  if (!client) return { departments: [], locations: [], jobs: [], recruiters: [] };

  const [{ data: departments }, { data: locations }, { data: jobs }, { data: recruiterRoles }] =
    await Promise.all([
      client.from("departments").select("id, name").order("name"),
      client.from("locations").select("id, name").order("name"),
      client
        .from("job_requisitions")
        .select("id, title, requisition_number")
        .order("title")
        .limit(200),
      client.from("user_roles").select("user_id").eq("role", "RECRUITER"),
    ]);

  const recruiterIds = [...new Set((recruiterRoles ?? []).map((row) => row.user_id as string))];
  let recruiters: FilterOption[] = [];
  if (recruiterIds.length > 0) {
    const { data: profiles } = await client
      .from("profiles")
      .select("id, display_name, email")
      .in("id", recruiterIds)
      .order("display_name");
    recruiters = (profiles ?? []).map((row) => ({
      id: row.id as string,
      label: (row.display_name as string) || (row.email as string) || (row.id as string),
    }));
  }

  return {
    departments: (departments ?? []).map((row) => ({
      id: row.id as string,
      label: row.name as string,
    })),
    locations: (locations ?? []).map((row) => ({
      id: row.id as string,
      label: row.name as string,
    })),
    jobs: (jobs ?? []).map((row) => ({
      id: row.id as string,
      label: `${row.title as string}${
        row.requisition_number ? ` (${row.requisition_number as string})` : ""
      }`,
    })),
    recruiters,
  };
}

function filterApplications(
  applications: ApplicationQueueItem[],
  filters: ReportFilters,
  scope?: RecruitingReportScope,
): ApplicationQueueItem[] {
  return applications.filter((app) => {
    if (!inRange(app.appliedAt, filters)) return false;
    if (filters.jobRequisitionId && app.requisitionId !== filters.jobRequisitionId) {
      return false;
    }
    if (filters.recruiterUserId && app.recruiterUserId !== filters.recruiterUserId) {
      return false;
    }
    if (scope?.hiringManagerUserId && app.hiringManagerUserId !== scope.hiringManagerUserId) {
      return false;
    }
    if (scope?.recruiterUserId && app.recruiterUserId !== scope.recruiterUserId) {
      return false;
    }
    return true;
  });
}

async function applyDepartmentLocationFilter(
  applications: ApplicationQueueItem[],
  filters: ReportFilters,
): Promise<ApplicationQueueItem[]> {
  const client = getSupabaseServiceClient();
  if (!client || (!filters.departmentId && !filters.locationId)) return applications;

  const requisitionIds = [
    ...new Set(applications.map((a) => a.requisitionId).filter(Boolean)),
  ] as string[];
  if (requisitionIds.length === 0) return [];

  let query = client
    .from("job_requisitions")
    .select("id, department_id, location_id")
    .in("id", requisitionIds);
  if (filters.departmentId) query = query.eq("department_id", filters.departmentId);
  if (filters.locationId) query = query.eq("location_id", filters.locationId);
  const { data } = await query;
  const allowed = new Set((data ?? []).map((row) => row.id as string));
  return applications.filter((app) => app.requisitionId && allowed.has(app.requisitionId));
}

async function loadRecruitingReport(
  filters: ReportFilters,
  scope?: RecruitingReportScope,
): Promise<RecruitingReportData> {
  const client = getSupabaseServiceClient();
  const applications = await recruitingRepository.listApplicationsQueue();

  let scoped = filterApplications(applications, filters, scope);
  scoped = await applyDepartmentLocationFilter(scoped, filters);

  const byStage = new Map<string, number>();
  const byJob = new Map<string, number>();
  const overTime = new Map<string, number>();
  const hires = new Map<string, number>();
  const hiringByMonth = new Map<string, number>();
  const hiringByDepartment = new Map<string, number>();
  const hiringByLocation = new Map<string, number>();
  const hiringBySource = new Map<string, number>();
  const timeToHireSamples: number[] = [];

  for (const app of scoped) {
    bump(byStage, candidateStageFor(app.status));
    bump(byJob, app.jobTitle || "Unknown role");
    bump(overTime, monthKey(app.appliedAt));

    if (app.status === "HIRED") {
      bump(hires, "Hired");
      bump(hiringByMonth, monthKey(app.lastActivityAt || app.appliedAt));
      bump(hiringByDepartment, app.departmentName || "Unknown");
      bump(hiringByLocation, app.locationName || "Unknown");
    }
  }

  // Interview / offer / source / time-to-hire from DB when available
  const interviewPipeline = new Map<string, number>();
  const offerOutcomes = new Map<string, number>();

  if (client && scoped.length > 0) {
    const applicationIds = scoped.map((a) => a.applicationId);
    const candidateIds = [...new Set(scoped.map((a) => a.candidateId))];

    const [{ data: interviews }, { data: offers }, { data: candidates }, { data: employees }] =
      await Promise.all([
        client
          .from("interviews")
          .select("id, application_id, status")
          .in("application_id", applicationIds),
        client
          .from("offers")
          .select("id, application_id, status")
          .in("application_id", applicationIds),
        client.from("candidate_profiles").select("id, source").in("id", candidateIds),
        client
          .from("employee_profiles")
          .select("id, candidate_id, hire_date, source_application_id")
          .in("candidate_id", candidateIds),
      ]);

    for (const row of interviews ?? []) {
      bump(interviewPipeline, (row.status as string) || "UNKNOWN");
    }
    for (const row of offers ?? []) {
      bump(offerOutcomes, (row.status as string) || "UNKNOWN");
    }

    const sourceByCandidate = new Map(
      (candidates ?? []).map((row) => [
        row.id as string,
        ((row.source as string) || "Unknown").trim() || "Unknown",
      ]),
    );
    const hireByCandidate = new Map(
      (employees ?? []).map((row) => [row.candidate_id as string, row]),
    );

    for (const app of scoped) {
      if (app.status !== "HIRED") continue;
      bump(hiringBySource, sourceByCandidate.get(app.candidateId) ?? "Unknown");
      const employee = hireByCandidate.get(app.candidateId);
      const hireDate = (employee?.hire_date as string | undefined) ?? app.lastActivityAt;
      const days = daysBetween(app.appliedAt, hireDate);
      if (days != null) timeToHireSamples.push(days);
    }
  }

  const avg =
    timeToHireSamples.length > 0
      ? Math.round(
          timeToHireSamples.reduce((sum, n) => sum + n, 0) / timeToHireSamples.length,
        )
      : null;

  return {
    byStage: toNamedCounts(byStage),
    byJob: toNamedCounts(byJob).slice(0, 20),
    overTime: toNamedCounts(overTime).sort((a, b) => a.key.localeCompare(b.key)),
    interviewPipeline: toNamedCounts(interviewPipeline, (key) =>
      key.replaceAll("_", " "),
    ),
    offerOutcomes: toNamedCounts(offerOutcomes, (key) => key.replaceAll("_", " ")),
    hires: toNamedCounts(hires),
    hiringByMonth: toNamedCounts(hiringByMonth).sort((a, b) =>
      a.key.localeCompare(b.key),
    ),
    hiringByDepartment: toNamedCounts(hiringByDepartment),
    hiringByLocation: toNamedCounts(hiringByLocation),
    hiringBySource: toNamedCounts(hiringBySource),
    timeToHireDays: avg,
    timeToHireSampleSize: timeToHireSamples.length,
  };
}

async function loadWorkforceReport(): Promise<WorkforceReportData> {
  return { headcount: await getWorkforceHeadcountSummary() };
}

async function loadOnboardingReport(
  filters: ReportFilters,
): Promise<OnboardingReportData> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return {
      inProgress: [],
      byStatus: [],
      overdueTasks: 0,
      completedCount: 0,
      averageCompletionDays: null,
      averageSampleSize: 0,
    };
  }

  const { data: records, error } = await client
    .from("onboarding_records")
    .select(
      "id, employee_id, status, started_at, completed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);

  const filtered = (records ?? []).filter((row) =>
    inRange((row.started_at as string) ?? (row.created_at as string), filters),
  );

  const byStatus = new Map<string, number>();
  const completionSamples: number[] = [];
  let completedCount = 0;

  for (const row of filtered) {
    const status = (row.status as string) || "UNKNOWN";
    bump(byStatus, status);
    if (status === "COMPLETED" || status === "COMPLETE") {
      completedCount += 1;
      const days = daysBetween(
        (row.started_at as string) ?? (row.created_at as string),
        row.completed_at as string,
      );
      if (days != null) completionSamples.push(days);
    }
  }

  const inProgressRows = filtered.filter((row) => {
    const status = (row.status as string) || "";
    return status !== "COMPLETED" && status !== "COMPLETE" && status !== "CANCELLED";
  });

  const employeeIds = [
    ...new Set(inProgressRows.map((row) => row.employee_id as string)),
  ];
  const { data: employees } = employeeIds.length
    ? await client
        .from("employee_profiles")
        .select("id, first_name, last_name, preferred_name")
        .in("id", employeeIds)
    : { data: [] as Record<string, unknown>[] };
  const nameById = new Map(
    (employees ?? []).map((row) => [
      row.id as string,
      `${(row.preferred_name as string) || (row.first_name as string)} ${row.last_name as string}`.trim(),
    ]),
  );

  const onboardingIds = inProgressRows.map((row) => row.id as string);
  const { data: tasks } = onboardingIds.length
    ? await client
        .from("onboarding_tasks")
        .select("id, onboarding_id, status, due_date, completed_at")
        .in("onboarding_id", onboardingIds)
    : { data: [] as Record<string, unknown>[] };

  const today = new Date().toISOString().slice(0, 10);
  let overdueTasks = 0;
  const completionByOnboarding = new Map<string, { done: number; total: number }>();
  for (const task of tasks ?? []) {
    const oid = task.onboarding_id as string;
    const bucket = completionByOnboarding.get(oid) ?? { done: 0, total: 0 };
    bucket.total += 1;
    if (task.completed_at || task.status === "COMPLETED" || task.status === "DONE") {
      bucket.done += 1;
    } else if (task.due_date && String(task.due_date).slice(0, 10) < today) {
      overdueTasks += 1;
    }
    completionByOnboarding.set(oid, bucket);
  }

  const inProgress = inProgressRows.map((row) => {
    const oid = row.id as string;
    const bucket = completionByOnboarding.get(oid);
    const percent =
      bucket && bucket.total > 0
        ? Math.round((bucket.done / bucket.total) * 100)
        : undefined;
    return {
      id: oid,
      label: nameById.get(row.employee_id as string) ?? row.employee_id as string,
      sublabel: (row.status as string) || undefined,
      href: `/workforce/people/${row.employee_id as string}`,
      percent,
      status: row.status as string,
    };
  });

  return {
    inProgress,
    byStatus: toNamedCounts(byStatus, (key) => key.replaceAll("_", " ")),
    overdueTasks,
    completedCount,
    averageCompletionDays:
      completionSamples.length > 0
        ? Math.round(
            completionSamples.reduce((sum, n) => sum + n, 0) /
              completionSamples.length,
          )
        : null,
    averageSampleSize: completionSamples.length,
  };
}

async function loadTimeLeaveReport(
  filters: ReportFilters,
): Promise<TimeLeaveReportData> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { timeByStatus: [], leaveByStatus: [], upcomingLeave: [] };
  }

  let timesheetQuery = client
    .from("timesheets")
    .select("id, status, period_start, period_end, employee_id")
    .order("period_start", { ascending: false })
    .limit(500);
  if (filters.from) timesheetQuery = timesheetQuery.gte("period_start", filters.from);
  if (filters.to) timesheetQuery = timesheetQuery.lte("period_end", filters.to);

  let leaveQuery = client
    .from("leave_requests")
    .select("id, status, start_date, end_date, employee_id, hours")
    .order("start_date", { ascending: false })
    .limit(500);
  if (filters.from) leaveQuery = leaveQuery.gte("start_date", filters.from);
  if (filters.to) leaveQuery = leaveQuery.lte("end_date", filters.to);

  const [{ data: timesheets, error: tsError }, { data: leaveRows, error: leaveError }] =
    await Promise.all([timesheetQuery, leaveQuery]);
  if (tsError) throw new Error(tsError.message);
  if (leaveError) throw new Error(leaveError.message);

  const timeByStatus = new Map<string, number>();
  for (const row of timesheets ?? []) {
    bump(timeByStatus, (row.status as string) || "UNKNOWN");
  }

  const leaveByStatus = new Map<string, number>();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming: Array<Record<string, unknown>> = [];
  for (const row of leaveRows ?? []) {
    bump(leaveByStatus, (row.status as string) || "UNKNOWN");
    const start = String(row.start_date).slice(0, 10);
    if (
      start >= today &&
      (row.status === "APPROVED" || row.status === "PENDING" || row.status === "SUBMITTED")
    ) {
      upcoming.push(row);
    }
  }

  const employeeIds = [
    ...new Set(upcoming.map((row) => row.employee_id as string)),
  ];
  const { data: employees } = employeeIds.length
    ? await client
        .from("employee_profiles")
        .select("id, first_name, last_name, preferred_name")
        .in("id", employeeIds)
    : { data: [] as Record<string, unknown>[] };
  const nameById = new Map(
    (employees ?? []).map((row) => [
      row.id as string,
      `${(row.preferred_name as string) || (row.first_name as string)} ${row.last_name as string}`.trim(),
    ]),
  );

  return {
    timeByStatus: toNamedCounts(timeByStatus, (key) => key.replaceAll("_", " ")),
    leaveByStatus: toNamedCounts(leaveByStatus, (key) => key.replaceAll("_", " ")),
    upcomingLeave: upcoming.slice(0, 25).map((row) => ({
      id: row.id as string,
      label: nameById.get(row.employee_id as string) ?? (row.employee_id as string),
      sublabel: `${String(row.start_date).slice(0, 10)} → ${String(row.end_date).slice(0, 10)} · ${row.status}`,
      href: `/workforce/people/${row.employee_id as string}`,
      status: row.status as string,
    })),
  };
}

async function loadHrReport(filters: ReportFilters): Promise<HrServiceDeskReportData> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return {
      openCount: 0,
      resolvedCount: 0,
      byCategory: [],
      byStatus: [],
      averageResolutionHours: null,
      resolutionSampleSize: 0,
    };
  }

  let query = client
    .from("hr_requests")
    .select("id, category, status, created_at, resolved_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const byCategory = new Map<string, number>();
  const byStatus = new Map<string, number>();
  let openCount = 0;
  let resolvedCount = 0;
  const resolutionHours: number[] = [];

  for (const row of data ?? []) {
    bump(byCategory, (row.category as string) || "UNKNOWN");
    const status = (row.status as string) || "UNKNOWN";
    bump(byStatus, status);
    if (status === "RESOLVED" || status === "CLOSED") {
      resolvedCount += 1;
      if (row.resolved_at && row.created_at) {
        const hours =
          (Date.parse(row.resolved_at as string) - Date.parse(row.created_at as string)) /
          (1000 * 60 * 60);
        if (Number.isFinite(hours) && hours >= 0) resolutionHours.push(hours);
      }
    } else {
      openCount += 1;
    }
  }

  return {
    openCount,
    resolvedCount,
    byCategory: toNamedCounts(byCategory, (key) => key.replaceAll("_", " ")),
    byStatus: toNamedCounts(byStatus, (key) => key.replaceAll("_", " ")),
    averageResolutionHours:
      resolutionHours.length > 0
        ? Math.round(
            (resolutionHours.reduce((sum, n) => sum + n, 0) / resolutionHours.length) * 10,
          ) / 10
        : null,
    resolutionSampleSize: resolutionHours.length,
  };
}

export async function loadReportWorkspace(
  filters: ReportFilters,
  sections: Array<
    "recruiting" | "workforce" | "onboarding" | "time-leave" | "hr"
  >,
  scope?: RecruitingReportScope,
): Promise<ReportWorkspaceData> {
  const options = await loadFilterOptions();

  const [recruiting, workforce, onboarding, timeLeave, hr] = await Promise.all([
    sections.includes("recruiting") ? loadRecruitingReport(filters, scope) : null,
    sections.includes("workforce") ? loadWorkforceReport() : null,
    sections.includes("onboarding") ? loadOnboardingReport(filters) : null,
    sections.includes("time-leave") ? loadTimeLeaveReport(filters) : null,
    sections.includes("hr") ? loadHrReport(filters) : null,
  ]);

  return {
    filters,
    departments: options.departments,
    locations: options.locations,
    jobs: options.jobs,
    recruiters: options.recruiters,
    recruiting,
    workforce,
    onboarding,
    timeLeave,
    hr,
  };
}

/** Pipeline export rows — same authorization surface as the reports UI. */
export async function listApplicationPipelineExportRows(
  filters: ReportFilters = {},
  scope?: RecruitingReportScope,
) {
  const applications = await recruitingRepository.listApplicationsQueue();
  let scoped = filterApplications(applications, filters, scope);
  scoped = await applyDepartmentLocationFilter(scoped, filters);
  return scoped.map((a) => ({
    applicationNumber: a.applicationNumber,
    candidateName: a.candidateName,
    candidateEmail: a.candidateEmail,
    jobTitle: a.jobTitle,
    departmentName: a.departmentName,
    locationName: a.locationName,
    appliedAt: a.appliedAt,
    candidateStage: candidateStageFor(a.status as ApplicationStatus),
    internalStatus: a.status,
    recruiterName: a.recruiterName ?? "",
    hiringManagerName: a.hiringManagerName ?? "",
    lastActivityAt: a.lastActivityAt,
  }));
}
