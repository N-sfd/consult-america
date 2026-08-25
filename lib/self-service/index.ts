import { hrRepository } from "@/lib/hr";
import {
  seedEmployeeDocuments,
  seedHrRequests,
  seedLeaveBalances,
  seedLeaveRequests,
  seedLeaveTypes,
} from "@/data/self-service/seed";
import {
  seedDepartments,
  seedLocations,
  seedPositions,
} from "@/data/recruiting/seed";
import type { Employee, EmploymentAssignment, Person } from "@/types/hr";
import { employeeStatusLabels } from "@/types/hr";
import {
  employmentTypeLabels,
  workplaceTypeLabels,
} from "@/types/organization";
import {
  getEditableTimesheet,
  getTimeStoreSnapshot,
  listTimeEntries,
  listTimesheets,
} from "@/lib/self-service/time-store";

export type EmployeeProfileView = {
  employee: Employee;
  person: Person;
  assignment?: EmploymentAssignment;
  positionTitle?: string;
  departmentName?: string;
  locationName?: string;
  managerName?: string;
  employmentTypeLabel?: string;
  workplaceTypeLabel?: string;
  statusLabel: string;
};

function resolveOrgLabels(assignment?: EmploymentAssignment) {
  if (!assignment) return {};

  return {
    positionTitle: seedPositions.find((p) => p.id === assignment.positionId)
      ?.title,
    departmentName: seedDepartments.find(
      (d) => d.id === assignment.departmentId,
    )?.name,
    locationName: seedLocations.find((l) => l.id === assignment.locationId)
      ?.name,
    employmentTypeLabel: employmentTypeLabels[assignment.employmentType],
    workplaceTypeLabel: workplaceTypeLabels[assignment.workplaceType],
  };
}

export async function getEmployeeProfile(
  employeeId: string,
): Promise<EmployeeProfileView | null> {
  const employee = await hrRepository.getEmployeeById(employeeId);
  if (!employee) return null;

  const person = await hrRepository.getPersonById(employee.personId);
  if (!person) return null;

  const assignment = await hrRepository.getPrimaryAssignment(employeeId);
  const labels = resolveOrgLabels(assignment);

  let managerName: string | undefined;
  if (assignment?.managerEmployeeId) {
    const manager = await hrRepository.getEmployeeById(
      assignment.managerEmployeeId,
    );
    if (manager) {
      const managerPerson = await hrRepository.getPersonById(manager.personId);
      managerName = managerPerson
        ? `${managerPerson.firstName} ${managerPerson.lastName}`
        : undefined;
    }
  }

  return {
    employee,
    person,
    assignment,
    ...labels,
    managerName,
    statusLabel: employeeStatusLabels[employee.employmentStatus],
  };
}

export async function getDirectReports(managerEmployeeId: string) {
  const employees = await hrRepository.listEmployees();
  const reports = [];

  for (const employee of employees) {
    const assignment = await hrRepository.getPrimaryAssignment(employee.id);
    if (assignment?.managerEmployeeId !== managerEmployeeId) continue;

    const profile = await getEmployeeProfile(employee.id);
    if (profile) reports.push(profile);
  }

  return reports;
}

export async function assertSelfAccess(
  sessionEmployeeId: string,
  resourceEmployeeId: string,
) {
  if (sessionEmployeeId !== resourceEmployeeId) {
    throw new Error("Forbidden: employees may only access their own records");
  }
}

export async function assertTeamAccess(
  managerEmployeeId: string,
  resourceEmployeeId: string,
) {
  if (managerEmployeeId === resourceEmployeeId) return;

  const assignment =
    await hrRepository.getPrimaryAssignment(resourceEmployeeId);
  if (assignment?.managerEmployeeId !== managerEmployeeId) {
    throw new Error("Forbidden: manager is not authorized for this employee");
  }
}

export function getLeaveTypes() {
  return seedLeaveTypes.filter((type) => type.status === "ACTIVE");
}

export function getLeaveBalances(employeeId: string) {
  return seedLeaveBalances.filter(
    (balance) => balance.employeeId === employeeId,
  );
}

export function getLeaveRequests(employeeId: string) {
  return seedLeaveRequests.filter(
    (request) => request.employeeId === employeeId,
  );
}

export function getTimesheets(employeeId: string) {
  return listTimesheets(employeeId);
}

export function getCurrentTimesheet(employeeId: string) {
  return (
    getEditableTimesheet(employeeId) ??
    listTimesheets(employeeId)[0] ??
    null
  );
}

export function getTimeEntries(timesheetId: string) {
  return listTimeEntries(timesheetId);
}

export function getEmployeeDocuments(employeeId: string) {
  return seedEmployeeDocuments.filter(
    (doc) =>
      doc.employeeId === employeeId &&
      (doc.visibility === "EMPLOYEE" || doc.visibility === "MANAGER_AND_HR"),
  );
}

export function getHrRequests(employeeId: string) {
  return seedHrRequests.filter((request) => request.employeeId === employeeId);
}

export function getNotifications(employeeId: string) {
  return getTimeStoreSnapshot()
    .notifications.filter((item) => item.employeeId === employeeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPendingApprovals(approverEmployeeId: string) {
  return getTimeStoreSnapshot().approvals.filter(
    (item) =>
      item.approverEmployeeId === approverEmployeeId &&
      item.status === "PENDING",
  );
}

export async function getEmployeeDashboard(employeeId: string) {
  await assertSelfAccess(employeeId, employeeId);

  const profile = await getEmployeeProfile(employeeId);
  const timesheet = getCurrentTimesheet(employeeId);
  const pto = getLeaveBalances(employeeId).find(
    (b) => b.leaveTypeId === "lt-pto",
  );
  const requests = getHrRequests(employeeId).filter(
    (r) => r.status === "OPEN" || r.status === "IN_PROGRESS",
  );
  const documents = getEmployeeDocuments(employeeId);
  const leave = getLeaveRequests(employeeId).find(
    (r) => r.status === "APPROVED" || r.status === "PENDING",
  );
  const unread = getNotifications(employeeId).filter((n) => !n.readAt);

  return {
    profile,
    timesheet,
    ptoAvailable: pto?.available ?? 0,
    pendingHrRequests: requests.length,
    documentCount: documents.length,
    upcomingLeave: leave,
    unreadNotifications: unread.length,
  };
}

export async function getManagerDashboard(managerEmployeeId: string) {
  const team = await getDirectReports(managerEmployeeId);
  const approvals = getPendingApprovals(managerEmployeeId);

  return {
    teamCount: team.length,
    pendingApprovals: approvals.length,
    pendingTimesheets: approvals.filter((a) => a.requestType === "TIMESHEET")
      .length,
    pendingLeave: approvals.filter((a) => a.requestType === "LEAVE").length,
    team,
    approvals,
  };
}
