import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/shared";
import { recruitingRepository } from "@/lib/recruiting";
import CandidateMatchForm from "@/components/workforce-app/recruiting/candidate-match-form";

export const metadata: Metadata = { title: "Candidate Match" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ requisitionId?: string }>;
}) {
  const jobs = await recruitingRepository.listJobSummaries();
  const { requisitionId } = await searchParams;
  const jobOptions = jobs
    .filter((job) => job.status === "PUBLISHED" || job.status === "APPROVED")
    .map((job) => ({
      requisitionId: job.requisitionId,
      title: job.title,
      departmentName: job.departmentName,
      locationName: job.locationName,
    }));

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-5 lg:px-8 lg:py-6">
      <PageHeader
        eyebrow="Recruiting intelligence"
        title="Candidate Match"
        description="AI Job Analyzer supports match and human decision-making inside the hiring lineage — advisory scores only. Prefer the Match tab on a job so intelligence stays on the requisition."
      />

      <nav className="ca-workflow-lineage" aria-label="Where Match sits">
        <span>Requisition</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span>Applications</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span className="font-semibold text-[var(--ca-app-ink)]">Match</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span>Review</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span>Interview</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span>Offer</span>
        <span className="ca-workflow-sep" aria-hidden>
          →
        </span>
        <span>Hire</span>
      </nav>

      {requisitionId ? (
        <p className="text-sm text-black/55">
          Prefer the embedded experience?{" "}
          <Link
            href={`/app/recruiting/jobs/${requisitionId}?tab=match`}
            className="font-medium text-[var(--ca-blue)] hover:underline"
          >
            Open this requisition&apos;s Candidate Match tab
          </Link>
          .
        </p>
      ) : (
        <p className="text-sm text-black/55">
          Day-to-day recruiting: open a job under{" "}
          <Link href="/app/recruiting/jobs" className="font-medium text-[var(--ca-blue)] hover:underline">
            Jobs
          </Link>{" "}
          and use its <strong className="font-medium text-black/70">Candidate Match</strong> tab.
          This page is for ad-hoc JD analysis.
        </p>
      )}

      <CandidateMatchForm
        jobs={jobOptions}
        initialRequisitionId={requisitionId}
        variant="adhoc"
      />
    </div>
  );
}
