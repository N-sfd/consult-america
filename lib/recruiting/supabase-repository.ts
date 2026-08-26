import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type {
  RecruitingDashboardReads,
  RecruitingRepository,
} from "@/lib/recruiting/repository";
import {
  APPLICATION_PIPELINE,
  APPLICATION_TERMINAL_STATUSES,
  type Application,
  type ApplicationStatus,
  type Candidate,
  type Interview,
  type JobPosting,
  type JobRequisition,
  type Offer,
} from "@/types/recruiting";

/** snake_case (Postgres) -> camelCase (app) row mappers, one per table. */

function mapPosting(row: Record<string, unknown>): JobPosting {
  return {
    id: row.id as string,
    requisitionId: row.requisition_id as string,
    slug: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    description: row.description as string,
    careerArea: row.career_area as JobPosting["careerArea"],
    departmentName: row.department_name as string,
    locationName: row.location_name as string,
    workplaceType: row.workplace_type as JobPosting["workplaceType"],
    employmentType: row.employment_type as JobPosting["employmentType"],
    responsibilities: (row.responsibilities as string[]) ?? [],
    qualifications: (row.qualifications as string[]) ?? [],
    preferredQualifications:
      (row.preferred_qualifications as string[]) ?? [],
    status: row.status as JobPosting["status"],
    publishedAt: (row.published_at as string) ?? undefined,
    closedAt: (row.closed_at as string) ?? undefined,
    isDemo: Boolean(row.is_demo),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapRequisition(row: Record<string, unknown>): JobRequisition {
  return {
    id: row.id as string,
    requisitionNumber: row.requisition_number as string,
    title: row.title as string,
    departmentId: row.department_id as string,
    positionId: row.position_id as string,
    locationId: row.location_id as string,
    hiringManagerUserId: (row.hiring_manager_user_id as string) ?? undefined,
    recruiterUserId: (row.recruiter_user_id as string) ?? undefined,
    employmentType: row.employment_type as JobRequisition["employmentType"],
    workplaceType: row.workplace_type as JobRequisition["workplaceType"],
    careerArea: row.career_area as JobRequisition["careerArea"],
    openings: row.openings as number,
    salaryMin: (row.salary_min as number) ?? undefined,
    salaryMax: (row.salary_max as number) ?? undefined,
    currency: row.currency as string,
    description: row.description as string,
    responsibilities: (row.responsibilities as string[]) ?? [],
    qualifications: (row.qualifications as string[]) ?? [],
    preferredQualifications:
      (row.preferred_qualifications as string[]) ?? [],
    targetHireDate: (row.target_hire_date as string) ?? undefined,
    status: row.status as JobRequisition["status"],
    createdByUserId: (row.created_by_user_id as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapCandidate(row: Record<string, unknown>): Candidate {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    preferredName: (row.preferred_name as string) ?? undefined,
    email: row.email as string,
    phone: (row.phone as string) ?? undefined,
    linkedinUrl: (row.linkedin_url as string) ?? undefined,
    portfolioUrl: (row.portfolio_url as string) ?? undefined,
    workAuthorization: (row.work_authorization as string) ?? undefined,
    willingToRelocate: (row.willing_to_relocate as boolean) ?? undefined,
    source: (row.source as string) ?? undefined,
    personId: (row.person_id as string) ?? undefined,
    employeeId: (row.employee_id as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    applicationNumber: row.application_number as string,
    candidateId: row.candidate_id as string,
    requisitionId: row.requisition_id as string,
    postingId: row.posting_id as string,
    status: row.status as ApplicationStatus,
    coverLetter: (row.cover_letter as string) ?? undefined,
    additionalInformation:
      (row.additional_information as string) ?? undefined,
    appliedAt: row.applied_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapOffer(row: Record<string, unknown>): Offer {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    offerNumber: row.offer_number as string,
    status: row.status as Offer["status"],
    baseSalary: (row.base_salary as number) ?? undefined,
    hourlyRate: (row.hourly_rate as number) ?? undefined,
    currency: row.currency as string,
    employmentType: row.employment_type as Offer["employmentType"],
    workplaceType: row.workplace_type as Offer["workplaceType"],
    startDate: row.start_date as string,
    expirationDate: (row.expiration_date as string) ?? undefined,
    termsSummary: (row.terms_summary as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapInterview(row: Record<string, unknown>): Interview {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    interviewType: row.interview_type as Interview["interviewType"],
    status: row.status as Interview["status"],
    scheduledAt: row.scheduled_at as string,
    durationMinutes: row.duration_minutes as number,
    locationOrLink: (row.location_or_link as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  ...APPLICATION_PIPELINE,
  ...APPLICATION_TERMINAL_STATUSES,
];

export function createSupabaseRecruitingRepository(): RecruitingRepository &
  RecruitingDashboardReads {
  return {
    async listPublishedPostings() {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const { data } = await client
        .from("job_postings")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("published_at", { ascending: false });

      return (data ?? []).map(mapPosting);
    },

    async getPostingBySlug(slug: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data } = await client
        .from("job_postings")
        .select("*")
        .eq("slug", slug)
        .eq("status", "PUBLISHED")
        .maybeSingle();

      return data ? mapPosting(data) : undefined;
    },

    async getRequisitionById(id: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data } = await client
        .from("job_requisitions")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      return data ? mapRequisition(data) : undefined;
    },

    async getCandidateByEmail(email: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data } = await client
        .from("candidates")
        .select("*")
        .ilike("email", email.trim())
        .maybeSingle();

      return data ? mapCandidate(data) : undefined;
    },

    async listApplicationsByRequisition(requisitionId: string) {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const { data } = await client
        .from("applications")
        .select("*")
        .eq("requisition_id", requisitionId);

      return (data ?? []).map(mapApplication);
    },

    async getOfferByApplicationId(applicationId: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data } = await client
        .from("offers")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle();

      return data ? mapOffer(data) : undefined;
    },

    async countCandidates() {
      const client = getSupabaseServiceClient();
      if (!client) return 0;

      const { count } = await client
        .from("candidates")
        .select("id", { count: "exact", head: true });

      return count ?? 0;
    },

    async countOpenRequisitions() {
      const client = getSupabaseServiceClient();
      if (!client) return 0;

      const { count } = await client
        .from("job_requisitions")
        .select("id", { count: "exact", head: true })
        .in("status", ["APPROVED", "PUBLISHED"]);

      return count ?? 0;
    },

    async getApplicationPipelineCounts() {
      const counts = Object.fromEntries(
        ALL_APPLICATION_STATUSES.map((status) => [status, 0]),
      ) as Record<ApplicationStatus, number>;

      const client = getSupabaseServiceClient();
      if (!client) return counts;

      const { data } = await client.from("applications").select("status");

      for (const row of data ?? []) {
        const status = row.status as ApplicationStatus;
        counts[status] = (counts[status] ?? 0) + 1;
      }

      return counts;
    },

    async listUpcomingInterviews(limit: number) {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const { data } = await client
        .from("interviews")
        .select("*")
        .eq("status", "SCHEDULED")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(limit);

      return (data ?? []).map(mapInterview);
    },

    async listRecentHires(limit: number) {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const { data } = await client
        .from("applications")
        .select("*")
        .eq("status", "HIRED")
        .order("updated_at", { ascending: false })
        .limit(limit);

      return (data ?? []).map(mapApplication);
    },
  };
}
