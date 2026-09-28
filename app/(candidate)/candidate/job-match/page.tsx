import type { Metadata } from "next";
import Link from "next/link";

import JobAnalyzerCapabilities from "@/components/candidate/job-analyzer-capabilities";
import JobMatchForm from "@/components/candidate/job-match-form";
import JobMatchHistoryList from "@/components/candidate/job-match-history-list";
import { PageHeader } from "@/components/shared";
import {
  listJobMatchAnalyses,
  listProposalDrafts,
} from "@/lib/candidate/job-analyzer-store";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getOpenJobs } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type { JobMatchResult } from "@/lib/candidate/job-match";
import { calculateProfileCompletion } from "@/lib/candidate/profile-completion";

export const metadata: Metadata = {
  title: "AI Job Analyzer",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ job?: string }>;
};

export default async function CandidateJobMatchPage({ searchParams }: PageProps) {
  const { job: preselectedJob } = await searchParams;
  const { session } = await requireCandidateActor();
  const [profile, jobs] = await Promise.all([
    recruitingRepository.getCandidateProfile(session.candidateId),
    getOpenJobs(),
  ]);

  const hasActiveResume = (profile?.documents ?? []).some(
    (doc) =>
      doc.documentType === "RESUME" &&
      (doc.isPrimaryResume || doc.status === "ACTIVE" || !doc.status),
  );
  const completion = profile
    ? calculateProfileCompletion({
        candidate: profile.candidate,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        hasActiveResume,
      })
    : null;

  const resumes = (profile?.documents ?? [])
    .filter((doc) => doc.documentType === "RESUME")
    .map((doc) => ({
      id: doc.id,
      label: `${doc.fileName}${doc.isPrimaryResume ? " · Current" : doc.status === "ARCHIVED" ? " · Archived" : ""}`,
      archived: doc.status === "ARCHIVED" && !doc.isPrimaryResume,
    }));

  const client = getSupabaseServiceClient();
  let historyRows: {
    id: string;
    createdAt: string;
    isJobRequisition: boolean;
    result: JobMatchResult;
  }[] = [];
  let proposals: { id: string; jobTitle: string; body: string; createdAt: string }[] = [];

  if (client) {
    const { data: priorRows } = await client
      .from("job_match_analyses")
      .select("id, result_json, created_at, job_requisition_id")
      .eq("candidate_id", session.candidateId)
      .order("created_at", { ascending: false })
      .limit(5);
    historyRows = (priorRows ?? []).map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      isJobRequisition: Boolean(row.job_requisition_id),
      result: row.result_json as JobMatchResult,
    }));

    const { data: proposalRows } = await client
      .from("candidate_proposal_drafts")
      .select("id, job_title, body, created_at")
      .eq("candidate_id", session.candidateId)
      .order("created_at", { ascending: false })
      .limit(5);
    proposals = (proposalRows ?? []).map((row) => ({
      id: row.id as string,
      jobTitle: row.job_title as string,
      body: row.body as string,
      createdAt: row.created_at as string,
    }));
  } else {
    historyRows = listJobMatchAnalyses(session.candidateId, 5).map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      isJobRequisition: Boolean(row.jobRequisitionId),
      result: row.result,
    }));
    proposals = listProposalDrafts(session.candidateId, 5).map((row) => ({
      id: row.id,
      jobTitle: row.jobTitle,
      body: row.body,
      createdAt: row.createdAt,
    }));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Job Analyzer"
        description="Search roles, review listings, create tailored proposals, and automatically save the jobs you care about — assistance only, never a hiring decision."
        meta={
          completion ? (
            <p className="text-sm text-[var(--ca-platform-muted)]">
              Profile {completion.percent}% complete.{" "}
              <Link
                href="/candidate/profile"
                className="font-semibold text-[var(--ca-platform-mid)] hover:underline"
              >
                Update personal information
              </Link>
            </p>
          ) : null
        }
      />

      <JobAnalyzerCapabilities />

      {resumes.length === 0 && !(profile?.candidate.professionalSummary || (profile?.skills.length ?? 0) > 0) ? (
        <div className="rounded-lg border border-dashed border-[var(--ca-platform-border)] bg-white p-6 text-sm text-[var(--ca-platform-muted)]">
          <p>
            Add personal information or upload a resume so the analyzer can score
            alignment and draft proposals.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/candidate/profile"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Personal information →
            </Link>
            <Link
              href="/candidate/documents?upload=resume"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Upload resume →
            </Link>
          </div>
        </div>
      ) : (
        <JobMatchForm
          resumes={resumes}
          jobs={jobs.map((job) => ({
            requisitionId: job.requisitionId,
            title: job.title,
            slug: job.slug,
            summary: job.summary,
            location: job.location,
          }))}
          initialJobRequisitionId={preselectedJob}
        />
      )}

      <section className="ca-platform-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
          Recent analyses
        </h2>
        {historyRows.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">
            No analyses yet. Pick a job below or from{" "}
            <Link href="/candidate/jobs" className="font-semibold text-[var(--ca-platform-mid)] hover:underline">
              Jobs
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4">
            <JobMatchHistoryList rows={historyRows} />
          </div>
        )}
      </section>

      <section className="ca-platform-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
          Recent proposal drafts
        </h2>
        {proposals.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">
            Tailored proposals appear here after you generate one from a job or match result.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {proposals.map((draft) => (
              <li key={draft.id} className="rounded-lg border border-[var(--ca-platform-border)] p-4">
                <p className="text-sm font-semibold text-[var(--ca-platform-ink)]">
                  {draft.jobTitle}
                </p>
                <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
                  {new Date(draft.createdAt).toLocaleString()}
                </p>
                <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap font-sans text-sm text-[var(--ca-platform-ink)]">
                  {draft.body}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
