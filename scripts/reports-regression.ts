/**
 * Reporting views + manager_team_report: role scope, team isolation, denial.
 * Usage: npx tsx --env-file=.env.local scripts/reports-regression.ts
 */
import pg from "pg";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function loadOrg(client: pg.Client) {
  const { rows } = await client.query(`
    SELECT d.id AS department_id, p.id AS position_id, l.id AS location_id,
           d.business_unit_id, bu.legal_entity_id
      FROM departments d
      JOIN business_units bu ON bu.id = d.business_unit_id
      JOIN positions p ON TRUE
      JOIN locations l ON TRUE
     LIMIT 1
  `);
  if (!rows[0]) throw new Error("No org placement for reports fixture");
  return rows[0] as {
    department_id: string;
    position_id: string;
    location_id: string;
    business_unit_id: string;
    legal_entity_id: string;
  };
}

async function asRole(
  client: pg.Client,
  authUserId: string | null,
  sql: string,
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
    const result = await client.query(sql);
    return { rows: result.rows, denied: false };
  } catch (err) {
    // A hard "permission denied" (no GRANT at all, e.g. anon on views only
    // granted to authenticated) is as valid a denial as an empty resultset.
    const message = err instanceof Error ? err.message : String(err);
    if (/permission denied/i.test(message)) {
      return { rows: [] as Array<Record<string, unknown>>, denied: true };
    }
    throw err;
  } finally {
    await client.query("ROLLBACK TO SAVEPOINT as_role");
  }
}

/** Row count for GROUP BY summary views: zero rows once the WHERE gate excludes everyone. */
function totalRows(result: { rows: Array<Record<string, unknown>> }) {
  return result.rows.reduce((sum, row) => sum + Number(row.n ?? 0), 0);
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
  const suffix = crypto.randomUUID().slice(0, 8);

  const auth = {
    employee: crypto.randomUUID(),
    manager1: crypto.randomUUID(),
    manager2: crypto.randomUUID(),
    hr: crypto.randomUUID(),
    payroll: crypto.randomUUID(),
    recruiter: crypto.randomUUID(),
    candidate: crypto.randomUUID(),
    noRole: crypto.randomUUID(),
  };

  const ids = {
    employee: `emp-rpt-ee-${suffix}`,
    manager1: `emp-rpt-mgr1-${suffix}`,
    manager2: `emp-rpt-mgr2-${suffix}`,
    report1: `emp-rpt-r1-${suffix}`,
    report2: `emp-rpt-r2-${suffix}`,
    hr: `emp-rpt-hr-${suffix}`,
    payroll: `emp-rpt-pay-${suffix}`,
    recruiter: `emp-rpt-rec-${suffix}`,
  };

  const profiles = {
    employee: `prof-rpt-ee-${suffix}`,
    manager1: `prof-rpt-mgr1-${suffix}`,
    manager2: `prof-rpt-mgr2-${suffix}`,
    report1: `prof-rpt-r1-${suffix}`,
    report2: `prof-rpt-r2-${suffix}`,
    hr: `prof-rpt-hr-${suffix}`,
    payroll: `prof-rpt-pay-${suffix}`,
    recruiter: `prof-rpt-rec-${suffix}`,
    candidate: `prof-rpt-cand-${suffix}`,
    noRole: `prof-rpt-none-${suffix}`,
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
      authId: string | null,
      email: string,
      role: string | null,
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
         ) VALUES ($1, $2, $3, 'Report', 'Test', CURRENT_DATE, CURRENT_DATE, 'ACTIVE')`,
        [employeeId, profileId, `E-${employeeId}`],
      );
      if (role) {
        await client.query(
          `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, $3)`,
          [`role-${employeeId}`, profileId, role],
        );
      }
    }

    for (const [key, id] of Object.entries(auth)) {
      await insertAuth(id, `rpt-${key}-${suffix}@example.invalid`);
    }

    await insertEmployee(ids.employee, profiles.employee, auth.employee, `rpt-employee-${suffix}@example.invalid`, "EMPLOYEE");
    await insertEmployee(ids.manager1, profiles.manager1, auth.manager1, `rpt-manager1-${suffix}@example.invalid`, "MANAGER");
    await insertEmployee(ids.manager2, profiles.manager2, auth.manager2, `rpt-manager2-${suffix}@example.invalid`, "MANAGER");
    await insertEmployee(ids.report1, profiles.report1, null, `rpt-report1-${suffix}@example.invalid`, "EMPLOYEE");
    await insertEmployee(ids.report2, profiles.report2, null, `rpt-report2-${suffix}@example.invalid`, "EMPLOYEE");
    await insertEmployee(ids.hr, profiles.hr, auth.hr, `rpt-hr-${suffix}@example.invalid`, "HR_ADMIN");
    await insertEmployee(ids.payroll, profiles.payroll, auth.payroll, `rpt-payroll-${suffix}@example.invalid`, "PAYROLL_ADMIN");
    await insertEmployee(ids.recruiter, profiles.recruiter, auth.recruiter, `rpt-recruiter-${suffix}@example.invalid`, "RECRUITER");

    await client.query(
      `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
       VALUES ($1, $2, 'Report Candidate', 'ACTIVE', $3)`,
      [profiles.candidate, `rpt-candidate-${suffix}@example.invalid`, auth.candidate],
    );
    await client.query(
      `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, 'CANDIDATE')`,
      [`role-cand-${suffix}`, profiles.candidate],
    );
    await client.query(
      `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
       VALUES ($1, $2, 'No Role', 'ACTIVE', $3)`,
      [profiles.noRole, `rpt-norole-${suffix}@example.invalid`, auth.noRole],
    );

    async function assignTeam(employeeId: string, managerId: string) {
      await client.query(
        `INSERT INTO job_assignments (
           id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
           location_id, manager_employee_id, employment_type, workplace_type, start_date,
           assignment_status, primary_assignment, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'FULL_TIME', 'REMOTE', CURRENT_DATE, 'ACTIVE', TRUE, now(), now())`,
        [
          `asg-rpt-${employeeId}`,
          employeeId,
          org.legal_entity_id,
          org.business_unit_id,
          org.department_id,
          org.position_id,
          org.location_id,
          managerId,
        ],
      );
    }

    // manager1 -> report1 (with a pending leave request); manager2 -> report2
    // (no pending leave), to prove team isolation on both fields.
    await assignTeam(ids.report1, ids.manager1);
    await assignTeam(ids.report2, ids.manager2);

    await client.query(
      `SELECT submit_leave_request($1, 'vacation', CURRENT_DATE + 40, CURRENT_DATE + 41, 16, 'trip')`,
      [ids.report1],
    );

    // manager_team_report: scoped to the caller's own team, never a
    // browser-supplied manager id.
    const mgr1Report = await asRole(client, auth.manager1, `SELECT * FROM manager_team_report()`);
    check(Number(mgr1Report.rows[0].team_headcount) === 1, "manager 1 sees only their own team headcount");
    check(Number(mgr1Report.rows[0].pending_leave) === 1, "manager 1 sees their team's pending leave");

    const mgr2Report = await asRole(client, auth.manager2, `SELECT * FROM manager_team_report()`);
    check(Number(mgr2Report.rows[0].team_headcount) === 1, "manager 2 sees only their own team headcount");
    check(Number(mgr2Report.rows[0].pending_leave) === 0, "manager 2 does not see manager 1's pending leave");

    // HR request + timesheet + payroll fixtures so the org-wide views have at
    // least one row to prove an authorized role can actually see data, not
    // just an empty table.
    await client.query(
      `SELECT create_hr_request($1, 'payroll', 'Report fixture', 'fixture', 'normal', $2)`,
      [ids.employee, profiles.hr],
    );

    // workforce_headcount_summary has no GROUP BY, so it always returns
    // exactly one row even when its WHERE gate excludes the caller — check
    // the aggregated column value, not the row count.
    for (const roleKey of ["recruiter", "payroll"]) {
      const authId = (auth as Record<string, string>)[roleKey];
      const result = await asRole(client, authId, `SELECT total_employees FROM workforce_headcount_summary`);
      check(Number(result.rows[0]?.total_employees ?? 0) > 0, `${roleKey} sees rows in workforce_headcount_summary`);
    }
    for (const roleKey of ["employee", "candidate", "noRole"]) {
      const authId = (auth as Record<string, string>)[roleKey];
      const result = await asRole(client, authId, `SELECT total_employees FROM workforce_headcount_summary`);
      check(
        result.denied || Number(result.rows[0]?.total_employees ?? 0) === 0,
        `${roleKey} is denied workforce_headcount_summary`,
      );
    }

    // lib/workforce/operations.ts reads every view through the service-role
    // client (no user JWT at all, matching every other self-service read in
    // this app) — that path must still see real data, not an empty gate.
    await client.query("SAVEPOINT as_service");
    let serviceHeadcount = -1;
    try {
      await client.query("SET LOCAL ROLE service_role");
      const result = await client.query("SELECT total_employees FROM workforce_headcount_summary");
      serviceHeadcount = Number(result.rows[0]?.total_employees ?? 0);
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT as_service");
    }
    check(serviceHeadcount > 0, "service-role read sees real workforce_headcount_summary data");

    const views: Array<{ name: string; authorized: string[]; unauthorized: string[] }> = [
      {
        name: "hr_request_summary",
        authorized: ["hr"],
        unauthorized: ["employee", "payroll", "recruiter", "candidate", "noRole"],
      },
      {
        name: "leave_request_summary",
        authorized: ["hr"],
        unauthorized: ["employee", "payroll", "recruiter", "candidate", "noRole"],
      },
      {
        name: "recruiting_pipeline_summary",
        authorized: ["recruiter", "hr"],
        unauthorized: ["employee", "payroll", "candidate", "noRole"],
      },
    ];

    for (const view of views) {
      for (const roleKey of view.authorized) {
        const authId = (auth as Record<string, string>)[roleKey];
        const result = await asRole(client, authId, `SELECT count(*)::int AS n FROM ${view.name}`);
        check(totalRows(result) > 0, `${roleKey} sees rows in ${view.name}`);
      }
      for (const roleKey of view.unauthorized) {
        const authId = (auth as Record<string, string>)[roleKey];
        const result = await asRole(client, authId, `SELECT count(*)::int AS n FROM ${view.name}`);
        check(result.denied || totalRows(result) === 0, `${roleKey} is denied ${view.name}`);
      }
    }

    // Payroll compensation isolation: HR does not get payroll data merely by
    // being HR staff.
    const hrPayroll = await asRole(client, auth.hr, `SELECT count(*)::int AS n FROM payroll_run_summary`);
    check(hrPayroll.denied || totalRows(hrPayroll) === 0, "HR is denied payroll_run_summary");

    const payrollPayroll = await asRole(client, auth.payroll, `SELECT count(*)::int AS n FROM payroll_run_summary`);
    check(!payrollPayroll.denied, "payroll admin can query payroll_run_summary without error");

    // Anonymous denial.
    const anonHeadcount = await asRole(client, null, `SELECT total_employees FROM workforce_headcount_summary`, "anon");
    check(
      anonHeadcount.denied || Number(anonHeadcount.rows[0]?.total_employees ?? 0) === 0,
      "anonymous is denied workforce_headcount_summary",
    );
    for (const view of ["hr_request_summary", "payroll_run_summary"]) {
      const anon = await asRole(client, null, `SELECT count(*)::int AS n FROM ${view}`, "anon");
      check(anon.denied || totalRows(anon) === 0, `anonymous is denied ${view}`);
    }
  } finally {
    await client.query("ROLLBACK");
  }

  await client.end();
  if (failed > 0) process.exit(1);
  console.log("PASS  reports");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
