import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cookie-aware, anon-key Supabase client for real user auth (sign in/out,
 * session reads) inside Server Actions and Server Components. Distinct from
 * `getSupabaseServiceClient()` in ./server.ts, which is service-role and
 * `persistSession: false` — deliberately unusable for a real user session.
 * Returns `null` when Supabase isn't configured, same convention as the rest
 * of this module.
 *
 * Kept in its own file (not app/lib/supabase/server.ts) because it imports
 * `next/headers`, which cannot be pulled into any Client Component's module
 * graph — server.ts is imported by lib/recruiting, which the public job
 * board (a Client Component) also imports for its data layer.
 */
export async function getSupabaseServerAuthClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — a middleware/proxy
            // refresh (see app/lib/supabase/middleware.ts) keeps the
            // session cookie alive between requests in that case.
          }
        },
      },
    },
  );
}
