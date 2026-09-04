/**
 * Recruiting / ATS domain model.
 *
 * Architectural rule:
 * Supabase Auth User → profiles → candidate_profiles → applications → jobs
 * On hire: candidate_profiles → employee_profiles (types/hr.ts), never a
 * disconnected employee record — see lib/hr/index.ts::convertAcceptedOfferToEmployee.
 */

import type {
  EmploymentType,
  WorkplaceType,
} from "@/types/organization";

export type RequisitionStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ON_HOLD"
  | "FILLED"
  | "CANCELLED";

export type JobStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "CLOSED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEW"
  | "RECRUITER_SCREEN"
  | "HIRING_MANAGER_REVIEW"
  | "INTERVIEW"
  | "FINAL_INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN"
  | "CLOSED";

export type InterviewType =
  | "PHONE_SCREEN"
  | "VIDEO"
  | "ONSITE"
  | "PANEL"
  | "TECHNICAL"
  | "FINAL";

export type InterviewStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type OfferStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "EXTENDED"
  | "ACCEPTED"
  | "DECLINED"
  | "WITHDRAWN"
  | "EXPIRED";

export type DocumentType =
  | "RESUME"
  | "COVER_LETTER"
  | "PORTFOLIO"
  | "OTHER";

export type CareerArea =
  | "experienced-professionals"
  | "technology-oracle"
  | "ai-data"
  | "consulting"
  | "early-careers";

/**
 * Internal hiring request — draft/approval workflow, salary range, opening
 * count. Kept distinct from `Job` (the public-facing posting derived from
 * an approved requisition) rather than merged into it.
 */
export type JobRequisition = {
  id: string;
  requisitionNumber: string;
  title: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  hiringManagerUserId?: string;
  recruiterUserId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  careerArea: CareerArea;
  openings: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications: string[];
  targetHireDate?: string;
  status: RequisitionStatus;
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string;
};

export type JobRequisitionApproval = {
  id: string;
  requisitionId: string;
  approverUserId: string;
  status: ApprovalStatus;
  comments?: string;
  decidedAt?: string;
  createdAt: string;
};

/**
 * Public job posting derived from an approved requisition.
 * Feeds /jobs and /jobs/[slug].
 */
export type Job = {
  id: string;
  requisitionId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  careerArea: CareerArea;
  departmentName: string;
  locationName: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications: string[];
  status: JobStatus;
  publishedAt?: string;
  closedAt?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
};

/** One person in the recruiting system — may apply to many jobs. */
export type CandidateProfile = {
  id: string;
  /** Links to the shared account identity once the candidate has a portal login. */
  profileId?: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
};

export type CandidateAddress = {
  id: string;
  candidateId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isPrimary: boolean;
};

export type Experience = {
  id: string;
  candidateId: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
};

export type Education = {
  id: string;
  candidateId: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
};

/** Master skill list — normalized target of `CandidateSkill`/`JobSkill`. */
export type Skill = {
  id: string;
  name: string;
  category?: string;
};

/** Candidate <-> skill mapping. `skill` is the resolved name (joined from `Skill`), for display. */
export type CandidateSkill = {
  id: string;
  candidateId: string;
  skillId: string;
  skill: string;
  proficiency?: string;
};

/** Job <-> skill mapping (required/preferred skills for a posting). */
export type JobSkill = {
  id: string;
  jobId: string;
  skillId: string;
  skill: string;
  required: boolean;
};

export type Document = {
  id: string;
  candidateId: string;
  userId?: string;
  documentType: DocumentType;
  fileName: string;
  storagePath: string;
  mimeType?: string;
  fileSize?: number;
  uploadedAt: string;
};

/** Documents attached to a specific application (a resume can attach to several). */
export type ApplicationDocument = {
  id: string;
  applicationId: string;
  documentId: string;
  createdAt: string;
};

/** Relationship between a candidate and a job. */
export type Application = {
  id: string;
  applicationNumber: string;
  candidateId: string;
  requisitionId: string;
  jobId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  additionalInformation?: string;
  appliedAt: string;
  updatedAt: string;
};

export type ApplicationStatusHistory = {
  id: string;
  applicationId: string;
  fromStatus?: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedByUserId?: string;
  note?: string;
  createdAt: string;
};

export type Interview = {
  id: string;
  applicationId: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes: number;
  locationOrLink?: string;
  createdAt: string;
  updatedAt: string;
};

export type InterviewPanelMember = {
  id: string;
  interviewId: string;
  userId: string;
  role: "INTERVIEWER" | "LEAD" | "OBSERVER";
};

export type InterviewFeedback = {
  id: string;
  interviewId: string;
  panelMemberId: string;
  recommendation: "STRONG_YES" | "YES" | "NEUTRAL" | "NO" | "STRONG_NO";
  score?: number;
  strengths?: string;
  concerns?: string;
  notes?: string;
  submittedAt: string;
};

export type Offer = {
  id: string;
  applicationId: string;
  offerNumber: string;
  status: OfferStatus;
  baseSalary?: number;
  hourlyRate?: number;
  currency: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  expirationDate?: string;
  termsSummary?: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferApproval = {
  id: string;
  offerId: string;
  approverUserId: string;
  status: ApprovalStatus;
  comments?: string;
  decidedAt?: string;
  createdAt: string;
};

export type RecruitingNote = {
  id: string;
  candidateId?: string;
  applicationId?: string;
  requisitionId?: string;
  visibility: "RECRUITER" | "HIRING_TEAM" | "HR";
  note: string;
  createdByUserId: string;
  createdAt: string;
};

export type RecruitingActivity = {
  id: string;
  candidateId?: string;
  applicationId?: string;
  requisitionId?: string;
  activityType: string;
  summary: string;
  createdByUserId?: string;
  createdAt: string;
};

/** Persisted JD Analyzer result — a standalone JD parse, not tied to one resume. */
export type JdAnalysis = {
  id: string;
  jobId?: string;
  candidateId?: string;
  resumeDocumentId?: string;
  analysisJson: Record<string, unknown>;
  matchScore?: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  createdAt: string;
};

/** Persisted resume<->job match result (same shape as JdAnalysis, one resume against one job). */
export type ResumeAnalysis = {
  id: string;
  jobId?: string;
  candidateId?: string;
  resumeDocumentId: string;
  analysisJson: Record<string, unknown>;
  matchScore?: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  createdAt: string;
};

/** Active pipeline stages shown on ATS boards (excludes terminals). */
export const APPLICATION_PIPELINE: ApplicationStatus[] = [
  "APPLIED",
  "REVIEW",
  "RECRUITER_SCREEN",
  "HIRING_MANAGER_REVIEW",
  "INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "HIRED",
];

export const APPLICATION_TERMINAL_STATUSES: ApplicationStatus[] = [
  "REJECTED",
  "WITHDRAWN",
  "CLOSED",
];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  REVIEW: "Review",
  RECRUITER_SCREEN: "Recruiter Screen",
  HIRING_MANAGER_REVIEW: "Hiring Manager",
  INTERVIEW: "Interview",
  FINAL_INTERVIEW: "Final Interview",
  OFFER: "Offer",
  HIRED: "Hired",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  CLOSED: "Closed",
};

export const requisitionStatusLabels: Record<RequisitionStatus, string> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
  ON_HOLD: "On Hold",
  FILLED: "Filled",
  CANCELLED: "Cancelled",
};
