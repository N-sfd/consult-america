import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PipelineBoard from "@/components/workforce-app/recruiting/pipeline-board";
import { recruitingRepository } from "@/lib/recruiting";
import {
  APPLICATION_PIPELINE,
  type ApplicationStatus,
} from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Pipeline",
};

export default async function RecruitingJobPipelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ stage?: string }>;
}) {
  const { jobId } = await params;
  const { stage } = await searchParams;
  const detail = await recruitingRepository.getJobDetail(jobId);
  if (!detail) notFound();

  const [applications, candidateSummaries] = await Promise.all([
    recruitingRepository.listApplicationsByRequisition(jobId),
    recruitingRepository.listCandidateSummaries(),
  ]);

  const candidateById = new Map(
    candidateSummaries.map((c) => [c.candidateId, c]),
  );

  const offers = await Promise.all(
    applications.map((application) =>
      recruitingRepository.getOfferByApplicationId(application.id),
    ),
  );
  const offerByApplicationId = new Map(
    applications.map((application, index) => [application.id, offers[index]]),
  );

  const scores = await recruitingRepository.listLatestMatchScoresForPairs(
    applications.map((application) => ({
      candidateId: application.candidateId,
      requisitionId: jobId,
    })),
  );
  const matchScoreByCandidateId = new Map(scores.map((s) => [s.candidateId, s.score]));

  const cards = applications.map((application) => ({
    applicationId: application.id,
    candidateId: application.candidateId,
    candidateName: candidateById.get(application.candidateId)?.name ?? "—",
    status: application.status,
    appliedAt: application.appliedAt,
    offer: offerByApplicationId.get(application.id),
    matchScore: matchScoreByCandidateId.get(application.candidateId),
  }));

  const initialFocusStage =
    stage && APPLICATION_PIPELINE.includes(stage as ApplicationStatus)
      ? (stage as ApplicationStatus)
      : null;

  return (
    <PipelineBoard
      requisitionId={jobId}
      jobTitle={detail.requisition.title}
      cards={cards}
      defaultEmploymentType={detail.requisition.employmentType}
      defaultWorkplaceType={detail.requisition.workplaceType}
      initialFocusStage={initialFocusStage}
    />
  );
}
