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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Payroll</h1>
        <p className="mt-2 text-black/55">
          Illustrative figures — a demo calculator, not a tax engine.
        </p>
      </div>

      {period ? (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Next Pay Date
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {formatDate(period.payDate)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Current Pay Period
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {formatDate(period.periodStart)} – {formatDate(period.periodEnd)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Status
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {status}
              </p>
            </div>
          </div>
          <Link
            href={run ? `/payroll/runs/${run.id}` : "/payroll/runs"}
            className="mt-6 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            {run ? "Continue this run →" : "Start payroll run →"}
          </Link>
        </section>
      ) : (
        <p className="text-sm text-black/50">No open pay period.</p>
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

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Recent Pay Periods
          </h2>
          <Link
            href="/payroll/pay-periods"
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            View all
          </Link>
        </div>
        <p className="mt-4 text-sm text-black/50">
          {payPeriodStatusLabels.CLOSED} periods have a locked, finalized run —
          see{" "}
          <Link href="/payroll/runs" className="text-[var(--ca-blue)] hover:underline">
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
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.1em] text-black/45">
        {label}
      </p>
    </div>
  );
}
