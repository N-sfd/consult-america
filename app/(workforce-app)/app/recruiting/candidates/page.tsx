import type { Metadata } from "next";

import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import CandidatesTable from "@/components/workforce-app/recruiting/candidates-table";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Candidates",
};

export default async function RecruitingCandidatesPage() {
  const candidates = await recruitingRepository.listCandidateSummaries();

  return (
    <CandidatesTable
      candidates={candidates}
      isSupabaseConnected={isSupabaseConfigured()}
    />
  );
}
