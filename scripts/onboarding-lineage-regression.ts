/**
 * Hire → employee onboarding handoff.
 * Usage: npx tsx --env-file=.env.local scripts/onboarding-lineage-regression.ts
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
  if (!rows[0]) throw new Error("No published job with org placement for onboarding fixture");
  return rows[0] as OrgRow;
}

async function seedHireFixture(
  client: pg.Client,
  org: OrgRow,
  suffix: string,
  withProfile = false,
) {
  const ids = {
    candidateId: `cand-onb-${suffix}`,
    docId: `doc-onb-${suffix}`,
    applicationId: `app-onb-${suffix}`,
    offerId: `offer-onb-${suffix}`,
    interviewId: `int-onb-${suffix}`,
    profileId: `prof-onb-${suffix}`,
  };

  await client.query(
    `INSERT INTO candidate_profiles (id, first_name, last_name, email)
     VALUES ($1, 'Onboard', 'Lineage', $2)`,
    [ids.candidateId, `onb-${suffix}@example.invalid`],
  );

  if (withProfile) {
    await client.query(
      `INSERT INTO profiles (id, email, display_name, status)
       VALUES ($1, $2, 'Onboard Lineage', 'ACTIVE')`,
      [ids.profileId, `onb-profile-${suffix}@example.invalid`],
    );
    await client.query(
      `UPDATE candidate_profiles SET profile_id = $2 WHERE id = $1`,
      [ids.candidateId, ids.profileId],
    );
  }

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
      `APP-ONB-${suffix}`,
      ids.candidateId,
      org.requisition_id,
      org.job_id,
    ],
  );
  await client.query(
    `INSERT INTO application_documents (
       id, application_id, document_id, purpose, document_role
     ) VALUES ($1, $2, $3, 'RESUME', 'RESUME')`,
    [`appdoc-onb-${suffix}`, ids.applicationId, ids.docId],
  );

  for (const status of ["RECRUITER_SCREEN", "INTERVIEW", "OFFER"] as const) {
    await client.query(
      `SELECT application_status_transition($1, $2, NULL, $3, FALSE)`,
      [ids.applicationId, status, `onboarding ${status}`],
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
      `OFFER-ONB-${suffix}`,
      org.employment_type,
      org.workplace_type,
    ],
  );
  await client.query(`UPDATE offers SET status = 'ACCEPTED' WHERE id = $1`, [
    ids.offerId,
  ]);

  return ids;
}

async function hire(
  client: pg.Client,
  org: OrgRow,
  ids: { applicationId: string; offerId: string; candidateId: string },
) {
  const { rows } = await client.query(
    `SELECT convert_accepted_offer_to_employee(
       $1, $2, $3, 'Onboard', 'Lineage', $4, NULL, CURRENT_DATE,
       $5, $6, $7, $8, $9, 'browser-manager-not-trusted', $10, $11
     ) AS result`,
    [
      ids.applicationId,
      ids.offerId,
      ids.candidateId,
      `onb-person-${ids.candidateId}@example.invalid`,
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
    onboardingId?: string;
    reused?: boolean;
  };
}

async function activityCount(
  client: pg.Client,
  candidateId: string,
  activityType: string,
) {
  const { rows } = await client.query(
    `SELECT count(*)::int AS n
       FROM recruiting_activities
      WHERE candidate_id = $1 AND activity_type = $2`,
    [candidateId, activityType],
  );
  return rows[0].n as number;
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
    "EMPLOYEE role does not grant interview feedback access",
  );

  const suffix = crypto.randomUUID().slice(0, 8);
  await client.query("BEGIN");
  try {
    const ids = await seedHireFixture(client, org, suffix, false);
    const first = await hire(client, org, ids);
    const second = await hire(client, org, ids);

    const employees = await client.query(
      `SELECT id, candidate_id, source_application_id, job_requisition_id,
              source_offer_id, hire_date, start_date, user_id,
              identity_provisioning_status, portal_access_status
         FROM employee_profiles
        WHERE source_offer_id = $1 OR source_application_id = $2`,
      [ids.offerId, ids.applicationId],
    );
    assert(employees.rows.length === 1, "no-profile hire creates one employee");
    assert(first.employeeId === second.employeeId, "second hire reuses the same employee");
    assert(second.reused === true, "second hire is marked reused");
    assert(employees.rows[0].candidate_id === ids.candidateId, "employee.candidate_id is correct");
    assert(
      employees.rows[0].source_application_id === ids.applicationId,
      "employee.source_application_id is correct",
    );
    assert(
      employees.rows[0].job_requisition_id === org.requisition_id,
      "employee.job_requisition_id is correct",
    );
    assert(employees.rows[0].user_id == null, "no profile means employee.user_id stays null");
    assert(
      employees.rows[0].identity_provisioning_status === "pending",
      "identity provisioning remains pending without a profile",
    );
    assert(
      employees.rows[0].portal_access_status === "pending",
      "portal access remains pending without a profile",
    );

    const offer = await client.query(
      `SELECT start_date FROM offers WHERE id = $1`,
      [ids.offerId],
    );
    const employeeStart = String(employees.rows[0].start_date).slice(0, 10);
    const offerStart = String(offer.rows[0].start_date).slice(0, 10);
    const hireDate = String(employees.rows[0].hire_date).slice(0, 10);
    assert(employeeStart === offerStart, "employee.start_date comes from the offer");
    assert(hireDate !== offerStart, "hire date is not inferred as the start date");

    const assignment = await client.query(
      `SELECT start_date, manager_employee_id
         FROM job_assignments
        WHERE employee_id = $1 AND primary_assignment`,
      [first.employeeId],
    );
    assert(
      String(assignment.rows[0].start_date).slice(0, 10) === offerStart,
      "assignment start date comes from the offer",
    );
    assert(
      assignment.rows[0].manager_employee_id == null ||
        assignment.rows[0].manager_employee_id !== "browser-manager-not-trusted",
      "browser manager id is not trusted",
    );

    const onboarding = await client.query(
      `SELECT id, status, started_at
         FROM onboarding_records
        WHERE employee_id = $1`,
      [first.employeeId],
    );
    assert(onboarding.rows.length === 1, "one onboarding instance");
    assert(onboarding.rows[0].status === "NOT_STARTED", "onboarding starts pending");
    assert(onboarding.rows[0].started_at != null, "onboarding records started_at");

    const view = await client.query(
      `SELECT status FROM employee_onboarding WHERE employee_id = $1`,
      [first.employeeId],
    );
    assert(view.rows[0].status === "pending", "employee_onboarding maps pending");

    const tasks = await client.query(
      `SELECT count(*)::int AS n, count(DISTINCT task_type)::int AS types
         FROM onboarding_tasks
        WHERE onboarding_id = $1`,
      [onboarding.rows[0].id],
    );
    assert(tasks.rows[0].n === 10, "default tasks created once");
    assert(tasks.rows[0].types === tasks.rows[0].n, "no duplicated onboarding task types");

    assert(
      (await activityCount(client, ids.candidateId, "ONBOARDING_CREATED")) === 1,
      "onboarding created is audited once",
    );
    assert(
      (await activityCount(client, ids.candidateId, "EMPLOYEE_ROLE_PENDING")) === 1,
      "pending identity is audited once",
    );
    assert(
      (await activityCount(client, ids.candidateId, "CANDIDATE_HIRED")) === 1,
      "hire audit is not duplicated on retry",
    );
    assert(
      (await activityCount(client, ids.candidateId, "EMPLOYEE_ROLE_ASSIGNED")) === 0,
      "no EMPLOYEE role assigned without a profile",
    );

    const candidate = await client.query(
      `SELECT profile_id FROM candidate_profiles WHERE id = $1`,
      [ids.candidateId],
    );
    assert(candidate.rows[0].profile_id == null, "no fabricated candidate profile");

    const application = await client.query(
      `SELECT status FROM applications WHERE id = $1`,
      [ids.applicationId],
    );
    assert(application.rows[0].status === "HIRED", "application remains HIRED");

    const resume = await client.query(
      `SELECT document_id FROM application_documents
        WHERE application_id = $1 AND document_role = 'RESUME'`,
      [ids.applicationId],
    );
    assert(resume.rows[0].document_id === ids.docId, "submitted resume stays on the application");

    const copied = await client.query(
      `SELECT count(*)::int AS n FROM employee_documents WHERE employee_id = $1`,
      [first.employeeId],
    );
    assert(copied.rows[0].n === 0, "recruiting documents are not copied into employee documents");

    const interview = await client.query(
      `SELECT count(*)::int AS n FROM interviews WHERE application_id = $1`,
      [ids.applicationId],
    );
    assert(interview.rows[0].n === 1, "interview history remains");

    await client.query("SAVEPOINT reject_complete");
    let blocked = false;
    try {
      await client.query(
        `UPDATE onboarding_records SET status = 'COMPLETED' WHERE id = $1`,
        [onboarding.rows[0].id],
      );
    } catch (err) {
      blocked =
        err instanceof Error &&
        err.message.includes("required tasks are complete");
      await client.query("ROLLBACK TO SAVEPOINT reject_complete");
    }
    assert(blocked, "onboarding cannot be marked completed before tasks are done");
  } finally {
    await client.query("ROLLBACK");
  }

  const profileSuffix = crypto.randomUUID().slice(0, 8);
  await client.query("BEGIN");
  try {
    const ids = await seedHireFixture(client, org, profileSuffix, true);
    const first = await hire(client, org, ids);
    const second = await hire(client, org, ids);

    const employees = await client.query(
      `SELECT id, user_id, identity_provisioning_status, portal_access_status
         FROM employee_profiles
        WHERE source_application_id = $1`,
      [ids.applicationId],
    );
    assert(employees.rows.length === 1, "existing-profile hire creates one employee");
    assert(first.employeeId === second.employeeId, "existing-profile second hire reuses employee");
    assert(
      employees.rows[0].user_id === ids.profileId,
      "employee is linked to the existing profile",
    );
    assert(
      employees.rows[0].identity_provisioning_status === "linked",
      "identity provisioning is linked",
    );
    assert(
      employees.rows[0].portal_access_status === "ready",
      "portal access is ready when a profile exists",
    );

    const resolved = await client.query(
      `SELECT id FROM employee_profiles WHERE user_id = $1`,
      [ids.profileId],
    );
    assert(resolved.rows.length === 1, "portal resolves one employee from the profile");
    assert(
      resolved.rows[0].id === first.employeeId,
      "portal resolves the hired employee",
    );

    const roles = await client.query(
      `SELECT count(*)::int AS n
         FROM user_roles
        WHERE user_id = $1 AND role = 'EMPLOYEE'`,
      [ids.profileId],
    );
    assert(roles.rows[0].n === 1, "EMPLOYEE role is assigned once");

    const onboarding = await client.query(
      `SELECT count(*)::int AS n FROM onboarding_records WHERE employee_id = $1`,
      [first.employeeId],
    );
    assert(onboarding.rows[0].n === 1, "existing-profile hire creates one onboarding instance");

    const tasks = await client.query(
      `SELECT count(*)::int AS n, count(DISTINCT task_type)::int AS types
         FROM onboarding_tasks
        WHERE employee_id = $1`,
      [first.employeeId],
    );
    assert(tasks.rows[0].n === tasks.rows[0].types, "retry does not duplicate default tasks");

    assert(
      (await activityCount(client, ids.candidateId, "PROFILE_LINKED")) === 1,
      "profile linked is audited once",
    );
    assert(
      (await activityCount(client, ids.candidateId, "EMPLOYEE_ROLE_ASSIGNED")) === 1,
      "employee role assigned is audited once",
    );
    assert(
      (await activityCount(client, ids.candidateId, "PORTAL_ACCESS_ENABLED")) === 1,
      "portal access enabled is audited once",
    );
    assert(
      (await activityCount(client, ids.candidateId, "ONBOARDING_CREATED")) === 1,
      "onboarding created is not duplicated when a profile exists",
    );
    assert(
      (await activityCount(client, ids.candidateId, "EMPLOYEE_ROLE_PENDING")) === 0,
      "linked profile does not stay pending",
    );

    const fabricatedAuth = await client.query(
      `SELECT auth_user_id FROM profiles WHERE id = $1`,
      [ids.profileId],
    );
    assert(fabricatedAuth.rows[0].auth_user_id == null, "no fabricated auth user");

    const candidate = await client.query(
      `SELECT id FROM candidate_profiles WHERE id = $1`,
      [ids.candidateId],
    );
    assert(candidate.rows.length === 1, "candidate history remains intact");
  } finally {
    await client.query("ROLLBACK");
  }

  await client.end();
  console.log("PASS  onboarding lineage");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
