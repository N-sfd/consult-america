import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import Link from "next/link";

import { getHrOperationalReport } from "@/lib/self-service/reporting-service";
import {
  requireHrActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "HR Reports | ConsultAmerica",
};

export default async function HrReportsPage() {
  const actor = await requireHrActor();
  requirePermission(actor, "reports.read");
  const report = await getHrOperationalReport();

  return (
    <div className="space-y-8">
      <PageHeader
        title="HR Reports"
        description="Operational snapshot over Core HR, time, leave, approvals, and service-desk activity. Values are calculated from live domain data — no separate reporting tables."
        actions={
          <Link
            href="/hr/audit"
            className="rounded-md border border-[var(--ca-platform-border)] px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Open Audit Log
          </Link>
        }
      />

      <p className="text-xs text-[var(--ca-platform-muted)]">
        Generated {report.generatedAt.slice(0, 19).replace("T", " ")} UTC
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {report.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {metric.value}
            </p>
            {metric.hint && (
              <p className="mt-2 text-xs text-[var(--ca-platform-muted)]">{metric.hint}</p>
            )}
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BreakdownCard title="Leave by Status" rows={report.leaveByStatus} />
        <BreakdownCard title="HR Requests by Status" rows={report.hrByStatus} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BreakdownCard title="Audit Events by Type" rows={report.auditBreakdown} />
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
            Recent Audit
          </h2>
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {report.recentAudit.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="font-medium">{entry.summary}</p>
                <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
                  {entry.eventType.replaceAll("_", " ")} ·{" "}
                  {entry.createdAt.slice(0, 10)}
                </p>
              </li>
            ))}
            {report.recentAudit.length === 0 && (
              <li className="py-3 text-black/50">No audit events.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
            Outstanding Acknowledgments
          </h2>
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {report.pendingAcknowledgments.map((doc) => (
              <li key={doc.id} className="py-3">
                <p className="font-medium">{doc.employeeName}</p>
                <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
                  {doc.documentType} · uploaded {doc.uploadedAt.slice(0, 10)}
                </p>
              </li>
            ))}
            {report.pendingAcknowledgments.length === 0 && (
              <li className="py-3 text-black/50">No outstanding acknowledgments.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

function BreakdownCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-black/5 text-sm">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 py-3"
          >
            <span className="text-black/65">
              {row.label.replaceAll("_", " ")}
            </span>
            <span className="font-medium">{row.value}</span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-3 text-black/50">No data.</li>
        )}
      </ul>
    </div>
  );
}
