import { toCsv } from "@/lib/exports/csv";
import { writeAuditEvent } from "@/lib/audit/audit-log";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  listApplicationPipelineExportRows,
  loadReportWorkspace,
  type ReportFilters,
} from "@/lib/reports";
import { getWorkforceSession } from "@/lib/workforce/session";
import { reportSectionsForWorkforce, recruitingScopeForWorkforce } from "@/lib/reports/access";
import {
  listPersistedHrRequests,
  listPersistedLeaveRequestsForEmployees,
  listPersistedTimeEntriesForEmployees,
  listPayrollRunSummaryRows,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { getDirectReports } from "@/lib/self-service";
import { hrRepository } from "@/lib/hr";
import {
  requireEmployeeActor,
  requireHrActor,
  requireManagerActor,
  requirePayrollActor,
  requirePermission,
  type PortalActor,
} from "@/lib/self-service/security";

function countCsvRows(csv: string): number {
  return Math.max(0, csv.split("\r\n").filter(Boolean).length - 1);
}

async function auditExport(input: {
  actor: PortalActor;
  reportType: string;
  filters?: Record<string, unknown>;
  csv: string;
}) {
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: input.actor.session.employeeId,
    actorRole: input.actor.role,
    resourceType: "report",
    resourceId: input.reportType,
    summary: `Exported ${input.reportType} report`,
    correlationId,
    metadata: {
      report_type: input.reportType,
      filters: input.filters ?? {},
      row_count: countCsvRows(input.csv),
      actor: input.actor.session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
}

/**
 * Every export resolves its own actor (same requireXActor() the pages use)
 * and scopes the query itself — never a client-supplied employee/team id —
 * so an export can never see more than the corresponding page would show.
 */

async function scopedEmployeeIds(actor: PortalActor): Promise<string[]> {
  if (actor.role === "MANAGER") {
    const reports = await getDirectReports(actor.session.employeeId);
    return reports.map((r) => r.employee.id);
  }
  return [actor.session.employeeId];
}

export async function exportTimeEntriesCsv(): Promise<string> {
  const actor =
    (await tryManagerActor()) ?? (await requireEmployeeActor());
  requirePermission(actor, actor.role === "MANAGER" ? "team.timesheet.read" : "self.timesheet.read");

  if (!workforceDataAvailable()) return toCsv([], TIME_ENTRY_COLUMNS);

  const employeeIds = await scopedEmployeeIds(actor);
  const entries = await listPersistedTimeEntriesForEmployees(employeeIds);
  return toCsv(entries, TIME_ENTRY_COLUMNS);
}

export async function exportLeaveRequestsCsv(): Promise<string> {
  const actor =
    (await tryManagerActor()) ?? (await requireEmployeeActor());
  requirePermission(actor, actor.role === "MANAGER" ? "team.leave.read" : "self.leave.read");

  if (!workforceDataAvailable()) return toCsv([], LEAVE_REQUEST_COLUMNS);

  const employeeIds = await scopedEmployeeIds(actor);
  const requests = await listPersistedLeaveRequestsForEmployees(employeeIds);
  return toCsv(requests, LEAVE_REQUEST_COLUMNS);
}

export async function exportHrRequestsCsv(): Promise<string> {
  const actor = await requireHrActor();
  requirePermission(actor, "hr_request.read");

  if (!workforceDataAvailable()) return toCsv([], HR_REQUEST_COLUMNS);

  const requests = await listPersistedHrRequests();
  return toCsv(requests, HR_REQUEST_COLUMNS);
}

export async function exportEmployeeDirectoryCsv(): Promise<string> {
  const actor = await requireHrActor();
  requirePermission(actor, "employee.read");

  const employees = await hrRepository.listEmployees();
  const rows = employees.map((e) => ({
    employeeId: e.id,
    employeeNumber: e.employeeNumber,
    firstName: e.firstName,
    lastName: e.lastName,
    workEmail: e.workEmail ?? "",
    employmentStatus: e.employmentStatus,
    hireDate: e.hireDate,
  }));
  const csv = toCsv(rows, EMPLOYEE_DIRECTORY_COLUMNS);
  await auditExport({ actor, reportType: "People Directory", csv });
  return csv;
}

export async function exportApplicationPipelineCsv(
  filters: ReportFilters = {},
): Promise<string> {
  const session = await getWorkforceSession();
  const sections = reportSectionsForWorkforce(session);
  if (!sections.includes("recruiting")) {
    throw new Error("Forbidden: recruiting reports are not available for this role");
  }

  const rows = await listApplicationPipelineExportRows(
    filters,
    recruitingScopeForWorkforce(session),
  );
  const csv = toCsv(rows, APPLICATION_PIPELINE_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: session.roles.includes("HR")
      ? "HR"
      : session.roles.includes("RECRUITER")
        ? "RECRUITER"
        : "ADMIN",
    resourceType: "report",
    resourceId: "Application Pipeline",
    summary: "Exported Application Pipeline report",
    correlationId,
    metadata: {
      report_type: "Application Pipeline",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportHiringReportCsv(filters: ReportFilters = {}): Promise<string> {
  const session = await getWorkforceSession();
  if (!reportSectionsForWorkforce(session).includes("recruiting")) {
    throw new Error("Forbidden: hiring reports are not available for this role");
  }
  const data = await loadReportWorkspace(
    filters,
    ["recruiting"],
    recruitingScopeForWorkforce(session),
  );
  const recruiting = data.recruiting;
  const rows = [
    ...(recruiting?.hiringByMonth ?? []).map((r) => ({
      dimension: "Month",
      label: r.label,
      count: r.count,
    })),
    ...(recruiting?.hiringByDepartment ?? []).map((r) => ({
      dimension: "Department",
      label: r.label,
      count: r.count,
    })),
    ...(recruiting?.hiringByLocation ?? []).map((r) => ({
      dimension: "Location",
      label: r.label,
      count: r.count,
    })),
    ...(recruiting?.hiringBySource ?? []).map((r) => ({
      dimension: "Source",
      label: r.label,
      count: r.count,
    })),
  ];
  if (recruiting?.timeToHireDays != null) {
    rows.push({
      dimension: "TimeToHireDays",
      label: `Average (${recruiting.timeToHireSampleSize} samples)`,
      count: recruiting.timeToHireDays,
    });
  }
  const csv = toCsv(rows, HIRING_REPORT_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: "HR",
    resourceType: "report",
    resourceId: "Hiring Report",
    summary: "Exported Hiring Report",
    correlationId,
    metadata: {
      report_type: "Hiring Report",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportOnboardingStatusCsv(filters: ReportFilters = {}): Promise<string> {
  const session = await getWorkforceSession();
  if (!reportSectionsForWorkforce(session).includes("onboarding")) {
    throw new Error("Forbidden: onboarding reports are not available for this role");
  }
  const data = await loadReportWorkspace(filters, ["onboarding"]);
  const rows = (data.onboarding?.inProgress ?? []).map((row) => ({
    employee: row.label,
    status: row.status ?? "",
    completionPercent: row.percent ?? "",
    href: row.href ?? "",
  }));
  const csv = toCsv(rows, ONBOARDING_STATUS_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: "HR",
    resourceType: "report",
    resourceId: "Onboarding Status",
    summary: "Exported Onboarding Status report",
    correlationId,
    metadata: {
      report_type: "Onboarding Status",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportTimeApprovalStatusCsv(filters: ReportFilters = {}): Promise<string> {
  const session = await getWorkforceSession();
  if (!reportSectionsForWorkforce(session).includes("time-leave")) {
    throw new Error("Forbidden: time reports are not available for this role");
  }
  const data = await loadReportWorkspace(filters, ["time-leave"]);
  const rows = (data.timeLeave?.timeByStatus ?? []).map((row) => ({
    status: row.label,
    count: row.count,
  }));
  const csv = toCsv(rows, STATUS_COUNT_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: "HR",
    resourceType: "report",
    resourceId: "Time Approval Status",
    summary: "Exported Time Approval Status report",
    correlationId,
    metadata: {
      report_type: "Time Approval Status",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportLeaveReportCsv(filters: ReportFilters = {}): Promise<string> {
  const session = await getWorkforceSession();
  if (!reportSectionsForWorkforce(session).includes("time-leave")) {
    throw new Error("Forbidden: leave reports are not available for this role");
  }
  const data = await loadReportWorkspace(filters, ["time-leave"]);
  const rows = (data.timeLeave?.leaveByStatus ?? []).map((row) => ({
    status: row.label,
    count: row.count,
  }));
  const csv = toCsv(rows, STATUS_COUNT_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: "HR",
    resourceType: "report",
    resourceId: "Leave Report",
    summary: "Exported Leave Report",
    correlationId,
    metadata: {
      report_type: "Leave Report",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportHrRequestSummaryCsv(filters: ReportFilters = {}): Promise<string> {
  const session = await getWorkforceSession();
  if (!reportSectionsForWorkforce(session).includes("hr")) {
    throw new Error("Forbidden: HR request reports are not available for this role");
  }
  const data = await loadReportWorkspace(filters, ["hr"]);
  const rows = [
    ...(data.hr?.byCategory ?? []).map((row) => ({
      dimension: "Category",
      label: row.label,
      count: row.count,
    })),
    ...(data.hr?.byStatus ?? []).map((row) => ({
      dimension: "Status",
      label: row.label,
      count: row.count,
    })),
  ];
  const csv = toCsv(rows, HR_SUMMARY_COLUMNS);
  const correlationId = `corr-export-${crypto.randomUUID()}`;
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: session.employeeId,
    actorRole: "HR",
    resourceType: "report",
    resourceId: "HR Request Summary",
    summary: "Exported HR Request Summary report",
    correlationId,
    metadata: {
      report_type: "HR Request Summary",
      filters,
      row_count: countCsvRows(csv),
      actor: session.employeeId,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
  });
  return csv;
}

export async function exportCandidateMatchResultsCsv(runId: string): Promise<string> {
  const actor = await requireHrActor();
  requirePermission(actor, "employee.read");

  const client = isSupabaseConfigured() ? getSupabaseServiceClient() : null;
  const rows: Record<string, unknown>[] = [];

  if (client) {
    const { data } = await client
      .from("jd_analysis")
      .select("candidate_id, match_score, matched_skills, missing_skills, analysis_json, created_at")
      .contains("analysis_json", { runId });

    for (const row of data ?? []) {
      rows.push({
        candidateId: row.candidate_id as string,
        matchScore: row.match_score as number,
        matchedSkills: ((row.matched_skills as string[]) ?? []).join("; "),
        missingSkills: ((row.missing_skills as string[]) ?? []).join("; "),
        createdAt: row.created_at as string,
      });
    }
  }

  const csv = toCsv(rows, CANDIDATE_MATCH_RESULTS_COLUMNS);
  await auditExport({ actor, reportType: "Candidate Match Results", filters: { runId }, csv });
  return csv;
}

export async function exportPayrollRunSummaryCsv(): Promise<string> {
  const actor = await requirePayrollActor();
  requirePermission(actor, "payroll.reports.read");

  if (!workforceDataAvailable()) return toCsv([], PAYROLL_RUN_SUMMARY_COLUMNS);

  const rows = await listPayrollRunSummaryRows();
  return toCsv(rows, PAYROLL_RUN_SUMMARY_COLUMNS);
}

async function tryManagerActor(): Promise<PortalActor | null> {
  try {
    return await requireManagerActor();
  } catch {
    return null;
  }
}

const TIME_ENTRY_COLUMNS = [
  { key: "id" as const, header: "Entry ID" },
  { key: "employeeId" as const, header: "Employee ID" },
  { key: "workDate" as const, header: "Work Date" },
  { key: "hours" as const, header: "Hours" },
  { key: "timeType" as const, header: "Type" },
  { key: "comments" as const, header: "Comments" },
];

const LEAVE_REQUEST_COLUMNS = [
  { key: "id" as const, header: "Leave Request ID" },
  { key: "employeeId" as const, header: "Employee ID" },
  { key: "startDate" as const, header: "Start Date" },
  { key: "endDate" as const, header: "End Date" },
  { key: "hours" as const, header: "Hours" },
  { key: "status" as const, header: "Status" },
];

const HR_REQUEST_COLUMNS = [
  { key: "requestNumber" as const, header: "Request Number" },
  { key: "employeeId" as const, header: "Employee ID" },
  { key: "category" as const, header: "Category" },
  { key: "subject" as const, header: "Subject" },
  { key: "priority" as const, header: "Priority" },
  { key: "status" as const, header: "Status" },
  { key: "createdAt" as const, header: "Created At" },
  { key: "resolvedAt" as const, header: "Resolved At" },
];

const EMPLOYEE_DIRECTORY_COLUMNS = [
  { key: "employeeId" as const, header: "Employee ID" },
  { key: "employeeNumber" as const, header: "Employee Number" },
  { key: "firstName" as const, header: "First Name" },
  { key: "lastName" as const, header: "Last Name" },
  { key: "workEmail" as const, header: "Work Email" },
  { key: "employmentStatus" as const, header: "Employment Status" },
  { key: "hireDate" as const, header: "Hire Date" },
];

const APPLICATION_PIPELINE_COLUMNS = [
  { key: "applicationNumber" as const, header: "Application Number" },
  { key: "candidateName" as const, header: "Candidate" },
  { key: "candidateEmail" as const, header: "Email" },
  { key: "jobTitle" as const, header: "Position" },
  { key: "departmentName" as const, header: "Department" },
  { key: "locationName" as const, header: "Location" },
  { key: "appliedAt" as const, header: "Applied" },
  { key: "candidateStage" as const, header: "Candidate Stage" },
  { key: "internalStatus" as const, header: "Internal Status" },
  { key: "recruiterName" as const, header: "Recruiter" },
  { key: "hiringManagerName" as const, header: "Hiring Manager" },
  { key: "lastActivityAt" as const, header: "Last Activity" },
];

const HIRING_REPORT_COLUMNS = [
  { key: "dimension" as const, header: "Dimension" },
  { key: "label" as const, header: "Label" },
  { key: "count" as const, header: "Count" },
];

const ONBOARDING_STATUS_COLUMNS = [
  { key: "employee" as const, header: "Employee" },
  { key: "status" as const, header: "Status" },
  { key: "completionPercent" as const, header: "Completion %" },
  { key: "href" as const, header: "People Link" },
];

const STATUS_COUNT_COLUMNS = [
  { key: "status" as const, header: "Status" },
  { key: "count" as const, header: "Count" },
];

const HR_SUMMARY_COLUMNS = [
  { key: "dimension" as const, header: "Dimension" },
  { key: "label" as const, header: "Label" },
  { key: "count" as const, header: "Count" },
];

const CANDIDATE_MATCH_RESULTS_COLUMNS = [
  { key: "candidateId" as const, header: "Candidate ID" },
  { key: "matchScore" as const, header: "Match Score" },
  { key: "matchedSkills" as const, header: "Matching Skills" },
  { key: "missingSkills" as const, header: "Potential Gaps" },
  { key: "createdAt" as const, header: "Analyzed At" },
];

const PAYROLL_RUN_SUMMARY_COLUMNS = [
  { key: "payrollRunId" as const, header: "Payroll Run ID" },
  { key: "status" as const, header: "Status" },
  { key: "periodStart" as const, header: "Period Start" },
  { key: "periodEnd" as const, header: "Period End" },
  { key: "payDate" as const, header: "Pay Date" },
  { key: "employeeCount" as const, header: "Employee Count" },
  { key: "totalRegularHours" as const, header: "Total Regular Hours" },
  { key: "totalOvertimeHours" as const, header: "Total Overtime Hours" },
  { key: "totalGrossAmount" as const, header: "Total Gross Amount" },
];
