/**
 * Compares every trigger's intended final state (derived from
 * DROP TRIGGER IF EXISTS / CREATE TRIGGER pairs across all migrations, in
 * order) against what is actually attached in the database. Catches a
 * trigger function being correct (see audit-function-drift.ts) while the
 * trigger itself is missing or points at the wrong function.
 *
 * Read-only — reports drift, does not fix it. If drift is found, fix it
 * with a new forward migration, never by editing a historical one.
 *
 * Usage: npm run db:audit-trigger-drift
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const root = path.resolve(import.meta.dirname, "..");
const schemaDir = path.join(root, "db", "schema");

type TriggerIntent = { name: string; table: string; fn: string | null; file: string; exists: boolean };

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const files = (await readdir(schemaDir))
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const intended = new Map<string, TriggerIntent>();
  const dropRe = /DROP\s+TRIGGER\s+IF\s+EXISTS\s+([a-zA-Z0-9_]+)\s+ON\s+(?:public\.)?([a-zA-Z0-9_]+)/gi;
  const createRe =
    /CREATE\s+TRIGGER\s+([a-zA-Z0-9_]+)\s+[\s\S]*?ON\s+(?:public\.)?([a-zA-Z0-9_]+)[\s\S]*?EXECUTE\s+FUNCTION\s+([a-zA-Z0-9_]+)\s*\(/gi;

  for (const file of files) {
    const sql = await readFile(path.join(schemaDir, file), "utf8");
    let m: RegExpExecArray | null;
    dropRe.lastIndex = 0;
    while ((m = dropRe.exec(sql))) {
      intended.set(`${m[1]}@${m[2]}`, { name: m[1], table: m[2], fn: null, file, exists: false });
    }
    createRe.lastIndex = 0;
    while ((m = createRe.exec(sql))) {
      intended.set(`${m[1]}@${m[2]}`, { name: m[1], table: m[2], fn: m[3], file, exists: true });
    }
  }

  const shouldExist = [...intended.values()].filter((t) => t.exists);

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const { rows: liveTriggers } = await client.query<{ name: string; table_name: string; fn: string }>(`
    SELECT t.tgname AS name, c.relname AS table_name, p.proname AS fn
      FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_proc p ON p.oid = t.tgfoid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE NOT t.tgisinternal AND n.nspname = 'public'
  `);
  const liveFnByKey = new Map(liveTriggers.map((r) => [`${r.name}@${r.table_name}`, r.fn]));

  const missing: TriggerIntent[] = [];
  const wrongFn: (TriggerIntent & { liveFn: string | undefined })[] = [];
  let okCount = 0;

  for (const t of shouldExist) {
    const key = `${t.name}@${t.table}`;
    const liveFn = liveFnByKey.get(key);
    if (liveFn === undefined) missing.push(t);
    else if (liveFn !== t.fn) wrongFn.push({ ...t, liveFn });
    else okCount++;
  }

  const status = missing.length || wrongFn.length ? "DRIFT" : "OK";
  const summary = `Checked ${shouldExist.length} triggers: ${okCount} ok, ${missing.length} missing, ${wrongFn.length} wrong function.`;
  await client.query(
    `INSERT INTO system_health_checks (id, check_name, status, summary, details, checked_at)
     VALUES ($1, 'trigger_drift', $2, $3, $4, now())`,
    [
      `shc-${crypto.randomUUID()}`,
      status,
      summary,
      JSON.stringify({
        missing: missing.map((t) => `${t.name}@${t.table}`),
        wrongFn: wrongFn.map((t) => `${t.name}@${t.table}`),
      }),
    ],
  );

  await client.end();

  console.log(`Checked ${shouldExist.length} triggers expected to exist.`);
  console.log(`OK: ${okCount}`);
  if (missing.length) {
    console.log(`\nMISSING (${missing.length}):`);
    missing.forEach((t) => console.log(`  - ${t.name} ON ${t.table} -> ${t.fn} (expected per ${t.file})`));
  }
  if (wrongFn.length) {
    console.log(`\nWRONG FUNCTION ATTACHED (${wrongFn.length}):`);
    wrongFn.forEach((t) =>
      console.log(`  - ${t.name} ON ${t.table}: expected ${t.fn}, live has ${t.liveFn} (expected per ${t.file})`),
    );
  }

  if (missing.length || wrongFn.length) {
    console.error(`\nFAIL: ${missing.length} missing, ${wrongFn.length} wrong. Fix with a new forward migration.`);
    process.exit(1);
  }
  console.log("\nPASS  no trigger drift detected");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
