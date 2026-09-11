import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getDbConnectivitySummary,
  getLatestHealthChecks,
  getNotificationDeliveryHealthSummary,
  listPlatformUsers,
} from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Administration" };
export const dynamic = "force-dynamic";

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  sent: "Sent",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default async function WorkforceAdministrationPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const [users, healthChecks, deliverySummary, dbSummary] = await Promise.all([
    listPlatformUsers(),
    getLatestHealthChecks(),
    getNotificationDeliveryHealthSummary(),
    getDbConnectivitySummary(),
  ]);

  const latestCheck = [...healthChecks].sort((a, b) =>
    b.checkedAt.localeCompare(a.checkedAt),
  )[0];
  const failedDeliveries = deliverySummary.failed ?? 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Administration
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
          Users, health, notifications, and audit — only surfaces that persist
          real data. Role grant/revoke is not available from this workspace yet.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Users &amp; Access
          </h2>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{users.length}</p>
          <p className="mt-1 text-sm text-black/55">Platform accounts (read-only)</p>
          <Link
            href="/workforce/users"
            className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Open users →
          </Link>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            System Health
          </h2>
          <p className="mt-3 text-sm text-black/70">
            Database:{" "}
            <span className="font-medium">
              {dbSummary.configured ? "Configured" : "Not configured"}
            </span>
          </p>
          <p className="mt-1 text-sm text-black/70">
            Last health check:{" "}
            <span className="font-medium">
              {latestCheck
                ? `${latestCheck.checkName.replaceAll("_", " ")} · ${latestCheck.status}`
                : "None yet"}
            </span>
          </p>
          <p className="mt-1 text-sm text-black/70">
            Failed deliveries:{" "}
            <span className={failedDeliveries > 0 ? "font-medium text-red-700" : "font-medium"}>
              {failedDeliveries}
            </span>
          </p>
          <Link
            href="/workforce/system-health"
            className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Open system health →
          </Link>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Notification Operations
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Object.entries(DELIVERY_STATUS_LABELS).map(([status, label]) => (
              <Link
                key={status}
                href={`/workforce/notifications?status=${status}`}
                className="rounded-md border border-black/10 px-3 py-3 hover:border-[var(--ca-platform-deep)]/40"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">{label}</p>
                <p className="mt-1 text-xl font-semibold">{deliverySummary[status] ?? 0}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">Audit</h2>
          <p className="mt-3 text-sm text-black/55">
            Unified timeline across compliance, workforce operations, and recruiting activity.
          </p>
          <Link
            href="/workforce/audit"
            className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Open audit →
          </Link>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Configuration
          </h2>
          <p className="mt-3 text-sm text-black/55">
            Only settings that persist should live here. Role changes remain out of scope until
            explicitly approved.
          </p>
          <Link
            href="/workforce/settings"
            className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Open settings →
          </Link>
        </section>
      </div>
    </div>
  );
}
