import type { Metadata } from "next";

import { PageHeader } from "@/components/shared";
import { ILLUSTRATIVE_WITHHOLDING_RATE } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Payroll Settings | ConsultAmerica",
};

export default function PayrollSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Settings"
        description="Payroll configuration for this demo (read-only)."
      />

      <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              Pay Period Cadence
            </dt>
            <dd className="mt-2 text-sm font-medium">Biweekly · 26 periods / year</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              Processing Lag
            </dt>
            <dd className="mt-2 text-sm font-medium">
              5 days from period end to pay date
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              Withholding Rate
            </dt>
            <dd className="mt-2 text-sm font-medium">
              {Math.round(ILLUSTRATIVE_WITHHOLDING_RATE * 100)}% flat (illustrative)
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              Currency
            </dt>
            <dd className="mt-2 text-sm font-medium">USD</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-[var(--ca-platform-muted)]">
          A production system would connect a real tax and benefits provider
          here rather than a flat rate.
        </p>
      </div>
    </div>
  );
}
