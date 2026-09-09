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
  return toCsv(rows, EMPLOYEE_DIRECTORY_COLUMNS);
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
