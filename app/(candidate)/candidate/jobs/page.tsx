import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import JobBoard from "@/components/jobs/job-board";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getJobFilterOptions, getOpenJobs } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Jobs",
};

export const dynamic = "force-dynamic";

export default async function CandidateJobsPage() {
  const { session } = await requireCandidateActor();
  const [jobs, profile] = await Promise.all([
    getOpenJobs(),
    recruitingRepository.getCandidateProfile(session.candidateId),
  ]);
  const filterOptions = getJobFilterOptions(jobs);

  const applicationCtasByRequisitionId: Record<
    string,
    { label: string; href: string }
  > = {};
  for (const job of jobs) {
    applicationCtasByRequisitionId[job.requisitionId] = {
      label: "Apply",
      href: `/jobs/${job.slug}/apply`,
    };
  }
  for (const application of profile?.applications ?? []) {
    applicationCtasByRequisitionId[application.requisitionId] = {
      label: "View Application",
      href: `/candidate/applications/${application.applicationId}`,
    };
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em]">Jobs</h1>
        <p className="mt-2 text-black/55">
          Browse published Consult America roles and apply with your current
          resume.
        </p>
      </div>

      {(profile?.applications?.length ?? 0) === 0 ? (
        <p className="text-sm text-black/50">
          No applications yet. Browse open roles to get started.
        </p>
      ) : (
        <p className="text-sm text-black/50">
          Roles you already applied to show View Application instead of Apply.{" "}
          <Link
            href="/candidate/applications"
            className="font-semibold text-[var(--cr-blue)] hover:underline"
          >
            View applications
          </Link>
        </p>
      )}

      <Suspense fallback={<p className="text-sm text-black/50">Loading jobs…</p>}>
        <JobBoard
          jobs={jobs}
          filterOptions={filterOptions}
          applicationCtasByRequisitionId={applicationCtasByRequisitionId}
        />
      </Suspense>
    </div>
  );
}
