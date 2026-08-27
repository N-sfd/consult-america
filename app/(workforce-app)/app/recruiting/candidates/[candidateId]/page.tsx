import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CandidateProfile from "@/components/workforce-app/recruiting/candidate-profile";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Candidate",
};

export default async function RecruitingCandidateDetailPage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const profile = await recruitingRepository.getCandidateProfile(candidateId);

  if (!profile) notFound();

  return <CandidateProfile profile={profile} />;
}
