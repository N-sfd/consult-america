import type { Metadata } from "next";

import PayslipList from "@/components/employee/payslip-list";
import { listPayslipsForEmployee } from "@/lib/self-service/payroll-store";
import { requireEmployeeActor, requirePermission } from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "My Pay | ConsultAmerica",
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

export default async function EmployeePayPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.pay.read");

  const payslips = listPayslipsForEmployee(actor.session.employeeId);
  const latest = payslips[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">My Pay</h1>
        <p className="mt-2 text-black/55">
          Illustrative figures — not a real payroll calculation.
        </p>
      </div>

      {latest ? (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Last Pay
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {formatDate(latest.payDate)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Net Pay
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {currency(latest.netPay)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                Gross Pay
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {currency(latest.grossPay)}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <p className="text-sm text-black/50">No payslips on file yet.</p>
      )}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Recent Payslips
        </h2>
        <div className="mt-4">
          <PayslipList payslips={payslips} />
        </div>
      </section>
    </div>
  );
}
