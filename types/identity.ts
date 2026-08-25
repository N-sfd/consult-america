/**
 * Identity / RBAC stubs for Phase 2+.
 * Full auth comes later — these types define the permission model early.
 */

export type PlatformRole =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "HR_SPECIALIST"
  | "RECRUITER"
  | "HIRING_MANAGER"
  | "PAYROLL_ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "CANDIDATE";

export type Permission =
  | "job.create"
  | "job.approve"
  | "job.publish"
  | "candidate.read"
  | "candidate.update"
  | "interview.schedule"
  | "offer.create"
  | "offer.approve"
  | "hire.convert"
  | "employee.read"
  | "employee.create"
  | "employee.update"
  | "employee.personal.read"
  | "employee.assignment.update"
  | "employee.compensation.read"
  | "employee.documents.read"
  | "organization.read"
  | "organization.manage"
  | "onboarding.manage"
  | "timesheet.submit"
  | "timesheet.approve"
  | "leave.submit"
  | "leave.approve"
  | "payroll.process"
  | "payroll.approve";

export type UserAccount = {
  id: string;
  email: string;
  displayName: string;
  roles: PlatformRole[];
  /** Links to employee when hired / active staff. */
  employeeId?: string;
  /** Links to candidate portal account. */
  candidateId?: string;
  status: "ACTIVE" | "INACTIVE" | "INVITED";
  createdAt: string;
  updatedAt: string;
};

export type RolePermission = {
  role: PlatformRole;
  permission: Permission;
};
