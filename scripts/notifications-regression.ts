/**
 * Notifications: recipient resolution, delivery fan-out, RLS isolation, retry safety.
 * Usage: npx tsx --env-file=.env.local scripts/notifications-regression.ts
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
  if (!rows[0]) throw new Error("No org placement for notifications fixture");
  return rows[0] as {
    department_id: string;
    position_id: string;
    location_id: string;
    business_unit_id: string;
    legal_entity_id: string;
  };
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

  const managerAuth = crypto.randomUUID();
  const employeeAuth = crypto.randomUUID();

  const managerId = `emp-ntf-mgr-${suffix}`;
  const employeeId = `emp-ntf-ee-${suffix}`;
  const hrId = `emp-ntf-hr-${suffix}`;

  const managerProfile = `prof-ntf-mgr-${suffix}`;
  const employeeProfile = `prof-ntf-ee-${suffix}`;
  const hrProfile = `prof-ntf-hr-${suffix}`;

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
      employeeIdValue: string,
      profileIdValue: string,
      authId: string | null,
      email: string,
      role: string,
    ) {
      await client.query(
        `INSERT INTO profiles (id, email, display_name, status, auth_user_id)
         VALUES ($1, $2, $3, 'ACTIVE', $4)`,
        [profileIdValue, email, employeeIdValue, authId],
      );
      await client.query(
        `INSERT INTO employee_profiles (
           id, user_id, employee_number, first_name, last_name,
           hire_date, original_hire_date, employment_status
         ) VALUES ($1, $2, $3, 'Notify', 'Test', CURRENT_DATE, CURRENT_DATE, 'ACTIVE')`,
        [employeeIdValue, profileIdValue, `E-${employeeIdValue}`],
      );
      await client.query(
        `INSERT INTO user_roles (id, user_id, role) VALUES ($1, $2, $3)`,
        [`role-${employeeIdValue}`, profileIdValue, role],
      );
    }

    await insertAuth(managerAuth, `ntf-mgr-${suffix}@example.invalid`);
    await insertAuth(employeeAuth, `ntf-ee-${suffix}@example.invalid`);

    await insertEmployee(managerId, managerProfile, managerAuth, `ntf-mgr-${suffix}@example.invalid`, "MANAGER");
    await insertEmployee(employeeId, employeeProfile, employeeAuth, `ntf-ee-${suffix}@example.invalid`, "EMPLOYEE");
    await insertEmployee(hrId, hrProfile, null, `ntf-hr-${suffix}@example.invalid`, "HR_ADMIN");

    await client.query(
      `INSERT INTO job_assignments (
         id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
         location_id, manager_employee_id, employment_type, workplace_type, start_date,
         assignment_status, primary_assignment, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'FULL_TIME', 'REMOTE', CURRENT_DATE, 'ACTIVE', TRUE, now(), now())`,
      [
        `asg-ntf-${suffix}`,
        employeeId,
        org.legal_entity_id,
        org.business_unit_id,
        org.department_id,
        org.position_id,
        org.location_id,
        managerId,
      ],
    );

    // 1. Timesheet submit -> manager notification.
    const periodStart = "2026-09-07";
    const periodEnd = "2026-09-13";
    const sheet = await client.query(
      `SELECT ensure_timesheet($1, $2::date, $3::date) AS id`,
      [employeeId, periodStart, periodEnd],
    );
    const timesheetId = sheet.rows[0].id as string;
    await client.query(
      `SELECT save_time_entry_draft($1, $2, $3::date, 8, 'regular', 'work', NULL)`,
      [employeeId, timesheetId, periodStart],
    );
    await client.query(`SELECT submit_employee_timesheet($1, $2)`, [employeeId, timesheetId]);

    const submittedNotif = await client.query(
      `SELECT id FROM notifications
        WHERE entity_type = 'timesheet' AND entity_id = $1
          AND notification_type = 'TIMESHEET_SUBMITTED' AND recipient_profile_id = $2`,
      [timesheetId, managerProfile],
    );
    check(submittedNotif.rows.length === 1, "timesheet submit -> manager notification");

    const submittedDelivery = await client.query(
      `SELECT channel, status FROM notification_deliveries WHERE notification_id = $1`,
      [submittedNotif.rows[0]?.id],
    );
    check(
      submittedDelivery.rows.some((r) => r.channel === "in_app" && r.status === "sent"),
      "timesheet submit notification has a sent in_app delivery",
    );

    // 2. Timesheet approval -> employee notification.
    await client.query(`SELECT decide_timesheet($1, $2, 'approved', NULL)`, [managerId, timesheetId]);
    const approvedNotif = await client.query(
      `SELECT id FROM notifications
        WHERE entity_type = 'timesheet' AND entity_id = $1
          AND notification_type = 'TIMESHEET_APPROVED' AND recipient_profile_id = $2`,
      [timesheetId, employeeProfile],
    );
    check(approvedNotif.rows.length === 1, "timesheet approval -> employee notification");

    // 3. Leave submit -> manager notification.
    const leave = await client.query(
      `SELECT submit_leave_request($1, 'vacation', CURRENT_DATE + 30, CURRENT_DATE + 31, 16, 'trip') AS result`,
      [employeeId],
    );
    const leaveId = leave.rows[0].result.leaveRequestId as string;
    const leaveNotif = await client.query(
      `SELECT id FROM notifications
        WHERE entity_type = 'leave_request' AND entity_id = $1
          AND notification_type = 'LEAVE_SUBMITTED' AND recipient_profile_id = $2`,
      [leaveId, managerProfile],
    );
    check(leaveNotif.rows.length === 1, "leave submit -> manager notification");

    // 4. HR request -> HR notification.
    const hr = await client.query(
      `SELECT create_hr_request($1, 'payroll', 'Pay question', 'Need my pay stub', 'normal', $2) AS result`,
      [employeeId, hrProfile],
    );
    const hrRequestId = hr.rows[0].result.hrRequestId as string;
    const hrNotif = await client.query(
      `SELECT id FROM notifications
        WHERE entity_type = 'hr_request' AND entity_id = $1
          AND notification_type = 'HR_REQUEST_CREATED' AND recipient_profile_id = $2`,
      [hrRequestId, hrProfile],
    );
    check(hrNotif.rows.length === 1, "HR request created -> HR notification");

    // 5. Recipient spoofing rejected: an authenticated non-admin cannot forge
    // a notification row for another recipient by inserting directly.
    await client.query("SAVEPOINT spoof");
    let spoofRejected = false;
    try {
      await client.query("SET LOCAL ROLE authenticated");
      await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [employeeAuth]);
      await client.query("SELECT set_config('request.jwt.claim.role', 'authenticated', true)");
      await client.query(
        `INSERT INTO notifications (id, recipient_profile_id, notification_type, title, message, created_at)
         VALUES ($1, $2, 'FORGED', 'forged', 'forged', now())`,
        [`ntf-forged-${suffix}`, managerProfile],
      );
    } catch (err) {
      spoofRejected = err instanceof Error && /permission denied|policy/i.test(err.message);
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT spoof");
    }
    check(spoofRejected, "recipient spoofing rejected");

    // 6. Cross-user notification access rejected; owner can still read their own.
    await client.query("SAVEPOINT cross_read");
    let crossCount = -1;
    let ownCount = -1;
    try {
      await client.query("SET LOCAL ROLE authenticated");
      await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [employeeAuth]);
      await client.query("SELECT set_config('request.jwt.claim.role', 'authenticated', true)");
      const cross = await client.query(
        `SELECT count(*)::int AS n FROM notifications WHERE recipient_profile_id = $1`,
        [managerProfile],
      );
      crossCount = cross.rows[0].n;
      const own = await client.query(
        `SELECT count(*)::int AS n FROM notifications WHERE recipient_profile_id = $1`,
        [employeeProfile],
      );
      ownCount = own.rows[0].n;
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT cross_read");
    }
    check(crossCount === 0, "cross-user notification access rejected");
    check(ownCount >= 1, "owner can read their own notifications");

    // 7. Duplicate event retry does not duplicate notification: the timesheet
    // is already APPROVED, so a repeat submit is a no-op "reused" branch and
    // the AFTER UPDATE trigger never fires a second time.
    await client.query(`SELECT submit_employee_timesheet($1, $2)`, [employeeId, timesheetId]);
    const submittedAgain = await client.query(
      `SELECT count(*)::int AS n FROM notifications
        WHERE entity_type = 'timesheet' AND entity_id = $1 AND notification_type = 'TIMESHEET_SUBMITTED'`,
      [timesheetId],
    );
    check(submittedAgain.rows[0].n === 1, "duplicate event retry does not duplicate notification");

    // 8. Mark-as-read is self-scoped: the manager can mark their own
    // notification read but not the employee's.
    await client.query("SAVEPOINT mark_read");
    let markedOwn = false;
    let markedOthers = true;
    try {
      await client.query("SET LOCAL ROLE authenticated");
      await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [managerAuth]);
      await client.query("SELECT set_config('request.jwt.claim.role', 'authenticated', true)");
      const upd = await client.query(
        `UPDATE notifications SET read_at = now() WHERE id = $1 RETURNING id`,
        [submittedNotif.rows[0].id],
      );
      markedOwn = upd.rows.length === 1;
      const updOther = await client.query(
        `UPDATE notifications SET read_at = now() WHERE id = $1 RETURNING id`,
        [approvedNotif.rows[0].id],
      );
      markedOthers = updOther.rows.length === 1;
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT mark_read");
    }
    check(markedOwn, "recipient can mark their own notification read");
    check(!markedOthers, "recipient cannot mark another user's notification read");
  } finally {
    await client.query("ROLLBACK");
  }

  await client.end();
  if (failed > 0) process.exit(1);
  console.log("PASS  notifications");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
