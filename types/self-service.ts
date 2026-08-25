/**
 * Phase 4 — Employee + Manager Self-Service domain.
 * Reuses Core HR Person / Employee / Assignment — no second employee master.
 */

export type TimesheetStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "REOPENED";

export type TimeType =
  | "REGULAR"
  | "OVERTIME"
  | "HOLIDAY"
  | "TRAINING"
  | "ADMIN";

export type LeaveRequestStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type ApprovalRequestType =
  | "TIMESHEET"
  | "LEAVE"
  | "PROFILE_CHANGE"
  | "HR_REQUEST";

export type ProfileChangeStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type HrRequestStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_EMPLOYEE"
  | "RESOLVED"
  | "CLOSED";

export type HrRequestCategory =
  | "EMPLOYMENT_VERIFICATION"
  | "PERSONAL_INFORMATION_CHANGE"
  | "DOCUMENT_REQUEST"
  | "GENERAL_HR_QUESTION"
  | "PAYROLL_QUESTION"
  | "BENEFITS_QUESTION"
  | "OTHER";

export type DocumentVisibility =
  | "HR_ONLY"
  | "EMPLOYEE"
  | "MANAGER_AND_HR"
  | "PAYROLL_ONLY";

export type LeaveType = {
  id: string;
  code: string;
  name: string;
  paid: boolean;
  requiresApproval: boolean;
  allowNegativeBalance: boolean;
  status: "ACTIVE" | "INACTIVE";
};

export type LeaveBalance = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  openingBalance: number;
  accrued: number;
  used: number;
  adjusted: number;
  available: number;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  hours: number;
  status: LeaveRequestStatus;
  comments?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Timesheet = {
  id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  status: TimesheetStatus;
  totalHours: number;
  submittedAt?: string;
  approvedAt?: string;
  approvedByEmployeeId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TimeEntry = {
  id: string;
  timesheetId: string;
  employeeId: string;
  workDate: string;
  hours: number;
  timeType: TimeType;
  projectId?: string;
  taskId?: string;
  comments?: string;
};

export type ApprovalRequest = {
  id: string;
  requestType: ApprovalRequestType;
  requestId: string;
  requesterEmployeeId: string;
  approverEmployeeId: string;
  status: ApprovalStatus;
  submittedAt: string;
  actedAt?: string;
  summary: string;
};

export type ApprovalHistory = {
  id: string;
  requestType: ApprovalRequestType;
  requestId: string;
  action: "SUBMITTED" | "APPROVED" | "REJECTED" | "RETURNED" | "CANCELLED";
  actorEmployeeId: string;
  comment?: string;
  actedAt: string;
};

export type ProfileChangeRequest = {
  id: string;
  employeeId: string;
  changeType: string;
  currentValue: string;
  requestedValue: string;
  supportingDocumentId?: string;
  status: ProfileChangeStatus;
  requestedAt: string;
  reviewedByEmployeeId?: string;
  reviewedAt?: string;
};

export type HrRequest = {
  id: string;
  employeeId: string;
  requestNumber: string;
  category: HrRequestCategory;
  subject: string;
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH";
  status: HrRequestStatus;
  assignedToEmployeeId?: string;
  createdAt: string;
  resolvedAt?: string;
};

export type Notification = {
  id: string;
  userId: string;
  employeeId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  readAt?: string;
  createdAt: string;
};

export type EmployeeDocumentView = {
  id: string;
  employeeId: string;
  documentType: string;
  fileName: string;
  visibility: DocumentVisibility;
  uploadedAt: string;
  effectiveDate?: string;
};

export const leaveTypeLabels: Record<string, string> = {
  PTO: "Vacation / PTO",
  SICK: "Sick",
  PERSONAL: "Personal",
  UNPAID: "Unpaid",
  BEREAVEMENT: "Bereavement",
  JURY: "Jury Duty",
};

export const leaveRequestStatusLabels: Record<LeaveRequestStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const timesheetStatusLabels: Record<TimesheetStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REOPENED: "Reopened",
};

export const hrRequestCategoryLabels: Record<HrRequestCategory, string> = {
  EMPLOYMENT_VERIFICATION: "Employment Verification",
  PERSONAL_INFORMATION_CHANGE: "Personal Information Change",
  DOCUMENT_REQUEST: "Document Request",
  GENERAL_HR_QUESTION: "General HR Question",
  PAYROLL_QUESTION: "Payroll Question",
  BENEFITS_QUESTION: "Benefits Question",
  OTHER: "Other",
};
