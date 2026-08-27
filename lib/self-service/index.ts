import { hrRepository } from "@/lib/hr";
import { listDocumentsForEmployee } from "@/lib/self-service/document-store";
import { getDocumentStatus } from "@/types/self-service";
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
  listLeaveBalances,
  listLeaveRequests,
  listLeaveTypes,
} from "@/lib/self-service/leave-store";
import { listHrRequestsForEmployee } from "@/lib/self-service/hr-request-store";
import {
  getEditableTimesheet,
  listTimeEntries,
  listTimesheets,
} from "@/lib/self-service/time-store";
import {
  listApprovals,
  listNotificationsForEmployee,
} from "@/lib/self-service/workflow-store";
import {
  assertSelfAccess,
  assertTeamAccess,
} from "@/lib/self-service/security";

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

export { assertSelfAccess, assertTeamAccess };

export function getLeaveTypes() {
  return listLeaveTypes();
}

export function getLeaveBalances(employeeId: string) {
  return listLeaveBalances(employeeId);
}

export function getLeaveRequests(employeeId: string) {
  return listLeaveRequests(employeeId);
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
  return listDocumentsForEmployee(employeeId);
}

export async function getEmployeeOnboarding(employeeId: string) {
  const record = await hrRepository.getOnboarding(employeeId);
  const tasks = await hrRepository.listOnboardingTasks(employeeId);
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return {
    record,
    tasks,
    completedCount,
    totalCount: tasks.length,
    percentComplete:
      tasks.length === 0
        ? 0
        : Math.round((completedCount / tasks.length) * 100),
  };
}

export function getHrRequests(employeeId: string) {
  return listHrRequestsForEmployee(employeeId);
}

export function getNotifications(employeeId: string) {
  return listNotificationsForEmployee(employeeId);
}

export function getPendingApprovals(approverEmployeeId: string) {
  return listApprovals().filter(
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
    (r) =>
      r.status === "OPEN" ||
      r.status === "IN_PROGRESS" ||
      r.status === "WAITING_FOR_EMPLOYEE",
  );
  const documents = getEmployeeDocuments(employeeId);
  const leave = getLeaveRequests(employeeId).find(
    (r) => r.status === "APPROVED" || r.status === "PENDING",
  );
  const unread = getNotifications(employeeId).filter((n) => !n.readAt);
  const onboarding = await getEmployeeOnboarding(employeeId);
  const documentsRequiringAction = documents.filter((doc) => {
    const status = getDocumentStatus(doc);
    return (
      status === "ACTION_REQUIRED" ||
      status === "EXPIRING_SOON" ||
      status === "EXPIRED"
    );
  });
  const profileCompleteness = profile
    ? getProfileCompleteness(profile.person)
    : 0;

  const attentionItems: Array<{
    id: string;
    title: string;
    detail: string;
    actionLabel: string;
    actionHref: string;
  }> = [
    ...onboarding.tasks
      .filter((task) => task.status !== "COMPLETED")
      .map((task) => ({
        id: task.id,
        title: task.title,
        detail: task.dueDate
          ? `Complete by ${formatShortDate(task.dueDate)}`
          : "Onboarding task",
        actionLabel: "Continue",
        actionHref: "/employee/onboarding",
      })),
    ...documentsRequiringAction.map((doc) => ({
      id: doc.id,
      title: doc.documentType,
      detail:
        getDocumentStatus(doc) === "EXPIRING_SOON"
          ? "Certification expiring soon"
          : "Acknowledgement required",
      actionLabel: "Review",
      actionHref: "/employee/documents",
    })),
  ];

  return {
    profile,
    timesheet,
    ptoAvailable: pto?.available ?? 0,
    pendingHrRequests: requests.length,
    documentCount: documents.length,
    documentsRequiringAction: documentsRequiringAction.length,
    upcomingLeave: leave,
    unreadNotifications: unread.length,
    onboarding,
    profileCompleteness,
    attentionItems,
  };
}

const PROFILE_COMPLETENESS_FIELDS: Array<keyof Person> = [
  "preferredName",
  "personalEmail",
  "personalPhone",
  "mailingAddress",
  "emergencyContactName",
  "emergencyContactPhone",
];

/** Date-only strings ("YYYY-MM-DD") must parse as local dates, not UTC
 * midnight, or they render one day early in negative-UTC timezones. */
function formatShortDate(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getProfileCompleteness(person: Person) {
  const filled = PROFILE_COMPLETENESS_FIELDS.filter(
    (field) => Boolean(person[field]),
  ).length;
  return Math.round((filled / PROFILE_COMPLETENESS_FIELDS.length) * 100);
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
