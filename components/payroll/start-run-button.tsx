"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { calculatePayrollRunAction } from "@/app/actions/payroll-actions";

export default function StartRunButton({ payPeriodId }: { payPeriodId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await calculatePayrollRunAction({ payPeriodId });
      if (result.ok && result.runId) {
        router.push(`/payroll/runs/${result.runId}`);
        return;
      }
      setError(result.message || "Unable to start payroll run.");
    });
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "Calculating…" : "Start Run"}
      </button>
      {error ? (
        <p className="max-w-[14rem] text-right text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
