import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import ExpenseClaimForm from "@/components/expenses/expense-claim-form";
import ExpenseClaimList from "@/components/expenses/expense-claim-list";
import { getExpenseClaims } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Expenses | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function EmployeeExpensesPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.expense.read");

  const claims = getExpenseClaims(actor.session.employeeId);
  const pendingTotal = claims
    .filter((claim) => claim.status === "PENDING")
    .reduce((total, claim) => total + claim.amount, 0);
  const approvedTotal = claims
    .filter((claim) => claim.status === "APPROVED" || claim.status === "PAID")
    .reduce((total, claim) => total + claim.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
        title="Expenses"
        description="Submit reimbursement claims and track approval status."
      />
        <ExpenseClaimForm />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
            Pending Approval
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            ${pendingTotal.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
            Approved Year to Date
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            ${approvedTotal.toFixed(2)}
          </p>
        </div>
      </section>

      <ExpenseClaimList claims={claims} />
    </div>
  );
}
