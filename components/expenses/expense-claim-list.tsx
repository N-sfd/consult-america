"use client";

import { useState, useTransition } from "react";

import { cancelExpenseAction } from "@/app/actions/expense-actions";
import type { ExpenseClaim } from "@/types/self-service";
import { expenseCategoryLabels, expenseClaimStatusLabels } from "@/types/self-service";

interface ExpenseClaimListProps {
  claims: ExpenseClaim[];
}

export default function ExpenseClaimList({ claims }: ExpenseClaimListProps) {
  if (claims.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
        No expense claims yet.
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        Claims
      </h2>
      <ul className="mt-4 divide-y divide-black/5 text-sm">
        {claims.map((claim) => (
          <ExpenseClaimRow key={claim.id} claim={claim} />
        ))}
      </ul>
    </section>
  );
}

function ExpenseClaimRow({ claim }: { claim: ExpenseClaim }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cancellable = claim.status === "PENDING";

  function handleCancel() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await cancelExpenseAction({ expenseClaimId: claim.id });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-medium">
          {expenseCategoryLabels[claim.category]} · ${claim.amount.toFixed(2)}
        </p>
        <p className="mt-1 text-black/55">
          {claim.expenseDate} · {claim.description}
        </p>
        {(message || error) && (
          <p
            className={`mt-1 text-xs ${message ? "text-emerald-700" : "text-red-600"}`}
            role={message ? "status" : "alert"}
          >
            {message ?? error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.1em] text-black/45">
          {expenseClaimStatusLabels[claim.status]}
        </span>
        {cancellable && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}
