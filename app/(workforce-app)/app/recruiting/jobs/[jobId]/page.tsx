import type { Metadata } from "next";
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

  const applicants = applications.map((application) => ({
    application,
    candidateName: candidateById.get(application.candidateId)?.name ?? "—",
    candidateEmail: candidateById.get(application.candidateId)?.email ?? "—",
  }));

  return <JobDetailView detail={detail} applicants={applicants} />;
}
