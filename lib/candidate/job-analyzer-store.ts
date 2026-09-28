/**
 * In-memory persistence for AI Job Analyzer when Supabase is unset (demo mode).
 * Process-local — resets on server restart. Never used in production auth mode.
 */

import type { JobMatchResult } from "@/lib/candidate/job-match";

export type SavedJobRecord = {
  id: string;
  candidateId: string;
  jobRequisitionId: string;
  createdAt: string;
};

export type JobMatchAnalysisRecord = {
  id: string;
  candidateId: string;
  documentId?: string;
  jobRequisitionId?: string;
  jobTitle?: string;
  jobDescriptionSnapshot?: string;
  result: JobMatchResult;
  createdAt: string;
};

export type ProposalDraftRecord = {
  id: string;
  candidateId: string;
  jobRequisitionId?: string;
  jobTitle: string;
  body: string;
  matchScore?: number;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __caJobAnalyzerStore?: {
    savedJobs: SavedJobRecord[];
    analyses: JobMatchAnalysisRecord[];
    proposals: ProposalDraftRecord[];
  };
};

function store() {
  if (!globalStore.__caJobAnalyzerStore) {
    globalStore.__caJobAnalyzerStore = {
      savedJobs: [],
      analyses: [],
      proposals: [],
    };
  }
  return globalStore.__caJobAnalyzerStore;
}

export function listSavedJobRequisitionIds(candidateId: string): string[] {
  return store()
    .savedJobs.filter((row) => row.candidateId === candidateId)
    .map((row) => row.jobRequisitionId);
}

export function listSavedJobs(candidateId: string): SavedJobRecord[] {
  return store()
    .savedJobs.filter((row) => row.candidateId === candidateId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function isJobSaved(candidateId: string, jobRequisitionId: string): boolean {
  return store().savedJobs.some(
    (row) =>
      row.candidateId === candidateId && row.jobRequisitionId === jobRequisitionId,
  );
}

export function toggleSavedJob(
  candidateId: string,
  jobRequisitionId: string,
): { saved: boolean; record?: SavedJobRecord } {
  const rows = store().savedJobs;
  const index = rows.findIndex(
    (row) =>
      row.candidateId === candidateId && row.jobRequisitionId === jobRequisitionId,
  );
  if (index >= 0) {
    rows.splice(index, 1);
    return { saved: false };
  }
  const record: SavedJobRecord = {
    id: `save-${crypto.randomUUID()}`,
    candidateId,
    jobRequisitionId,
    createdAt: new Date().toISOString(),
  };
  rows.push(record);
  return { saved: true, record };
}

export function saveJobMatchAnalysis(
  input: Omit<JobMatchAnalysisRecord, "id" | "createdAt"> & { id?: string },
): JobMatchAnalysisRecord {
  const record: JobMatchAnalysisRecord = {
    id: input.id ?? `jma-${crypto.randomUUID()}`,
    candidateId: input.candidateId,
    documentId: input.documentId,
    jobRequisitionId: input.jobRequisitionId,
    jobTitle: input.jobTitle,
    jobDescriptionSnapshot: input.jobDescriptionSnapshot,
    result: input.result,
    createdAt: new Date().toISOString(),
  };
  store().analyses.unshift(record);
  return record;
}

export function listJobMatchAnalyses(
  candidateId: string,
  limit = 8,
): JobMatchAnalysisRecord[] {
  return store()
    .analyses.filter((row) => row.candidateId === candidateId)
    .slice(0, limit);
}

export function saveProposalDraft(
  input: Omit<ProposalDraftRecord, "id" | "createdAt"> & { id?: string },
): ProposalDraftRecord {
  const record: ProposalDraftRecord = {
    id: input.id ?? `prop-${crypto.randomUUID()}`,
    candidateId: input.candidateId,
    jobRequisitionId: input.jobRequisitionId,
    jobTitle: input.jobTitle,
    body: input.body,
    matchScore: input.matchScore,
    createdAt: new Date().toISOString(),
  };
  store().proposals.unshift(record);
  return record;
}

export function listProposalDrafts(
  candidateId: string,
  limit = 8,
): ProposalDraftRecord[] {
  return store()
    .proposals.filter((row) => row.candidateId === candidateId)
    .slice(0, limit);
}
