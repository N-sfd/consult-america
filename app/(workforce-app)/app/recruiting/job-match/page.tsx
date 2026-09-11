import type { Metadata } from "next";
import Link from "next/link";

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
    <div className="mx-auto max-w-[1100px] px-4 py-5 lg:px-8 lg:py-6">
      <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
        Candidate Match
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-black/50">
        Ad-hoc analysis for pasted or uploaded JDs, or a quick run against an
        existing requisition. For day-to-day recruiting, open a job and use the{" "}
        <strong className="font-medium text-black/70">Candidate Match</strong> tab
        so intelligence stays inside the ATS workflow.
      </p>
      {requisitionId ? (
        <p className="mt-3 text-sm text-black/55">
          Prefer the embedded experience?{" "}
          <Link
            href={`/app/recruiting/jobs/${requisitionId}?tab=match`}
            className="font-medium text-[var(--ca-blue)] hover:underline"
          >
            Open this requisition&apos;s Candidate Match tab
          </Link>
          .
        </p>
      ) : null}

      <CandidateMatchForm
        jobs={jobOptions}
        initialRequisitionId={requisitionId}
        variant="adhoc"
      />
    </div>
  );
}
