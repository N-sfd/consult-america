/**
 * audit_logs: widened actor_role CHECK, and the new writeAuditEvent() helper
 * actually persisting the events listed in the modernization spec.
 * Usage: npx tsx --env-file=.env.local scripts/audit-regression.ts
 */
import pg from "pg";

import { writeAuditEvent } from "@/lib/audit/audit-log";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function testCheckConstraint(client: pg.Client, employeeId: string) {
  await client.query("BEGIN");
  try {
    for (const role of ["EMPLOYEE", "MANAGER", "HR", "PAYROLL", "RECRUITER", "HIRING_MANAGER", "ADMIN"]) {
      await client.query("SAVEPOINT role_check");
      try {
        await client.query(
          `INSERT INTO audit_logs (id, event_type, actor_employee_id, actor_role, summary, created_at)
           VALUES ($1, 'TEST_EVENT', $2, $3, 'regression check', now())`,
          [`audit-check-${crypto.randomUUID()}`, employeeId, role],
        );
        check(true, `audit_logs accepts actor_role '${role}'`);
      } catch {
        check(false, `audit_logs accepts actor_role '${role}'`);
      } finally {
        await client.query("ROLLBACK TO SAVEPOINT role_check");
      }
    }

    await client.query("SAVEPOINT invalid_role");
    let rejected = false;
    try {
      await client.query(
        `INSERT INTO audit_logs (id, event_type, actor_employee_id, actor_role, summary, created_at)
         VALUES ($1, 'TEST_EVENT', $2, 'NOT_A_REAL_ROLE', 'regression check', now())`,
        [`audit-check-${crypto.randomUUID()}`, employeeId],
      );
    } catch {
      rejected = true;
    } finally {
      await client.query("ROLLBACK TO SAVEPOINT invalid_role");
    }
    check(rejected, "audit_logs rejects an actor_role outside the allowed set");
  } finally {
    await client.query("ROLLBACK");
  }
}

async function testWriteAuditEventHelper(employeeId: string) {
  const client = getSupabaseServiceClient();
  if (!client) {
    check(false, "Supabase service client is configured for writeAuditEvent() test");
    return;
  }

  const events: Array<{ eventType: Parameters<typeof writeAuditEvent>[0]["eventType"]; resourceType: string }> = [
    { eventType: "EMPLOYEE_CREATED", resourceType: "employee_profile" },
    { eventType: "EMPLOYEE_STATUS_CHANGED", resourceType: "employee_profile" },
    { eventType: "CANDIDATE_MATCH_RUN", resourceType: "job_requisition" },
    { eventType: "DOCUMENT_UPLOADED", resourceType: "employee_document" },
    { eventType: "REPORT_EXPORTED", resourceType: "report" },
  ];

  for (const event of events) {
    const resourceId = `regression-${crypto.randomUUID()}`;
    await writeAuditEvent({
      eventType: event.eventType,
      actorEmployeeId: employeeId,
      actorRole: "HR",
      resourceType: event.resourceType,
      resourceId,
      summary: `regression check for ${event.eventType}`,
      metadata: { regression: true },
    });

    const { data, error } = await client
      .from("audit_logs")
      .select("id, event_type, metadata_json")
      .eq("resource_id", resourceId)
      .maybeSingle();

    check(!error && Boolean(data), `writeAuditEvent persists ${event.eventType}`);
    check(data?.event_type === event.eventType, `${event.eventType} row has the correct event_type`);

    if (data?.id) {
      await client.from("audit_logs").delete().eq("id", data.id as string);
    }
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    const { rows } = await client.query(`SELECT id FROM employee_profiles LIMIT 1`);
    const employeeId = rows[0]?.id as string | undefined;
    if (!employeeId) throw new Error("No employee_profiles fixture available for audit regression");

    await testCheckConstraint(client, employeeId);
    await testWriteAuditEventHelper(employeeId);
  } finally {
    await client.end();
  }

  if (failed > 0) process.exit(1);
  console.log("PASS  audit (audit_logs role expansion + writeAuditEvent)");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
