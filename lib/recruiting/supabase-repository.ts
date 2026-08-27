import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type {
  CandidateApplicationSummary,
  CandidateInterviewSummary,
  CandidateListItem,
  CandidateProfile,
  CreateJobRequisitionInput,
  JobDetail,
  JobListItem,
  RecruitingApplicationWrites,
  RecruitingCandidateReads,
  RecruitingDashboardReads,
  RecruitingJobReads,
  RecruitingJobWrites,
  RecruitingPipelineWrites,
  RecruitingRepository,
  SubmitApplicationInput,
  SubmitApplicationResult,
} from "@/lib/recruiting/repository";
import {
  APPLICATION_PIPELINE,
  APPLICATION_TERMINAL_STATUSES,
  type Application,
  type ApplicationStatus,
  type Candidate,
  type CandidateDocument,
  type CandidateEducation,
  type CandidateExperience,
  type CandidateSkill,
  type Interview,
  type InterviewFeedback,
  type JobPosting,
  type JobRequisition,
  type Offer,
  type RecruitingActivity,
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

function mapExperience(row: Record<string, unknown>): CandidateExperience {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    company: row.company as string,
    title: row.title as string,
    startDate: row.start_date as string,
    endDate: (row.end_date as string) ?? undefined,
    isCurrent: Boolean(row.is_current),
    description: (row.description as string) ?? undefined,
  };
}

function mapEducation(row: Record<string, unknown>): CandidateEducation {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    institution: row.institution as string,
    degree: (row.degree as string) ?? undefined,
    fieldOfStudy: (row.field_of_study as string) ?? undefined,
    startDate: (row.start_date as string) ?? undefined,
    endDate: (row.end_date as string) ?? undefined,
  };
}

function mapSkill(row: Record<string, unknown>): CandidateSkill {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    skill: row.skill as string,
    proficiency: (row.proficiency as string) ?? undefined,
  };
}

function mapDocument(row: Record<string, unknown>): CandidateDocument {
  return {
    id: row.id as string,
    candidateId: row.candidate_id as string,
    applicationId: (row.application_id as string) ?? undefined,
    documentType: row.document_type as CandidateDocument["documentType"],
    fileName: row.file_name as string,
    storagePath: row.storage_path as string,
    uploadedAt: row.uploaded_at as string,
  };
}

function mapFeedback(row: Record<string, unknown>): InterviewFeedback {
  return {
    id: row.id as string,
    interviewId: row.interview_id as string,
    panelMemberId: row.panel_member_id as string,
    recommendation: row.recommendation as InterviewFeedback["recommendation"],
    score: (row.score as number) ?? undefined,
    strengths: (row.strengths as string) ?? undefined,
    concerns: (row.concerns as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    submittedAt: row.submitted_at as string,
  };
}

function mapActivity(row: Record<string, unknown>): RecruitingActivity {
  return {
    id: row.id as string,
    candidateId: (row.candidate_id as string) ?? undefined,
    applicationId: (row.application_id as string) ?? undefined,
    requisitionId: (row.requisition_id as string) ?? undefined,
    activityType: row.activity_type as string,
    summary: row.summary as string,
    createdByUserId: (row.created_by_user_id as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  ...APPLICATION_PIPELINE,
  ...APPLICATION_TERMINAL_STATUSES,
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createSupabaseRecruitingRepository(): RecruitingRepository &
  RecruitingDashboardReads &
  RecruitingCandidateReads &
  RecruitingJobReads &
  RecruitingJobWrites &
  RecruitingApplicationWrites &
  RecruitingPipelineWrites {
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

    async listCandidateSummaries() {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const [
        { data: candidateRows },
        { data: applicationRows },
        { data: postingRows },
      ] = await Promise.all([
        client.from("candidates").select("*"),
        client.from("applications").select("*"),
        client.from("job_postings").select("id, title, location_name"),
      ]);

      const postingById = new Map(
        (postingRows ?? []).map((row) => [row.id as string, row]),
      );

      const latestApplicationByCandidate = new Map<
        string,
        Record<string, unknown>
      >();
      for (const row of applicationRows ?? []) {
        const candidateId = row.candidate_id as string;
        const existing = latestApplicationByCandidate.get(candidateId);
        if (
          !existing ||
          new Date(row.applied_at as string) >
            new Date(existing.applied_at as string)
        ) {
          latestApplicationByCandidate.set(candidateId, row);
        }
      }

      return (candidateRows ?? []).map((row): CandidateListItem => {
        const candidate = mapCandidate(row);
        const application = latestApplicationByCandidate.get(candidate.id);
        const posting = application
          ? postingById.get(application.posting_id as string)
          : undefined;

        return {
          candidateId: candidate.id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          role: (posting?.title as string) ?? "—",
          requisitionId: application?.requisition_id as string | undefined,
          applicationNumber:
            (application?.application_number as string) ?? "—",
          stage: (application?.status as ApplicationStatus) ?? undefined,
          location: (posting?.location_name as string) ?? "—",
          source: candidate.source,
          workAuthorization: candidate.workAuthorization,
          appliedAt: application?.applied_at as string | undefined,
          lastActivityAt:
            (application?.updated_at as string) ?? candidate.updatedAt,
        };
      });
    },

    async getCandidateProfile(candidateId: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data: candidateRow } = await client
        .from("candidates")
        .select("*")
        .eq("id", candidateId)
        .maybeSingle();

      if (!candidateRow) return undefined;

      const [
        { data: applicationRows },
        { data: experienceRows },
        { data: educationRows },
        { data: skillRows },
        { data: documentRows },
        { data: activityRows },
      ] = await Promise.all([
        client.from("applications").select("*").eq("candidate_id", candidateId),
        client
          .from("candidate_experience")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("start_date", { ascending: false }),
        client
          .from("candidate_education")
          .select("*")
          .eq("candidate_id", candidateId),
        client.from("candidate_skills").select("*").eq("candidate_id", candidateId),
        client
          .from("candidate_documents")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("uploaded_at", { ascending: false }),
        client
          .from("recruiting_activities")
          .select("*")
          .eq("candidate_id", candidateId)
          .order("created_at", { ascending: false }),
      ]);

      const applicationIds = (applicationRows ?? []).map(
        (row) => row.id as string,
      );
      const requisitionIds = [
        ...new Set((applicationRows ?? []).map((row) => row.requisition_id as string)),
      ];
      const postingIds = [
        ...new Set((applicationRows ?? []).map((row) => row.posting_id as string)),
      ];

      const [
        { data: requisitionRows },
        { data: postingRows },
        { data: interviewRows },
      ] = await Promise.all([
        requisitionIds.length
          ? client
              .from("job_requisitions")
              .select("id, title, requisition_number")
              .in("id", requisitionIds)
          : Promise.resolve({ data: [] as Record<string, unknown>[] }),
        postingIds.length
          ? client
              .from("job_postings")
              .select("id, location_name")
              .in("id", postingIds)
          : Promise.resolve({ data: [] as Record<string, unknown>[] }),
        applicationIds.length
          ? client.from("interviews").select("*").in("application_id", applicationIds)
          : Promise.resolve({ data: [] as Record<string, unknown>[] }),
      ]);

      const requisitionById = new Map(
        (requisitionRows ?? []).map((row) => [row.id as string, row]),
      );
      const postingById = new Map(
        (postingRows ?? []).map((row) => [row.id as string, row]),
      );
      const applicationById = new Map(
        (applicationRows ?? []).map((row) => [row.id as string, row]),
      );

      const applications: CandidateApplicationSummary[] = (
        applicationRows ?? []
      ).map((row) => {
        const requisition = requisitionById.get(row.requisition_id as string);
        const posting = postingById.get(row.posting_id as string);
        return {
          applicationId: row.id as string,
          applicationNumber: row.application_number as string,
          requisitionId: row.requisition_id as string,
          requisitionTitle: (requisition?.title as string) ?? "—",
          requisitionNumber:
            (requisition?.requisition_number as string) ?? "—",
          postingLocation: (posting?.location_name as string) ?? "—",
          status: row.status as ApplicationStatus,
          appliedAt: row.applied_at as string,
          updatedAt: row.updated_at as string,
        };
      });

      const interviews: CandidateInterviewSummary[] = (interviewRows ?? []).map(
        (row) => {
          const application = applicationById.get(row.application_id as string);
          const requisition = application
            ? requisitionById.get(application.requisition_id as string)
            : undefined;
          return {
            ...mapInterview(row),
            applicationNumber:
              (application?.application_number as string) ?? "—",
            requisitionTitle: (requisition?.title as string) ?? "—",
          };
        },
      );

      const interviewIds = interviews.map((interview) => interview.id);
      const { data: feedbackRows } = interviewIds.length
        ? await client.from("interview_feedback").select("*").in(
            "interview_id",
            interviewIds,
          )
        : { data: [] as Record<string, unknown>[] };

      const profile: CandidateProfile = {
        candidate: mapCandidate(candidateRow),
        applications,
        experience: (experienceRows ?? []).map(mapExperience),
        education: (educationRows ?? []).map(mapEducation),
        skills: (skillRows ?? []).map(mapSkill),
        documents: (documentRows ?? []).map(mapDocument),
        interviews,
        feedback: (feedbackRows ?? []).map(mapFeedback),
        activities: (activityRows ?? []).map(mapActivity),
      };

      return profile;
    },

    async listJobSummaries(): Promise<JobListItem[]> {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const [
        { data: requisitionRows },
        { data: departmentRows },
        { data: locationRows },
        { data: applicationRows },
      ] = await Promise.all([
        client.from("job_requisitions").select("*"),
        client.from("departments").select("id, name"),
        client.from("locations").select("id, name"),
        client.from("applications").select("requisition_id"),
      ]);

      const departmentById = new Map(
        (departmentRows ?? []).map((row) => [row.id as string, row.name as string]),
      );
      const locationById = new Map(
        (locationRows ?? []).map((row) => [row.id as string, row.name as string]),
      );
      const candidateCountByRequisition = new Map<string, number>();
      for (const row of applicationRows ?? []) {
        const id = row.requisition_id as string;
        candidateCountByRequisition.set(
          id,
          (candidateCountByRequisition.get(id) ?? 0) + 1,
        );
      }

      return (requisitionRows ?? [])
        .map((row): JobListItem => {
          const requisition = mapRequisition(row);
          return {
            requisitionId: requisition.id,
            requisitionNumber: requisition.requisitionNumber,
            title: requisition.title,
            departmentName: departmentById.get(requisition.departmentId) ?? "—",
            locationName: locationById.get(requisition.locationId) ?? "—",
            workplaceType: requisition.workplaceType,
            employmentType: requisition.employmentType,
            status: requisition.status,
            candidateCount: candidateCountByRequisition.get(requisition.id) ?? 0,
            updatedAt: requisition.updatedAt,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    },

    async getJobDetail(requisitionId: string): Promise<JobDetail | undefined> {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data: requisitionRow } = await client
        .from("job_requisitions")
        .select("*")
        .eq("id", requisitionId)
        .maybeSingle();
      if (!requisitionRow) return undefined;

      const requisition = mapRequisition(requisitionRow);

      const [
        { data: departmentRow },
        { data: locationRow },
        { data: postingRow },
        { data: applicationRows },
      ] = await Promise.all([
        client
          .from("departments")
          .select("name")
          .eq("id", requisition.departmentId)
          .maybeSingle(),
        client
          .from("locations")
          .select("name")
          .eq("id", requisition.locationId)
          .maybeSingle(),
        client
          .from("job_postings")
          .select("slug, status")
          .eq("requisition_id", requisitionId)
          .maybeSingle(),
        client
          .from("applications")
          .select("status")
          .eq("requisition_id", requisitionId),
      ]);

      const pipelineCounts = Object.fromEntries(
        ALL_APPLICATION_STATUSES.map((status) => [status, 0]),
      ) as Record<ApplicationStatus, number>;
      for (const row of applicationRows ?? []) {
        const status = row.status as ApplicationStatus;
        pipelineCounts[status] = (pipelineCounts[status] ?? 0) + 1;
      }

      return {
        requisition,
        departmentName: (departmentRow?.name as string) ?? "—",
        locationName: (locationRow?.name as string) ?? "—",
        postingSlug:
          postingRow?.status === "PUBLISHED"
            ? (postingRow.slug as string)
            : undefined,
        candidateCount: (applicationRows ?? []).length,
        pipelineCounts,
      };
    },

    async createJobRequisition(input: CreateJobRequisitionInput) {
      const client = getSupabaseServiceClient();
      if (!client) {
        throw new Error("Supabase is not configured");
      }

      const now = new Date().toISOString();
      const requisitionId = `req-${crypto.randomUUID()}`;
      const requisitionNumber = `REQ-${new Date().getFullYear()}-${crypto
        .randomUUID()
        .slice(0, 4)
        .toUpperCase()}`;

      await client.from("job_requisitions").insert({
        id: requisitionId,
        requisition_number: requisitionNumber,
        title: input.title,
        department_id: input.departmentId,
        position_id: input.positionId,
        location_id: input.locationId,
        hiring_manager_user_id: input.hiringManagerUserId,
        recruiter_user_id: input.recruiterUserId,
        employment_type: input.employmentType,
        workplace_type: input.workplaceType,
        career_area: input.careerArea,
        openings: input.openings,
        salary_min: input.salaryMin,
        salary_max: input.salaryMax,
        currency: "USD",
        description: input.description,
        responsibilities: input.responsibilities,
        qualifications: input.qualifications,
        preferred_qualifications: input.preferredQualifications,
        status: input.publishNow ? "PUBLISHED" : "DRAFT",
        created_at: now,
        updated_at: now,
      });

      let postingSlug: string | undefined;
      if (input.publishNow) {
        postingSlug = await insertPosting(client, {
          requisitionId,
          title: input.title,
          careerArea: input.careerArea,
          departmentName: input.departmentName,
          locationName: input.locationName,
          workplaceType: input.workplaceType,
          employmentType: input.employmentType,
          description: input.description,
          responsibilities: input.responsibilities,
          qualifications: input.qualifications,
          preferredQualifications: input.preferredQualifications,
        });
      }

      return { requisitionId, postingSlug };
    },

    async publishJobRequisition(requisitionId: string) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const now = new Date().toISOString();

      const { data: requisitionRow } = await client
        .from("job_requisitions")
        .select("*")
        .eq("id", requisitionId)
        .maybeSingle();
      if (!requisitionRow) return undefined;

      await client
        .from("job_requisitions")
        .update({ status: "PUBLISHED", updated_at: now })
        .eq("id", requisitionId);

      const { data: existingPosting } = await client
        .from("job_postings")
        .select("slug")
        .eq("requisition_id", requisitionId)
        .maybeSingle();

      if (existingPosting) {
        await client
          .from("job_postings")
          .update({ status: "PUBLISHED", published_at: now, updated_at: now })
          .eq("requisition_id", requisitionId);
        return { postingSlug: existingPosting.slug as string };
      }

      const requisition = mapRequisition(requisitionRow);
      const [{ data: departmentRow }, { data: locationRow }] =
        await Promise.all([
          client
            .from("departments")
            .select("name")
            .eq("id", requisition.departmentId)
            .maybeSingle(),
          client
            .from("locations")
            .select("name")
            .eq("id", requisition.locationId)
            .maybeSingle(),
        ]);

      const postingSlug = await insertPosting(client, {
        requisitionId,
        title: requisition.title,
        careerArea: requisition.careerArea,
        departmentName: (departmentRow?.name as string) ?? "—",
        locationName: (locationRow?.name as string) ?? "—",
        workplaceType: requisition.workplaceType,
        employmentType: requisition.employmentType,
        description: requisition.description,
        responsibilities: requisition.responsibilities,
        qualifications: requisition.qualifications,
        preferredQualifications: requisition.preferredQualifications,
      });

      return { postingSlug };
    },

    async submitApplication(
      input: SubmitApplicationInput,
    ): Promise<SubmitApplicationResult> {
      const client = getSupabaseServiceClient();
      if (!client) {
        throw new Error("Supabase is not configured");
      }

      const now = new Date().toISOString();
      const normalizedEmail = input.email.trim().toLowerCase();

      const { data: existingCandidateRow } = await client
        .from("candidates")
        .select("id")
        .ilike("email", normalizedEmail)
        .maybeSingle();

      let candidateId = existingCandidateRow?.id as string | undefined;
      if (!candidateId) {
        candidateId = `cand-${crypto.randomUUID()}`;
        await client.from("candidates").insert({
          id: candidateId,
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          phone: input.phone,
          linkedin_url: input.linkedinUrl,
          portfolio_url: input.portfolioUrl,
          work_authorization: input.workAuthorization,
          willing_to_relocate: input.willingToRelocate,
          source: input.source,
          created_at: now,
          updated_at: now,
        });
      }

      const { data: existingApplicationRow } = await client
        .from("applications")
        .select("id, application_number")
        .eq("candidate_id", candidateId)
        .eq("requisition_id", input.requisitionId)
        .maybeSingle();

      if (existingApplicationRow) {
        return {
          candidateId,
          applicationId: existingApplicationRow.id as string,
          applicationNumber: existingApplicationRow.application_number as string,
        };
      }

      const applicationId = `app-${crypto.randomUUID()}`;
      const applicationNumber = `APP-${new Date().getFullYear()}-${crypto
        .randomUUID()
        .slice(0, 4)
        .toUpperCase()}`;

      await client.from("applications").insert({
        id: applicationId,
        application_number: applicationNumber,
        candidate_id: candidateId,
        requisition_id: input.requisitionId,
        posting_id: input.postingId,
        status: "APPLIED",
        cover_letter: input.coverLetter,
        additional_information: input.additionalInformation,
        applied_at: now,
        updated_at: now,
      });

      await client.from("recruiting_activities").insert({
        id: `act-${crypto.randomUUID()}`,
        candidate_id: candidateId,
        application_id: applicationId,
        requisition_id: input.requisitionId,
        activity_type: "APPLICATION_SUBMITTED",
        summary: "Application submitted",
        created_at: now,
      });

      return { candidateId, applicationId, applicationNumber };
    },

    async updateApplicationStage(applicationId, status) {
      const client = getSupabaseServiceClient();
      if (!client) return;

      const { data: applicationRow } = await client
        .from("applications")
        .select("candidate_id, requisition_id, status")
        .eq("id", applicationId)
        .maybeSingle();
      if (!applicationRow) return;

      const now = new Date().toISOString();
      const previousStatus = applicationRow.status as string;

      await client
        .from("applications")
        .update({ status, updated_at: now })
        .eq("id", applicationId);

      await client.from("recruiting_activities").insert({
        id: `act-${crypto.randomUUID()}`,
        candidate_id: applicationRow.candidate_id,
        application_id: applicationId,
        requisition_id: applicationRow.requisition_id,
        activity_type: "STAGE_CHANGED",
        summary: `Stage changed: ${previousStatus} → ${status}`,
        created_at: now,
      });
    },
  };
}

async function insertPosting(
  client: NonNullable<ReturnType<typeof getSupabaseServiceClient>>,
  posting: {
    requisitionId: string;
    title: string;
    careerArea: string;
    departmentName: string;
    locationName: string;
    workplaceType: string;
    employmentType: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    preferredQualifications: string[];
  },
): Promise<string> {
  const now = new Date().toISOString();
  const baseSlug = slugify(posting.title);

  let slug = baseSlug;
  let suffix = 2;
  for (;;) {
    const { data: collision } = await client
      .from("job_postings")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!collision) break;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  await client.from("job_postings").insert({
    id: `post-${posting.requisitionId}`,
    requisition_id: posting.requisitionId,
    slug,
    title: posting.title,
    summary: posting.description,
    description: posting.description,
    career_area: posting.careerArea,
    department_name: posting.departmentName,
    location_name: posting.locationName,
    workplace_type: posting.workplaceType,
    employment_type: posting.employmentType,
    responsibilities: posting.responsibilities,
    qualifications: posting.qualifications,
    preferred_qualifications: posting.preferredQualifications,
    status: "PUBLISHED",
    published_at: now,
    is_demo: false,
    created_at: now,
    updated_at: now,
  });

  return slug;
}
