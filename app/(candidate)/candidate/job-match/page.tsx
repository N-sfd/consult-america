import type { Metadata } from "next";
import Link from "next/link";

import JobMatchForm from "@/components/candidate/job-match-form";
import JobMatchHistoryList from "@/components/candidate/job-match-history-list";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getOpenJobs } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type { JobMatchResult } from "@/lib/candidate/job-match";

export const metadata: Metadata = {
  title: "Job Match",
};

export const dynamic = "force-dynamic";

export default async function CandidateJobMatchPage() {
  const { session } = await requireCandidateActor();
  const [profile, jobs] = await Promise.all([
    recruitingRepository.getCandidateProfile(session.candidateId),
    getOpenJobs(),
  ]);

  const resumes = (profile?.documents ?? [])
    .filter((doc) => doc.documentType === "RESUME")
    .map((doc) => ({
      id: doc.id,
      label: `${doc.fileName}${doc.isPrimaryResume ? " · Current" : doc.status === "ARCHIVED" ? " · Archived" : ""}`,
      archived: doc.status === "ARCHIVED" && !doc.isPrimaryResume,
    }));

  const client = getSupabaseServiceClient();
  const { data: priorRows } = client
    ? await client
        .from("job_match_analyses")
        .select("id, result_json, created_at, job_requisition_id")
        .eq("candidate_id", session.candidateId)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: [] as Record<string, unknown>[] };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Job Match</h1>
        <p className="mt-2 max-w-2xl text-black/55">
          Compare your stored resume to a Consult America role or a pasted job
          description. Results stay on your candidate record for guidance only.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/15 bg-white p-6 text-sm text-black/55">
          <p>
            No resume uploaded. Upload your resume to make Job Match and
            applications faster.
          </p>
          <Link
            href="/candidate/documents?upload=resume"
            className="mt-3 inline-block text-sm font-semibold text-[var(--ca-blue)] hover:underline"
          >
            Upload Resume →
          </Link>
        </div>
      ) : (
        <JobMatchForm
          resumes={resumes}
          jobs={jobs.map((job) => ({
            requisitionId: job.requisitionId,
            title: job.title,
          }))}
        />
      )}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Recent analyses
        </h2>
        {(priorRows ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No job-match analyses yet.</p>
        ) : (
          <JobMatchHistoryList
            rows={(priorRows ?? []).map((row) => ({
              id: row.id as string,
              createdAt: row.created_at as string,
              isJobRequisition: Boolean(row.job_requisition_id),
              result: row.result_json as JobMatchResult,
            }))}
          />
        )}
      </section>
    </div>
  );
}
