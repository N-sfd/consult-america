import type {
  Employee,
  EmploymentAssignment,
  HrEvent,
  OnboardingRecord,
  OnboardingTask,
  Person,
  EmployeeStatusHistory,
} from "@/types/hr";
import type {
  HireConversionInput,
  HireConversionResult,
} from "@/lib/recruiting/repository";

export type CreatePersonInput = {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  personalEmail?: string;
  personalPhone?: string;
};

export type CreateEmployeeInput = {
  personId: string;
  hireDate: string;
  employmentStatus?: Employee["employmentStatus"];
  workEmail?: string;
  workPhone?: string;
  sourceCandidateId?: string;
  sourceApplicationId?: string;
};

export type CreateAssignmentInput = {
  employeeId: string;
  legalEntityId: string;
  businessUnitId: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: EmploymentAssignment["employmentType"];
  workplaceType: EmploymentAssignment["workplaceType"];
  startDate: string;
  changeReason?: string;
  primaryAssignment?: boolean;
};

export type HrRepository = {
  listPeople(): Promise<Person[]>;
  getPersonById(id: string): Promise<Person | undefined>;
  findPersonByEmail(email: string): Promise<Person | undefined>;
  createPerson(input: CreatePersonInput): Promise<Person>;

  listEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | undefined>;
  getEmployeeByNumber(employeeNumber: string): Promise<Employee | undefined>;
  createEmployee(input: CreateEmployeeInput): Promise<Employee>;
  updateEmployeeStatus(
    employeeId: string,
    status: Employee["employmentStatus"],
    effectiveDate: string,
    note?: string,
  ): Promise<Employee>;

  listAssignments(employeeId: string): Promise<EmploymentAssignment[]>;
  getPrimaryAssignment(
    employeeId: string,
  ): Promise<EmploymentAssignment | undefined>;
  createAssignment(
    input: CreateAssignmentInput,
  ): Promise<EmploymentAssignment>;

  listStatusHistory(employeeId: string): Promise<EmployeeStatusHistory[]>;
  listHrEvents(employeeId: string): Promise<HrEvent[]>;
  getOnboarding(employeeId: string): Promise<OnboardingRecord | undefined>;
  listOnboardingTasks(employeeId: string): Promise<OnboardingTask[]>;

  convertAcceptedOffer(
    input: HireConversionInput & {
      firstName: string;
      lastName: string;
      personalEmail: string;
      personalPhone?: string;
      legalEntityId: string;
      businessUnitId: string;
      employmentType: EmploymentAssignment["employmentType"];
      workplaceType: EmploymentAssignment["workplaceType"];
      candidateId: string;
    },
  ): Promise<HireConversionResult>;
};
