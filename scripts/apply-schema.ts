/**
 * Apply db/schema/*.sql in order via the Postgres connection string.
 *
 * Requires DATABASE_URL in .env.local (Supabase → Project Settings → Database
 * → Connection string → URI). Example:
 *   postgresql://postgres.[ref]:[PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/apply-schema.ts
 *   npx tsx --env-file=.env.local scripts/apply-schema.ts --through=006
 *   npx tsx --env-file=.env.local scripts/apply-schema.ts --from=007 --through=012
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const root = path.resolve(import.meta.dirname, "..");
const schemaDir = path.join(root, "db", "schema");

function argValue(flag: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (eq) return eq.slice(flag.length + 1);
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.error(
      "Missing DATABASE_URL (or SUPABASE_DB_URL).\n" +
        "Add the Supabase Postgres URI to .env.local, then re-run.\n" +
        "Do not paste the DB password into chat — put it only in .env.local.",
    );
    process.exit(1);
  }

  const through = argValue("--through");
  const from = argValue("--from") ?? "001";

  const files = (await readdir(schemaDir))
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const selected = files.filter((f) => {
    const prefix = f.slice(0, 3);
    if (prefix < from) return false;
    if (through && prefix > through) return false;
    return true;
  });

  // Prefer 004_core_hr before 004_identity_auth_link when both share 004.
  selected.sort((a, b) => {
    if (a.startsWith("004_") && b.startsWith("004_")) {
      if (a.includes("core_hr")) return -1;
      if (b.includes("core_hr")) return 1;
    }
    return a.localeCompare(b, undefined, { numeric: true });
  });

  console.log(`Applying ${selected.length} migration(s)…`);
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    for (const file of selected) {
      const full = path.join(schemaDir, file);
      const sql = await readFile(full, "utf8");
      process.stdout.write(`  ${file} … `);
      try {
        await client.query(sql);
        console.log("ok");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("FAILED");
        console.error(`\nStopped on ${file}:\n${message}\n`);
        process.exit(1);
      }
    }
  } finally {
    await client.end();
  }

  console.log("\nAll selected migrations applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
