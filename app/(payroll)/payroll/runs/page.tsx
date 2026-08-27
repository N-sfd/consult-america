import type { Metadata } from "next";
import Link from "next/link";

import StartRunButton from "@/components/payroll/start-run-button";
import {
  getRunForPeriod,
  listPayPeriods,
} from "@/lib/self-service/payroll-store";
import { payrollRunStatusLabels } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Payroll Runs | ConsultAmerica",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PayrollRunsPage() {
  const periods = listPayPeriods();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Payroll Runs
        </h1>
        <p className="mt-2 text-black/55">
          Open → Collect → Calculate → Review → Approve → Lock.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Pay Period</th>
              <th className="px-4 py-3 font-medium">Pay Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Net Pay</th>
              <th className="px-4 py-3 font-medium">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => {
              const run = getRunForPeriod(period.id);
              return (
                <tr key={period.id} className="border-b border-black/5 last:border-b-0">
                  <td className="px-4 py-4 font-medium">
                    {formatDate(period.periodStart)} – {formatDate(period.periodEnd)}
                  </td>
                  <td className="px-4 py-4 text-black/55">
                    {formatDate(period.payDate)}
                  </td>
                  <td className="px-4 py-4 text-black/55">
                    {run ? payrollRunStatusLabels[run.status] : "Not started"}
                  </td>
                  <td className="px-4 py-4 text-black/55">
                    {run
                      ? run.totalNetPay.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {run ? (
                      <Link
                        href={`/payroll/runs/${run.id}`}
                        className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
                      >
                        {run.status === "LOCKED" ? "View" : "Continue"}
                      </Link>
                    ) : (
                      <StartRunButton payPeriodId={period.id} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
