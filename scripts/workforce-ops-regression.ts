/**
 * Workforce operations: time, leave, HR requests, approval scope.
 * Usage: npx tsx --env-file=.env.local scripts/workforce-ops-regression.ts
 */
import pg from "pg";

function assert(ok: boolean, message: string) {
  if (!ok) throw new Error(message);
  console.log(`PASS  ${message}`);
}

async function loadOrg(client: pg.Client) {
  const { rows } = await client.query(`
    SELECT d.id AS department_id,
           p.id AS position_id,
           l.id AS location_id,
           d.business_unit_id,
           bu.legal_entity_id
      FROM departments d
      JOIN business_units bu ON bu.id = d.business_unit_id
      JOIN positions p ON TRUE
      JOIN locations l ON TRUE
     LIMIT 1
  `);
  if (!rows[0]) throw new Error("No org placement for workforce fixture");
  return rows[0] as {
    department_id: string;
    position_id: string;
    location_id: string;
    business_unit_id: string;
    legal_entity_id: string;
  };
}

async function insertEmployee(
  client: pg.Client,
  id: string,
  email: string,
  role?: string,
) {
  const profileId = `prof-${id}`;
  await client.query(
    `INSERT INTO profiles (id, email, display_name, status)
     VALUES ($1, $2, $3, 'ACTIVE')`,
    [profileId, email, id],
  );
  await client.query(
    `INSERT INTO employee_profiles (
       id, user_id, employee_number, first_name, last_name,
       hire_date, original_hire_date, employment_status
     ) VALUES ($1, $2, $3, 'Workforce', 'Ops', CURRENT_DATE, CURRENT_DATE, 'ACTIVE')`,
    [id, profileId, `E-${id}`],
  );
  if (role) {
    await client.query(
      `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, $3)`,
      [`role-${id}`, profileId, role],
    );
  }
  return profileId;
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
  const managerId = `emp-ops-mgr-${suffix}`;
  const employeeId = `emp-ops-ee-${suffix}`;
  const outsiderId = `emp-ops-out-${suffix}`;
  const hrId = `emp-ops-hr-${suffix}`;

  await client.query("BEGIN");
  try {
    const hrProfileId = await insertEmployee(
      client,
      hrId,
      `ops-hr-${suffix}@example.invalid`,
      "HR_ADMIN",
    );
    await insertEmployee(client, managerId, `ops-mgr-${suffix}@example.invalid`, "MANAGER");
    await insertEmployee(client, employeeId, `ops-ee-${suffix}@example.invalid`, "EMPLOYEE");
    await insertEmployee(client, outsiderId, `ops-out-${suffix}@example.invalid`, "MANAGER");

    await client.query(
      `INSERT INTO job_assignments (
         id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
         location_id, manager_employee_id, employment_type, workplace_type, start_date,
         assignment_status, primary_assignment, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'FULL_TIME', 'REMOTE', CURRENT_DATE, 'ACTIVE', TRUE, now(), now())`,
      [
        `asg-${suffix}`,
        employeeId,
        org.legal_entity_id,
        org.business_unit_id,
        org.department_id,
        org.position_id,
        org.location_id,
        managerId,
      ],
    );

    const periodStart = "2026-09-07";
    const periodEnd = "2026-09-13";
    const sheet = await client.query(
      `SELECT ensure_timesheet($1, $2::date, $3::date) AS id`,
      [employeeId, periodStart, periodEnd],
    );
    const timesheetId = sheet.rows[0].id as string;
    const again = await client.query(
      `SELECT ensure_timesheet($1, $2::date, $3::date) AS id`,
      [employeeId, periodStart, periodEnd],
    );
    assert(again.rows[0].id === timesheetId, "same employee period reuses one timesheet");

    await client.query(
      `SELECT save_time_entry_draft($1, $2, $3::date, 8, 'regular', 'project work', NULL)`,
      [employeeId, timesheetId, periodStart],
    );
    const submitted = await client.query(
      `SELECT submit_employee_timesheet($1, $2) AS result`,
      [employeeId, timesheetId],
    );
    assert(submitted.rows[0].result.reused === false, "employee can submit own timesheet");
    await client.query(
      `SELECT submit_employee_timesheet($1, $2)`,
      [employeeId, timesheetId],
    );
    const submittedAudits = await client.query(
      `SELECT count(*)::int AS n FROM workforce_audit_events
        WHERE event_type = 'TIMESHEET_SUBMITTED' AND entity_id = $1`,
      [timesheetId],
    );
    assert(submittedAudits.rows[0].n === 1, "timesheet submitted is audited once");

    await client.query("SAVEPOINT self_approve");
    let selfBlocked = false;
    try {
      await client.query(`SELECT decide_timesheet($1, $2, 'approved', NULL)`, [
        employeeId,
        timesheetId,
      ]);
    } catch (err) {
      selfBlocked = err instanceof Error && err.message.includes("cannot approve own timesheet");
      await client.query("ROLLBACK TO SAVEPOINT self_approve");
    }
    assert(selfBlocked, "employee cannot approve own timesheet");

    await client.query("SAVEPOINT outsider");
    let outsiderBlocked = false;
    try {
      await client.query(`SELECT decide_timesheet($1, $2, 'approved', NULL)`, [
        outsiderId,
        timesheetId,
      ]);
    } catch (err) {
      outsiderBlocked =
        err instanceof Error && err.message.includes("outside reporting scope");
      await client.query("ROLLBACK TO SAVEPOINT outsider");
    }
    assert(outsiderBlocked, "manager cannot approve outside reporting scope");

    await client.query(`SELECT decide_timesheet($1, $2, 'approved', NULL)`, [
      managerId,
      timesheetId,
    ]);
    const approved = await client.query(
      `SELECT status, approved_by_employee_id FROM timesheets WHERE id = $1`,
      [timesheetId],
    );
    assert(approved.rows[0].status === "APPROVED", "manager can approve direct-report timesheet");
    assert(
      approved.rows[0].approved_by_employee_id === managerId,
      "timesheet records the authorizing manager",
    );

    const leave = await client.query(
      `SELECT submit_leave_request($1, 'vacation', CURRENT_DATE + 21, CURRENT_DATE + 22, 16, 'trip') AS result`,
      [employeeId],
    );
    const leaveId = leave.rows[0].result.leaveRequestId as string;

    await client.query("SAVEPOINT self_leave");
    let leaveSelf = false;
    try {
      await client.query(`SELECT decide_leave_request($1, $2, 'approved', NULL)`, [
        employeeId,
        leaveId,
      ]);
    } catch (err) {
      leaveSelf = err instanceof Error && err.message.includes("cannot approve own leave");
      await client.query("ROLLBACK TO SAVEPOINT self_leave");
    }
    assert(leaveSelf, "employee cannot approve own leave");

    await client.query(`SELECT decide_leave_request($1, $2, 'approved', NULL)`, [
      managerId,
      leaveId,
    ]);
    const leaveRow = await client.query(
      `SELECT status, approved_by_employee_id, start_date FROM leave_requests WHERE id = $1`,
      [leaveId],
    );
    assert(leaveRow.rows[0].status === "APPROVED", "leave lifecycle reaches approved");
    assert(leaveRow.rows[0].approved_by_employee_id === managerId, "approved leave keeps approver");

    const hr = await client.query(
      `SELECT create_hr_request($1, 'payroll', 'Pay question', 'Need a copy of my pay statement', 'normal', $2) AS result`,
      [employeeId, hrProfileId],
    );
    const hrIdCreated = hr.rows[0].result.hrRequestId as string;
    assert(
      String(hr.rows[0].result.requestNumber).startsWith("HR-"),
      "request number is generated by the database",
    );

    await client.query("SAVEPOINT bad_hr");
    let hrBlocked = false;
    try {
      await client.query(`SELECT resolve_hr_request($1, $2, 'no')`, [
        outsiderId,
        hrIdCreated,
      ]);
    } catch (err) {
      hrBlocked = err instanceof Error && err.message.includes("unauthorized HR user");
      await client.query("ROLLBACK TO SAVEPOINT bad_hr");
    }
    assert(hrBlocked, "unauthorized HR user cannot resolve arbitrary tickets");

    await client.query(`SELECT assign_hr_request($1, $2, $3)`, [
      hrId,
      hrIdCreated,
      hrProfileId,
    ]);
    await client.query(`SELECT resolve_hr_request($1, $2, 'Sent')`, [hrId, hrIdCreated]);
    const activity = await client.query(
      `SELECT activity_type FROM hr_request_activity WHERE hr_request_id = $1 ORDER BY created_at`,
      [hrIdCreated],
    );
    const types = activity.rows.map((row) => row.activity_type);
    assert(types.includes("created") && types.includes("resolved"), "HR request activity is preserved");
  } finally {
    await client.query("ROLLBACK");
  }

  await client.end();
  console.log("PASS  workforce operations");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
