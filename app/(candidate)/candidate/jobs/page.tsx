import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import JobBoard from "@/components/jobs/job-board";
import { PageHeader } from "@/components/shared";
import { listSavedJobRequisitionIds } from "@/lib/candidate/job-analyzer-store";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getCandidatePortalJobs, getJobFilterOptions } from "@/lib/jobs";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Jobs",
};

export const dynamic = "force-dynamic";

export default async function CandidateJobsPage() {
  const { session } = await requireCandidateActor();
  const [jobs, profile] = await Promise.all([
    getCandidatePortalJobs(),
    recruitingRepository.getCandidateProfile(session.candidateId),
  ]);
  const filterOptions = getJobFilterOptions(jobs);

  const applicationCtasByRequisitionId: Record<
    string,
    { label: string; href: string }
  > = {};
  for (const application of profile?.applications ?? []) {
    applicationCtasByRequisitionId[application.requisitionId] = {
      label: "View Application",
      href: `/candidate/applications/${application.applicationId}`,
    };
  }

  const client = getSupabaseServiceClient();
  let savedRequisitionIds: string[] = [];
  if (client) {
    const { data } = await client
      .from("candidate_saved_jobs")
      .select("job_requisition_id")
      .eq("candidate_id", session.candidateId);
    savedRequisitionIds = (data ?? []).map((row) => row.job_requisition_id as string);
  } else {
    savedRequisitionIds = listSavedJobRequisitionIds(session.candidateId);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Search"
        description="Search Consult America roles, open a listing to review details, save favorites, and jump into the AI Job Analyzer."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/candidate/saved-jobs"
              className="rounded-lg border border-[var(--ca-platform-border)] px-3.5 py-2 text-sm font-semibold"
            >
              Saved jobs
            </Link>
            <Link
              href="/candidate/job-match"
              className="rounded-lg bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
            >
              AI Job Analyzer
            </Link>
          </div>
        }
        meta={
          (profile?.applications?.length ?? 0) === 0 ? (
            <p className="text-sm text-[var(--ca-platform-muted)]">
              No applications yet. Open a role to review details, save it, or apply.
            </p>
          ) : (
            <p className="text-sm text-[var(--ca-platform-muted)]">
              Roles you already applied to show View Application.{" "}
              <Link
                href="/candidate/applications"
                className="font-semibold text-[var(--ca-platform-mid)] hover:underline"
              >
                View applications
              </Link>
            </p>
          )
        }
      />

      <Suspense fallback={<p className="text-sm text-[var(--ca-platform-muted)]">Loading jobs…</p>}>
        <JobBoard
          jobs={jobs}
          filterOptions={filterOptions}
          applicationCtasByRequisitionId={applicationCtasByRequisitionId}
          portalMode
          savedRequisitionIds={savedRequisitionIds}
        />
      </Suspense>
    </div>
  );
}
