import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { listAuditTimeline } from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Audit" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  source?: string;
  action?: string;
  actor?: string;
  entityType?: string;
  entityId?: string;
  correlationId?: string;
  from?: string;
  to?: string;
  detail?: string;
}>;

const SOURCE_FILTERS = [
  { value: "ALL", label: "All sources" },
  { value: "audit_logs", label: "Compliance" },
  { value: "workforce_audit_events", label: "Workforce Ops" },
  { value: "recruiting_activities", label: "Recruiting" },
] as const;

function formatTimestamp(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

function buildAuditHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return query ? `/workforce/audit?${query}` : "/workforce/audit";
}

export default async function WorkforceAuditPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getWorkforceSession();
  if (
    !session.roles.includes("ADMIN") &&
    !session.roles.includes("HR") &&
    !session.roles.includes("RECRUITER")
  ) {
    redirect("/workforce");
  }

  const params = await searchParams;
  const source = params.source ?? "ALL";
  const allEntries = await listAuditTimeline(250);

  const entries = allEntries.filter((entry) => {
    if (source !== "ALL" && entry.source !== source) return false;
    if (params.action && !entry.eventType.toLowerCase().includes(params.action.toLowerCase())) {
      return false;
    }
    if (params.actor) {
      const actorHaystack = `${entry.actorRole ?? ""} ${entry.actorEmployeeId ?? ""}`.toLowerCase();
      if (!actorHaystack.includes(params.actor.toLowerCase())) return false;
    }
    if (
      params.entityType &&
      !(entry.resourceType ?? "").toLowerCase().includes(params.entityType.toLowerCase())
    ) {
      return false;
    }
    if (
      params.entityId &&
      !(entry.resourceId ?? "").toLowerCase().includes(params.entityId.toLowerCase())
    ) {
      return false;
    }
    if (
      params.correlationId &&
      !(entry.correlationId ?? "").toLowerCase().includes(params.correlationId.toLowerCase())
    ) {
      return false;
    }
    if (params.from && entry.occurredAt.slice(0, 10) < params.from) return false;
    if (params.to && entry.occurredAt.slice(0, 10) > params.to) return false;
    return true;
  });

  const detail = params.detail
    ? allEntries.find((entry) => entry.id === params.detail)
    : undefined;

  const filterState = {
    source: source !== "ALL" ? source : undefined,
    action: params.action,
    actor: params.actor,
    entityType: params.entityType,
    entityId: params.entityId,
    correlationId: params.correlationId,
    from: params.from,
    to: params.to,
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">Workforce</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">Audit</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
          Unified timeline across compliance, workforce operations, and recruiting activity.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">Source</p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={buildAuditHref({
                ...filterState,
                source: filter.value === "ALL" ? undefined : filter.value,
                detail: undefined,
              })}
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

      <form
        method="get"
        action="/workforce/audit"
        className="mt-4 grid gap-3 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        <input type="hidden" name="source" value={source} />
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">From</span>
          <input
            type="date"
            name="from"
            defaultValue={params.from ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">To</span>
          <input
            type="date"
            name="to"
            defaultValue={params.to ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Actor</span>
          <input
            name="actor"
            defaultValue={params.actor ?? ""}
            placeholder="Role or employee id"
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Action</span>
          <input
            name="action"
            defaultValue={params.action ?? ""}
            placeholder="REPORT_EXPORTED"
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Entity Type
          </span>
          <input
            name="entityType"
            defaultValue={params.entityType ?? ""}
            placeholder="report"
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Entity ID</span>
          <input
            name="entityId"
            defaultValue={params.entityId ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs sm:col-span-2 xl:col-span-2">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Correlation ID
          </span>
          <input
            name="correlationId"
            defaultValue={params.correlationId ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <div className="flex items-end sm:col-span-2 xl:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
          >
            Apply filters
          </button>
        </div>
      </form>

      {detail ? (
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                Detail · {detail.eventType.replaceAll("_", " ")}
              </p>
              <p className="mt-1 font-medium">{detail.summary}</p>
              <p className="mt-2 text-xs text-black/45">
                {[detail.resourceType, detail.resourceId].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
            <Link
              href={buildAuditHref(filterState)}
              className="text-sm font-medium text-[var(--ca-platform-mid)] hover:underline"
            >
              Close detail
            </Link>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-md bg-black/[0.03] p-3 text-xs text-black/70">
            {JSON.stringify(
              {
                source: detail.source,
                actorRole: detail.actorRole,
                actorEmployeeId: detail.actorEmployeeId,
                resourceType: detail.resourceType,
                resourceId: detail.resourceId,
                correlationId: detail.correlationId,
                metadata: detail.metadata ?? null,
                occurredAt: detail.occurredAt,
              },
              null,
              2,
            )}
          </pre>
        </div>
      ) : null}

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
                    <p className="mt-1 font-mono text-xs text-black/40">{entry.correlationId}</p>
                  )}
                  <Link
                    href={buildAuditHref({ ...filterState, detail: entry.id })}
                    className="mt-2 inline-block text-xs font-medium text-[var(--ca-platform-mid)] hover:underline"
                  >
                    View detail
                  </Link>
                </div>
                <span className="text-xs text-black/40">{formatTimestamp(entry.occurredAt)}</span>
              </div>
            </li>
          ))}
          {entries.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-black/50">
              No data available for this period.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
