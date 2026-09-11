import type { Metadata } from "next";
import Link from "next/link";

import { listAuditTimeline } from "@/lib/workforce/operations";
import { requireHrActor, requirePermission } from "@/lib/self-service/security";

export const metadata: Metadata = { title: "Audit" };

type SearchParams = Promise<{ source?: string }>;

const SOURCE_FILTERS = [
  { value: "ALL", label: "All sources" },
  { value: "audit_logs", label: "Compliance (employees, documents, exports)" },
  { value: "workforce_audit_events", label: "Workforce Ops (time, leave, payroll, HR requests)" },
  { value: "recruiting_activities", label: "Recruiting" },
] as const;

function buildHref(source: string) {
  return source === "ALL" ? "/workforce/audit" : `/workforce/audit?source=${source}`;
}

function formatTimestamp(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

export default async function WorkforceAuditPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const actor = await requireHrActor();
  requirePermission(actor, "audit.read");

  const params = await searchParams;
  const source = params.source ?? "ALL";

  const allEntries = await listAuditTimeline();
  const entries = source === "ALL" ? allEntries : allEntries.filter((e) => e.source === source);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Audit
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
          A unified timeline across the real audit trails — compliance
          events, workforce operations, and recruiting activity. Correlation
          IDs are shown where the underlying event carries one.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Source
        </p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={buildHref(filter.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                source === filter.value
                  ? "bg-[var(--ca-blue)] text-white"
                  : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-black/45">{entries.length} matching events</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {entries.map((entry) => (
            <li key={`${entry.source}-${entry.id}`} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                    {entry.eventType.replaceAll("_", " ")}
                    {entry.actorRole ? ` · ${entry.actorRole}` : ""}
                  </p>
                  <p className="mt-1 font-medium">{entry.summary}</p>
                  {entry.correlationId && (
                    <p className="mt-1 font-mono text-xs text-black/40">
                      {entry.correlationId}
                    </p>
                  )}
                </div>
                <span className="text-xs text-black/40">
                  {formatTimestamp(entry.occurredAt)}
                </span>
              </div>
            </li>
          ))}
          {entries.length === 0 && (
            <li className="px-5 py-8 text-sm text-black/50">
              No audit events match this filter.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
