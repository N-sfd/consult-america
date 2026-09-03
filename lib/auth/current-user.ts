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
 * Resolves the current request's Supabase Auth session (if any) to a
 * platform `users`/`user_roles` record. `cache()`-wrapped so every caller
 * within one render shares a single lookup. Returns `null` — never throws —
 * whenever there's no session, no matching `users` row, or Supabase auth
 * isn't configured (demo mode, see lib/self-service/session.ts).
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

    const { data: userRow } = await serviceClient
      .from("users")
      .select("id, email, display_name, employee_id, candidate_id")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (!userRow) return null;

    const { data: roleRows } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userRow.id);

    return {
      userId: userRow.id,
      authUserId: authUser.id,
      email: userRow.email,
      displayName: userRow.display_name,
      employeeId: userRow.employee_id ?? undefined,
      candidateId: userRow.candidate_id ?? undefined,
      roles: (roleRows ?? []).map((r) => r.role as PlatformRole),
    };
  },
);
