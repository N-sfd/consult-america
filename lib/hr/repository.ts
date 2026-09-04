import type {
  CompensationRecord,
  EmployeeProfile,
  EmployeeStatusHistory,
  HrEvent,
  JobAssignment,
  OnboardingRecord,
  OnboardingTask,
} from "@/types/hr";
import type {
  HireConversionInput,
  HireConversionResult,
} from "@/lib/recruiting/repository";

export type CreateEmployeeProfileInput = {
  firstName: string;
  lastName: string;
  personalEmail?: string;
  phone?: string;
  hireDate: string;
  employmentStatus?: EmployeeProfile["employmentStatus"];
  workEmail?: string;
  workPhone?: string;
  candidateId?: string;
  sourceApplicationId?: string;
  sourceOfferId?: string;
};

/** Employee-editable contact fields — no approval required. */
export type UpdateEmployeeContactInput = {
  preferredName?: string;
  personalEmail?: string;
  phone?: string;
  mailingAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
};

export type CreateAssignmentInput = {
  employeeId: string;
  legalEntityId: string;
  businessUnitId: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: JobAssignment["employmentType"];
  workplaceType: JobAssignment["workplaceType"];
  startDate: string;
  changeReason?: string;
  primaryAssignment?: boolean;
};

export type UpsertCompensationInput = {
  employeeId: string;
  assignmentId: string;
  compensationType: CompensationRecord["compensationType"];
  annualSalary?: number;
  hourlyRate?: number;
  currency?: string;
  effectiveStartDate: string;
  reason?: string;
};

export type HrRepository = {
  listEmployees(): Promise<EmployeeProfile[]>;
  getEmployeeById(id: string): Promise<EmployeeProfile | undefined>;
  getEmployeeByNumber(employeeNumber: string): Promise<EmployeeProfile | undefined>;
  findEmployeeByPersonalEmail(email: string): Promise<EmployeeProfile | undefined>;
  createEmployee(input: CreateEmployeeProfileInput): Promise<EmployeeProfile>;
  updateEmployeeContact(
    employeeId: string,
    updates: UpdateEmployeeContactInput,
  ): Promise<EmployeeProfile>;
  updateEmployeeStatus(
    employeeId: string,
    status: EmployeeProfile["employmentStatus"],
    effectiveDate: string,
    note?: string,
  ): Promise<EmployeeProfile>;

  listAssignments(employeeId: string): Promise<JobAssignment[]>;
  getPrimaryAssignment(
    employeeId: string,
  ): Promise<JobAssignment | undefined>;
  createAssignment(
    input: CreateAssignmentInput,
  ): Promise<JobAssignment>;

  listStatusHistory(employeeId: string): Promise<EmployeeStatusHistory[]>;
  listHrEvents(employeeId: string): Promise<HrEvent[]>;
  getOnboarding(employeeId: string): Promise<OnboardingRecord | undefined>;
  listOnboardingTasks(employeeId: string): Promise<OnboardingTask[]>;

  getActiveCompensation(
    employeeId: string,
    asOf?: string,
  ): Promise<CompensationRecord | undefined>;
  upsertCompensation(
    input: UpsertCompensationInput,
  ): Promise<CompensationRecord>;

  convertAcceptedOffer(
    input: HireConversionInput & {
      firstName: string;
      lastName: string;
      personalEmail: string;
      personalPhone?: string;
      legalEntityId: string;
      businessUnitId: string;
      employmentType: JobAssignment["employmentType"];
      workplaceType: JobAssignment["workplaceType"];
      candidateId: string;
    },
  ): Promise<HireConversionResult>;
};
