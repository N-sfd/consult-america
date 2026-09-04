import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type {
  Application,
  ApplicationStatus,
  CandidateProfile,
  Document,
  Education,
  Experience,
  CandidateSkill,
  CareerArea,
  Interview,
  InterviewFeedback,
  Job,
  JobRequisition,
  Offer,
  OfferStatus,
  RecruitingActivity,
  RequisitionStatus,
} from "@/types/recruiting";

export type RecruitingRepository = {
  listPublishedPostings(): Promise<Job[]>;
  getPostingBySlug(slug: string): Promise<Job | undefined>;
  getRequisitionById(id: string): Promise<JobRequisition | undefined>;
  getCandidateByEmail(email: string): Promise<CandidateProfile | undefined>;
  listApplicationsByRequisition(
    requisitionId: string,
  ): Promise<Application[]>;
  getApplicationById(applicationId: string): Promise<Application | undefined>;
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

/** One row in the recruiting/candidates list — one row per candidate, keyed to their most recent application. */
export type CandidateListItem = {
  candidateId: string;
  name: string;
  email: string;
  role: string;
  requisitionId?: string;
  applicationNumber: string;
  stage?: ApplicationStatus;
  location: string;
  source?: string;
  workAuthorization?: string;
  appliedAt?: string;
  lastActivityAt: string;
};

export type CandidateApplicationSummary = {
  applicationId: string;
  applicationNumber: string;
  requisitionId: string;
  requisitionTitle: string;
  requisitionNumber: string;
  postingLocation: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
};

export type CandidateInterviewSummary = Interview & {
  applicationNumber: string;
  requisitionTitle: string;
};

/**
 * Full aggregate read for one candidate — candidate record plus everything
 * that hangs off it. Named `...Detail` to avoid colliding with the
 * `CandidateProfile` entity type (the `candidate_profiles` row itself).
 */
export type CandidateProfileDetail = {
  candidate: CandidateProfile;
  applications: CandidateApplicationSummary[];
  experience: Experience[];
  education: Education[];
  skills: CandidateSkill[];
  documents: Document[];
  interviews: CandidateInterviewSummary[];
  feedback: InterviewFeedback[];
  activities: RecruitingActivity[];
};

/** Candidate list/profile reads backing the ATS (Recruiting > Candidates). */
export type RecruitingCandidateReads = {
  listCandidateSummaries(): Promise<CandidateListItem[]>;
  getCandidateProfile(candidateId: string): Promise<CandidateProfileDetail | undefined>;
};

export type UpdateCandidateContactInfoInput = {
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: boolean;
};

/** Write backing the Candidate Portal's own-profile contact info edit. */
export type RecruitingCandidateSelfWrites = {
  updateCandidateContactInfo(
    candidateId: string,
    input: UpdateCandidateContactInfoInput,
  ): Promise<CandidateProfile>;
};

/** One row in the recruiting/jobs list. */
export type JobListItem = {
  requisitionId: string;
  requisitionNumber: string;
  title: string;
  departmentName: string;
  locationName: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  status: RequisitionStatus;
  candidateCount: number;
  updatedAt: string;
};

export type JobDetail = {
  requisition: JobRequisition;
  departmentName: string;
  locationName: string;
  postingSlug?: string;
  candidateCount: number;
  pipelineCounts: Record<ApplicationStatus, number>;
};

export type CreateJobRequisitionInput = {
  title: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  locationId: string;
  locationName: string;
  hiringManagerUserId?: string;
  recruiterUserId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  careerArea: CareerArea;
  openings: number;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications: string[];
  publishNow: boolean;
};

/** Reads backing the ATS Jobs / Requisitions workspace. */
export type RecruitingJobReads = {
  listJobSummaries(): Promise<JobListItem[]>;
  getJobDetail(requisitionId: string): Promise<JobDetail | undefined>;
};

/** Writes backing requisition creation/publishing from the ATS. */
export type RecruitingJobWrites = {
  createJobRequisition(
    input: CreateJobRequisitionInput,
  ): Promise<{ requisitionId: string; postingSlug?: string }>;
  publishJobRequisition(
    requisitionId: string,
  ): Promise<{ postingSlug: string } | undefined>;
};

export type SubmitApplicationInput = {
  requisitionId: string;
  postingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: boolean;
  coverLetter?: string;
  additionalInformation?: string;
  source?: string;
};

export type SubmitApplicationResult = {
  candidateId: string;
  applicationId: string;
  applicationNumber: string;
};

/** Writes backing the public "Apply" flow (candidate + application creation). */
export type RecruitingApplicationWrites = {
  submitApplication(
    input: SubmitApplicationInput,
  ): Promise<SubmitApplicationResult>;
};

/** Writes backing the ATS pipeline board ("Move to Stage"). */
export type RecruitingPipelineWrites = {
  updateApplicationStage(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<void>;
};

export type CreateOfferInput = {
  applicationId: string;
  baseSalary?: number;
  hourlyRate?: number;
  currency?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  expirationDate?: string;
  termsSummary?: string;
};

/** Writes backing offer extension/acceptance from the ATS pipeline. */
export type RecruitingOfferWrites = {
  createOffer(input: CreateOfferInput): Promise<Offer>;
  updateOfferStatus(
    offerId: string,
    status: OfferStatus,
  ): Promise<Offer | undefined>;
};

/**
 * Hire conversion contract. Implementations must create/reuse an
 * employee_profiles row linked back to candidate_profiles via candidateId —
 * never a disconnected employee record.
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
