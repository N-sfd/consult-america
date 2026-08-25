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
  {
    id: "aud-seed-3",
    eventType: "TIMESHEET_SUBMITTED",
    actorEmployeeId: "emp-demo-002",
    actorRole: "EMPLOYEE",
    targetEmployeeId: "emp-demo-002",
    resourceType: "TIMESHEET",
    resourceId: "ts-002-prior",
    summary: "Submitted timesheet Aug 17 – Aug 23",
    createdAt: "2026-08-23T18:00:00.000Z",
  },
  {
    id: "aud-seed-4",
    eventType: "LEAVE_REQUESTED",
    actorEmployeeId: "emp-demo-002",
    actorRole: "EMPLOYEE",
    targetEmployeeId: "emp-demo-002",
    resourceType: "LEAVE_REQUEST",
    resourceId: "lr-002-2",
    summary: "Requested leave Oct 2 – Oct 2",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "aud-seed-5",
    eventType: "DOCUMENT_VIEWED",
    actorEmployeeId: "emp-demo-002",
    actorRole: "EMPLOYEE",
    targetEmployeeId: "emp-demo-002",
    resourceType: "DOCUMENT",
    resourceId: "doc-1",
    summary: "Viewed offer-letter-2025.pdf",
    createdAt: "2026-08-22T16:00:00.000Z",
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

export type AuditLogFilter = {
  eventType?: AuditEventType | "ALL";
  actorRole?: "EMPLOYEE" | "MANAGER" | "HR" | "ALL";
  limit?: number;
};

export function listAuditLogs(limit = 50) {
  return auditLogs.slice(0, limit);
}

export function queryAuditLogs(filter: AuditLogFilter = {}) {
  const limit = filter.limit ?? 100;
  return auditLogs
    .filter((item) => {
      if (
        filter.eventType &&
        filter.eventType !== "ALL" &&
        item.eventType !== filter.eventType
      ) {
        return false;
      }
      if (
        filter.actorRole &&
        filter.actorRole !== "ALL" &&
        item.actorRole !== filter.actorRole
      ) {
        return false;
      }
      return true;
    })
    .slice(0, limit);
}

export function listAuditLogsForActor(actorEmployeeId: string, limit = 50) {
  return auditLogs
    .filter((item) => item.actorEmployeeId === actorEmployeeId)
    .slice(0, limit);
}

export function countAuditByEventType() {
  const counts: Partial<Record<AuditEventType, number>> = {};
  for (const item of auditLogs) {
    counts[item.eventType] = (counts[item.eventType] ?? 0) + 1;
  }
  return counts;
}

export function getAuditStoreSnapshot() {
  return { auditLogs };
}
