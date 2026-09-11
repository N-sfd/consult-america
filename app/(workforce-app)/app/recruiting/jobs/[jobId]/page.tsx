import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import JobDetailView from "@/components/workforce-app/recruiting/job-detail-view";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Job",
};

export default async function RecruitingJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const detail = await recruitingRepository.getJobDetail(jobId);

  if (!detail) notFound();

  const [applications, candidateSummaries] = await Promise.all([
    recruitingRepository.listApplicationsByRequisition(jobId),
    recruitingRepository.listCandidateSummaries(),
  ]);

  const candidateById = new Map(
    candidateSummaries.map((c) => [c.candidateId, c]),
  );

  const scores = await recruitingRepository.listLatestMatchScoresForPairs(
    applications.map((application) => ({
      candidateId: application.candidateId,
      requisitionId: jobId,
    })),
  );
  const matchScoreByCandidateId = new Map(scores.map((s) => [s.candidateId, s.score]));

  const applicants = applications.map((application) => ({
    application,
    candidateName: candidateById.get(application.candidateId)?.name ?? "—",
    candidateEmail: candidateById.get(application.candidateId)?.email ?? "—",
    matchScore: matchScoreByCandidateId.get(application.candidateId),
  }));

  return (
    <Suspense fallback={<div className="px-4 py-8 text-sm text-black/45">Loading job…</div>}>
      <JobDetailView detail={detail} applicants={applicants} />
    </Suspense>
  );
}
