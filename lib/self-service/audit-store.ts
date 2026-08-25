import type {
  AuditEventType,
  AuditLogEntry,
} from "@/types/security";

const auditLogs: AuditLogEntry[] = [
  {
    id: "aud-seed-1",
    eventType: "LEAVE_APPROVED",
    actorEmployeeId: "emp-demo-001",
    actorRole: "MANAGER",
    targetEmployeeId: "emp-demo-002",
    resourceType: "LEAVE_REQUEST",
    resourceId: "lr-002-1",
    summary: "Approved PTO Sep 14–16",
    createdAt: "2026-08-11T12:00:00.000Z",
  },
  {
    id: "aud-seed-2",
    eventType: "HR_REQUEST_CREATED",
    actorEmployeeId: "emp-demo-002",
    actorRole: "EMPLOYEE",
    targetEmployeeId: "emp-demo-002",
    resourceType: "HR_REQUEST",
    resourceId: "hrr-1",
    summary: "Created HR-2026-000142",
    createdAt: "2026-08-25T14:00:00.000Z",
  },
];

function createId() {
  return `aud-${crypto.randomUUID()}`;
}

export function writeAuditLog(input: {
  eventType: AuditEventType;
  actorEmployeeId: string;
  actorRole: "EMPLOYEE" | "MANAGER" | "HR";
  targetEmployeeId?: string;
  resourceType?: string;
  resourceId?: string;
  summary: string;
  metadata?: Record<string, string>;
}) {
  const entry: AuditLogEntry = {
    id: createId(),
    eventType: input.eventType,
    actorEmployeeId: input.actorEmployeeId,
    actorRole: input.actorRole,
    targetEmployeeId: input.targetEmployeeId,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    summary: input.summary,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  };
  auditLogs.unshift(entry);
  return entry;
}

export function listAuditLogs(limit = 50) {
  return auditLogs.slice(0, limit);
}

export function listAuditLogsForActor(actorEmployeeId: string, limit = 50) {
  return auditLogs
    .filter((item) => item.actorEmployeeId === actorEmployeeId)
    .slice(0, limit);
}

export function getAuditStoreSnapshot() {
  return { auditLogs };
}
