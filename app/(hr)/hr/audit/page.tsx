import type { Metadata } from "next";
import Link from "next/link";

import { listAuditLogs } from "@/lib/self-service/audit-store";
import {
  requireHrActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Audit Log | ConsultAmerica",
};

export default function HrAuditPage() {
  const actor = requireHrActor();
  requirePermission(actor, "audit.read");
  const logs = listAuditLogs(40);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Audit Log</h1>
        <p className="mt-2 text-black/55">
          Security-relevant actions across employee, manager, and HR portals.
          Full reporting continues in Phase 4L.
        </p>
      </div>

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
              No audit events yet.
            </li>
          )}
        </ul>
      </div>

      <p className="text-sm text-black/45">
        Denied access attempts are logged as ACCESS_DENIED.{" "}
        <Link
          href="/hr/requests"
          className="font-medium text-[var(--ca-blue)] hover:underline"
        >
          Back to HR Requests
        </Link>
      </p>
    </div>
  );
}
