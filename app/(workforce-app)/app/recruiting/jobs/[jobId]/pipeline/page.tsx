import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PipelineBoard from "@/components/workforce-app/recruiting/pipeline-board";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Pipeline",
};

export default async function RecruitingJobPipelinePage({
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

  const cards = applications.map((application) => ({
    applicationId: application.id,
    candidateId: application.candidateId,
    candidateName: candidateById.get(application.candidateId)?.name ?? "—",
    status: application.status,
    appliedAt: application.appliedAt,
  }));

  return (
    <PipelineBoard
      requisitionId={jobId}
      jobTitle={detail.requisition.title}
      cards={cards}
    />
  );
}
