import { redirect } from "next/navigation";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { recruitingRepository } from "@/lib/recruiting";

/**
 * Candidate Portal session — real (Supabase Auth + users/user_roles, linked
 * via candidate_id) when Supabase is configured, otherwise
 * DEMO_CANDIDATE_SESSION below. Same pattern as lib/self-service/session.ts
 * and lib/workforce/session.ts.
 */

export type CandidateSession = {
  candidateId: string;
  displayName: string;
  email: string;
};

/** Demo candidate portal user: Priya Shah (mid-pipeline on a seeded application). */
export const DEMO_CANDIDATE_SESSION: CandidateSession = {
  candidateId: "cand-demo-001",
  displayName: "Priya Shah",
  email: "priya.shah@example.demo",
};

export async function getCandidateSession(): Promise<CandidateSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_CANDIDATE_SESSION;

  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser || !platformUser.candidateId) {
    redirect("/login");
  }

  const profile = await recruitingRepository.getCandidateProfile(
    platformUser.candidateId,
  );
  if (!profile) redirect("/login");

  return {
    candidateId: profile.candidate.id,
    displayName:
      profile.candidate.preferredName ||
      `${profile.candidate.firstName} ${profile.candidate.lastName}`,
    email: profile.candidate.email,
  };
}
