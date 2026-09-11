/**
 * HR workspace regression — people filters surface + overview invariants.
 * Usage: npx tsx --env-file=.env.local scripts/hr-regression.ts
 */
import { access, readFile } from "node:fs/promises";
import path from "node:path";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function exists(rel: string) {
  try {
    await access(path.resolve(import.meta.dirname, "..", rel));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  for (const rel of [
    "app/(workforce)/workforce/people/page.tsx",
    "components/workforce/people-filters.tsx",
    "components/workforce/employee-detail-tabs.tsx",
    "app/(hr)/hr/requests/page.tsx",
  ]) {
    check(await exists(rel), `${rel} exists`);
  }

  const people = await readFile(
    path.resolve(import.meta.dirname, "..", "app/(workforce)/workforce/people/page.tsx"),
    "utf8",
  );
  const filters = await readFile(
    path.resolve(import.meta.dirname, "..", "components/workforce/people-filters.tsx"),
    "utf8",
  );
  check(people.includes("PeopleFiltersBar"), "people directory uses filter bar");
  check(people.includes("Onboarding"), "people directory includes onboarding column");
  check(filters.includes("Clear filters"), "people clear filters available");

  const overview = await readFile(
    path.resolve(import.meta.dirname, "..", "components/workforce/employee-detail-tabs.tsx"),
    "utf8",
  );
  check(overview.includes("Pending document acknowledgments"), "employee overview shows pending acks");
  check(overview.includes("Open HR requests"), "employee overview shows open HR requests");

  const hr = await readFile(
    path.resolve(import.meta.dirname, "..", "app/(hr)/hr/requests/page.tsx"),
    "utf8",
  );
  check(hr.includes("Aging"), "HR queue includes operational aging indicator");
  check(hr.includes("not contractual SLA"), "HR aging is labeled non-contractual");

  if (failed > 0) process.exit(1);
  console.log("PASS  hr");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
