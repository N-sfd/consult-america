/**
 * Least-privilege probes. Prints status only — never keys or row contents.
 * Usage: npx tsx --env-file=.env.local scripts/security-rls-test.ts
 */
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import WebSocket from "ws";

function required(value: string | undefined, name: string): string {
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

const url = required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
const anonKey = required(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
const databaseUrl = required(
  process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL,
  "DATABASE_URL",
);

const denied = new Set(["42501", "PGRST301", "PGRST116"]);
let failed = 0;

async function expectDenied(
  label: string,
  run: () => Promise<{ error: { code?: string; message: string } | null; count: number | null }>,
) {
  const { error, count } = await run();
  const blocked =
    Boolean(error) || count === 0 || count === null;
  if (!blocked) failed += 1;
  const status = blocked ? "PASS" : "FAIL";
  console.log(
    `${status}  ${label}  ${
      error ? `error=${error.code ?? "unknown"}` : `rows=${count}`
    }`,
  );
  return blocked;
}

async function expectAllowed(
  label: string,
  run: () => Promise<{ error: { code?: string; message: string } | null; count: number | null }>,
) {
  const { error, count } = await run();
  const ok = !error;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label}  ${
      error ? `error=${error.code ?? error.message}` : `rows=${count}`
    }`,
  );
  return ok;
}

async function main() {
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const open = await client.query(`
    SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relkind = 'r'
       AND NOT c.relrowsecurity
     ORDER BY 1
  `);
  if (open.rows.length > 0) failed += 1;
  console.log(
    open.rows.length === 0
      ? "PASS  no public tables with RLS disabled (rls_disabled_in_public cleared)"
      : `FAIL  RLS still disabled: ${open.rows.map((r) => r.relname).join(", ")}`,
  );

  const view = await client.query(`
    SELECT c.reloptions
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND c.relname = 'candidate_documents'
  `);
  const invoker = (view.rows[0]?.reloptions ?? []).some((opt: string) =>
    opt.includes("security_invoker=true"),
  );
  if (!invoker) failed += 1;
  console.log(
    invoker
      ? "PASS  candidate_documents view is security_invoker"
      : "FAIL  candidate_documents view can bypass RLS",
  );

  const buckets = await client.query(
    `SELECT id, public FROM storage.buckets ORDER BY id`,
  );
  const publicBuckets = buckets.rows.filter((row) => row.public);
  if (publicBuckets.length > 0) failed += 1;
  console.log(
    publicBuckets.length === 0
      ? "PASS  all storage buckets private"
      : `FAIL  public buckets: ${publicBuckets.map((r) => r.id).join(", ")}`,
  );

  const anonGrants = await client.query(`
    SELECT table_name, privilege_type
      FROM information_schema.role_table_grants
     WHERE table_schema = 'public'
       AND grantee = 'anon'
       AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
     ORDER BY table_name, privilege_type
  `);
  const unexpected = anonGrants.rows.filter(
    (row) => !(row.table_name === "jobs" && row.privilege_type === "SELECT"),
  );
  if (unexpected.length > 0) failed += 1;
  console.log(
    unexpected.length === 0
      ? "PASS  anon grants limited to jobs SELECT"
      : `FAIL  extra anon grants: ${unexpected
          .map((r) => `${r.table_name}:${r.privilege_type}`)
          .join(", ")}`,
  );

  await client.end();

  const anon = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
  });

  const probe = async (table: string) => {
    const { error, count } = await anon
      .from(table)
      .select("*", { count: "exact", head: true });
    return { error, count };
  };

  console.log("\n-- unauthenticated data API --");
  await expectAllowed("jobs published readable", async () => {
    const { error, count } = await anon
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "PUBLISHED");
    return { error, count };
  });

  for (const table of [
    "candidate_profiles",
    "applications",
    "employee_profiles",
    "documents",
    "candidate_documents",
    "offers",
    "interviews",
    "interview_feedback",
    "audit_logs",
    "compensation_records",
    "user_roles",
  ]) {
    await expectDenied(`${table} denied`, () => probe(table));
  }

  const insert = await anon.from("applications").insert({
    id: "rls-probe-should-fail",
    application_number: "RLS-PROBE",
    candidate_id: "cand-none",
    requisition_id: "req-none",
    job_id: "job-none",
    status: "APPLIED",
  });
  if (!insert.error) failed += 1;
  console.log(
    insert.error
      ? "PASS  anon INSERT applications denied"
      : "FAIL  anon INSERT applications succeeded",
  );

  void denied;
  if (failed > 0) {
    console.error(`\n${failed} RLS regression check(s) failed`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
