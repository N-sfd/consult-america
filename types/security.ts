/**
 * Phase 4K — Self-service security permissions.
 * Auth is still demo-session based; enforcement is server-side against these grants.
 */

export type SelfServicePermission =
  | "self.profile.read"
  | "self.profile.update_limited"
  | "self.documents.read"
  | "self.documents.upload_requested"
  | "self.timesheet.read"
  | "self.timesheet.submit"
  | "self.leave.read"
  | "self.leave.submit"
  | "self.hr_request.read"
  | "self.hr_request.create"
  | "self.notification.read"
  | "team.read"
  | "team.timesheet.read"
  | "team.timesheet.approve"
  | "team.leave.read"
  | "team.leave.approve"
  | "approval.read"
  | "approval.act"
  | "employee.read"
  | "employee.update"
  | "time.admin"
  | "leave.admin"
  | "hr_request.read"
  | "hr_request.manage"
  | "audit.read"
  | "reports.read"
  | "team.reports.read";

export type AuditEventType =
  | "PROFILE_CHANGE_REQUESTED"
  | "PROFILE_CHANGE_APPROVED"
  | "PROFILE_CHANGE_REJECTED"
  | "DOCUMENT_VIEWED"
  | "TIMESHEET_SUBMITTED"
  | "TIMESHEET_APPROVED"
  | "TIMESHEET_REJECTED"
  | "TIMESHEET_RETURNED"
  | "LEAVE_REQUESTED"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "LEAVE_CANCELLED"
  | "HR_REQUEST_CREATED"
  | "HR_REQUEST_EMPLOYEE_MESSAGE"
  | "HR_REQUEST_HR_REPLY"
  | "HR_REQUEST_STATUS_CHANGED"
  | "NOTIFICATION_READ"
  | "NOTIFICATION_MARK_ALL_READ"
  | "ACCESS_DENIED";

export type AuditLogEntry = {
  id: string;
  eventType: AuditEventType;
  actorEmployeeId: string;
  actorRole: "EMPLOYEE" | "MANAGER" | "HR";
  targetEmployeeId?: string;
  resourceType?: string;
  resourceId?: string;
  summary: string;
  metadata?: Record<string, string>;
  createdAt: string;
};
