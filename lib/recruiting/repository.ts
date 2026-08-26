import type {
  Application,
  ApplicationStatus,
  Candidate,
  Interview,
  JobPosting,
  JobRequisition,
  Offer,
} from "@/types/recruiting";

export type RecruitingRepository = {
  listPublishedPostings(): Promise<JobPosting[]>;
  getPostingBySlug(slug: string): Promise<JobPosting | undefined>;
  getRequisitionById(id: string): Promise<JobRequisition | undefined>;
  getCandidateByEmail(email: string): Promise<Candidate | undefined>;
  listApplicationsByRequisition(
    requisitionId: string,
  ): Promise<Application[]>;
  getOfferByApplicationId(
    applicationId: string,
  ): Promise<Offer | undefined>;
};

/**
 * Aggregate reads for the Workforce App dashboard. Kept separate from the
 * core `RecruitingRepository` interface (which mirrors the public jobs
 * flow) so callers that only need postings/requisitions aren't forced to
 * implement dashboard-specific aggregation.
 */
export type RecruitingDashboardReads = {
  countCandidates(): Promise<number>;
  countOpenRequisitions(): Promise<number>;
  getApplicationPipelineCounts(): Promise<Record<ApplicationStatus, number>>;
  listUpcomingInterviews(limit: number): Promise<Interview[]>;
  listRecentHires(limit: number): Promise<Application[]>;
};

/**
 * Future hire conversion contract (Phase 2I → Phase 3).
 * Implementations must create/reuse Person + Employee + Assignment.
 */
export type HireConversionInput = {
  applicationId: string;
  offerId: string;
  startDate: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
};

export type HireConversionResult = {
  personId: string;
  employeeId: string;
  employeeNumber: string;
  assignmentId: string;
  onboardingId: string;
};

export type HireConversionService = {
  convertAcceptedOffer(
    input: HireConversionInput,
  ): Promise<HireConversionResult>;
};
