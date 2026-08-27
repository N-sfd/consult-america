"use client";

import { useState, useTransition } from "react";

import {
  approvePayrollRunAction,
  calculatePayrollRunAction,
  lockPayrollRunAction,
  submitRunForReviewAction,
} from "@/app/actions/payroll-actions";
import type { PayrollRunStatus } from "@/types/payroll";

export default function RunActions({
  runId,
  payPeriodId,
  status,
}: {
  runId: string;
  payPeriodId: string;
  status: PayrollRunStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {status === "CALCULATED" && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(() => calculatePayrollRunAction({ payPeriodId }))
              }
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50"
            >
              Recalculate
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => submitRunForReviewAction({ runId }))}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Submit for Review
            </button>
          </>
        )}

        {status === "UNDER_REVIEW" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => approvePayrollRunAction({ runId }))}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Approve
          </button>
        )}

        {status === "APPROVED" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => lockPayrollRunAction({ runId }))}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Lock Payroll
          </button>
        )}

        {status === "LOCKED" && (
          <p className="text-sm text-black/55">
            Payslips are final. This run is locked.
          </p>
        )}
      </div>

      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
