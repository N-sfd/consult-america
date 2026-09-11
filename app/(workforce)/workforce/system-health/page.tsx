import type { Metadata } from "next";
import Link from "next/link";

import {
  getDbConnectivitySummary,
  getLatestHealthChecks,
  getNotificationDeliveryHealthSummary,
} from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "System Health" };

const CHECK_LABELS: Record<string, string> = {
  function_drift: "Function Drift",
  trigger_drift: "Trigger Drift",
};

const STATUS_STYLES: Record<string, string> = {
  OK: "bg-emerald-100 text-emerald-800",
  DRIFT: "bg-amber-100 text-amber-800",
  ERROR: "bg-red-100 text-red-700",
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  sent: "Sent",
  failed: "Failed",
  cancelled: "Cancelled",
};

function formatTimestamp(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

export default async function WorkforceSystemHealthPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const [healthChecks, deliverySummary, dbSummary] = await Promise.all([
    getLatestHealthChecks(),
    getNotificationDeliveryHealthSummary(),
    getDbConnectivitySummary(),
  ]);

  const checksByName = new Map(healthChecks.map((c) => [c.checkName, c]));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          System Health
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
          Real, persisted status only — nothing on this page is computed live.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Schema Drift
        </h2>
        <p className="mt-2 text-sm text-black/45">
          Run <code className="rounded bg-black/5 px-1.5 py-0.5">npm run db:audit-drift</code> to
          refresh these results.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {Object.entries(CHECK_LABELS).map(([checkName, label]) => {
            const check = checksByName.get(checkName);
            return (
              <div key={checkName} className="rounded-lg border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{label}</p>
                  {check ? (
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        STATUS_STYLES[check.status] ?? "bg-black/5 text-black/60"
                      }`}
                    >
                      {check.status}
                    </span>
                  ) : (
                    <span className="rounded-md bg-black/5 px-2 py-1 text-xs font-medium text-black/40">
                      No check yet
                    </span>
                  )}
                </div>
                {check ? (
                  <>
                    <p className="mt-3 text-sm text-black/60">{check.summary}</p>
                    <p className="mt-2 text-xs text-black/40">
                      Checked {formatTimestamp(check.checkedAt)}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-black/45">
                    This check has never been run against the connected database.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Notification Delivery Health
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.entries(DELIVERY_STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="rounded-lg border border-black/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.1em] text-black/40">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {deliverySummary[status] ?? 0}
              </p>
              {status === "failed" && (deliverySummary.failed ?? 0) > 0 && (
                <Link
                  href="/workforce/notifications?status=failed"
                  className="mt-2 inline-block text-xs font-medium text-[var(--ca-blue)] hover:underline"
                >
                  View failed
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Database Connectivity
        </h2>
        <div className="mt-4 rounded-lg border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">Supabase connection</p>
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                dbSummary.configured ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
              }`}
            >
              {dbSummary.configured ? "Configured" : "Not configured"}
            </span>
          </div>
          {dbSummary.tables.length > 0 && (
            <ul className="mt-4 divide-y divide-black/5 text-sm">
              {dbSummary.tables.map((table) => (
                <li key={table.name} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-black/65">{table.name}</span>
                  <span className={table.ok ? "text-emerald-700" : "text-red-600"}>
                    {table.ok ? "reachable" : (table.error ?? "error")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
