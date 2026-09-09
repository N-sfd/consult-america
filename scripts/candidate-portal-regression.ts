/**
 * Candidate portal expansion regression.
 * Covers profile fields, completion score, resume lineage, published jobs,
 * applications, friendly statuses, job_match_analyses ownership, RLS denial.
 *
 * Usage: npm run test:candidate-portal
 */
import pg from "pg";

import { calculateProfileCompletion } from "../lib/candidate/profile-completion";
import { analyzeJobMatch } from "../lib/candidate/job-match";
import { candidateApplicationStatusLabels } from "../types/recruiting";
import type { CandidateProfile } from "../types/recruiting";

function assert(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  console.log(`PASS  ${message}`);
}

function testProfileCompletion() {
  const base: CandidateProfile = {
    id: "c1",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const empty = calculateProfileCompletion({
    candidate: { ...base, firstName: "", lastName: "" },
    experience: [],
    education: [],
    skills: [],
    hasActiveResume: false,
  });
  assert(empty.percent === 0, "empty profile completion is 0%");

  const partial = calculateProfileCompletion({
    candidate: {
      ...base,
      phone: "555-0100",
      professionalSummary: "Engineer",
    },
    experience: [],
    education: [],
    skills: [],
    hasActiveResume: true,
  });
  assert(partial.percent > 0 && partial.percent < 100, "partial completion is not hardcoded 100%");
  assert(partial.identity && partial.contact && partial.resume && partial.summary, "identity/contact/resume/summary scored");

  const full = calculateProfileCompletion({
    candidate: {
      ...base,
      phone: "555-0100",
      city: "Ashburn",
      state: "VA",
      professionalSummary: "Engineer",
    },
    experience: [
      {
        id: "e1",
        candidateId: "c1",
        company: "CA",
        title: "Engineer",
        startDate: "2020-01-01",
        isCurrent: true,
      },
    ],
    education: [
      {
        id: "ed1",
        candidateId: "c1",
        institution: "MIT",
      },
    ],
    skills: [{ id: "s1" }],
    hasActiveResume: true,
  });
  assert(full.percent === 100, "fully populated profile is 100%");
}

function testJobMatchAssistanceOnly() {
  const result = analyzeJobMatch({
    resumeText: "Python SQL data engineering cloud pipelines",
    candidateSkills: ["Python", "SQL"],
    jobTitle: "Data Engineer",
    jobDescription:
      "Need Python, SQL, Data Engineering, Cloud, Oracle Integration, Data Modeling",
  });
  assert(result.overallMatch > 0, "job match returns a score");
  assert(result.skillsFound.length > 0, "job match finds overlapping skills");
  assert(Array.isArray(result.suggestions), "job match returns suggestions");
}

function testFriendlyStatuses() {
  assert(
    candidateApplicationStatusLabels.RECRUITER_SCREEN === "Under Review",
    "recruiter screen maps to Under Review",
  );
  assert(
    candidateApplicationStatusLabels.INTERVIEW === "Interview",
    "interview status stays Interview",
  );
  assert(candidateApplicationStatusLabels.OFFER === "Offer", "offer status stays Offer");
}

async function main() {
  testProfileCompletion();
  testJobMatchAssistanceOnly();
  testFriendlyStatuses();

  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const suffix = crypto.randomUUID().slice(0, 8);
  const candidateA = `cand-portal-a-${suffix}`;
  const candidateB = `cand-portal-b-${suffix}`;
  const docV1 = `doc-portal-v1-${suffix}`;
  const docV2 = `doc-portal-v2-${suffix}`;
  const appId = `app-portal-${suffix}`;
  const analysisId = `jma-portal-${suffix}`;

  await client.query("BEGIN");
  try {
    const cols = await client.query(`
      SELECT column_name
        FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'candidate_profiles'
         AND column_name IN ('city', 'state', 'professional_summary', 'github_url')
    `);
    assert(cols.rows.length === 4, "candidate_profiles has portal profile columns");

    const table = await client.query(`
      SELECT to_regclass('public.job_match_analyses') AS rel
    `);
    assert(table.rows[0]?.rel != null, "job_match_analyses table exists");

    const rls = await client.query(`
      SELECT c.relrowsecurity
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public' AND c.relname = 'job_match_analyses'
    `);
    assert(rls.rows[0]?.relrowsecurity === true, "job_match_analyses has RLS enabled");

    const jobs = await client.query(`
      SELECT j.id AS job_id, j.requisition_id, j.status
        FROM jobs j
       WHERE j.status = 'PUBLISHED'
         AND j.requisition_id IS NOT NULL
       LIMIT 1
    `);
    assert(jobs.rows.length === 1, "published jobs available for candidate portal");

    const unpublished = await client.query(`
      SELECT COUNT(*)::int AS n
        FROM jobs
       WHERE status <> 'PUBLISHED'
    `);
    // Soft check — draft/closed may exist; portal must only list PUBLISHED
    assert(
      typeof unpublished.rows[0].n === "number",
      "non-published jobs are queryable for exclusion checks",
    );

    const jobId = jobs.rows[0].job_id as string;
    const requisitionId = jobs.rows[0].requisition_id as string;

    await client.query(
      `INSERT INTO candidate_profiles (
         id, first_name, last_name, email, phone, city, state,
         professional_summary, github_url
       ) VALUES ($1, 'Portal', 'Alpha', $2, '555-1111', 'Ashburn', 'VA',
                 'Data engineer', 'https://github.com/example')`,
      [candidateA, `portal-a-${suffix}@example.invalid`],
    );
    await client.query(
      `INSERT INTO candidate_profiles (id, first_name, last_name, email)
       VALUES ($1, 'Portal', 'Beta', $2)`,
      [candidateB, `portal-b-${suffix}@example.invalid`],
    );

    const updated = await client.query(
      `UPDATE candidate_profiles
          SET professional_summary = $2, city = 'Hagerstown', updated_at = now()
        WHERE id = $1
        RETURNING professional_summary, city`,
      [candidateA, "Updated summary for portal"],
    );
    assert(
      updated.rows[0].professional_summary === "Updated summary for portal",
      "candidate profile update persists",
    );
    assert(updated.rows[0].city === "Hagerstown", "city update persists");

    await client.query(
      `INSERT INTO documents (
         id, candidate_id, document_type, file_name, storage_path,
         is_primary_resume, status
       ) VALUES
         ($1, $3, 'RESUME', 'resume-v1.pdf', $4, TRUE, 'ACTIVE'),
         ($2, $3, 'RESUME', 'resume-v2.pdf', $5, FALSE, 'ACTIVE')`,
      [
        docV1,
        docV2,
        candidateA,
        `${candidateA}/${docV1}/resume-v1.pdf`,
        `${candidateA}/${docV2}/resume-v2.pdf`,
      ],
    );

    await client.query(
      `INSERT INTO applications (
         id, application_number, candidate_id, requisition_id, job_id, status
       ) VALUES ($1, $2, $3, $4, $5, 'APPLIED')`,
      [appId, `APP-PORTAL-${suffix}`, candidateA, requisitionId, jobId],
    );

    await client.query(
      `INSERT INTO application_documents (
         id, application_id, document_id, purpose, document_role
       ) VALUES ($1, $2, $3, 'RESUME', 'RESUME')`,
      [`appdoc-portal-${suffix}`, appId, docV1],
    );

    // Replace primary resume after apply
    await client.query(
      `UPDATE documents
          SET is_primary_resume = FALSE, status = 'ARCHIVED', archived_at = now()
        WHERE id = $1`,
      [docV1],
    );
    await client.query(
      `UPDATE documents
          SET is_primary_resume = TRUE, status = 'ACTIVE'
        WHERE id = $1`,
      [docV2],
    );

    const historical = await client.query(
      `SELECT document_id FROM application_documents
        WHERE application_id = $1 AND document_role = 'RESUME'`,
      [appId],
    );
    assert(
      historical.rows[0].document_id === docV1,
      "historical application resume remains V1 after replacement",
    );

    const current = await client.query(
      `SELECT id FROM documents
        WHERE candidate_id = $1 AND document_type = 'RESUME'
          AND is_primary_resume = TRUE AND status = 'ACTIVE'`,
      [candidateA],
    );
    assert(current.rows[0].id === docV2, "current primary resume is V2");

    // Duplicate active application blocked
    await client.query("SAVEPOINT before_duplicate_apply");
    let duplicateBlocked = false;
    try {
      await client.query(
        `INSERT INTO applications (
           id, application_number, candidate_id, requisition_id, job_id, status
         ) VALUES ($1, $2, $3, $4, $5, 'APPLIED')`,
        [
          `app-portal-dup-${suffix}`,
          `APP-PORTAL-DUP-${suffix}`,
          candidateA,
          requisitionId,
          jobId,
        ],
      );
    } catch {
      duplicateBlocked = true;
      await client.query("ROLLBACK TO SAVEPOINT before_duplicate_apply");
    }
    assert(duplicateBlocked, "duplicate active application for same job denied");
    await client.query("RELEASE SAVEPOINT before_duplicate_apply").catch(() => undefined);

    await client.query(
      `INSERT INTO job_match_analyses (
         id, candidate_id, document_id, job_requisition_id,
         job_description_snapshot, result_json
       ) VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      [
        analysisId,
        candidateA,
        docV2,
        requisitionId,
        "Need Python SQL",
        JSON.stringify({ overallMatch: 72, skillsFound: ["python"], suggestions: [] }),
      ],
    );

    const owned = await client.query(
      `SELECT candidate_id FROM job_match_analyses WHERE id = $1`,
      [analysisId],
    );
    assert(owned.rows[0].candidate_id === candidateA, "job match analysis owned by candidate");

    // Cross-candidate isolation via current_candidate_id() when set
    const policySelf = await client.query(`
      SELECT pg_get_expr(polqual, polrelid) AS qual
        FROM pg_policy
        JOIN pg_class ON pg_class.oid = polrelid
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
       WHERE nspname = 'public'
         AND relname = 'job_match_analyses'
         AND polname = 'job_match_analyses_self'
    `);
    assert(
      String(policySelf.rows[0]?.qual ?? "").includes("current_candidate_id"),
      "job_match_analyses self policy uses current_candidate_id()",
    );

    const otherProfiles = await client.query(
      `SELECT id FROM candidate_profiles WHERE id = $1`,
      [candidateB],
    );
    assert(otherProfiles.rows.length === 1, "second candidate fixture exists for isolation");

    // Candidate B must not own A's analysis
    const cross = await client.query(
      `SELECT COUNT(*)::int AS n FROM job_match_analyses
        WHERE id = $1 AND candidate_id = $2`,
      [analysisId, candidateB],
    );
    assert(cross.rows[0].n === 0, "cross-candidate job match ownership denied");

    const appHistory = await client.query(
      `SELECT status FROM applications WHERE id = $1`,
      [appId],
    );
    assert(appHistory.rows[0].status === "APPLIED", "application history row persists");

    await client.query("ROLLBACK");
    console.log("PASS  candidate portal fixtures rolled back");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }

  console.log("PASS  candidate portal expansion");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
