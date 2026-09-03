import type { Metadata } from "next";
import Link from "next/link";

import { getManagerTeamReport } from "@/lib/self-service/reporting-service";
import {
  requireManagerActor,
  requirePermission,
} from "@/lib/self-service/security";
import { approvalRequestTypeLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Team Reports | ConsultAmerica",
};

export default async function ManagerReportsPage() {
  const actor = await requireManagerActor();
  requirePermission(actor, "team.reports.read");
  const report = await getManagerTeamReport(actor.session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Team Reports
        </h1>
        <p className="mt-2 text-black/55">
          Direct-report operational view. Scoped to your team — not an HR
          employee directory.
        </p>
        <p className="mt-2 text-xs text-black/40">
          Generated {report.generatedAt.slice(0, 19).replace("T", " ")} UTC
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {report.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-black/10 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-black/40">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Direct Reports
          </h2>
          <Link
            href="/manager/team"
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            Open My Team
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.08em] text-black/40">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Position</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">PTO Available</th>
              </tr>
            </thead>
            <tbody>
              {report.teamRows.map((row) => (
                <tr key={row.employeeId} className="border-b border-black/5">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/manager/team/${row.employeeId}`}
                      className="font-medium text-[var(--ca-blue)] hover:underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-black/55">{row.position}</td>
                  <td className="py-3 pr-4 text-black/55">{row.status}</td>
                  <td className="py-3 font-medium">{row.ptoAvailable}h</td>
                </tr>
              ))}
              {report.teamRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-black/50">
                    No direct reports.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Pending Approvals
          </h2>
          <Link
            href="/manager/approvals"
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            Open Inbox
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-black/5 text-sm">
          {report.pendingApprovals.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                  {approvalRequestTypeLabels[item.requestType]}
                </p>
                <p className="mt-1 font-medium">{item.summary}</p>
              </div>
              <span className="text-xs text-black/40">
                {item.submittedAt.slice(0, 10)}
              </span>
            </li>
          ))}
          {report.pendingApprovals.length === 0 && (
            <li className="py-4 text-black/50">No pending approvals.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
