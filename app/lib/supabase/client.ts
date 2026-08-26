import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client using the public anon key. Not used by the
 * Workforce App shell/dashboard yet (those are server-rendered) — kept for
 * parity so future client components have a ready factory.
 */

let cachedClient: SupabaseClient | null | undefined;

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  if (!isSupabaseBrowserConfigured()) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  return cachedClient;
}
