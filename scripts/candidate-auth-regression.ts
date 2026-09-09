/**
 * Candidate auth experience: returnTo safety + role-gated portals.
 * Usage: npx tsx --env-file=.env.local scripts/candidate-auth-regression.ts
 */
import pg from "pg";

import {
  isCandidateReturnTo,
  isWorkforceReturnTo,
  sanitizeReturnTo,
} from "../lib/auth/return-to";
import { candidateApplicationStatusLabels } from "../types/recruiting";

function assert(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  console.log(`PASS  ${message}`);
}

function testReturnTo() {
  assert(sanitizeReturnTo("/candidate") === "/candidate", "candidate home returnTo allowed");
  assert(
    sanitizeReturnTo("/candidate/applications") === "/candidate/applications",
    "candidate nested returnTo allowed",
  );
  assert(sanitizeReturnTo("/employee") === "/employee", "employee returnTo allowed");
  assert(sanitizeReturnTo("/manager/approvals") === "/manager/approvals", "manager returnTo allowed");

  assert(sanitizeReturnTo("https://evil.example") === null, "absolute URL returnTo rejected");
  assert(sanitizeReturnTo("//evil.example") === null, "scheme-relative returnTo rejected");
  assert(sanitizeReturnTo("/\\evil") === null, "backslash returnTo rejected");
  assert(sanitizeReturnTo("/candidate/../employee") === null, "path traversal returnTo rejected");
  assert(sanitizeReturnTo("/login") === null, "unapproved internal path rejected");
  assert(sanitizeReturnTo("candidate") === null, "relative non-path rejected");
  assert(
    sanitizeReturnTo("/%2e%2e/employee") === null,
    "encoded traversal returnTo rejected",
  );

  assert(isCandidateReturnTo("/candidate"), "candidate context detected for /candidate");
  assert(isCandidateReturnTo("/candidate/documents"), "candidate context detected for nested path");
  assert(!isCandidateReturnTo("/employee"), "employee path is not candidate context");
  assert(isWorkforceReturnTo("/employee"), "workforce context detected for /employee");
  assert(isWorkforceReturnTo("/hr/requests"), "workforce context detected for /hr");
  assert(isWorkforceReturnTo("/crm"), "workforce context detected for /crm");
  assert(isWorkforceReturnTo("/payroll"), "workforce context detected for /payroll");
  assert(!isWorkforceReturnTo("/candidate"), "candidate path is not workforce context");
  assert(
    sanitizeReturnTo("/workforce/people") === "/workforce/people",
    "workforce people returnTo allowed",
  );
}

function testCandidateStatusLabels() {
  assert(
    candidateApplicationStatusLabels.RECRUITER_SCREEN === "Under Review",
    "RECRUITER_SCREEN shows Under Review",
  );
  assert(
    candidateApplicationStatusLabels.HIRING_MANAGER_REVIEW === "Under Review",
    "HIRING_MANAGER_REVIEW shows Under Review",
  );
  assert(
    candidateApplicationStatusLabels.INTERVIEW === "Interview",
    "INTERVIEW shows Interview",
  );
  assert(candidateApplicationStatusLabels.OFFER === "Offer", "OFFER shows Offer");
  assert(candidateApplicationStatusLabels.HIRED === "Hired", "HIRED shows Hired");
}

async function testRoleIsolation(client: pg.Client) {
  const feedbackPolicy = await client.query(`
    SELECT qual FROM pg_policies
     WHERE tablename = 'interview_feedback'
       AND policyname = 'interview_feedback_staff'
  `);
  const qual = String(feedbackPolicy.rows[0]?.qual ?? "");
  assert(
    qual.includes("is_recruiting_staff") && !qual.includes("'EMPLOYEE'"),
    "interview feedback remains unavailable to EMPLOYEE",
  );

  const candidateOnly = await client.query(`
    SELECT polname, pg_get_expr(polqual, polrelid) AS qual
      FROM pg_policy
      JOIN pg_class ON pg_class.oid = polrelid
     WHERE relname = 'candidate_profiles'
  `);
  assert(candidateOnly.rows.length > 0, "candidate_profiles has RLS policies");
}

async function main() {
  testReturnTo();
  testCandidateStatusLabels();

  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await testRoleIsolation(client);
  } finally {
    await client.end();
  }

  console.log("PASS  candidate auth experience");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
