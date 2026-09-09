/**
 * Payroll RLS: own data, denied peers, manager/HR/candidate/anon, payroll admin allowed.
 * Usage: npx tsx --env-file=.env.local scripts/payroll-rls-regression.ts
 */
import pg from "pg";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function asUser(client: pg.Client, authUserId: string | null, sql: string) {
  await client.query("BEGIN");
  try {
    await client.query("SET LOCAL ROLE authenticated");
    await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [
      authUserId ?? "00000000-0000-0000-0000-000000000000",
    ]);
    await client.query(
      "SELECT set_config('request.jwt.claim.role', 'authenticated', true)",
    );
    const result = await client.query(sql);
    await client.query("ROLLBACK");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function asAnon(client: pg.Client, sql: string) {
  await client.query("BEGIN");
  try {
    await client.query("SET LOCAL ROLE anon");
    const result = await client.query(sql);
    await client.query("ROLLBACK");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    const message = err instanceof Error ? err.message : String(err);
    return { rows: [{ n: 0 }], denied: true, message };
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const suffix = crypto.randomUUID().slice(0, 8);
  const employeeAuth = crypto.randomUUID();
  const peerAuth = crypto.randomUUID();
  const managerAuth = crypto.randomUUID();
  const hrAuth = crypto.randomUUID();
  const payrollAuth = crypto.randomUUID();
  const candidateAuth = crypto.randomUUID();

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

  await insertAuth(employeeAuth, `pay-ee-${suffix}@example.invalid`);
  await insertAuth(peerAuth, `pay-peer-${suffix}@example.invalid`);
  await insertAuth(managerAuth, `pay-mgr-${suffix}@example.invalid`);
  await insertAuth(hrAuth, `pay-hr-${suffix}@example.invalid`);
  await insertAuth(payrollAuth, `pay-adm-${suffix}@example.invalid`);
  await insertAuth(candidateAuth, `pay-cand-${suffix}@example.invalid`);

  const ids = {
    employee: `emp-rls-${suffix}`,
    peer: `emp-rls-peer-${suffix}`,
    manager: `emp-rls-mgr-${suffix}`,
    hr: `emp-rls-hr-${suffix}`,
    payroll: `emp-rls-pay-${suffix}`,
  };
  const profiles = {
    employee: `prof-rls-${suffix}`,
    peer: `prof-rls-peer-${suffix}`,
    manager: `prof-rls-mgr-${suffix}`,
    hr: `prof-rls-hr-${suffix}`,
    payroll: `prof-rls-pay-${suffix}`,
    candidate: `prof-rls-cand-${suffix}`,
  };

  async function linkEmployee(
    employeeId: string,
    profileId: string,
    authId: string,
    email: string,
    role: string,
  ) {
    await client.query(
      `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
       VALUES ($1, $2, $3, 'ACTIVE', $4)`,
      [profileId, email, employeeId, authId],
    );
    await client.query(
      `INSERT INTO employee_profiles (
         id, user_id, employee_number, first_name, last_name,
         hire_date, original_hire_date, employment_status
       ) VALUES ($1, $2, $3, 'Pay', 'Rls', CURRENT_DATE, CURRENT_DATE, 'ACTIVE')`,
      [employeeId, profileId, `E-${employeeId}`],
    );
    await client.query(
      `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, $3)`,
      [`role-${employeeId}`, profileId, role],
    );
  }

  await linkEmployee(ids.employee, profiles.employee, employeeAuth, `pay-ee-${suffix}@example.invalid`, "EMPLOYEE");
  await linkEmployee(ids.peer, profiles.peer, peerAuth, `pay-peer-${suffix}@example.invalid`, "EMPLOYEE");
  await linkEmployee(ids.manager, profiles.manager, managerAuth, `pay-mgr-${suffix}@example.invalid`, "MANAGER");
  await linkEmployee(ids.hr, profiles.hr, hrAuth, `pay-hr-${suffix}@example.invalid`, "HR_ADMIN");
  await linkEmployee(ids.payroll, profiles.payroll, payrollAuth, `pay-adm-${suffix}@example.invalid`, "PAYROLL_ADMIN");
  await client.query(
    `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
     VALUES ($1, $2, 'Candidate', 'ACTIVE', $3)`,
    [profiles.candidate, `pay-cand-${suffix}@example.invalid`, candidateAuth],
  );
  await client.query(
    `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, 'CANDIDATE')`,
    [`role-cand-${suffix}`, profiles.candidate],
  );
  await client.query(
    `INSERT INTO candidate_profiles (id, first_name, last_name, email, profile_id)
     VALUES ($1, 'Pay', 'Candidate', $2, $3)`,
    [`cand-rls-${suffix}`, `pay-cand-${suffix}@example.invalid`, profiles.candidate],
  );

  await client.query(
    `INSERT INTO payroll_profiles (
       id, employee_id, pay_type, pay_frequency, salary_amount, currency, effective_date, status
     ) VALUES ($1, $2, 'salary', 'biweekly', 100000, 'USD', CURRENT_DATE, 'active')`,
    [`ppr-rls-${suffix}`, ids.employee],
  );

  const ownProfile = await asUser(
    client,
    employeeAuth,
    `SELECT count(*)::int AS n FROM payroll_profiles WHERE employee_id = '${ids.employee}'`,
  );
  check(Number(ownProfile.rows[0].n) === 1, "employee can read own payroll profile");

  const peerProfile = await asUser(
    client,
    peerAuth,
    `SELECT count(*)::int AS n FROM payroll_profiles WHERE employee_id = '${ids.employee}'`,
  );
  check(Number(peerProfile.rows[0].n) === 0, "another employee cannot read payroll profile");

  const managerRuns = await asUser(
    client,
    managerAuth,
    "SELECT count(*)::int AS n FROM payroll_runs",
  );
  check(Number(managerRuns.rows[0].n) === 0, "manager cannot read payroll runs");

  const hrProfiles = await asUser(
    client,
    hrAuth,
    `SELECT count(*)::int AS n FROM payroll_profiles WHERE employee_id = '${ids.employee}'`,
  );
  check(Number(hrProfiles.rows[0].n) === 0, "HR cannot read payroll profiles unless payroll admin");

  const adminProfiles = await asUser(
    client,
    payrollAuth,
    `SELECT count(*)::int AS n FROM payroll_profiles WHERE employee_id = '${ids.employee}'`,
  );
  check(Number(adminProfiles.rows[0].n) === 1, "payroll admin can read payroll profiles");

  const candidateProfiles = await asUser(
    client,
    candidateAuth,
    "SELECT count(*)::int AS n FROM payroll_profiles",
  );
  check(Number(candidateProfiles.rows[0].n) === 0, "candidate cannot read payroll profiles");

  const anon = await asAnon(client, "SELECT count(*)::int AS n FROM payroll_profiles");
  check(
    Number(anon.rows[0]?.n ?? 0) === 0 || "denied" in anon,
    "anonymous cannot read payroll profiles",
  );

  const strangerComp = await asUser(
    client,
    null,
    "SELECT count(*)::int AS n FROM compensation_records",
  );
  check(Number(strangerComp.rows[0].n) === 0, "no-role authenticated cannot read compensation");

  await client.query(`DELETE FROM payroll_profiles WHERE id = $1`, [`ppr-rls-${suffix}`]);
  await client.query(`DELETE FROM user_roles WHERE user_id = ANY($1::text[])`, [
    Object.values(profiles),
  ]);
  await client.query(`DELETE FROM candidate_profiles WHERE id = $1`, [`cand-rls-${suffix}`]);
  await client.query(`DELETE FROM employee_profiles WHERE id = ANY($1::text[])`, [
    Object.values(ids),
  ]);
  await client.query(`DELETE FROM profiles WHERE id = ANY($1::text[])`, [
    Object.values(profiles),
  ]);
  await client.query(`DELETE FROM auth.users WHERE id = ANY($1::uuid[])`, [[
    employeeAuth,
    peerAuth,
    managerAuth,
    hrAuth,
    payrollAuth,
    candidateAuth,
  ]]);

  await client.end();
  if (failed > 0) process.exit(1);
  console.log("PASS  payroll RLS");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
