import type { Metadata } from "next";

import { recruitingRepository } from "@/lib/recruiting";
import ApplicationsTable from "@/components/workforce-app/recruiting/applications-table";

export const metadata: Metadata = { title: "Applications" };

export default async function Page() {
  const applications = await recruitingRepository.listApplicationsQueue();

  const pairs = applications
    .filter((app) => Boolean(app.requisitionId))
    .map((app) => ({ candidateId: app.candidateId, requisitionId: app.requisitionId! }));
  const scores = await recruitingRepository.listLatestMatchScoresForPairs(pairs);
  const scoreByPair = new Map(scores.map((s) => [`${s.candidateId}:${s.requisitionId}`, s.score]));

  const matchScoreByApplicationId: Record<string, number> = {};
  for (const app of applications) {
    if (!app.requisitionId) continue;
    const score = scoreByPair.get(`${app.candidateId}:${app.requisitionId}`);
    if (score !== undefined) matchScoreByApplicationId[app.applicationId] = score;
  }

  return (
    <ApplicationsTable
      applications={applications}
      matchScoreByApplicationId={matchScoreByApplicationId}
    />
  );
}
