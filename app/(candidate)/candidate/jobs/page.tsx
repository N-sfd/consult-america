import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import JobBoard from "@/components/jobs/job-board";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getJobFilterOptions, getOpenJobs } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";
import {
  candidateApplicationStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Jobs",
};

export const dynamic = "force-dynamic";

function applicationCtaLabel(status: ApplicationStatus): string {
  if (status === "OFFER") return "Offer";
  if (status === "INTERVIEW" || status === "FINAL_INTERVIEW") return "Interview";
  if (status === "HIRED") return "Hired";
  if (status === "APPLIED") return "Applied";
  if (
    status === "REVIEW" ||
    status === "RECRUITER_SCREEN" ||
    status === "HIRING_MANAGER_REVIEW"
  ) {
    return "Under Review";
  }
  return candidateApplicationStatusLabels[status];
}

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
  for (const application of profile?.applications ?? []) {
    applicationCtasByRequisitionId[application.requisitionId] = {
      label: applicationCtaLabel(application.status),
      href: `/candidate/applications/${application.applicationId}`,
    };
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Jobs</h1>
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
          Roles you already applied to show your current status.{" "}
          <Link
            href="/candidate/applications"
            className="font-semibold text-[var(--ca-platform-mid)] hover:underline"
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
