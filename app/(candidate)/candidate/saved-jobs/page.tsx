import type { Metadata } from "next";
import Link from "next/link";

import SaveJobButton from "@/components/candidate/save-job-button";
import { PageHeader } from "@/components/shared";
import { listSavedJobs } from "@/lib/candidate/job-analyzer-store";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getOpenJobs } from "@/lib/jobs";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";

export const metadata: Metadata = {
  title: "Saved Jobs",
};

export const dynamic = "force-dynamic";

export default async function CandidateSavedJobsPage() {
  const { session } = await requireCandidateActor();
  const jobs = await getOpenJobs();
  const client = getSupabaseServiceClient();

  let savedIds: string[] = [];
  if (client) {
    const { data } = await client
      .from("candidate_saved_jobs")
      .select("job_requisition_id")
      .eq("candidate_id", session.candidateId)
      .order("created_at", { ascending: false });
    savedIds = (data ?? []).map((row) => row.job_requisition_id as string);
  } else {
    savedIds = listSavedJobs(session.candidateId).map((row) => row.jobRequisitionId);
  }

  const savedJobs = savedIds
    .map((id) => jobs.find((job) => job.requisitionId === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved Jobs"
        description="Roles you favorited or auto-saved when generating a tailored proposal."
        actions={
          <Link
            href="/candidate/jobs"
            className="rounded-lg border border-[var(--ca-platform-border)] px-3.5 py-2 text-sm font-semibold"
          >
            Search jobs
          </Link>
        }
      />

      {savedJobs.length === 0 ? (
        <div className="ca-platform-card p-6 text-sm text-[var(--ca-platform-muted)]">
          No saved jobs yet. Browse open roles and tap Save, or create a proposal from
          a job detail page to auto-save.
          <div className="mt-3">
            <Link
              href="/candidate/jobs"
              className="font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Browse jobs →
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {savedJobs.map((job) =>
            job ? (
              <li
                key={job.requisitionId}
                className="ca-platform-card flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <Link
                    href={`/candidate/jobs/${job.slug}`}
                    className="text-lg font-semibold text-[var(--ca-platform-ink)] hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                    {job.location} · {job.workplaceType} · {job.employmentType}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SaveJobButton
                    jobRequisitionId={job.requisitionId}
                    initiallySaved
                  />
                  <Link
                    href={`/candidate/job-match?job=${job.requisitionId}`}
                    className="rounded-lg border border-[var(--ca-platform-border)] px-3 py-2 text-sm font-semibold"
                  >
                    Analyze
                  </Link>
                  <Link
                    href={`/jobs/${job.slug}/apply`}
                    className="rounded-lg bg-[var(--ca-platform-deep)] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Apply
                  </Link>
                </div>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
