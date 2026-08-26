import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type { HrRepository } from "@/lib/hr/repository";
import type { Employee, EmploymentAssignment, Person } from "@/types/hr";

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

function notImplemented(method: string): never {
  throw new Error(
    `HrRepository.${method} is not implemented against Supabase yet — this is a later-block feature (hire conversion / onboarding UI), not part of the Workforce App shell + dashboard pass.`,
  );
}

/**
 * Supabase-backed HR repository. Scoped to what the Workforce App dashboard
 * needs (people/employee/assignment reads) — write paths and hire
 * conversion are deliberately left unimplemented until those features are
 * built, rather than silently stubbed as no-ops.
 */
export function createSupabaseHrRepository(): HrRepository {
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

    async createPerson() {
      notImplemented("createPerson");
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

    async createEmployee() {
      notImplemented("createEmployee");
    },

    async updateEmployeeStatus() {
      notImplemented("updateEmployeeStatus");
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

    async createAssignment() {
      notImplemented("createAssignment");
    },

    async listStatusHistory() {
      notImplemented("listStatusHistory");
    },

    async listHrEvents() {
      notImplemented("listHrEvents");
    },

    async getOnboarding() {
      notImplemented("getOnboarding");
    },

    async listOnboardingTasks() {
      notImplemented("listOnboardingTasks");
    },

    async convertAcceptedOffer() {
      notImplemented("convertAcceptedOffer");
    },
  };
}
