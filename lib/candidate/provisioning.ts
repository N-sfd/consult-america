import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";

/**
 * Provisions a Candidate Portal sign-in for a newly-submitted application:
 * invites the candidate's email via Supabase Auth (sends them a "set your
 * password" email) and links the resulting auth user to a `users` row with
 * the CANDIDATE role, so `getAuthenticatedPlatformUser()` resolves them once
 * they finish the invite.
 *
 * No-ops when Supabase isn't configured (demo mode uses DEMO_CANDIDATE_SESSION
 * instead — see lib/candidate/session.ts). Never throws: provisioning the
 * portal account must never block the underlying application submission.
 */
export async function provisionCandidatePortalAccount(input: {
  candidateId: string;
  email: string;
  displayName: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const client = getSupabaseServiceClient();
  if (!client) return;

  try {
    const { data: existingUser } = await client
      .from("users")
      .select("id")
      .eq("candidate_id", input.candidateId)
      .maybeSingle();
    if (existingUser) return;

    const now = new Date().toISOString();
    const { data: invited, error: inviteError } =
      await client.auth.admin.inviteUserByEmail(input.email);
    if (inviteError || !invited?.user) {
      console.error(
        `Candidate portal invite failed for ${input.email}: ${inviteError?.message}`,
      );
      return;
    }

    const userId = `user-${input.candidateId}`;
    await client.from("users").insert({
      id: userId,
      email: input.email,
      display_name: input.displayName,
      candidate_id: input.candidateId,
      status: "INVITED",
      auth_user_id: invited.user.id,
      created_at: now,
      updated_at: now,
    });

    await client.from("user_roles").insert({
      id: `${userId}-candidate`,
      user_id: userId,
      role: "CANDIDATE",
    });
  } catch (error) {
    console.error("Candidate portal provisioning failed:", error);
  }
}
