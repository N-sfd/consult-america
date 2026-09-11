/**
 * Job analyzer regression — explainable scoring, safety invariants.
 * Usage: npx tsx --env-file=.env.local scripts/job-analyzer-regression.ts
 */
import { access } from "node:fs/promises";
import path from "node:path";

import { analyzeJobMatch } from "../lib/recruiting/candidate-match";

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
  check(await exists("app/(workforce-app)/app/recruiting/job-match/page.tsx"), "job-match page exists");
  check(
    await exists("components/workforce-app/recruiting/candidate-match-form.tsx"),
    "candidate match form exists",
  );

  const jd = `
    Senior Business Analyst
    Required: Salesforce, requirements gathering, business analysis
    Preferred: CPQ experience, Salesforce certification
  `;
  const resume = `
    Business Analyst with Salesforce administration and requirements gathering.
    Delivered stakeholder workshops and process documentation.
  `;

  const result = analyzeJobMatch({
    jobDescription: jd,
    resumeText: resume,
    candidateSkills: ["Salesforce", "business analysis", "requirements gathering"],
  });
  check(typeof result.overallMatch === "number", "overall match score is numeric");
  check(result.overallMatch >= 0 && result.overallMatch <= 100, "score is within 0-100");
  check(result.skillsFound.length > 0, "matched requirements are explainable");
  check(Array.isArray(result.skillsMissing), "potential gaps are listed");
  check(typeof result.experienceAlignment === "string", "experience alignment explanation exists");

  const again = analyzeJobMatch({
    jobDescription: jd,
    resumeText: resume,
    candidateSkills: ["Salesforce", "business analysis", "requirements gathering"],
  });
  check(
    again.overallMatch === result.overallMatch,
    "same inputs produce deterministic score for comparison",
  );

  const protectedish = analyzeJobMatch({
    jobDescription: "Engineer in New York",
    resumeText: "Engineer. Age 42. Female. Christian. Married. From Mexico.",
    candidateSkills: ["engineering"],
  });
  check(
    !protectedish.skillsFound.some((s) =>
      /age|female|christian|married|mexico|race|gender/i.test(s),
    ),
    "scoring features do not surface protected-characteristic tokens as matches",
  );

  if (failed > 0) process.exit(1);
  console.log("PASS  job-analyzer");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
