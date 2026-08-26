import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  seedPostings,
  seedRequisitions,
} from "@/data/recruiting/seed";
import { createSupabaseRecruitingRepository } from "@/lib/recruiting/supabase-repository";
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
  type JobPosting,
  type JobRequisition,
  type Offer,
} from "@/types/recruiting";

/**
 * In-memory recruiting repository for Phase 2A.
 * Replace with database-backed implementation in Phase 2B+ without changing callers.
 */
export function createMemoryRecruitingRepository(): RecruitingRepository {
  const postings = [...seedPostings];
  const requisitions = [...seedRequisitions];
  const candidates: Candidate[] = [];
  const applications: Application[] = [];
  const offers: Offer[] = [];

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
  };
}

/**
 * The memory repository's candidates/applications/offers are always empty
 * (Phase 2A never wrote to them), so these dashboard-read implementations
 * are exact, not approximations — they just mirror that emptiness in the
 * shape the Workforce App dashboard expects.
 */
function withEmptyDashboardReads(
  repository: RecruitingRepository,
): RecruitingRepository & RecruitingDashboardReads {
  return {
    ...repository,
    async countCandidates() {
      return 0;
    },
    async countOpenRequisitions() {
      return 0;
    },
    async getApplicationPipelineCounts() {
      return Object.fromEntries(
        [...APPLICATION_PIPELINE, ...APPLICATION_TERMINAL_STATUSES].map(
          (status) => [status, 0],
        ),
      ) as Record<ApplicationStatus, number>;
    },
    async listUpcomingInterviews() {
      return [];
    },
    async listRecentHires() {
      return [];
    },
  };
}

export const recruitingRepository: RecruitingRepository &
  RecruitingDashboardReads = isSupabaseConfigured()
  ? createSupabaseRecruitingRepository()
  : withEmptyDashboardReads(createMemoryRecruitingRepository());

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
