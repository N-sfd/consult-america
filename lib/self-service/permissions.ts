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
];

const managerPermissions: SelfServicePermission[] = [
  ...employeePermissions,
  "team.read",
  "team.timesheet.read",
  "team.timesheet.approve",
  "team.leave.read",
  "team.leave.approve",
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

/** Demo role grants. Auth later binds these to real user_roles rows. */
export const rolePermissionMap: Record<
  "EMPLOYEE" | "MANAGER" | "HR",
  SelfServicePermission[]
> = {
  EMPLOYEE: employeePermissions,
  MANAGER: managerPermissions,
  HR: hrPermissions,
};

export function permissionsForPortalRole(
  role: "EMPLOYEE" | "MANAGER" | "HR",
): SelfServicePermission[] {
  return rolePermissionMap[role];
}

export function hasPermission(
  role: "EMPLOYEE" | "MANAGER" | "HR",
  permission: SelfServicePermission,
) {
  return rolePermissionMap[role].includes(permission);
}

/** Maps demo portal mode to platform roles for future auth bridging. */
export function platformRolesForPortal(
  role: "EMPLOYEE" | "MANAGER" | "HR",
): PlatformRole[] {
  if (role === "HR") return ["HR_SPECIALIST", "EMPLOYEE"];
  if (role === "MANAGER") return ["MANAGER", "EMPLOYEE"];
  return ["EMPLOYEE"];
}
