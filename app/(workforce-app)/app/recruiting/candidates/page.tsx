import type { Metadata } from "next";
import { Suspense } from "react";

import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import CandidatesTable from "@/components/workforce-app/recruiting/candidates-table";
import { recruitingRepository } from "@/lib/recruiting";
import { isWithinLastDays } from "@/lib/recruiting/format";

export const metadata: Metadata = {
  title: "Candidates",
};

// Always reflect live data for the current request rather than a
// build-time snapshot - this is an authenticated app page, not marketing.
export const dynamic = "force-dynamic";

export default async function RecruitingCandidatesPage() {
  const candidates = await recruitingRepository.listCandidateSummaries();

  const kpis = {
    active: candidates.length,
    newThisWeek: candidates.filter((c) => isWithinLastDays(c.appliedAt, 7))
      .length,
    interviews: candidates.filter(
      (c) => c.stage === "INTERVIEW" || c.stage === "FINAL_INTERVIEW",
    ).length,
    offers: candidates.filter((c) => c.stage === "OFFER").length,
  };

  return (
    <Suspense>
      <CandidatesTable
        candidates={candidates}
        kpis={kpis}
        isSupabaseConnected={isSupabaseConfigured()}
      />
    </Suspense>
  );
}
