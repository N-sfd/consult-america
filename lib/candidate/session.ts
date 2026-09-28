import { assertDemoSessionAllowed, isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { redirectToAuthorizedLanding } from "@/lib/auth/roles";
import { recruitingRepository } from "@/lib/recruiting";

/**
 * Candidate Portal session — real (Supabase Auth + users/user_roles, linked
 * via candidate_id) when Supabase is configured, otherwise
 * DEMO_CANDIDATE_SESSION below. Same pattern as lib/self-service/session.ts
 * and lib/workforce/session.ts.
 */

export type CandidateSession = {
  candidateId: string;
  /** Platform profiles.id — needed for storage path ownership when Supabase is live */
  profileId?: string;
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
  if (!isSupabaseBrowserConfigured()) {
    assertDemoSessionAllowed("candidate");
    return DEMO_CANDIDATE_SESSION;
  }

  const platformUser = await getAuthenticatedPlatformUser();
  if (
    !platformUser ||
    !platformUser.candidateId ||
    !platformUser.roles.includes("CANDIDATE")
  ) {
    // Authenticated but not a candidate identity (e.g. an employee/recruiter
    // account) — send them to their own workspace, not back to /login
    // (which would loop: proxy.ts bounces an authenticated user hitting
    // /login straight back to a validated returnTo).
    redirectToAuthorizedLanding(platformUser?.roles ?? []);
  }

  const profile = await recruitingRepository.getCandidateProfile(
    platformUser.candidateId,
  );
  // A genuinely broken candidate_profiles link for an otherwise-valid
  // candidate identity — not a role mismatch, so there's no other page to
  // send them to. Surface it as a real error rather than redirect into the
  // same failure again.
  if (!profile) {
    throw new Error(
      `Candidate profile not found for candidateId ${platformUser.candidateId}`,
    );
  }

  return {
    candidateId: profile.candidate.id,
    profileId: platformUser.userId,
    displayName:
      profile.candidate.preferredName ||
      `${profile.candidate.firstName} ${profile.candidate.lastName}`,
    email: profile.candidate.email,
  };
}

/** Non-redirecting session for public pages (e.g. job apply document reuse). */
export async function getOptionalCandidateSession(): Promise<CandidateSession | null> {
  if (!isSupabaseBrowserConfigured()) return null;

  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser?.candidateId) return null;
  if (!platformUser.roles.includes("CANDIDATE")) return null;

  const profile = await recruitingRepository.getCandidateProfile(
    platformUser.candidateId,
  );
  if (!profile) return null;

  return {
    candidateId: profile.candidate.id,
    profileId: platformUser.userId,
    displayName:
      profile.candidate.preferredName ||
      `${profile.candidate.firstName} ${profile.candidate.lastName}`,
    email: profile.candidate.email,
  };
}
