/**
 * Check whether required ClientFlow Production env keys exist on Vercel.
 * Prints only SET/MISSING — never values.
 *
 * Usage: npx tsx --env-file=.env.local scripts/clientflow-vercel-env-sync.ts [--apply]
 */
import { spawnSync } from "node:child_process";

const REQUIRED = [
  "GMAIL_CLIENT_ID",
  "GMAIL_CLIENT_SECRET",
  "GMAIL_REFRESH_TOKEN",
  "GMAIL_FROM",
  "CLIENTFLOW_INTERNAL_NOTIFY_TO",
  "CLIENTFLOW_REQUIRE_GMAIL",
] as const;

const apply = process.argv.includes("--apply");

function listProductionNames(): Set<string> {
  const result = spawnSync("npx", ["vercel", "env", "ls", "production"], {
    encoding: "utf8",
    shell: true,
  });
  const text = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const names = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const m = line.trim().match(/^([A-Z][A-Z0-9_]+)\s+/);
    if (m) names.add(m[1]!);
  }
  return names;
}

function upsertProduction(key: string, value: string) {
  // Remove existing (ignore failure), then add.
  spawnSync("npx", ["vercel", "env", "rm", key, "production", "-y"], {
    encoding: "utf8",
    shell: true,
  });
  const added = spawnSync(
    "npx",
    ["vercel", "env", "add", key, "production"],
    {
      encoding: "utf8",
      shell: true,
      input: `${value}\n`,
    },
  );
  if (added.status !== 0) {
    throw new Error(`Failed to set ${key}: ${added.stderr || added.stdout}`);
  }
}

function main() {
  const existing = listProductionNames();
  console.log("Vercel Production ClientFlow env presence:");
  const missing: string[] = [];
  for (const key of REQUIRED) {
    const ok = existing.has(key);
    console.log(`${key}=${ok ? "SET" : "MISSING"}`);
    if (!ok) missing.push(key);
  }

  if (!apply) {
    if (missing.length) {
      console.log(`\n${missing.length} missing. Re-run with --apply to sync from .env.local.`);
      process.exit(2);
    }
    console.log("\nAll six required Production vars present.");
    return;
  }

  for (const key of REQUIRED) {
    const value = process.env[key];
    if (!value) {
      console.error(`Local .env.local missing ${key}; cannot apply.`);
      process.exit(1);
    }
  }

  for (const key of REQUIRED) {
    upsertProduction(key, process.env[key]!);
    console.log(`APPLIED ${key}`);
  }
  console.log("\nProduction env sync complete. Redeploy required.");
}

main();
