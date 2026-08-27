"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { calculatePayrollRunAction } from "@/app/actions/payroll-actions";

export default function StartRunButton({ payPeriodId }: { payPeriodId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await calculatePayrollRunAction({ payPeriodId });
      if (result.ok && result.runId) {
        router.push(`/payroll/runs/${result.runId}`);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
    >
      {pending ? "Calculating…" : "Start Run"}
    </button>
  );
}
