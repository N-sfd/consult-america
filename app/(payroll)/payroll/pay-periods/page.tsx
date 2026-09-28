import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import { listPayPeriods } from "@/lib/self-service/payroll-store";
import { payPeriodStatusLabels } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Pay Periods | ConsultAmerica",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PayPeriodsPage() {
  const periods = listPayPeriods();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pay Periods"
        description="Biweekly cadence, 26 periods per year."
      />

      <div className="overflow-hidden rounded-lg border border-[var(--ca-platform-border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-[var(--ca-platform-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium">Pay Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-4 font-medium">
                  {formatDate(period.periodStart)} – {formatDate(period.periodEnd)}
                </td>
                <td className="px-4 py-4 text-[var(--ca-platform-muted)]">
                  {formatDate(period.payDate)}
                </td>
                <td className="px-4 py-4 text-[var(--ca-platform-muted)]">
                  {payPeriodStatusLabels[period.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
