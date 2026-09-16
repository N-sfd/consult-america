import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared";
import {
  listPayrollRunSummaryRows,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Payroll" };
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  completed: "bg-emerald-600/10 text-emerald-800",
  ready: "bg-[var(--ca-platform-mid)]/10 text-[var(--ca-platform-mid)]",
  processing: "bg-amber-500/15 text-amber-800",
  failed: "bg-red-600/10 text-red-700",
  draft: "bg-black/[0.04] text-black/45",
};

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default async function WorkforcePayrollPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const persisted = workforceDataAvailable();
  const runs = persisted ? await listPayrollRunSummaryRows() : [];

  const totalGross = runs.reduce((sum, run) => sum + run.totalGrossAmount, 0);
  const totalEmployeesLastRun = runs[0]?.employeeCount ?? 0;
  const lockedRuns = runs.filter((run) => run.status === "completed").length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <PageHeader
        eyebrow="Administration"
        title="Payroll"
        description="Admin oversight of pay runs across the platform. For processing a run, adjustments, and payslips, use the Payroll workspace."
        actions={
          <Link
            href="/payroll"
            className="rounded-md border border-[var(--ca-platform-border)] px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Open Payroll workspace →
          </Link>
        }
      />

      {!persisted ? (
        <p className="rounded-lg border border-dashed border-black/15 bg-white p-5 text-sm text-black/45">
          Payroll runs connect when workforce data is persisted — no runs are recorded in this
          environment yet.
        </p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pay runs" value={String(runs.length)} />
            <StatCard label="Locked runs" value={String(lockedRuns)} />
            <StatCard label="Latest run headcount" value={String(totalEmployeesLastRun)} />
            <StatCard label="Total gross (all runs)" value={formatCurrency(totalGross)} />
          </section>

          <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white">
            <div className="border-b border-[var(--ca-platform-border)] px-5 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                Pay runs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
                  <tr>
                    <th className="px-5 py-3 font-medium">Pay period</th>
                    <th className="px-5 py-3 font-medium">Pay date</th>
                    <th className="px-5 py-3 font-medium">Employees</th>
                    <th className="px-5 py-3 font-medium">Regular hrs</th>
                    <th className="px-5 py-3 font-medium">Overtime hrs</th>
                    <th className="px-5 py-3 font-medium">Gross amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.payrollRunId} className="border-b border-black/5 last:border-b-0">
                      <td className="px-5 py-3 font-medium">
                        {formatDate(run.periodStart)} – {formatDate(run.periodEnd)}
                      </td>
                      <td className="px-5 py-3 text-black/70">{formatDate(run.payDate)}</td>
                      <td className="px-5 py-3 text-black/70">{run.employeeCount}</td>
                      <td className="px-5 py-3 text-black/70">{run.totalRegularHours}</td>
                      <td className="px-5 py-3 text-black/70">{run.totalOvertimeHours}</td>
                      <td className="px-5 py-3 text-black/70">
                        {formatCurrency(run.totalGrossAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${
                            STATUS_TONE[run.status] ?? "bg-black/[0.04] text-black/45"
                          }`}
                        >
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {runs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-black/50">
                        No payroll runs recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{value}</p>
    </div>
  );
}
