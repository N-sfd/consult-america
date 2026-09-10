import type { ApplicationStatus } from "@/types/recruiting";

/**
 * Simplified candidate-facing stage shown in the Applications queue.
 * Internal statuses (types/recruiting.ts ApplicationStatus) stay detailed —
 * this is a display grouping only, never written back to `applications`.
 */
export type CandidateStage =
  | "Application Received"
  | "Under Review"
  | "Interview"
  | "Offer"
  | "Decision";

export const CANDIDATE_STAGES: CandidateStage[] = [
  "Application Received",
  "Under Review",
  "Interview",
  "Offer",
  "Decision",
];

const STAGE_BY_STATUS: Record<ApplicationStatus, CandidateStage> = {
  APPLIED: "Application Received",
  REVIEW: "Under Review",
  RECRUITER_SCREEN: "Under Review",
  HIRING_MANAGER_REVIEW: "Under Review",
  INTERVIEW: "Interview",
  FINAL_INTERVIEW: "Interview",
  OFFER: "Offer",
  HIRED: "Decision",
  REJECTED: "Decision",
  WITHDRAWN: "Decision",
  CLOSED: "Decision",
};

export function candidateStageFor(status: ApplicationStatus): CandidateStage {
  return STAGE_BY_STATUS[status];
}
