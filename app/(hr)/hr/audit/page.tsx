import type { Metadata } from "next";
import Link from "next/link";

import { getFilteredAuditReport } from "@/lib/self-service/reporting-service";
import {
  requireHrActor,
  requirePermission,
} from "@/lib/self-service/security";
import type { AuditEventType } from "@/types/security";

export const metadata: Metadata = {
  title: "Audit Log | ConsultAmerica",
};

type SearchParams = Promise<{
  eventType?: string;
  actorRole?: string;
}>;

const eventTypes: Array<AuditEventType | "ALL"> = [
  "ALL",
  "TIMESHEET_SUBMITTED",
  "TIMESHEET_APPROVED",
  "TIMESHEET_REJECTED",
  "TIMESHEET_RETURNED",
  "LEAVE_REQUESTED",
  "LEAVE_APPROVED",
  "LEAVE_REJECTED",
  "LEAVE_CANCELLED",
  "HR_REQUEST_CREATED",
  "HR_REQUEST_HR_REPLY",
  "HR_REQUEST_STATUS_CHANGED",
  "PROFILE_CHANGE_APPROVED",
  "PROFILE_CHANGE_REJECTED",
  "DOCUMENT_VIEWED",
  "ACCESS_DENIED",
  "NOTIFICATION_READ",
];

function parseEventType(value?: string): AuditEventType | "ALL" {
  if (!value) return "ALL";
  return eventTypes.includes(value as AuditEventType | "ALL")
    ? (value as AuditEventType | "ALL")
    : "ALL";
}

function parseActorRole(
  value?: string,
): "EMPLOYEE" | "MANAGER" | "HR" | "ALL" {
  if (
    value === "EMPLOYEE" ||
    value === "MANAGER" ||
    value === "HR" ||
    value === "ALL"
  ) {
    return value;
  }
  return "ALL";
}

export default async function HrAuditPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const actor = requireHrActor();
  requirePermission(actor, "audit.read");

  const params = await searchParams;
  const eventType = parseEventType(params.eventType);
  const actorRole = parseActorRole(params.actorRole);
  const logs = getFilteredAuditReport({ eventType, actorRole });

  const roleFilters = ["ALL", "EMPLOYEE", "MANAGER", "HR"] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Audit Log</h1>
          <p className="mt-2 text-black/55">
            Security-relevant actions across employee, manager, and HR portals.
            Filter by event type and actor role.
          </p>
        </div>
        <Link
          href="/hr/reports"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
        >
          Back to Reports
        </Link>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Actor Role
        </p>
        <div className="flex flex-wrap gap-2">
          {roleFilters.map((role) => {
            const href =
              role === "ALL" && eventType === "ALL"
                ? "/hr/audit"
                : `/hr/audit?${new URLSearchParams({
                    ...(eventType !== "ALL" ? { eventType } : {}),
                    ...(role !== "ALL" ? { actorRole: role } : {}),
                  }).toString()}`;
            const active = actorRole === role;
            return (
              <Link
                key={role}
                href={href || "/hr/audit"}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-[var(--ca-blue)] text-white"
                    : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
                }`}
              >
                {role === "ALL" ? "All roles" : role}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Event Type
        </p>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => {
            const href =
              type === "ALL" && actorRole === "ALL"
                ? "/hr/audit"
                : `/hr/audit?${new URLSearchParams({
                    ...(type !== "ALL" ? { eventType: type } : {}),
                    ...(actorRole !== "ALL" ? { actorRole } : {}),
                  }).toString()}`;
            const active = eventType === type;
            return (
              <Link
                key={type}
                href={href || "/hr/audit"}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-[var(--ca-blue)] text-white"
                    : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
                }`}
              >
                {type === "ALL" ? "All events" : type.replaceAll("_", " ")}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-black/45">{logs.length} matching events</p>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {logs.map((entry) => (
            <li key={entry.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                    {entry.eventType.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 font-medium">{entry.summary}</p>
                  <p className="mt-1 text-sm text-black/55">
                    Actor {entry.actorEmployeeId} · {entry.actorRole}
                    {entry.targetEmployeeId
                      ? ` · Target ${entry.targetEmployeeId}`
                      : ""}
                    {entry.resourceType
                      ? ` · ${entry.resourceType}${entry.resourceId ? ` ${entry.resourceId}` : ""}`
                      : ""}
                  </p>
                </div>
                <span className="text-xs text-black/40">
                  {entry.createdAt.slice(0, 19).replace("T", " ")}
                </span>
              </div>
            </li>
          ))}
          {logs.length === 0 && (
            <li className="px-5 py-8 text-sm text-black/50">
              No audit events match these filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
