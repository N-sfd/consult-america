import { cache } from "react";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getSupabaseServerAuthClient } from "@/app/lib/supabase/auth-server";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import type { PlatformRole } from "@/types/identity";

export type AuthenticatedPlatformUser = {
  userId: string;
  authUserId: string;
  email: string;
  displayName: string;
  employeeId?: string;
  candidateId?: string;
  roles: PlatformRole[];
};

/**
 * Resolves the current Supabase Auth session to a platform `profiles` row
 * plus roles and linked employee/candidate IDs.
 *
 * Schema note (post 010–012): identity lives in `profiles`; employee link is
 * `employee_profiles.user_id`, candidate link is `candidate_profiles.profile_id`.
 * Returns `null` when demo mode / no session / no matching profile.
 */
export const getAuthenticatedPlatformUser = cache(
  async (): Promise<AuthenticatedPlatformUser | null> => {
    if (!isSupabaseBrowserConfigured()) return null;

    const authClient = await getSupabaseServerAuthClient();
    if (!authClient) return null;

    const {
      data: { user: authUser },
    } = await authClient.auth.getUser();
    if (!authUser) return null;

    const serviceClient = getSupabaseServiceClient();
    if (!serviceClient) return null;

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("id, email, display_name")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (!profile) return null;

    const [{ data: roleRows }, { data: employeeRow }, { data: candidateRow }] =
      await Promise.all([
        serviceClient.from("user_roles").select("role").eq("user_id", profile.id),
        serviceClient
          .from("employee_profiles")
          .select("id")
          .eq("user_id", profile.id)
          .maybeSingle(),
        serviceClient
          .from("candidate_profiles")
          .select("id")
          .eq("profile_id", profile.id)
          .maybeSingle(),
      ]);

    return {
      userId: profile.id,
      authUserId: authUser.id,
      email: profile.email,
      displayName: profile.display_name,
      employeeId: employeeRow?.id ?? undefined,
      candidateId: candidateRow?.id ?? undefined,
      roles: (roleRows ?? []).map((r) => r.role as PlatformRole),
    };
  },
);
