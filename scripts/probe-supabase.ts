/**
 * Lightweight connectivity + table presence check (no seed writes).
 * Usage: npx tsx --env-file=.env.local scripts/probe-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
});

const tables = [
  "legal_entities",
  "departments",
  "job_requisitions",
  "jobs",
  "job_postings",
  "candidate_profiles",
  "candidates",
  "applications",
  "employee_profiles",
  "employees",
  "profiles",
  "users",
] as const;

async function main() {
  console.log(`Project: ${url}`);
  for (const table of tables) {
    const { error, data } = await supabase.from(table).select("id").limit(1);
    if (error) {
      console.log(`  ${table}: MISSING/ERROR — ${error.message}`);
    } else {
      console.log(`  ${table}: ok (sample_rows=${data?.length ?? 0})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
