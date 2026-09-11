/**
 * Compares every SQL function's latest migration-defined body against what
 * is actually live in the database. Catches the class of bug fixed in
 * db/schema/029_restore_hire_conversion_function.sql: a CREATE OR REPLACE
 * FUNCTION that silently failed to take effect (e.g. from an out-of-order
 * partial `apply-schema.ts --from/--through` run), leaving a stale body
 * live while the migration files say something else.
 *
 * Read-only — reports drift, does not fix it. If drift is found, fix it
 * with a new forward migration that reissues the correct body (see 029),
 * never by editing the historical migration file.
 *
 * Usage: npm run db:audit-function-drift
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const root = path.resolve(import.meta.dirname, "..");
const schemaDir = path.join(root, "db", "schema");

/** Strip whitespace/comments/schema-qualification so cosmetic reformatting
 * (Postgres's canonical pretty-printer vs hand-written migration SQL) never
 * registers as drift — only real logic/identifier differences do. */
function fingerprint(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, "")
    .replace(/\bpublic\./gi, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function extractBody(statement: string): string | null {
  const afterHeader = statement.search(/\bAS\b/i);
  if (afterHeader === -1) return null;
  const dollarMatch = statement.slice(afterHeader).match(/\$([a-zA-Z_]*)\$/);
  if (!dollarMatch || dollarMatch.index === undefined) return null;
  const tag = `$${dollarMatch[1]}$`;
  const bodyStart = afterHeader + dollarMatch.index + tag.length;
  const bodyEnd = statement.indexOf(tag, bodyStart);
  if (bodyEnd === -1) return null;
  return statement.slice(bodyStart, bodyEnd);
}

type FnEntry = { statement: string; file: string };

function extractFunctions(sql: string, fileLabel: string, map: Map<string, FnEntry>) {
  const re = /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+([a-zA-Z0-9_]+)\s*\(/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    const name = m[1].toLowerCase();
    const startIdx = m.index;
    const afterHeader = sql.indexOf("AS", m.index);
    if (afterHeader === -1) continue;
    const dollarMatch = sql.slice(afterHeader).match(/\$([a-zA-Z_]*)\$/);
    if (!dollarMatch || dollarMatch.index === undefined) continue;
    const tag = `$${dollarMatch[1]}$`;
    const bodyStart = afterHeader + dollarMatch.index + tag.length;
    const bodyEnd = sql.indexOf(tag, bodyStart);
    if (bodyEnd === -1) continue;
    const semiIdx = sql.indexOf(";", bodyEnd + tag.length);
    map.set(name, { statement: sql.slice(startIdx, semiIdx + 1), file: fileLabel });
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const files = (await readdir(schemaDir))
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const latest = new Map<string, FnEntry>();
  for (const file of files) {
    const sql = await readFile(path.join(schemaDir, file), "utf8");
    extractFunctions(sql, file, latest);
  }

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const { rows: liveFns } = await client.query<{ name: string; def: string }>(`
    SELECT p.proname AS name, pg_get_functiondef(p.oid) AS def
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public' AND p.prokind = 'f'
  `);
  const liveMap = new Map<string, string[]>();
  for (const row of liveFns) {
    if (!liveMap.has(row.name)) liveMap.set(row.name, []);
    liveMap.get(row.name)!.push(row.def);
  }

  const clean: string[] = [];
  const missing: { name: string; file: string }[] = [];
  const drifted: { name: string; file: string; migrationBodyPreview: string }[] = [];

  for (const [name, { statement, file }] of latest) {
    const liveDefs = liveMap.get(name);
    if (!liveDefs || liveDefs.length === 0) {
      missing.push({ name, file });
      continue;
    }
    const migBody = extractBody(statement);
    if (migBody === null) {
      drifted.push({ name, file, migrationBodyPreview: "(could not parse migration body)" });
      continue;
    }
    const migBodyFp = fingerprint(migBody);
    const bodyMatch = liveDefs.some((def) => fingerprint(extractBody(def) ?? "") === migBodyFp);
    if (bodyMatch) clean.push(name);
    else drifted.push({ name, file, migrationBodyPreview: migBody.trim().slice(0, 300) });
  }

  const status = missing.length || drifted.length ? "DRIFT" : "OK";
  const summary = `Checked ${latest.size} functions: ${clean.length} clean, ${missing.length} missing, ${drifted.length} drifted.`;
  await client.query(
    `INSERT INTO system_health_checks (id, check_name, status, summary, details, checked_at)
     VALUES ($1, 'function_drift', $2, $3, $4, now())`,
    [
      `shc-${crypto.randomUUID()}`,
      status,
      summary,
      JSON.stringify({
        missing: missing.map((m) => m.name),
        drifted: drifted.map((d) => d.name),
      }),
    ],
  );

  await client.end();

  console.log(`Checked ${latest.size} functions across ${files.length} migration files.`);
  console.log(`CLEAN: ${clean.length}`);
  if (missing.length) {
    console.log(`\nMISSING FROM LIVE DB (${missing.length}):`);
    missing.forEach((m) => console.log(`  - ${m.name} (defined in ${m.file})`));
  }
  if (drifted.length) {
    console.log(`\nDRIFT (${drifted.length}) — live body does not match the latest migration-defined body:`);
    drifted.forEach((d) => {
      console.log(`  - ${d.name} (latest migration def in ${d.file})`);
      console.log(`    migration body starts: ${d.migrationBodyPreview}`);
    });
  }

  if (missing.length || drifted.length) {
    console.error(
      `\nFAIL: ${missing.length} missing, ${drifted.length} drifted. Fix with a new forward migration — never edit the historical file.`,
    );
    process.exit(1);
  }
  console.log("\nPASS  no function drift detected");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
