import type { Metadata } from "next";
import Link from "next/link";

import { hrRepository } from "@/lib/hr";
import {
  getCurrentPayPeriod,
  getRunForPeriod,
} from "@/lib/self-service/payroll-store";
import { listApprovals } from "@/lib/self-service/workflow-store";
import {
  payPeriodStatusLabels,
  payrollRunStatusLabels,
} from "@/types/payroll";

export const metadata: Metadata = {
  title: "Payroll | ConsultAmerica",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
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

export default async function PayrollOverviewPage() {
  const period = getCurrentPayPeriod();
  const run = period ? getRunForPeriod(period.id) : undefined;
  const employees = await hrRepository.listEmployees();
  const activeCount = employees.filter((e) => e.employmentStatus === "ACTIVE").length;
  const pendingTimeApprovals = listApprovals().filter(
    (a) => a.requestType === "TIMESHEET" && a.status === "PENDING",
  ).length;

  const status = run ? payrollRunStatusLabels[run.status] : "Ready for Processing";

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
          Payroll
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
          Demo calculator figures — not production payroll or tax data.
        </p>
      </div>

      {period ? (
        <section className="ca-platform-summary-band">
          <div>
            <p className="ca-platform-kpi-label">Next Pay Date</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {formatDate(period.payDate)}
            </p>
          </div>
          <div>
            <p className="ca-platform-kpi-label">Current Period</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
              {formatDate(period.periodStart)} – {formatDate(period.periodEnd)}
            </p>
          </div>
          <div>
            <p className="ca-platform-kpi-label">Status</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">{status}</p>
          </div>
          <Link
            href={run ? `/payroll/runs/${run.id}` : "/payroll/runs"}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--ca-platform-red)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--ca-red-hover)]"
          >
            {run ? "Continue Run" : "Start Payroll Run"}
          </Link>
        </section>
      ) : (
        <p className="text-sm text-[var(--ca-platform-muted)]">No open pay period.</p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Employees" value={String(activeCount)} />
        <StatCard
          label="Gross Payroll"
          value={run ? formatCurrency(run.totalGrossPay) : "—"}
        />
        <StatCard label="Exceptions" value={String(run?.exceptionCount ?? 0)} />
        <StatCard
          label="Pending Time Approvals"
          value={String(pendingTimeApprovals)}
        />
      </section>

      <section className="ca-platform-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="ca-platform-kpi-label">Recent Pay Periods</h2>
          <Link
            href="/payroll/pay-periods"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            View all
          </Link>
        </div>
        <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">
          {payPeriodStatusLabels.CLOSED} periods have a locked, finalized run —
          see{" "}
          <Link href="/payroll/runs" className="font-semibold text-[var(--ca-platform-mid)] hover:underline">
            Payroll Runs
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="ca-platform-card ca-platform-kpi">
      <p className="ca-platform-kpi-label">{label}</p>
      <p className="ca-platform-kpi-value">{value}</p>
    </div>
  );
}
