/**
 * Core HR domain model (Phase 3).
 *
 * Person ≠ Employee ≠ Assignment
 *
 * Candidate (Phase 2) → Offer Accepted → Hire → Person + Employee + Assignment
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

/** The human being — shared across Candidate and Employee. */
export type Person = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  personalEmail?: string;
  personalPhone?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
};

/** Employment relationship with ConsultAmerica. */
export type Employee = {
  id: string;
  personId: string;
  employeeNumber: string;
  hireDate: string;
  originalHireDate: string;
  employmentStatus: EmployeeStatus;
  terminationDate?: string;
  terminationReason?: string;
  workEmail?: string;
  workPhone?: string;
  /** Originating candidate / application / offer when hired via ATS. */
  sourceCandidateId?: string;
  sourceApplicationId?: string;
  sourceOfferId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Time-bounded job placement.
 * Do not store department/position/manager only on employees —
 * history requires assignments.
 */
export type EmploymentAssignment = {
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

/** Minimal compensation foundation for Phase 5 — not payroll calc. */
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
