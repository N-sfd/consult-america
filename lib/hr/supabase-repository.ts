import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type { HrRepository } from "@/lib/hr/repository";
import type {
  Employee,
  EmployeeStatusHistory,
  EmploymentAssignment,
  HrEvent,
  OnboardingRecord,
  OnboardingTask,
  Person,
} from "@/types/hr";
import type { HireConversionResult } from "@/lib/recruiting/repository";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function mapPerson(row: Record<string, unknown>): Person {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    middleName: (row.middle_name as string) ?? undefined,
    lastName: row.last_name as string,
    preferredName: (row.preferred_name as string) ?? undefined,
    personalEmail: (row.personal_email as string) ?? undefined,
    personalPhone: (row.personal_phone as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    personId: row.person_id as string,
    employeeNumber: row.employee_number as string,
    hireDate: row.hire_date as string,
    originalHireDate: row.original_hire_date as string,
    employmentStatus: row.employment_status as Employee["employmentStatus"],
    terminationDate: (row.termination_date as string) ?? undefined,
    terminationReason: (row.termination_reason as string) ?? undefined,
    workEmail: (row.work_email as string) ?? undefined,
    workPhone: (row.work_phone as string) ?? undefined,
    sourceCandidateId: (row.source_candidate_id as string) ?? undefined,
    sourceApplicationId: (row.source_application_id as string) ?? undefined,
    sourceOfferId: (row.source_offer_id as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapStatusHistory(row: Record<string, unknown>): EmployeeStatusHistory {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    fromStatus: (row.from_status as EmployeeStatusHistory["fromStatus"]) ?? undefined,
    toStatus: row.to_status as EmployeeStatusHistory["toStatus"],
    effectiveDate: row.effective_date as string,
    changedByUserId: (row.changed_by_user_id as string) ?? undefined,
    note: (row.note as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function mapHrEvent(row: Record<string, unknown>): HrEvent {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    eventType: row.event_type as HrEvent["eventType"],
    effectiveDate: row.effective_date as string,
    summary: row.summary as string,
    beforeJson: (row.before_json as string) ?? undefined,
    afterJson: (row.after_json as string) ?? undefined,
    createdByUserId: (row.created_by_user_id as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

function mapOnboardingRecord(row: Record<string, unknown>): OnboardingRecord {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    startDate: row.start_date as string,
    status: row.status as OnboardingRecord["status"],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapOnboardingTask(row: Record<string, unknown>): OnboardingTask {
  return {
    id: row.id as string,
    onboardingId: row.onboarding_id as string,
    employeeId: row.employee_id as string,
    taskType: row.task_type as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    assignedToUserId: (row.assigned_to_user_id as string) ?? undefined,
    dueDate: (row.due_date as string) ?? undefined,
    status: row.status as OnboardingTask["status"],
    completedAt: (row.completed_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapAssignment(row: Record<string, unknown>): EmploymentAssignment {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    legalEntityId: row.legal_entity_id as string,
    businessUnitId: row.business_unit_id as string,
    departmentId: row.department_id as string,
    positionId: row.position_id as string,
    locationId: row.location_id as string,
    managerEmployeeId: (row.manager_employee_id as string) ?? undefined,
    employmentType: row.employment_type as EmploymentAssignment["employmentType"],
    workplaceType: row.workplace_type as EmploymentAssignment["workplaceType"],
    startDate: row.start_date as string,
    endDate: (row.end_date as string) ?? undefined,
    assignmentStatus: row.assignment_status as EmploymentAssignment["assignmentStatus"],
    primaryAssignment: Boolean(row.primary_assignment),
    changeReason: (row.change_reason as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/**
 * Supabase-backed HR repository for Phase 3A (accepted offer -> employee
 * conversion, onboarding). Hire conversion runs as a single Postgres
 * function (db/schema/007_hire_conversion.sql) so it commits atomically.
 */
export function createSupabaseHrRepository(): HrRepository {
  function requireClient() {
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");
    return client;
  }

  return {
    async listPeople() {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client.from("people").select("*");
      return (data ?? []).map(mapPerson);
    },

    async getPersonById(id) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("people")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return data ? mapPerson(data) : undefined;
    },

    async findPersonByEmail(email) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("people")
        .select("*")
        .ilike("personal_email", email.trim())
        .maybeSingle();
      return data ? mapPerson(data) : undefined;
    },

    async createPerson(input) {
      const client = requireClient();

      if (input.personalEmail) {
        const { data: existing } = await client
          .from("people")
          .select("*")
          .ilike("personal_email", input.personalEmail.trim())
          .maybeSingle();
        if (existing) return mapPerson(existing);
      }

      const row = {
        id: createId("person"),
        first_name: input.firstName,
        middle_name: input.middleName ?? null,
        last_name: input.lastName,
        preferred_name: input.preferredName ?? null,
        personal_email: input.personalEmail ?? null,
        personal_phone: input.personalPhone ?? null,
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      const { data, error } = await client
        .from("people")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create person: ${error.message}`);
      return mapPerson(data);
    },

    async listEmployees() {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client.from("employees").select("*");
      return (data ?? []).map(mapEmployee);
    },

    async getEmployeeById(id) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("employees")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      return data ? mapEmployee(data) : undefined;
    },

    async getEmployeeByNumber(employeeNumber) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("employees")
        .select("*")
        .eq("employee_number", employeeNumber)
        .maybeSingle();
      return data ? mapEmployee(data) : undefined;
    },

    async createEmployee(input) {
      const client = requireClient();

      const { data: employeeNumber, error: numberError } =
        await client.rpc("next_employee_number");
      if (numberError || !employeeNumber) {
        throw new Error(
          `Failed to generate employee number: ${numberError?.message}`,
        );
      }

      const status = input.employmentStatus ?? "PRE_HIRE";
      const row = {
        id: createId("emp"),
        person_id: input.personId,
        employee_number: employeeNumber,
        hire_date: input.hireDate,
        original_hire_date: input.hireDate,
        employment_status: status,
        work_email: input.workEmail ?? null,
        work_phone: input.workPhone ?? null,
        source_candidate_id: input.sourceCandidateId ?? null,
        source_application_id: input.sourceApplicationId ?? null,
        source_offer_id: input.sourceOfferId ?? null,
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      const { data, error } = await client
        .from("employees")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create employee: ${error.message}`);
      const employee = mapEmployee(data);

      await client.from("employee_status_history").insert({
        id: createId("esh"),
        employee_id: employee.id,
        from_status: null,
        to_status: status,
        effective_date: input.hireDate,
        note: "Employee record created",
        created_at: nowIso(),
      });

      await client.from("hr_events").insert({
        id: createId("hre"),
        employee_id: employee.id,
        event_type: "HIRED",
        effective_date: input.hireDate,
        summary: `Employee ${employeeNumber} created`,
        created_at: nowIso(),
      });

      return employee;
    },

    async updateEmployeeStatus(employeeId, status, effectiveDate, note) {
      const client = requireClient();

      const { data: current, error: fetchError } = await client
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .maybeSingle();
      if (fetchError || !current) {
        throw new Error(`Employee not found: ${employeeId}`);
      }
      const fromStatus = current.employment_status as Employee["employmentStatus"];

      const update: Record<string, unknown> = {
        employment_status: status,
        updated_at: nowIso(),
      };
      if (status === "TERMINATED") {
        update.termination_date = effectiveDate;
        update.termination_reason = note ?? null;
      }

      const { data, error } = await client
        .from("employees")
        .update(update)
        .eq("id", employeeId)
        .select("*")
        .single();
      if (error) throw new Error(`Failed to update employee status: ${error.message}`);

      await client.from("employee_status_history").insert({
        id: createId("esh"),
        employee_id: employeeId,
        from_status: fromStatus,
        to_status: status,
        effective_date: effectiveDate,
        note: note ?? null,
        created_at: nowIso(),
      });

      await client.from("hr_events").insert({
        id: createId("hre"),
        employee_id: employeeId,
        event_type: "STATUS_CHANGED",
        effective_date: effectiveDate,
        summary: `Status changed from ${fromStatus} to ${status}`,
        before_json: JSON.stringify({ status: fromStatus }),
        after_json: JSON.stringify({ status }),
        created_at: nowIso(),
      });

      return mapEmployee(data);
    },

    async listAssignments(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client
        .from("employment_assignments")
        .select("*")
        .eq("employee_id", employeeId)
        .order("start_date", { ascending: false });
      return (data ?? []).map(mapAssignment);
    },

    async getPrimaryAssignment(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("employment_assignments")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("primary_assignment", true)
        .eq("assignment_status", "ACTIVE")
        .maybeSingle();
      return data ? mapAssignment(data) : undefined;
    },

    async createAssignment(input) {
      const client = requireClient();

      if (input.managerEmployeeId === input.employeeId) {
        throw new Error("Employee cannot report to themselves");
      }

      const primary = input.primaryAssignment ?? true;

      if (primary) {
        await client
          .from("employment_assignments")
          .update({ assignment_status: "ENDED", end_date: input.startDate, updated_at: nowIso() })
          .eq("employee_id", input.employeeId)
          .eq("primary_assignment", true)
          .eq("assignment_status", "ACTIVE");
      }

      const row = {
        id: createId("asg"),
        employee_id: input.employeeId,
        legal_entity_id: input.legalEntityId,
        business_unit_id: input.businessUnitId,
        department_id: input.departmentId,
        position_id: input.positionId,
        location_id: input.locationId,
        manager_employee_id: input.managerEmployeeId ?? null,
        employment_type: input.employmentType,
        workplace_type: input.workplaceType,
        start_date: input.startDate,
        assignment_status: "ACTIVE",
        primary_assignment: primary,
        change_reason: input.changeReason ?? "Initial assignment",
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      const { data, error } = await client
        .from("employment_assignments")
        .insert(row)
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create assignment: ${error.message}`);
      const assignment = mapAssignment(data);

      await client.from("hr_events").insert({
        id: createId("hre"),
        employee_id: input.employeeId,
        event_type: "ASSIGNMENT_CHANGED",
        effective_date: input.startDate,
        summary: input.changeReason ?? "Employment assignment created",
        after_json: JSON.stringify({
          departmentId: input.departmentId,
          positionId: input.positionId,
          locationId: input.locationId,
        }),
        created_at: nowIso(),
      });

      return assignment;
    },

    async listStatusHistory(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client
        .from("employee_status_history")
        .select("*")
        .eq("employee_id", employeeId)
        .order("effective_date", { ascending: false });
      return (data ?? []).map(mapStatusHistory);
    },

    async listHrEvents(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client
        .from("hr_events")
        .select("*")
        .eq("employee_id", employeeId)
        .order("effective_date", { ascending: false });
      return (data ?? []).map(mapHrEvent);
    },

    async getOnboarding(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;
      const { data } = await client
        .from("onboarding_records")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle();
      return data ? mapOnboardingRecord(data) : undefined;
    },

    async listOnboardingTasks(employeeId) {
      const client = getSupabaseServiceClient();
      if (!client) return [];
      const { data } = await client
        .from("onboarding_tasks")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: true });
      return (data ?? []).map(mapOnboardingTask);
    },

    async convertAcceptedOffer(input): Promise<HireConversionResult> {
      const client = requireClient();

      const { data, error } = await client.rpc(
        "convert_accepted_offer_to_employee",
        {
          p_application_id: input.applicationId,
          p_offer_id: input.offerId,
          p_candidate_id: input.candidateId,
          p_first_name: input.firstName,
          p_last_name: input.lastName,
          p_personal_email: input.personalEmail,
          p_personal_phone: input.personalPhone ?? null,
          p_start_date: input.startDate,
          p_legal_entity_id: input.legalEntityId,
          p_business_unit_id: input.businessUnitId,
          p_department_id: input.departmentId,
          p_position_id: input.positionId,
          p_location_id: input.locationId,
          p_manager_employee_id: input.managerEmployeeId ?? null,
          p_employment_type: input.employmentType,
          p_workplace_type: input.workplaceType,
        },
      );

      if (error) {
        throw new Error(`Hire conversion failed: ${error.message}`);
      }

      return data as HireConversionResult;
    },
  };
}
