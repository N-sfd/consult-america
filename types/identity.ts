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
  | "payroll.approve"
  // Phase 4K self-service grants
  | "self.profile.read"
  | "self.profile.update_limited"
  | "self.documents.read"
  | "self.timesheet.read"
  | "self.timesheet.submit"
  | "self.leave.read"
  | "self.leave.submit"
  | "self.hr_request.read"
  | "self.hr_request.create"
  | "team.read"
  | "team.timesheet.read"
  | "team.timesheet.approve"
  | "team.leave.read"
  | "team.leave.approve"
  | "approval.read"
  | "approval.act"
  | "hr_request.read"
  | "hr_request.manage"
  | "time.admin"
  | "leave.admin"
  | "audit.read"
  | "reports.read"
  | "team.reports.read";

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
