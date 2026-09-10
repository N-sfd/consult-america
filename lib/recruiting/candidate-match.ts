/**
 * Recruiter-side Candidate Match reuses the exact same deterministic
 * keyword-overlap heuristic as the candidate-facing Job Match
 * (lib/candidate/job-match.ts) — one scoring algorithm, not two. Decision
 * support only: never auto-reject, auto-advance, rank hiring decisions, or
 * change application status.
 */
export { analyzeJobMatch } from "@/lib/candidate/job-match";
export type { JobMatchResult } from "@/lib/candidate/job-match";
