import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  seedDepartments,
  seedLocations,
  seedPostings,
  seedRequisitions,
} from "@/data/recruiting/seed";
import { createSupabaseRecruitingRepository } from "@/lib/recruiting/supabase-repository";
import type {
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
  type JobPosting,
  type JobRequisition,
  type Offer,
  type RecruitingActivity,
} from "@/types/recruiting";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * In-memory recruiting repository. Fully functional (including writes) so
 * the whole requisition -> publish -> apply -> ATS loop can be exercised
 * locally without a Supabase project - not just a read-only stub.
 */
export function createMemoryRecruitingRepository(): RecruitingRepository &
  RecruitingDashboardReads &
  RecruitingCandidateReads &
  RecruitingJobReads &
  RecruitingJobWrites &
  RecruitingApplicationWrites &
  RecruitingPipelineWrites {
  const postings = [...seedPostings];
  const requisitions = [...seedRequisitions];
  const candidates: Candidate[] = [];
  const applications: Application[] = [];
  const offers: Offer[] = [];
  const activities: RecruitingActivity[] = [];

  function departmentName(departmentId: string): string {
    return (
      seedDepartments.find((d) => d.id === departmentId)?.name ?? "—"
    );
  }

  function locationName(locationId: string): string {
    return seedLocations.find((l) => l.id === locationId)?.name ?? "—";
  }

  function candidateCountFor(requisitionId: string): number {
    return applications.filter((a) => a.requisitionId === requisitionId)
      .length;
  }

  return {
    async listPublishedPostings() {
      return postings
        .filter((posting) => posting.status === "PUBLISHED")
        .sort((a, b) => {
          const aDate = a.publishedAt ?? a.createdAt;
          const bDate = b.publishedAt ?? b.createdAt;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
    },

    async getPostingBySlug(slug: string) {
      return postings.find(
        (posting) =>
          posting.slug === slug && posting.status === "PUBLISHED",
      );
    },

    async getRequisitionById(id: string) {
      return requisitions.find((requisition) => requisition.id === id);
    },

    async getCandidateByEmail(email: string) {
      const normalized = email.trim().toLowerCase();
      return candidates.find(
        (candidate) => candidate.email.toLowerCase() === normalized,
      );
    },

    async listApplicationsByRequisition(requisitionId: string) {
      return applications.filter(
        (application) => application.requisitionId === requisitionId,
      );
    },

    async getOfferByApplicationId(applicationId: string) {
      return offers.find((offer) => offer.applicationId === applicationId);
    },

    async countCandidates() {
      return candidates.length;
    },

    async countOpenRequisitions() {
      return requisitions.filter((r) =>
        ["APPROVED", "PUBLISHED"].includes(r.status),
      ).length;
    },

    async getApplicationPipelineCounts() {
      const counts = Object.fromEntries(
        [...APPLICATION_PIPELINE, ...APPLICATION_TERMINAL_STATUSES].map(
          (status) => [status, 0],
        ),
      ) as Record<ApplicationStatus, number>;

      for (const application of applications) {
        counts[application.status] = (counts[application.status] ?? 0) + 1;
      }

      return counts;
    },

    async listUpcomingInterviews() {
      return [];
    },

    async listRecentHires(limit: number) {
      return applications
        .filter((a) => a.status === "HIRED")
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, limit);
    },

    async listCandidateSummaries(): Promise<CandidateListItem[]> {
      const latestByCandidate = new Map<string, Application>();
      for (const application of applications) {
        const existing = latestByCandidate.get(application.candidateId);
        if (
          !existing ||
          new Date(application.appliedAt) > new Date(existing.appliedAt)
        ) {
          latestByCandidate.set(application.candidateId, application);
        }
      }

      return candidates.map((candidate) => {
        const application = latestByCandidate.get(candidate.id);
        const posting = application
          ? postings.find((p) => p.id === application.postingId)
          : undefined;

        return {
          candidateId: candidate.id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          role: posting?.title ?? "—",
          requisitionId: application?.requisitionId,
          applicationNumber: application?.applicationNumber ?? "—",
          stage: application?.status,
          location: posting?.locationName ?? "—",
          source: candidate.source,
          workAuthorization: candidate.workAuthorization,
          appliedAt: application?.appliedAt,
          lastActivityAt: application?.updatedAt ?? candidate.updatedAt,
        };
      });
    },

    async getCandidateProfile(
      candidateId: string,
    ): Promise<CandidateProfile | undefined> {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) return undefined;

      const candidateApplications = applications.filter(
        (a) => a.candidateId === candidateId,
      );

      return {
        candidate,
        applications: candidateApplications.map((application) => {
          const requisition = requisitions.find(
            (r) => r.id === application.requisitionId,
          );
          const posting = postings.find(
            (p) => p.id === application.postingId,
          );
          return {
            applicationId: application.id,
            applicationNumber: application.applicationNumber,
            requisitionId: application.requisitionId,
            requisitionTitle: requisition?.title ?? posting?.title ?? "—",
            requisitionNumber: requisition?.requisitionNumber ?? "—",
            postingLocation: posting?.locationName ?? "—",
            status: application.status,
            appliedAt: application.appliedAt,
            updatedAt: application.updatedAt,
          };
        }),
        experience: [],
        education: [],
        skills: [],
        documents: [],
        interviews: [],
        feedback: [],
        activities: activities
          .filter((a) => a.candidateId === candidateId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
      };
    },

    async listJobSummaries(): Promise<JobListItem[]> {
      return requisitions
        .map((requisition) => ({
          requisitionId: requisition.id,
          requisitionNumber: requisition.requisitionNumber,
          title: requisition.title,
          departmentName: departmentName(requisition.departmentId),
          locationName: locationName(requisition.locationId),
          workplaceType: requisition.workplaceType,
          employmentType: requisition.employmentType,
          status: requisition.status,
          candidateCount: candidateCountFor(requisition.id),
          updatedAt: requisition.updatedAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    },

    async getJobDetail(requisitionId: string): Promise<JobDetail | undefined> {
      const requisition = requisitions.find((r) => r.id === requisitionId);
      if (!requisition) return undefined;

      const posting = postings.find(
        (p) => p.requisitionId === requisitionId,
      );

      const pipelineCounts = Object.fromEntries(
        [...APPLICATION_PIPELINE, ...APPLICATION_TERMINAL_STATUSES].map(
          (status) => [status, 0],
        ),
      ) as Record<ApplicationStatus, number>;

      for (const application of applications) {
        if (application.requisitionId !== requisitionId) continue;
        pipelineCounts[application.status] =
          (pipelineCounts[application.status] ?? 0) + 1;
      }

      return {
        requisition,
        departmentName: departmentName(requisition.departmentId),
        locationName: locationName(requisition.locationId),
        postingSlug: posting?.status === "PUBLISHED" ? posting.slug : undefined,
        candidateCount: candidateCountFor(requisitionId),
        pipelineCounts,
      };
    },

    async createJobRequisition(input: CreateJobRequisitionInput) {
      const now = new Date().toISOString();
      const requisitionId = `req-${crypto.randomUUID()}`;
      const requisitionNumber = `REQ-${new Date().getFullYear()}-${String(
        requisitions.length + 1,
      ).padStart(4, "0")}`;

      const requisition: JobRequisition = {
        id: requisitionId,
        requisitionNumber,
        title: input.title,
        departmentId: input.departmentId,
        positionId: input.positionId,
        locationId: input.locationId,
        hiringManagerUserId: input.hiringManagerUserId,
        recruiterUserId: input.recruiterUserId,
        employmentType: input.employmentType,
        workplaceType: input.workplaceType,
        careerArea: input.careerArea,
        openings: input.openings,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: "USD",
        description: input.description,
        responsibilities: input.responsibilities,
        qualifications: input.qualifications,
        preferredQualifications: input.preferredQualifications,
        status: input.publishNow ? "PUBLISHED" : "DRAFT",
        createdAt: now,
        updatedAt: now,
      };
      requisitions.push(requisition);

      let postingSlug: string | undefined;
      if (input.publishNow) {
        postingSlug = createPostingFor(requisition, input);
      }

      return { requisitionId, postingSlug };
    },

    async publishJobRequisition(requisitionId: string) {
      const requisition = requisitions.find((r) => r.id === requisitionId);
      if (!requisition) return undefined;

      requisition.status = "PUBLISHED";
      requisition.updatedAt = new Date().toISOString();

      const existingPosting = postings.find(
        (p) => p.requisitionId === requisitionId,
      );
      if (existingPosting) {
        existingPosting.status = "PUBLISHED";
        existingPosting.publishedAt = requisition.updatedAt;
        existingPosting.updatedAt = requisition.updatedAt;
        return { postingSlug: existingPosting.slug };
      }

      const postingSlug = createPostingFor(requisition, {
        departmentName: departmentName(requisition.departmentId),
        locationName: locationName(requisition.locationId),
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
      const now = new Date().toISOString();
      const normalizedEmail = input.email.trim().toLowerCase();

      let candidate = candidates.find(
        (c) => c.email.toLowerCase() === normalizedEmail,
      );
      if (!candidate) {
        candidate = {
          id: `cand-${crypto.randomUUID()}`,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          linkedinUrl: input.linkedinUrl,
          portfolioUrl: input.portfolioUrl,
          workAuthorization: input.workAuthorization,
          willingToRelocate: input.willingToRelocate,
          source: input.source,
          createdAt: now,
          updatedAt: now,
        };
        candidates.push(candidate);
      }

      const existingApplication = applications.find(
        (a) =>
          a.candidateId === candidate!.id &&
          a.requisitionId === input.requisitionId,
      );
      if (existingApplication) {
        return {
          candidateId: candidate.id,
          applicationId: existingApplication.id,
          applicationNumber: existingApplication.applicationNumber,
        };
      }

      const applicationId = `app-${crypto.randomUUID()}`;
      const applicationNumber = `APP-${new Date().getFullYear()}-${String(
        applications.length + 1,
      ).padStart(4, "0")}`;

      const application: Application = {
        id: applicationId,
        applicationNumber,
        candidateId: candidate.id,
        requisitionId: input.requisitionId,
        postingId: input.postingId,
        status: "APPLIED",
        coverLetter: input.coverLetter,
        additionalInformation: input.additionalInformation,
        appliedAt: now,
        updatedAt: now,
      };
      applications.push(application);

      activities.push({
        id: `act-${crypto.randomUUID()}`,
        candidateId: candidate.id,
        applicationId,
        requisitionId: input.requisitionId,
        activityType: "APPLICATION_SUBMITTED",
        summary: "Application submitted",
        createdAt: now,
      });

      return {
        candidateId: candidate.id,
        applicationId,
        applicationNumber,
      };
    },

    async updateApplicationStage(applicationId, status) {
      const application = applications.find((a) => a.id === applicationId);
      if (!application) return;

      const now = new Date().toISOString();
      const previousStatus = application.status;
      application.status = status;
      application.updatedAt = now;

      activities.push({
        id: `act-${crypto.randomUUID()}`,
        candidateId: application.candidateId,
        applicationId: application.id,
        requisitionId: application.requisitionId,
        activityType: "STAGE_CHANGED",
        summary: `Stage changed: ${previousStatus} → ${status}`,
        createdAt: now,
      });
    },
  };

  function createPostingFor(
    requisition: JobRequisition,
    content: {
      departmentName: string;
      locationName: string;
      description: string;
      responsibilities: string[];
      qualifications: string[];
      preferredQualifications: string[];
    },
  ): string {
    const now = new Date().toISOString();
    const baseSlug = slugify(requisition.title);
    let slug = baseSlug;
    let suffix = 2;
    while (postings.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const posting: JobPosting = {
      id: `post-${requisition.id}`,
      requisitionId: requisition.id,
      slug,
      title: requisition.title,
      summary: content.description,
      description: content.description,
      careerArea: requisition.careerArea,
      departmentName: content.departmentName,
      locationName: content.locationName,
      workplaceType: requisition.workplaceType,
      employmentType: requisition.employmentType,
      responsibilities: content.responsibilities,
      qualifications: content.qualifications,
      preferredQualifications: content.preferredQualifications,
      status: "PUBLISHED",
      publishedAt: now,
      isDemo: false,
      createdAt: now,
      updatedAt: now,
    };
    postings.push(posting);
    return slug;
  }
}

export const recruitingRepository: RecruitingRepository &
  RecruitingDashboardReads &
  RecruitingCandidateReads &
  RecruitingJobReads &
  RecruitingJobWrites &
  RecruitingApplicationWrites &
  RecruitingPipelineWrites = isSupabaseConfigured()
  ? createSupabaseRecruitingRepository()
  : createMemoryRecruitingRepository();

export async function listPublishedPostings(): Promise<JobPosting[]> {
  return recruitingRepository.listPublishedPostings();
}

export async function getPostingBySlug(
  slug: string,
): Promise<JobPosting | undefined> {
  return recruitingRepository.getPostingBySlug(slug);
}

export async function getRequisitionById(
  id: string,
): Promise<JobRequisition | undefined> {
  return recruitingRepository.getRequisitionById(id);
}
