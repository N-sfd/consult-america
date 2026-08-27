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

export type HrRequestMessage = {
  id: string;
  hrRequestId: string;
  authorEmployeeId: string;
  authorRole: "EMPLOYEE" | "HR";
  message: string;
  createdAt: string;
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

export type DocumentCategory =
  | "EMPLOYMENT"
  | "POLICY"
  | "PERSONAL"
  | "CERTIFICATION";

export type EmployeeDocumentView = {
  id: string;
  employeeId: string;
  documentType: string;
  category: DocumentCategory;
  fileName: string;
  visibility: DocumentVisibility;
  uploadedAt: string;
  effectiveDate?: string;
  version?: string;
  requiresAcknowledgement?: boolean;
  acknowledgedAt?: string;
  expiresAt?: string;
};

export type DocumentStatus =
  | "AVAILABLE"
  | "ACTION_REQUIRED"
  | "ACKNOWLEDGED"
  | "EXPIRING_SOON"
  | "EXPIRED";

export const documentStatusLabels: Record<DocumentStatus, string> = {
  AVAILABLE: "Available",
  ACTION_REQUIRED: "Action Required",
  ACKNOWLEDGED: "Acknowledged",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
};

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  EMPLOYMENT: "Employment",
  POLICY: "Policies",
  PERSONAL: "Personal",
  CERTIFICATION: "Certifications",
};

/** 30-day window before `expiresAt` where a document reads as "Expiring Soon". */
const EXPIRING_SOON_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function getDocumentStatus(
  doc: EmployeeDocumentView,
  now: Date = new Date(),
): DocumentStatus {
  if (doc.expiresAt) {
    const expiresAt = new Date(doc.expiresAt).getTime();
    if (expiresAt < now.getTime()) return "EXPIRED";
    if (expiresAt - now.getTime() <= EXPIRING_SOON_WINDOW_MS) {
      return "EXPIRING_SOON";
    }
  }
  if (doc.requiresAcknowledgement) {
    return doc.acknowledgedAt ? "ACKNOWLEDGED" : "ACTION_REQUIRED";
  }
  return "AVAILABLE";
}

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

export const approvalRequestTypeLabels: Record<ApprovalRequestType, string> = {
  TIMESHEET: "Timesheet",
  LEAVE: "Leave",
  PROFILE_CHANGE: "Profile Change",
  HR_REQUEST: "HR Request",
};

export const approvalStatusLabels: Record<ApprovalStatus, string> = {
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

export const hrRequestStatusLabels: Record<HrRequestStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_EMPLOYEE: "Waiting for Employee",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const hrRequestPriorityLabels: Record<"LOW" | "NORMAL" | "HIGH", string> =
  {
    LOW: "Low",
    NORMAL: "Normal",
    HIGH: "High",
  };
