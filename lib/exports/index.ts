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
import {
  listPersistedHrRequests,
  listPersistedLeaveRequestsForEmployees,
  listPersistedTimeEntriesForEmployees,
  listPayrollRunSummaryRows,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { toCsv } from "@/lib/exports/csv";
import { writeAuditEvent } from "@/lib/audit/audit-log";
import { recruitingRepository } from "@/lib/recruiting";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { candidateStageFor } from "@/lib/recruiting/candidate-stage";

function countCsvRows(csv: string): number {
  return Math.max(0, csv.split("\r\n").filter(Boolean).length - 1);
}

async function auditExport(input: {
  actor: PortalActor;
  reportType: string;
  filters?: Record<string, unknown>;
  csv: string;
}) {
  await writeAuditEvent({
    eventType: "REPORT_EXPORTED",
    actorEmployeeId: input.actor.session.employeeId,
    actorRole: input.actor.role,
    resourceType: "report",
    resourceId: input.reportType,
    summary: `Exported ${input.reportType} report`,
    metadata: {
      reportType: input.reportType,
      filters: input.filters ?? {},
      rowCount: countCsvRows(input.csv),
      timestamp: new Date().toISOString(),
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

export async function exportApplicationPipelineCsv(): Promise<string> {
  const actor = await requireHrActor();
  requirePermission(actor, "employee.read");

  const applications = await recruitingRepository.listApplicationsQueue();
  const rows = applications.map((a) => ({
    applicationNumber: a.applicationNumber,
    candidateName: a.candidateName,
    candidateEmail: a.candidateEmail,
    jobTitle: a.jobTitle,
    departmentName: a.departmentName,
    locationName: a.locationName,
    appliedAt: a.appliedAt,
    candidateStage: candidateStageFor(a.status),
    internalStatus: a.status,
    recruiterName: a.recruiterName ?? "",
    hiringManagerName: a.hiringManagerName ?? "",
    lastActivityAt: a.lastActivityAt,
  }));
  const csv = toCsv(rows, APPLICATION_PIPELINE_COLUMNS);
  await auditExport({ actor, reportType: "Application Pipeline", csv });
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
