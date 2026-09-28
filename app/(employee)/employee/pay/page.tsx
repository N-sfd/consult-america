import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

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
      <PageHeader
        title="My Pay"
        description="Illustrative figures — not a real payroll calculation."
      />

      {latest ? (
        <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
                Last Pay
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {formatDate(latest.payDate)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
                Net Pay
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {currency(latest.netPay)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
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

      <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
          Recent Payslips
        </h2>
        <div className="mt-4">
          <PayslipList payslips={payslips} />
        </div>
      </section>
    </div>
  );
}
