import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access using the service-role key.
 * Every caller must handle a `null` client — this project runs without a
 * configured Supabase project until one is provisioned, and nothing here
 * may throw or crash a page render when that's the case.
 */

let cachedClient: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseServiceClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  if (!isSupabaseConfigured()) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } },
  );

  return cachedClient;
}
