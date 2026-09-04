import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import { nextEmployeeNumber } from "@/lib/hr/employee-number";
import type {
  CreateAssignmentInput,
  CreateEmployeeProfileInput,
  HrRepository,
  UpdateEmployeeContactInput,
} from "@/lib/hr/repository";
import { createSupabaseHrRepository } from "@/lib/hr/supabase-repository";
import {
  seedEmployees,
  seedAssignments,
  seedCompensationRecords,
  seedOnboardingRecords,
  seedOnboardingTasks,
} from "@/data/hr/seed";
import {
  DEFAULT_ONBOARDING_TASKS,
  type CompensationRecord,
  type EmployeeProfile,
  type EmployeeStatusHistory,
  type JobAssignment,
  type HrEvent,
  type OnboardingRecord,
  type OnboardingTask,
} from "@/types/hr";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * In-memory Core HR repository.
 * Replace with database-backed implementation without changing callers.
 */
export function createMemoryHrRepository(): HrRepository {
  const employees: EmployeeProfile[] = [...seedEmployees];
  const assignments: JobAssignment[] = [...seedAssignments];
  const statusHistory: EmployeeStatusHistory[] = [];
  const hrEvents: HrEvent[] = [];
  const onboardingRecords: OnboardingRecord[] = [...seedOnboardingRecords];
  const onboardingTasks: OnboardingTask[] = [...seedOnboardingTasks];
  const compensationRecords: CompensationRecord[] = [...seedCompensationRecords];

  function getActiveCompensation(
    employeeId: string,
    asOf?: string,
  ): CompensationRecord | undefined {
    const cutoff = asOf ?? new Date().toISOString().slice(0, 10);
    return compensationRecords
      .filter(
        (record) =>
          record.employeeId === employeeId &&
          record.effectiveStartDate <= cutoff &&
          (!record.effectiveEndDate || record.effectiveEndDate >= cutoff),
      )
      .sort((a, b) => b.effectiveStartDate.localeCompare(a.effectiveStartDate))[0];
  }

  async function createEmployee(
    input: CreateEmployeeProfileInput,
  ): Promise<EmployeeProfile> {
    const employeeNumber = nextEmployeeNumber(
      employees.map((employee) => employee.employeeNumber),
    );

    const status = input.employmentStatus ?? "PRE_HIRE";
    const employee: EmployeeProfile = {
      id: createId("emp"),
      candidateId: input.candidateId,
      employeeNumber,
      firstName: input.firstName,
      lastName: input.lastName,
      personalEmail: input.personalEmail,
      phone: input.phone,
      hireDate: input.hireDate,
      originalHireDate: input.hireDate,
      employmentStatus: status,
      workEmail: input.workEmail,
      workPhone: input.workPhone,
      sourceApplicationId: input.sourceApplicationId,
      sourceOfferId: input.sourceOfferId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    employees.push(employee);

    statusHistory.push({
      id: createId("esh"),
      employeeId: employee.id,
      toStatus: status,
      effectiveDate: input.hireDate,
      note: "Employee record created",
      createdAt: nowIso(),
    });

    hrEvents.push({
      id: createId("hre"),
      employeeId: employee.id,
      eventType: "HIRED",
      effectiveDate: input.hireDate,
      summary: `Employee ${employeeNumber} created`,
      createdAt: nowIso(),
    });

    return employee;
  }

  async function updateEmployeeContact(
    employeeId: string,
    updates: UpdateEmployeeContactInput,
  ): Promise<EmployeeProfile> {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) throw new Error(`Employee not found: ${employeeId}`);

    Object.assign(employee, updates, { updatedAt: nowIso() });
    return employee;
  }

  async function createAssignment(
    input: CreateAssignmentInput,
  ): Promise<JobAssignment> {
    if (input.managerEmployeeId === input.employeeId) {
      throw new Error("Employee cannot report to themselves");
    }

    const primary = input.primaryAssignment ?? true;

    if (primary) {
      for (const assignment of assignments) {
        if (
          assignment.employeeId === input.employeeId &&
          assignment.primaryAssignment &&
          assignment.assignmentStatus === "ACTIVE"
        ) {
          assignment.assignmentStatus = "ENDED";
          assignment.endDate = input.startDate;
          assignment.updatedAt = nowIso();
        }
      }
    }

    const assignment: JobAssignment = {
      id: createId("asg"),
      employeeId: input.employeeId,
      legalEntityId: input.legalEntityId,
      businessUnitId: input.businessUnitId,
      departmentId: input.departmentId,
      positionId: input.positionId,
      locationId: input.locationId,
      managerEmployeeId: input.managerEmployeeId,
      employmentType: input.employmentType,
      workplaceType: input.workplaceType,
      startDate: input.startDate,
      assignmentStatus: "ACTIVE",
      primaryAssignment: primary,
      changeReason: input.changeReason ?? "Initial assignment",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    assignments.push(assignment);

    hrEvents.push({
      id: createId("hre"),
      employeeId: input.employeeId,
      eventType: "ASSIGNMENT_CHANGED",
      effectiveDate: input.startDate,
      summary: input.changeReason ?? "Employment assignment created",
      afterJson: JSON.stringify({
        departmentId: input.departmentId,
        positionId: input.positionId,
        locationId: input.locationId,
      }),
      createdAt: nowIso(),
    });

    return assignment;
  }

  function createOnboarding(employeeId: string, startDate: string) {
    const record: OnboardingRecord = {
      id: createId("onb"),
      employeeId,
      startDate,
      status: "NOT_STARTED",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    onboardingRecords.push(record);

    for (const task of DEFAULT_ONBOARDING_TASKS) {
      onboardingTasks.push({
        id: createId("otask"),
        onboardingId: record.id,
        employeeId,
        taskType: task.taskType,
        title: task.title,
        description: task.description,
        status: "NOT_STARTED",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
    }

    return record;
  }

  return {
    async listEmployees() {
      return [...employees];
    },

    async getEmployeeById(id) {
      return employees.find((employee) => employee.id === id);
    },

    async getEmployeeByNumber(employeeNumber) {
      return employees.find(
        (employee) => employee.employeeNumber === employeeNumber,
      );
    },

    async findEmployeeByPersonalEmail(email) {
      const normalized = email.trim().toLowerCase();
      return employees.find(
        (employee) => employee.personalEmail?.toLowerCase() === normalized,
      );
    },

    createEmployee,
    updateEmployeeContact,

    async updateEmployeeStatus(employeeId, status, effectiveDate, note) {
      const employee = employees.find((item) => item.id === employeeId);
      if (!employee) throw new Error(`Employee not found: ${employeeId}`);

      const fromStatus = employee.employmentStatus;
      employee.employmentStatus = status;
      employee.updatedAt = nowIso();

      if (status === "TERMINATED") {
        employee.terminationDate = effectiveDate;
        employee.terminationReason = note;
      }

      statusHistory.push({
        id: createId("esh"),
        employeeId,
        fromStatus,
        toStatus: status,
        effectiveDate,
        note,
        createdAt: nowIso(),
      });

      hrEvents.push({
        id: createId("hre"),
        employeeId,
        eventType: "STATUS_CHANGED",
        effectiveDate,
        summary: `Status changed from ${fromStatus} to ${status}`,
        beforeJson: JSON.stringify({ status: fromStatus }),
        afterJson: JSON.stringify({ status }),
        createdAt: nowIso(),
      });

      return employee;
    },

    async listAssignments(employeeId) {
      return assignments
        .filter((assignment) => assignment.employeeId === employeeId)
        .sort((a, b) => b.startDate.localeCompare(a.startDate));
    },

    async getPrimaryAssignment(employeeId) {
      return assignments.find(
        (assignment) =>
          assignment.employeeId === employeeId &&
          assignment.primaryAssignment &&
          assignment.assignmentStatus === "ACTIVE",
      );
    },

    createAssignment,

    async listStatusHistory(employeeId) {
      return statusHistory
        .filter((item) => item.employeeId === employeeId)
        .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
    },

    async listHrEvents(employeeId) {
      return hrEvents
        .filter((item) => item.employeeId === employeeId)
        .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
    },

    async getOnboarding(employeeId) {
      return onboardingRecords.find((item) => item.employeeId === employeeId);
    },

    async listOnboardingTasks(employeeId) {
      return onboardingTasks.filter((item) => item.employeeId === employeeId);
    },

    async getActiveCompensation(employeeId, asOf) {
      return getActiveCompensation(employeeId, asOf);
    },

    async upsertCompensation(input) {
      const previous = getActiveCompensation(input.employeeId);
      if (previous) previous.effectiveEndDate = input.effectiveStartDate;

      const record: CompensationRecord = {
        id: createId("comp"),
        employeeId: input.employeeId,
        assignmentId: input.assignmentId,
        compensationType: input.compensationType,
        annualSalary: input.annualSalary,
        hourlyRate: input.hourlyRate,
        currency: input.currency ?? "USD",
        effectiveStartDate: input.effectiveStartDate,
        reason: input.reason,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      compensationRecords.push(record);
      return record;
    },

    async convertAcceptedOffer(input) {
      const existing = employees.find(
        (employee) => employee.sourceOfferId === input.offerId,
      );
      if (existing) {
        const assignment = assignments.find(
          (item) =>
            item.employeeId === existing.id &&
            item.primaryAssignment &&
            item.assignmentStatus === "ACTIVE",
        );
        const onboarding = onboardingRecords.find(
          (record) => record.employeeId === existing.id,
        );
        if (!assignment || !onboarding) {
          throw new Error(
            `Employee ${existing.id} was converted from offer ${input.offerId} but is missing assignment/onboarding records`,
          );
        }
        return {
          employeeId: existing.id,
          employeeNumber: existing.employeeNumber,
          assignmentId: assignment.id,
          onboardingId: onboarding.id,
        };
      }

      const employee = await createEmployee({
        firstName: input.firstName,
        lastName: input.lastName,
        personalEmail: input.personalEmail,
        phone: input.personalPhone,
        hireDate: input.startDate,
        employmentStatus: "PRE_HIRE",
        candidateId: input.candidateId,
        sourceApplicationId: input.applicationId,
        sourceOfferId: input.offerId,
      });

      const assignment = await createAssignment({
        employeeId: employee.id,
        legalEntityId: input.legalEntityId,
        businessUnitId: input.businessUnitId,
        departmentId: input.departmentId,
        positionId: input.positionId,
        locationId: input.locationId,
        managerEmployeeId: input.managerEmployeeId,
        employmentType: input.employmentType,
        workplaceType: input.workplaceType,
        startDate: input.startDate,
        changeReason: "Hire from accepted offer",
        primaryAssignment: true,
      });

      const onboarding = createOnboarding(employee.id, input.startDate);

      return {
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        assignmentId: assignment.id,
        onboardingId: onboarding.id,
      };
    },
  };
}

export const hrRepository: HrRepository = isSupabaseConfigured()
  ? createSupabaseHrRepository()
  : createMemoryHrRepository();
