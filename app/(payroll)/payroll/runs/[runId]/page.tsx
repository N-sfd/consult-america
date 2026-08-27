import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RunActions from "@/components/payroll/run-actions";
import { getEmployeeProfile } from "@/lib/self-service";
import {
  getPayPeriodById,
  getPayrollRunById,
  listPayslipsForRun,
} from "@/lib/self-service/payroll-store";
import { payrollRunStatusLabels } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Payroll Run | ConsultAmerica",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function currency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PayrollRunDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = getPayrollRunById(runId);
  if (!run) notFound();

  const period = getPayPeriodById(run.payPeriodId);
  const payslips = listPayslipsForRun(run.id);
  const rows = await Promise.all(
    payslips.map(async (slip) => {
      const profile = await getEmployeeProfile(slip.employeeId);
      return { slip, name: profile ? `${profile.person.firstName} ${profile.person.lastName}` : slip.employeeId };
    }),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Payroll Run
        </h1>
        {period && (
          <p className="mt-2 text-black/55">
            {formatDate(period.periodStart)} – {formatDate(period.periodEnd)} ·
            Pay date {formatDate(period.payDate)}
          </p>
        )}
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-black/40">Status</p>
            <p className="mt-2 text-lg font-semibold">
              {payrollRunStatusLabels[run.status]}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-black/40">
              Employees
            </p>
            <p className="mt-2 text-lg font-semibold">{run.employeeCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-black/40">
              Gross Payroll
            </p>
            <p className="mt-2 text-lg font-semibold">
              {currency(run.totalGrossPay)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-black/40">
              Net Payroll
            </p>
            <p className="mt-2 text-lg font-semibold">
              {currency(run.totalNetPay)}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-black/5 pt-6">
          <RunActions runId={run.id} payPeriodId={run.payPeriodId} status={run.status} />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Gross Pay</th>
              <th className="px-4 py-3 font-medium">Deductions</th>
              <th className="px-4 py-3 font-medium">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ slip, name }) => (
              <tr key={slip.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-4 font-medium">{name}</td>
                <td className="px-4 py-4 text-black/55">{currency(slip.grossPay)}</td>
                <td className="px-4 py-4 text-black/55">
                  {currency(slip.totalDeductions)}
                </td>
                <td className="px-4 py-4 font-medium">{currency(slip.netPay)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-black/50">
                  No payslips calculated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
