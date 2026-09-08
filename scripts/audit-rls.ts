/**
 * Read-only RLS / grant audit. Does not print connection secrets.
 * Usage: npx tsx --env-file=.env.local scripts/audit-rls.ts
 */
import pg from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const tables = await client.query(`
    SELECT n.nspname AS schema,
           c.relname AS name,
           c.relkind AS kind,
           c.relrowsecurity AS rls,
           c.relforcerowsecurity AS force_rls
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relkind IN ('r', 'v', 'p')
     ORDER BY c.relkind, c.relname
  `);

  console.log("=== PUBLIC RELATIONS ===");
  for (const row of tables.rows) {
    const kind = row.kind === "v" ? "view" : row.kind === "r" ? "table" : "other";
    console.log(
      `${kind}\t${row.name}\trls=${row.rls}\tforce=${row.force_rls}`,
    );
  }

  const policies = await client.query(`
    SELECT schemaname, tablename, policyname, roles, cmd, qual IS NOT NULL AS has_using
      FROM pg_policies
     WHERE schemaname IN ('public', 'storage')
     ORDER BY schemaname, tablename, policyname
  `);
  console.log("\n=== POLICIES ===");
  for (const row of policies.rows) {
    console.log(
      `${row.schemaname}.${row.tablename}\t${row.policyname}\t${row.cmd}\t${JSON.stringify(row.roles)}`,
    );
  }

  const grants = await client.query(`
    SELECT table_schema, table_name, grantee, privilege_type
      FROM information_schema.role_table_grants
     WHERE table_schema = 'public'
       AND grantee IN ('anon', 'authenticated', 'public')
     ORDER BY table_name, grantee, privilege_type
  `);
  console.log("\n=== GRANTS (anon/authenticated/public) ===");
  for (const row of grants.rows) {
    console.log(`${row.table_name}\t${row.grantee}\t${row.privilege_type}`);
  }

  const buckets = await client.query(`
    SELECT id, name, public FROM storage.buckets ORDER BY id
  `);
  console.log("\n=== STORAGE BUCKETS ===");
  for (const row of buckets.rows) {
    console.log(`${row.id}\tpublic=${row.public}`);
  }

  const exposed = await client.query(`
    SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relkind = 'r'
       AND NOT c.relrowsecurity
     ORDER BY 1
  `);
  console.log("\n=== TABLES WITH RLS DISABLED ===");
  for (const row of exposed.rows) console.log(row.relname);

  await client.end();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
