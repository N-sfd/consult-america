/**
 * Hire lineage + concurrent hire regression. Cleans up only rows it creates.
 * Usage: npx tsx --env-file=.env.local scripts/hire-lineage-regression.ts
 */
import pg from "pg";

function assert(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  console.log(`PASS  ${message}`);
}

type OrgRow = {
  requisition_id: string;
  job_id: string;
  department_id: string;
  position_id: string;
  location_id: string;
  business_unit_id: string;
  legal_entity_id: string;
  employment_type: string;
  workplace_type: string;
};

async function loadOrg(client: pg.Client): Promise<OrgRow> {
  const { rows } = await client.query(`
    SELECT r.id AS requisition_id,
           j.id AS job_id,
           r.department_id,
           r.position_id,
           r.location_id,
           d.business_unit_id,
           bu.legal_entity_id,
           r.employment_type,
           r.workplace_type
      FROM job_requisitions r
      JOIN jobs j ON j.requisition_id = r.id AND j.status = 'PUBLISHED'
      JOIN departments d ON d.id = r.department_id
      JOIN business_units bu ON bu.id = d.business_unit_id
     LIMIT 1
  `);
  if (!rows[0]) throw new Error("No published job with org placement for hire fixture");
  return rows[0] as OrgRow;
}

async function seedHireFixture(
  client: pg.Client,
  org: OrgRow,
  suffix: string,
) {
  const ids = {
    candidateId: `cand-hire-${suffix}`,
    docId: `doc-hire-${suffix}`,
    applicationId: `app-hire-${suffix}`,
    offerId: `offer-hire-${suffix}`,
    interviewId: `int-hire-${suffix}`,
  };

  await client.query(
    `INSERT INTO candidate_profiles (id, first_name, last_name, email)
     VALUES ($1, 'Hire', 'Lineage', $2)`,
    [ids.candidateId, `hire-${suffix}@example.invalid`],
  );
  await client.query(
    `INSERT INTO documents (
       id, candidate_id, document_type, file_name, storage_path,
       is_primary_resume, status
     ) VALUES ($1, $2, 'RESUME', 'resume-v1.pdf', $3, TRUE, 'ACTIVE')`,
    [ids.docId, ids.candidateId, `${ids.candidateId}/${ids.docId}/resume-v1.pdf`],
  );
  await client.query(
    `INSERT INTO applications (
       id, application_number, candidate_id, requisition_id, job_id, status
     ) VALUES ($1, $2, $3, $4, $5, 'APPLIED')`,
    [
      ids.applicationId,
      `APP-HIRE-${suffix}`,
      ids.candidateId,
      org.requisition_id,
      org.job_id,
    ],
  );
  await client.query(
    `INSERT INTO application_documents (
       id, application_id, document_id, purpose, document_role
     ) VALUES ($1, $2, $3, 'RESUME', 'RESUME')`,
    [`appdoc-hire-${suffix}`, ids.applicationId, ids.docId],
  );

  for (const status of ["RECRUITER_SCREEN", "INTERVIEW", "OFFER"] as const) {
    await client.query(
      `SELECT application_status_transition($1, $2, NULL, $3, FALSE)`,
      [ids.applicationId, status, `lineage ${status}`],
    );
  }

  await client.query(
    `INSERT INTO interviews (
       id, application_id, interview_type, status, scheduled_at, duration_minutes
     ) VALUES ($1, $2, 'VIDEO', 'COMPLETED', now(), 60)`,
    [ids.interviewId, ids.applicationId],
  );

  await client.query(
    `INSERT INTO offers (
       id, application_id, offer_number, status, currency,
       employment_type, workplace_type, start_date, base_salary
     ) VALUES ($1, $2, $3, 'EXTENDED', 'USD', $4, $5, CURRENT_DATE + 14, 90000)`,
    [
      ids.offerId,
      ids.applicationId,
      `OFFER-HIRE-${suffix}`,
      org.employment_type,
      org.workplace_type,
    ],
  );
  await client.query(`UPDATE offers SET status = 'ACCEPTED' WHERE id = $1`, [
    ids.offerId,
  ]);

  return ids;
}

async function hire(client: pg.Client, org: OrgRow, ids: {
  applicationId: string;
  offerId: string;
  candidateId: string;
}) {
  const { rows } = await client.query(
    `SELECT convert_accepted_offer_to_employee(
       $1, $2, $3, 'Hire', 'Lineage', $4, NULL, CURRENT_DATE + 14,
       $5, $6, $7, $8, $9, NULL, $10, $11
     ) AS result`,
    [
      ids.applicationId,
      ids.offerId,
      ids.candidateId,
      `hire-person-${ids.candidateId}@example.invalid`,
      org.legal_entity_id,
      org.business_unit_id,
      org.department_id,
      org.position_id,
      org.location_id,
      org.employment_type,
      org.workplace_type,
    ],
  );
  return rows[0].result as {
    employeeId: string;
    employeeNumber: string;
    reused?: boolean;
  };
}

async function cleanup(client: pg.Client, ids: {
  candidateId: string;
  applicationId: string;
  offerId: string;
}) {
  await client.query("BEGIN");
  await client.query(
    `DELETE FROM recruiting_activities
      WHERE candidate_id = $1 OR application_id = $2`,
    [ids.candidateId, ids.applicationId],
  );
  await client.query(
    `DELETE FROM application_status_history WHERE application_id = $1`,
    [ids.applicationId],
  );
  await client.query(
    `DELETE FROM interview_feedback
      WHERE interview_id IN (SELECT id FROM interviews WHERE application_id = $1)`,
    [ids.applicationId],
  );
  await client.query(`DELETE FROM interviews WHERE application_id = $1`, [
    ids.applicationId,
  ]);
  await client.query(
    `DELETE FROM application_documents WHERE application_id = $1`,
    [ids.applicationId],
  );
  await client.query(`DELETE FROM offers WHERE id = $1`, [ids.offerId]);

  const employees = await client.query(
    `SELECT id FROM employee_profiles
      WHERE source_application_id = $1 OR source_offer_id = $2 OR candidate_id = $3`,
    [ids.applicationId, ids.offerId, ids.candidateId],
  );
  for (const row of employees.rows) {
    await client.query(`DELETE FROM onboarding_tasks WHERE employee_id = $1`, [
      row.id,
    ]);
    await client.query(
      `DELETE FROM onboarding_records WHERE employee_id = $1`,
      [row.id],
    );
    await client.query(`DELETE FROM job_assignments WHERE employee_id = $1`, [
      row.id,
    ]);
    await client.query(`DELETE FROM hr_events WHERE employee_id = $1`, [row.id]);
    await client.query(
      `DELETE FROM employee_status_history WHERE employee_id = $1`,
      [row.id],
    );
    await client.query(`DELETE FROM employee_profiles WHERE id = $1`, [row.id]);
  }

  await client.query(`DELETE FROM applications WHERE id = $1`, [
    ids.applicationId,
  ]);
  await client.query(`DELETE FROM documents WHERE candidate_id = $1`, [
    ids.candidateId,
  ]);
  await client.query(`DELETE FROM candidate_profiles WHERE id = $1`, [
    ids.candidateId,
  ]);
  await client.query("COMMIT");
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const org = await loadOrg(client);

  const feedbackPolicy = await client.query(`
    SELECT qual FROM pg_policies
     WHERE tablename = 'interview_feedback'
       AND policyname = 'interview_feedback_staff'
  `);
  const qual = String(feedbackPolicy.rows[0]?.qual ?? "");
  assert(
    qual.includes("is_recruiting_staff") && !qual.includes("'EMPLOYEE'"),
    "interview feedback policy does not grant EMPLOYEE access",
  );

  const suffix = crypto.randomUUID().slice(0, 8);
  await client.query("BEGIN");
  try {
    const ids = await seedHireFixture(client, org, suffix);
    const first = await hire(client, org, ids);
    const second = await hire(client, org, ids);

    const employees = await client.query(
      `SELECT id, candidate_id, source_application_id, job_requisition_id, source_offer_id
         FROM employee_profiles
        WHERE source_offer_id = $1 OR source_application_id = $2`,
      [ids.offerId, ids.applicationId],
    );
    assert(employees.rows.length === 1, "exactly one employee after two hires");
    assert(first.employeeId === second.employeeId, "second hire reuses the same employee");
    assert(second.reused === true, "second hire is marked reused");
    assert(employees.rows[0].candidate_id === ids.candidateId, "employee.candidate_id is correct");
    assert(
      employees.rows[0].source_application_id === ids.applicationId,
      "employee.hired_application_id is correct",
    );
    assert(
      employees.rows[0].job_requisition_id === org.requisition_id,
      "employee.job_requisition_id is correct",
    );
    assert(employees.rows[0].source_offer_id === ids.offerId, "employee stays linked to the accepted offer");

    const application = await client.query(
      `SELECT status FROM applications WHERE id = $1`,
      [ids.applicationId],
    );
    assert(application.rows[0].status === "HIRED", "application is HIRED");

    const hiredHistory = await client.query(
      `SELECT count(*)::int AS n
         FROM application_status_history
        WHERE application_id = $1 AND to_status = 'HIRED'`,
      [ids.applicationId],
    );
    assert(hiredHistory.rows[0].n === 1, "status history contains one HIRED event");

    const resume = await client.query(
      `SELECT document_id FROM application_documents
        WHERE application_id = $1 AND document_role = 'RESUME'`,
      [ids.applicationId],
    );
    assert(resume.rows[0].document_id === ids.docId, "submitted resume remains unchanged");

    const offer = await client.query(
      `SELECT application_id, status, accepted_at FROM offers WHERE id = $1`,
      [ids.offerId],
    );
    assert(offer.rows[0].application_id === ids.applicationId, "accepted offer remains linked to the application");
    assert(offer.rows[0].status === "ACCEPTED", "accepted offer remains accepted");
    assert(offer.rows[0].accepted_at != null, "offer acceptance records accepted_at");

    const candidate = await client.query(
      `SELECT id FROM candidate_profiles WHERE id = $1`,
      [ids.candidateId],
    );
    assert(candidate.rows.length === 1, "candidate record remains after hire");

    const hireEvents = await client.query(
      `SELECT count(*)::int AS n
         FROM recruiting_activities
        WHERE application_id = $1 AND activity_type = 'CANDIDATE_HIRED'`,
      [ids.applicationId],
    );
    assert(hiredHistory.rows[0].n === 1 && hireEvents.rows[0].n === 1, "idempotent hire does not duplicate hire audit");

    await client.query("SAVEPOINT reject_backward");
    let backwardBlocked = false;
    try {
      await client.query(
        `SELECT application_status_transition($1, 'INTERVIEW', NULL, 'should fail', FALSE)`,
        [ids.applicationId],
      );
    } catch (err) {
      backwardBlocked =
        err instanceof Error && err.message.includes("Invalid application transition");
      await client.query("ROLLBACK TO SAVEPOINT reject_backward");
    }
    assert(backwardBlocked, "HIRED cannot move backward to INTERVIEW");

    await client.query("SAVEPOINT reject_repoint");
    let repointError = "";
    try {
      await client.query(`UPDATE offers SET application_id = 'other-app' WHERE id = $1`, [
        ids.offerId,
      ]);
    } catch (err) {
      repointError = err instanceof Error ? err.message : String(err);
      await client.query("ROLLBACK TO SAVEPOINT reject_repoint");
    }
    assert(
      repointError.includes("cannot be repointed"),
      "accepted offer cannot be repointed",
    );

    const pending = await client.query(
      `SELECT count(*)::int AS n
         FROM recruiting_activities
        WHERE candidate_id = $1 AND activity_type = 'EMPLOYEE_ROLE_PENDING'`,
      [ids.candidateId],
    );
    assert(pending.rows[0].n === 1, "hire without a profile records pending role provisioning");
  } finally {
    await client.query("ROLLBACK");
  }

  const concurrentSuffix = crypto.randomUUID().slice(0, 8);
  const ids = await seedHireFixture(client, org, concurrentSuffix);
  const left = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  const right = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await left.connect();
  await right.connect();
  try {
    const results = await Promise.allSettled([
      hire(left, org, ids),
      hire(right, org, ids),
    ]);
    const fulfilled = results.filter((result) => result.status === "fulfilled");
    assert(fulfilled.length >= 1, "at least one concurrent hire succeeded");

    const employees = await client.query(
      `SELECT id FROM employee_profiles
        WHERE source_application_id = $1 OR source_offer_id = $2`,
      [ids.applicationId, ids.offerId],
    );
    assert(employees.rows.length === 1, "concurrent hire creates exactly one employee");

    const application = await client.query(
      `SELECT status FROM applications WHERE id = $1`,
      [ids.applicationId],
    );
    assert(application.rows[0].status === "HIRED", "concurrent hire leaves application HIRED");

    const hiredHistory = await client.query(
      `SELECT count(*)::int AS n
         FROM application_status_history
        WHERE application_id = $1 AND to_status = 'HIRED'`,
      [ids.applicationId],
    );
    assert(hiredHistory.rows[0].n === 1, "concurrent hire writes one HIRED history row");
  } finally {
    await left.end();
    await right.end();
    await cleanup(client, ids);
  }

  await client.end();
  console.log("PASS  hire lineage and concurrency");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
