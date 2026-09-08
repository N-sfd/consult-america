/**
 * Resume version lineage regression. Rolls back all fixture rows.
 * Usage: npx tsx --env-file=.env.local scripts/document-lineage-regression.ts
 */
import pg from "pg";

function assert(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  console.log(`PASS  ${message}`);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const jobs = await client.query(`
    SELECT DISTINCT ON (requisition_id) id, requisition_id
      FROM jobs
     WHERE status = 'PUBLISHED'
       AND requisition_id IS NOT NULL
     ORDER BY requisition_id
     LIMIT 2
  `);
  if (jobs.rows.length < 2) {
    throw new Error("Need two published jobs for Job A / Job B lineage fixture");
  }

  const suffix = crypto.randomUUID().slice(0, 8);
  const candidateId = `cand-lineage-${suffix}`;
  const docV1 = `doc-v1-${suffix}`;
  const docV2 = `doc-v2-${suffix}`;
  const appA = `app-a-${suffix}`;
  const appB = `app-b-${suffix}`;
  const requisitionA = jobs.rows[0].requisition_id as string;
  const jobAId = jobs.rows[0].id as string;
  const requisitionB = jobs.rows[1].requisition_id as string;
  const jobBId = jobs.rows[1].id as string;

  await client.query("BEGIN");
  try {
    await client.query(
      `INSERT INTO candidate_profiles (id, first_name, last_name, email)
       VALUES ($1, 'Lineage', 'Probe', $2)`,
      [candidateId, `lineage-${suffix}@example.invalid`],
    );

    await client.query(
      `INSERT INTO documents (
         id, candidate_id, document_type, file_name, storage_path,
         is_primary_resume, status, uploaded_at, updated_at
       ) VALUES
         ($1, $3, 'RESUME', 'resume-v1.pdf', $4, TRUE, 'ACTIVE', now(), now()),
         ($2, $3, 'RESUME', 'resume-v2.pdf', $5, FALSE, 'ACTIVE', now(), now())`,
      [
        docV1,
        docV2,
        candidateId,
        `${candidateId}/${docV1}/resume-v1.pdf`,
        `${candidateId}/${docV2}/resume-v2.pdf`,
      ],
    );

    await client.query(
      `INSERT INTO applications (
         id, application_number, candidate_id, requisition_id, job_id, status
       ) VALUES
         ($1, $2, $5, $6, $7, 'APPLIED'),
         ($3, $4, $5, $8, $9, 'APPLIED')`,
      [
        appA,
        `APP-A-${suffix}`,
        appB,
        `APP-B-${suffix}`,
        candidateId,
        requisitionA,
        jobAId,
        requisitionB,
        jobBId,
      ],
    );

    await client.query(
      `INSERT INTO application_documents (
         id, application_id, document_id, purpose, document_role, attached_at
       ) VALUES ($1, $2, $3, 'RESUME', 'RESUME', now())`,
      [`appdoc-a-${suffix}`, appA, docV1],
    );

    await client.query(
      `UPDATE documents
          SET is_primary_resume = FALSE,
              status = 'ARCHIVED',
              archived_at = now(),
              updated_at = now()
        WHERE id = $1`,
      [docV1],
    );
    await client.query(
      `UPDATE documents
          SET is_primary_resume = TRUE,
              status = 'ACTIVE',
              updated_at = now()
        WHERE id = $1`,
      [docV2],
    );

    await client.query(
      `INSERT INTO application_documents (
         id, application_id, document_id, purpose, document_role, attached_at
       ) VALUES ($1, $2, $3, 'RESUME', 'RESUME', now())`,
      [`appdoc-b-${suffix}`, appB, docV2],
    );

    const jobA = await client.query(
      `SELECT document_id FROM application_documents
        WHERE application_id = $1 AND document_role = 'RESUME'`,
      [appA],
    );
    assert(jobA.rows.length === 1, "Job A has one submitted resume");
    assert(jobA.rows[0].document_id === docV1, "Job A still points to resume V1");

    const current = await client.query(
      `SELECT id FROM documents
        WHERE candidate_id = $1
          AND document_type = 'RESUME'
          AND is_primary_resume = TRUE
          AND status = 'ACTIVE'`,
      [candidateId],
    );
    assert(current.rows.length === 1, "exactly one current primary resume");
    assert(current.rows[0].id === docV2, "current candidate resume is V2");

    const jobB = await client.query(
      `SELECT document_id FROM application_documents
        WHERE application_id = $1 AND document_role = 'RESUME'`,
      [appB],
    );
    assert(jobB.rows[0].document_id === docV2, "Job B points to resume V2");

    const v1 = await client.query(
      `SELECT storage_path, status FROM documents WHERE id = $1`,
      [docV1],
    );
    assert(v1.rows[0].status === "ARCHIVED", "V1 is archived, not deleted");
    assert(
      String(v1.rows[0].storage_path).includes(docV1),
      "V1 storage path is unchanged",
    );

    let blocked = false;
    try {
      await client.query(
        `UPDATE application_documents SET document_id = $2 WHERE application_id = $1`,
        [appA, docV2],
      );
    } catch (err) {
      blocked = err instanceof Error && err.message.includes("immutable");
    }
    assert(blocked, "Job A resume reference cannot be silently replaced");

    console.log("PASS  resume version lineage holds");
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
