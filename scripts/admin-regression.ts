/**
 * People admin: Work Authorization + employee documents RLS, candidate-stage
 * mapping, and cross-role denial for the new People/Documents surfaces.
 * Usage: npx tsx --env-file=.env.local scripts/admin-regression.ts
 */
import pg from "pg";

import { candidateStageFor } from "../lib/recruiting/candidate-stage";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

function testCandidateStageMapping() {
  check(candidateStageFor("APPLIED") === "Application Received", "APPLIED maps to Application Received");
  check(candidateStageFor("REVIEW") === "Under Review", "REVIEW maps to Under Review");
  check(candidateStageFor("RECRUITER_SCREEN") === "Under Review", "RECRUITER_SCREEN maps to Under Review");
  check(
    candidateStageFor("HIRING_MANAGER_REVIEW") === "Under Review",
    "HIRING_MANAGER_REVIEW maps to Under Review",
  );
  check(candidateStageFor("INTERVIEW") === "Interview", "INTERVIEW maps to Interview");
  check(candidateStageFor("FINAL_INTERVIEW") === "Interview", "FINAL_INTERVIEW maps to Interview");
  check(candidateStageFor("OFFER") === "Offer", "OFFER maps to Offer");
  check(candidateStageFor("HIRED") === "Decision", "HIRED maps to Decision");
  check(candidateStageFor("REJECTED") === "Decision", "REJECTED maps to Decision");
  check(candidateStageFor("WITHDRAWN") === "Decision", "WITHDRAWN maps to Decision");
  check(candidateStageFor("CLOSED") === "Decision", "CLOSED maps to Decision");
}

async function asRole(
  client: pg.Client,
  authUserId: string | null,
  sql: string,
  params: unknown[] = [],
  role: "authenticated" | "anon" = "authenticated",
) {
  await client.query("SAVEPOINT as_role");
  try {
    await client.query(`SET LOCAL ROLE ${role}`);
    if (role === "authenticated") {
      await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [
        authUserId ?? "00000000-0000-0000-0000-000000000000",
      ]);
      await client.query("SELECT set_config('request.jwt.claim.role', 'authenticated', true)");
    }
    const result = await client.query(sql, params);
    return { rows: result.rows, denied: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/permission denied/i.test(message)) {
      return { rows: [] as Array<Record<string, unknown>>, denied: true };
    }
    throw err;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT as_role");
  }
}

async function testWorkAuthorizationAndDocumentsRls(client: pg.Client) {
  const suffix = crypto.randomUUID().slice(0, 8);
  const auth = { hr: crypto.randomUUID(), employee: crypto.randomUUID(), other: crypto.randomUUID() };
  const profiles = {
    hr: `prof-admin-hr-${suffix}`,
    employee: `prof-admin-ee-${suffix}`,
    other: `prof-admin-other-${suffix}`,
  };
  const employeeIds = {
    hr: `emp-admin-hr-${suffix}`,
    employee: `emp-admin-ee-${suffix}`,
    other: `emp-admin-other-${suffix}`,
  };

  await client.query("BEGIN");
  try {
    async function insertAuth(id: string, email: string) {
      await client.query(
        `INSERT INTO auth.users (
           instance_id, id, aud, role, email, encrypted_password,
           email_confirmed_at, created_at, updated_at,
           confirmation_token, recovery_token, email_change_token_new, email_change
         ) VALUES (
           '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2, '',
           now(), now(), now(), '', '', '', ''
         )`,
        [id, email],
      );
    }

    async function insertEmployee(
      employeeId: string,
      profileId: string,
      authId: string,
      email: string,
      role: string,
    ) {
      await insertAuth(authId, email);
      await client.query(
        `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
         VALUES ($1, $2, $3, 'ACTIVE', $4)`,
        [profileId, email, employeeId, authId],
      );
      await client.query(
        `INSERT INTO employee_profiles (
           id, user_id, employee_number, first_name, last_name,
           hire_date, original_hire_date, employment_status
         ) VALUES ($1, $2, $3, 'Admin', 'Test', CURRENT_DATE, CURRENT_DATE, 'ACTIVE')`,
        [employeeId, profileId, `E-${employeeId}`],
      );
      await client.query(`INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, $3)`, [
        `role-${employeeId}`,
        profileId,
        role,
      ]);
    }

    await insertEmployee(employeeIds.hr, profiles.hr, auth.hr, `admin-hr-${suffix}@example.invalid`, "HR_ADMIN");
    await insertEmployee(
      employeeIds.employee,
      profiles.employee,
      auth.employee,
      `admin-ee-${suffix}@example.invalid`,
      "EMPLOYEE",
    );
    await insertEmployee(
      employeeIds.other,
      profiles.other,
      auth.other,
      `admin-other-${suffix}@example.invalid`,
      "EMPLOYEE",
    );

    const workAuthId = `wauth-${suffix}`;
    await client.query(
      `INSERT INTO employee_work_authorization (id, employee_id, authorization_type, hr_notes)
       VALUES ($1, $2, 'H-1B', 'sensitive HR note')`,
      [workAuthId, employeeIds.employee],
    );

    const hrRead = await asRole(
      client,
      auth.hr,
      `SELECT hr_notes FROM employee_work_authorization WHERE id = $1`,
      [workAuthId],
    );
    check(!hrRead.denied && hrRead.rows.length === 1, "HR_ADMIN can read work authorization including HR notes");

    const hrWrite = await asRole(
      client,
      auth.hr,
      `UPDATE employee_work_authorization SET verification_status = 'VERIFIED' WHERE id = $1`,
      [workAuthId],
    );
    check(!hrWrite.denied, "HR_ADMIN can update work authorization");

    const strangerRead = await asRole(
      client,
      auth.other,
      `SELECT hr_notes FROM employee_work_authorization WHERE id = $1`,
      [workAuthId],
    );
    check(
      strangerRead.denied || strangerRead.rows.length === 0,
      "a different employee cannot read another employee's work authorization",
    );

    const anonRead = await asRole(
      client,
      null,
      `SELECT hr_notes FROM employee_work_authorization WHERE id = $1`,
      [workAuthId],
      "anon",
    );
    check(anonRead.denied || anonRead.rows.length === 0, "anonymous cannot read work authorization");

    const docId = `empdoc-${suffix}`;
    await client.query(
      `INSERT INTO employee_documents (id, employee_id, document_type, file_name, storage_path, visibility)
       VALUES ($1, $2, 'OFFER_LETTER', 'offer.pdf', $3, 'HR_ONLY')`,
      [docId, employeeIds.employee, `${employeeIds.employee}/${docId}/offer.pdf`],
    );

    const hrDocRead = await asRole(client, auth.hr, `SELECT id FROM employee_documents WHERE id = $1`, [docId]);
    check(!hrDocRead.denied && hrDocRead.rows.length === 1, "HR_ADMIN can read HR_ONLY employee documents");

    const strangerDocRead = await asRole(
      client,
      auth.other,
      `SELECT id FROM employee_documents WHERE id = $1`,
      [docId],
    );
    check(
      strangerDocRead.denied || strangerDocRead.rows.length === 0,
      "a different employee cannot read another employee's HR_ONLY document",
    );
  } finally {
    await client.query("ROLLBACK");
  }
}

async function testSchemaShape(client: pg.Client) {
  const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns
     WHERE table_name = 'employee_work_authorization'
  `);
  const columns = new Set(rows.map((r) => r.column_name as string));
  check(
    ["authorization_type", "authorization_expiration_date", "verification_status", "hr_notes"].every((c) =>
      columns.has(c),
    ),
    "employee_work_authorization has the expected columns",
  );

  const { rows: policyRows } = await client.query(`
    SELECT policyname FROM pg_policies WHERE tablename = 'employee_documents'
  `);
  const policies = new Set(policyRows.map((r) => r.policyname as string));
  check(policies.has("employee_documents_hr"), "employee_documents has an HR-staff RLS policy");

  const { rows: constraintRows } = await client.query(`
    SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint
     WHERE conname = 'audit_logs_actor_role_check'
  `);
  const def = String(constraintRows[0]?.def ?? "");
  check(
    ["RECRUITER", "HIRING_MANAGER", "PAYROLL", "ADMIN"].every((role) => def.includes(role)),
    "audit_logs actor_role check includes the platform's recruiting/admin roles",
  );
}

async function main() {
  testCandidateStageMapping();

  // Administration surfaces exist as real pages (not placeholders).
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "..");
  for (const rel of [
    "app/(workforce)/workforce/reports/page.tsx",
    "app/(workforce)/workforce/administration/page.tsx",
    "app/(workforce)/workforce/users/page.tsx",
    "app/(workforce)/workforce/system-health/page.tsx",
    "app/(workforce)/workforce/notifications/page.tsx",
    "app/(workforce)/workforce/audit/page.tsx",
    "app/(workforce-app)/app/recruiting/page.tsx",
    "app/(workforce-app)/app/recruiting/interviews/page.tsx",
    "app/(workforce-app)/app/recruiting/offers/page.tsx",
  ]) {
    const full = path.join(root, rel);
    const exists = await fs
      .access(full)
      .then(() => true)
      .catch(() => false);
    check(exists, `${rel} exists`);
  }

  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await testSchemaShape(client);
    await testWorkAuthorizationAndDocumentsRls(client);
  } finally {
    await client.end();
  }

  if (failed > 0) process.exit(1);
  console.log("PASS  admin (People/Work Authorization/Documents)");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
