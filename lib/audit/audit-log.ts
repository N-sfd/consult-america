import { getSupabaseServiceClient } from "@/app/lib/supabase/server";

/**
 * Writes to the real `audit_logs` table (db/schema/006_audit.sql), which was
 * provisioned but never wired to application code until now. This is
 * intentionally separate from the in-memory `lib/self-service/audit-store.ts`
 * used by the existing /hr/audit demo page — reconciling the two is a
 * follow-up, not attempted here.
 */

/**
 * Matches audit_logs.actor_role's CHECK constraint (db/schema/031). Coarse
 * on purpose — mirrors the actor-role vocabularies the app's session helpers
 * already resolve to (PortalActor.role, WorkforceRole), not the finer-grained
 * platform role names.
 */
export type AuditActorRole =
  | "EMPLOYEE"
  | "MANAGER"
  | "HR"
  | "PAYROLL"
  | "RECRUITER"
  | "HIRING_MANAGER"
  | "ADMIN";

export type AuditEventType =
  | "EMPLOYEE_CREATED"
  | "EMPLOYEE_UPDATED"
  | "EMPLOYEE_STATUS_CHANGED"
  | "APPLICATION_VIEWED"
  | "APPLICATION_STATUS_CHANGED"
  | "CANDIDATE_MATCH_RUN"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_ARCHIVED"
  | "DOCUMENT_ACKNOWLEDGED"
  | "REPORT_EXPORTED";

export type WriteAuditEventInput = {
  eventType: AuditEventType;
  actorEmployeeId: string;
  actorRole: AuditActorRole;
  targetEmployeeId?: string;
  resourceType?: string;
  resourceId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
  correlationId?: string;
};

/**
 * Best-effort: audit logging must never block or fail the operation it is
 * describing. Errors are swallowed after a console warning.
 */
export async function writeAuditEvent(input: WriteAuditEventInput): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) return;

  const metadata = input.correlationId
    ? { ...input.metadata, correlationId: input.correlationId }
    : input.metadata;

  const { error } = await client.from("audit_logs").insert({
    id: `audit-${crypto.randomUUID()}`,
    event_type: input.eventType,
    actor_employee_id: input.actorEmployeeId,
    actor_role: input.actorRole,
    target_employee_id: input.targetEmployeeId ?? null,
    resource_type: input.resourceType ?? null,
    resource_id: input.resourceId ?? null,
    summary: input.summary,
    metadata_json: metadata ? JSON.stringify(metadata) : null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.warn(`[audit] failed to write ${input.eventType}: ${error.message}`);
  }
}

export type AuditLogRow = {
  id: string;
  eventType: string;
  actorEmployeeId: string;
  actorRole: AuditActorRole;
  targetEmployeeId?: string;
  resourceType?: string;
  resourceId?: string;
  summary: string;
  correlationId?: string;
  createdAt: string;
};

/**
 * First read path for `audit_logs` — until now this table was write-only in
 * application code (only `scripts/audit-regression.ts` ever selected from
 * it, as a throwaway verification read).
 */
export async function listAuditEvents(limit = 100): Promise<AuditLogRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data, error } = await client
    .from("audit_logs")
    .select(
      "id, event_type, actor_employee_id, actor_role, target_employee_id, resource_type, resource_id, summary, metadata_json, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    let correlationId: string | undefined;
    if (row.metadata_json) {
      try {
        const metadata = JSON.parse(row.metadata_json as string) as Record<string, unknown>;
        if (typeof metadata.correlationId === "string") correlationId = metadata.correlationId;
      } catch {
        // metadata_json is best-effort context, not a contract — ignore malformed rows.
      }
    }

    return {
      id: row.id as string,
      eventType: row.event_type as string,
      actorEmployeeId: row.actor_employee_id as string,
      actorRole: row.actor_role as AuditActorRole,
      targetEmployeeId: (row.target_employee_id as string) ?? undefined,
      resourceType: (row.resource_type as string) ?? undefined,
      resourceId: (row.resource_id as string) ?? undefined,
      summary: row.summary as string,
      correlationId,
      createdAt: row.created_at as string,
    };
  });
}
