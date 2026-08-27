import type { Metadata } from "next";

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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Pay Periods
        </h1>
        <p className="mt-2 text-black/55">Biweekly cadence, 26 periods per year.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
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
                <td className="px-4 py-4 text-black/55">
                  {formatDate(period.payDate)}
                </td>
                <td className="px-4 py-4 text-black/55">
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
