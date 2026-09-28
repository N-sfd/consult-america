import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import { listPayrollRuns } from "@/lib/self-service/payroll-store";

export const metadata: Metadata = {
  title: "Payroll Reports | ConsultAmerica",
};

function currency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function PayrollReportsPage() {
  const runs = listPayrollRuns().filter((r) => r.status === "LOCKED");
  const totals = runs.reduce(
    (acc, run) => ({
      gross: acc.gross + run.totalGrossPay,
      deductions: acc.deductions + run.totalDeductions,
      net: acc.net + run.totalNetPay,
    }),
    { gross: 0, deductions: 0, net: 0 },
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Summary across locked (finalized) payroll runs."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.gross)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
            Total Gross Pay
          </p>
        </div>
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.deductions)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
            Total Deductions
          </p>
        </div>
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.net)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
            Total Net Pay
          </p>
        </div>
      </section>

      <p className="text-xs text-[var(--ca-platform-muted)]">
        Across {runs.length} locked {runs.length === 1 ? "run" : "runs"}.
      </p>
    </div>
  );
}
