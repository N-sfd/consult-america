import { hrRepository } from "@/lib/hr";
import { listDocumentsForEmployee } from "@/lib/self-service/document-store";
import { getDocumentStatus } from "@/types/self-service";
import {
  seedDepartments,
  seedLocations,
  seedPositions,
} from "@/data/recruiting/seed";
import type { EmployeeProfile, JobAssignment } from "@/types/hr";
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
import { listExpenseClaims } from "@/lib/self-service/expense-store";
import { listAvailablePlans, listElections } from "@/lib/self-service/benefits-store";
import {
  listGoals,
  listReviewCycles,
  listReviewsForEmployee,
} from "@/lib/self-service/performance-store";
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

/**
 * Identity/contact fields, shaped like the old separate `Person` record for
 * display convenience — sourced directly from `EmployeeProfile` now that
 * person + employee are one row (see types/hr.ts).
 */
export type EmployeeProfilePerson = {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  personalEmail?: string;
  personalPhone?: string;
  mailingAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
};

export type EmployeeProfileView = {
  employee: EmployeeProfile;
  person: EmployeeProfilePerson;
  assignment?: JobAssignment;
  positionTitle?: string;
  departmentName?: string;
  locationName?: string;
  managerName?: string;
  employmentTypeLabel?: string;
  workplaceTypeLabel?: string;
  statusLabel: string;
};

function toPersonView(employee: EmployeeProfile): EmployeeProfilePerson {
  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    preferredName: employee.preferredName,
    personalEmail: employee.personalEmail,
    personalPhone: employee.phone,
    mailingAddress: employee.mailingAddress,
    emergencyContactName: employee.emergencyContactName,
    emergencyContactRelationship: employee.emergencyContactRelationship,
    emergencyContactPhone: employee.emergencyContactPhone,
  };
}

function resolveOrgLabels(assignment?: JobAssignment) {
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

  const assignment = await hrRepository.getPrimaryAssignment(employeeId);
  const labels = resolveOrgLabels(assignment);

  let managerName: string | undefined;
  if (assignment?.managerEmployeeId) {
    const manager = await hrRepository.getEmployeeById(
      assignment.managerEmployeeId,
    );
    if (manager) {
      managerName = `${manager.firstName} ${manager.lastName}`;
    }
  }

  return {
    employee,
    person: toPersonView(employee),
    assignment,
    ...labels,
    managerName,
    statusLabel: employeeStatusLabels[employee.employmentStatus],
  };
}

export async function getDirectoryEntries() {
  const employees = await hrRepository.listEmployees();
  const profiles = await Promise.all(
    employees.map((employee) => getEmployeeProfile(employee.id)),
  );

  return profiles
    .filter((profile): profile is EmployeeProfileView => profile !== null)
    .filter((profile) => profile.employee.employmentStatus === "ACTIVE")
    .sort((a, b) =>
      `${a.person.lastName}${a.person.firstName}`.localeCompare(
        `${b.person.lastName}${b.person.firstName}`,
      ),
    );
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

export function getExpenseClaims(employeeId: string) {
  return listExpenseClaims(employeeId);
}

export function getBenefitsPlans() {
  return listAvailablePlans();
}

export function getBenefitsElections(employeeId: string) {
  return listElections(employeeId);
}

export function getGoals(employeeId: string) {
  return listGoals(employeeId);
}

export function getReviewCycles() {
  return listReviewCycles();
}

export function getPerformanceReviews(employeeId: string) {
  return listReviewsForEmployee(employeeId);
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

const PROFILE_COMPLETENESS_FIELDS: Array<keyof EmployeeProfilePerson> = [
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

export function getProfileCompleteness(person: EmployeeProfilePerson) {
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
