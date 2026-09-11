/**
 * ATS ops regression — pages, transition rules, interview/offer reads.
 * Usage: npx tsx --env-file=.env.local scripts/ats-regression.ts
 */
import { readdir, access } from "node:fs/promises";
import path from "node:path";

import { canTransitionApplication } from "../lib/recruiting/status-machine";
import { candidateStageFor } from "../lib/recruiting/candidate-stage";
import { loadAtsDashboard } from "../lib/ats/ops";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function exists(rel: string) {
  const full = path.resolve(import.meta.dirname, "..", rel);
  try {
    await access(full);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  check(canTransitionApplication("APPLIED", "REVIEW"), "APPLIED can move to REVIEW");
  check(canTransitionApplication("APPLIED", "INTERVIEW"), "APPLIED can move to INTERVIEW");
  check(!canTransitionApplication("HIRED", "INTERVIEW"), "HIRED cannot move back to INTERVIEW");
  check(candidateStageFor("OFFER") === "Offer", "OFFER maps to Offer stage");
  check(candidateStageFor("HIRED") === "Decision", "HIRED maps to Decision stage");

  for (const rel of [
    "app/(workforce-app)/app/recruiting/page.tsx",
    "app/(workforce-app)/app/recruiting/interviews/page.tsx",
    "app/(workforce-app)/app/recruiting/offers/page.tsx",
    "app/(workforce-app)/app/recruiting/applications/[applicationId]/page.tsx",
    "lib/ats/ops.ts",
  ]) {
    check(await exists(rel), `${rel} exists`);
  }

  const dash = await loadAtsDashboard();
  check(typeof dash.metrics.openRequisitions === "number", "ATS open requisitions is numeric");
  check(typeof dash.metrics.activeApplications === "number", "ATS active applications is numeric");
  check(Array.isArray(dash.pipeline), "ATS pipeline stages are present");
  check(
    dash.pipeline.every((s) => typeof s.count === "number"),
    "ATS pipeline counts are real numbers (may be zero)",
  );

  if (failed > 0) process.exit(1);
  console.log("PASS  ats");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
