import type { Metadata } from "next";

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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Reports</h1>
        <p className="mt-2 text-black/55">
          Summary across locked (finalized) payroll runs.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.gross)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-black/45">
            Total Gross Pay
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.deductions)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-black/45">
            Total Deductions
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {currency(totals.net)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.1em] text-black/45">
            Total Net Pay
          </p>
        </div>
      </section>

      <p className="text-xs text-black/40">
        Across {runs.length} locked {runs.length === 1 ? "run" : "runs"}.
      </p>
    </div>
  );
}
