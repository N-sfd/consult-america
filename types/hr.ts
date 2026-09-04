/**
 * Core HR domain model.
 *
 * candidate_profiles -> employee_profiles on hire (real FK, never a
 * disconnected employee record — see lib/hr/index.ts::convertAcceptedOfferToEmployee).
 *
 * employee_profiles holds identity/contact fields only. Job title,
 * department, position, location, and manager live on JobAssignment
 * (time-bounded) instead, so promotions/transfers keep history rather than
 * overwriting a single current-job snapshot.
 */

import type {
  EmploymentType,
  WorkplaceType,
} from "@/types/organization";

export type EmployeeStatus =
  | "PRE_HIRE"
  | "ACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "TERMINATED";

export type AssignmentStatus = "ACTIVE" | "ENDED" | "CANCELLED";

export type HrEventType =
  | "HIRED"
  | "PROMOTED"
  | "TRANSFERRED"
  | "MANAGER_CHANGED"
  | "LOCATION_CHANGED"
  | "EMPLOYMENT_TYPE_CHANGED"
  | "COMPENSATION_CHANGED"
  | "LEAVE_STARTED"
  | "LEAVE_ENDED"
  | "TERMINATED"
  | "STATUS_CHANGED"
  | "ASSIGNMENT_CHANGED";

export type OnboardingTaskStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NOT_APPLICABLE";

export type CompensationType = "SALARY" | "HOURLY";

/** Employment relationship + identity/contact fields with ConsultAmerica. */
export type EmployeeProfile = {
  id: string;
  /** Links to the shared account identity once the employee has a portal login. */
  userId?: string;
  /** Links back to the candidate this person was hired from, if any. */
  candidateId?: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  workEmail?: string;
  personalEmail?: string;
  phone?: string;
  workPhone?: string;
  mailingAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  hireDate: string;
  originalHireDate: string;
  employmentStatus: EmployeeStatus;
  terminationDate?: string;
  terminationReason?: string;
  /** Originating application / offer when hired via ATS. */
  sourceApplicationId?: string;
  sourceOfferId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Time-bounded job placement.
 * Do not store department/position/manager only on employee_profiles —
 * history requires assignments.
 */
export type JobAssignment = {
  id: string;
  employeeId: string;
  legalEntityId: string;
  businessUnitId: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  endDate?: string;
  assignmentStatus: AssignmentStatus;
  primaryAssignment: boolean;
  changeReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeStatusHistory = {
  id: string;
  employeeId: string;
  fromStatus?: EmployeeStatus;
  toStatus: EmployeeStatus;
  effectiveDate: string;
  changedByUserId?: string;
  note?: string;
  createdAt: string;
};

export type HrEvent = {
  id: string;
  employeeId: string;
  eventType: HrEventType;
  effectiveDate: string;
  summary: string;
  beforeJson?: string;
  afterJson?: string;
  createdByUserId?: string;
  createdAt: string;
};

export type OnboardingRecord = {
  id: string;
  employeeId: string;
  startDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

export type OnboardingTask = {
  id: string;
  onboardingId: string;
  employeeId: string;
  taskType: string;
  title: string;
  description?: string;
  assignedToUserId?: string;
  dueDate?: string;
  status: OnboardingTaskStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

/** Minimal compensation foundation — not payroll calc. */
export type CompensationRecord = {
  id: string;
  employeeId: string;
  assignmentId: string;
  compensationType: CompensationType;
  annualSalary?: number;
  hourlyRate?: number;
  currency: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
};

export const employeeStatusLabels: Record<EmployeeStatus, string> = {
  PRE_HIRE: "Pre-Hire",
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
};

export const DEFAULT_ONBOARDING_TASKS: Array<{
  taskType: string;
  title: string;
  description: string;
}> = [
  {
    taskType: "PERSONAL_INFO",
    title: "Complete Personal Information",
    description: "Verify legal name, contact details, and emergency contacts.",
  },
  {
    taskType: "EMERGENCY_CONTACT",
    title: "Add Emergency Contact",
    description: "Provide at least one emergency contact on file.",
  },
  {
    taskType: "DOCUMENTS",
    title: "Verify Documents",
    description: "Collect required employment and identity documents.",
  },
  {
    taskType: "WORK_EMAIL",
    title: "Create Work Email",
    description: "Provision corporate email and directory listing.",
  },
  {
    taskType: "MANAGER",
    title: "Assign Manager",
    description: "Confirm reporting manager and team placement.",
  },
  {
    taskType: "ORG",
    title: "Confirm Department & Position",
    description: "Validate department, position, and location assignment.",
  },
  {
    taskType: "POLICIES",
    title: "Review Policies",
    description: "Acknowledge company policies and codes of conduct.",
  },
  {
    taskType: "EQUIPMENT",
    title: "Equipment Setup",
    description: "Provision laptop and required tools.",
  },
  {
    taskType: "ACCESS",
    title: "System Access",
    description: "Grant application and environment access.",
  },
  {
    taskType: "ORIENTATION",
    title: "Orientation",
    description: "Schedule orientation with HR and the hiring manager.",
  },
];
