/**
 * V1.0 release gate — clean DB rebuild step 1: empty the `public` schema
 * (drop every table/view/function it contains) without dropping the schema
 * object itself, so Supabase's baseline schema-level grants to
 * anon/authenticated/service_role (set at project provisioning time, not by
 * any migration file) are never touched. `npm run db:migrate` then reapplies
 * db/schema/*.sql from 001 forward against a genuinely empty schema.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/reset-public-schema.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/reset-public-schema.ts --confirm
 */
import pg from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const confirm = process.argv.includes("--confirm");
  const dryRun = process.argv.includes("--dry-run") || !confirm;

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    const { rows: tables } = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`,
    );
    const { rows: views } = await client.query<{ viewname: string }>(
      `SELECT viewname FROM pg_views WHERE schemaname = 'public' ORDER BY viewname`,
    );
    const { rows: functions } = await client.query<{ proname: string; args: string }>(`
      SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
       WHERE n.nspname = 'public'
       ORDER BY p.proname
    `);

    console.log(`public schema currently has: ${tables.length} tables, ${views.length} views, ${functions.length} functions.`);
    console.log("Tables:", tables.map((t) => t.tablename).join(", "));
    console.log("Views:", views.map((v) => v.viewname).join(", "));

    if (dryRun) {
      console.log("\nDRY RUN — nothing dropped. Re-run with --confirm to actually empty the schema.");
      return;
    }

    console.log("\n--confirm passed. Dropping all views, tables, and functions in public...");

    for (const v of views) {
      await client.query(`DROP VIEW IF EXISTS public.${JSON.stringify(v.viewname).replace(/"/g, '"')} CASCADE`);
    }
    for (const t of tables) {
      await client.query(`DROP TABLE IF EXISTS public."${t.tablename.replace(/"/g, '""')}" CASCADE`);
    }
    for (const f of functions) {
      await client.query(`DROP FUNCTION IF EXISTS public."${f.proname.replace(/"/g, '""')}"(${f.args}) CASCADE`);
    }

    const { rows: remainingTables } = await client.query(
      `SELECT count(*)::int AS n FROM pg_tables WHERE schemaname = 'public'`,
    );
    const { rows: remainingFns } = await client.query(
      `SELECT count(*)::int AS n FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public'`,
    );
    console.log(`\nDone. Remaining in public: ${remainingTables[0].n} tables, ${remainingFns[0].n} functions.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
