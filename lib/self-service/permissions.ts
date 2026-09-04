import type { PlatformRole } from "@/types/identity";
import type { SelfServicePermission } from "@/types/security";

const employeePermissions: SelfServicePermission[] = [
  "self.profile.read",
  "self.profile.update_limited",
  "self.documents.read",
  "self.documents.upload_requested",
  "self.timesheet.read",
  "self.timesheet.submit",
  "self.leave.read",
  "self.leave.submit",
  "self.hr_request.read",
  "self.hr_request.create",
  "self.notification.read",
  "self.pay.read",
  "self.directory.read",
  "self.expense.read",
  "self.expense.submit",
  "self.benefits.read",
  "self.benefits.submit",
  "self.goals.read",
  "self.goals.manage",
  "self.performance.read",
  "self.performance.submit",
];

const managerPermissions: SelfServicePermission[] = [
  ...employeePermissions,
  "team.read",
  "team.timesheet.read",
  "team.timesheet.approve",
  "team.leave.read",
  "team.leave.approve",
  "team.expense.approve",
  "team.performance.manage",
  "approval.read",
  "approval.act",
  "team.reports.read",
];

const hrPermissions: SelfServicePermission[] = [
  ...employeePermissions,
  "employee.read",
  "employee.update",
  "time.admin",
  "leave.admin",
  "hr_request.read",
  "hr_request.manage",
  "audit.read",
  "reports.read",
];

const payrollPermissions: SelfServicePermission[] = [
  "self.pay.read",
  "employee.read",
  "payroll.compensation.read",
  "payroll.compensation.manage",
  "payroll.run.manage",
  "payroll.reports.read",
  "audit.read",
];

/** Demo role grants. Auth later binds these to real user_roles rows. */
export const rolePermissionMap: Record<
  "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL",
  SelfServicePermission[]
> = {
  EMPLOYEE: employeePermissions,
  MANAGER: managerPermissions,
  HR: hrPermissions,
  PAYROLL: payrollPermissions,
};

export function permissionsForPortalRole(
  role: "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL",
): SelfServicePermission[] {
  return rolePermissionMap[role];
}

export function hasPermission(
  role: "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL",
  permission: SelfServicePermission,
) {
  return rolePermissionMap[role].includes(permission);
}

/** Maps demo portal mode to platform roles for future auth bridging. */
export function platformRolesForPortal(
  role: "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL",
): PlatformRole[] {
  if (role === "HR") return ["HR_SPECIALIST", "EMPLOYEE"];
  if (role === "MANAGER") return ["MANAGER", "EMPLOYEE"];
  if (role === "PAYROLL") return ["PAYROLL_ADMIN"];
  return ["EMPLOYEE"];
}
