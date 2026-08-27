import type { Metadata } from "next";

import { ILLUSTRATIVE_WITHHOLDING_RATE } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Payroll Settings | ConsultAmerica",
};

export default function PayrollSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Settings</h1>
        <p className="mt-2 text-black/55">Payroll configuration for this demo.</p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">
              Pay Period Cadence
            </dt>
            <dd className="mt-2 text-sm font-medium">Biweekly · 26 periods / year</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">
              Processing Lag
            </dt>
            <dd className="mt-2 text-sm font-medium">
              5 days from period end to pay date
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">
              Withholding Rate
            </dt>
            <dd className="mt-2 text-sm font-medium">
              {Math.round(ILLUSTRATIVE_WITHHOLDING_RATE * 100)}% flat (illustrative)
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">
              Currency
            </dt>
            <dd className="mt-2 text-sm font-medium">USD</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-black/40">
          A production system would connect a real tax and benefits provider
          here rather than a flat rate.
        </p>
      </div>
    </div>
  );
}
