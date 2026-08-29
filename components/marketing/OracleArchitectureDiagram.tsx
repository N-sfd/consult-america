"use client";

import { ArrowDown } from "lucide-react";

const ROW_1 = ["Financials", "Procurement", "Projects"];
const ROW_2 = ["HCM", "SCM", "EPM"];

const FLOW_STEPS = [
  "Strategy",
  "Design",
  "Configure",
  "Integrate",
  "Test",
  "Deploy",
];

export default function OracleArchitectureDiagram({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-white shadow-[0_12px_36px_rgba(16,42,67,0.04)]">
      <div className="flex items-center justify-between border-b border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-4 py-2.5">
        <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--mkt-navy)] uppercase">
          Oracle Cloud Architecture
        </span>
        <span className="text-[0.65rem] font-medium text-[var(--mkt-blue)]">
          Fusion · EPM · Analytics
        </span>
      </div>

      <div className={compact ? "p-4 space-y-3" : "p-5 space-y-4"}>
        {/* Modules Grid */}
        <div className="grid grid-cols-3 gap-2">
          {ROW_1.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-2.5 py-2 text-center text-xs font-medium text-[var(--mkt-navy)] shadow-xs transition-colors hover:border-[var(--mkt-blue)]/40 hover:bg-[var(--mkt-cloud)]"
            >
              {item}
            </div>
          ))}
          {ROW_2.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-2.5 py-2 text-center text-xs font-medium text-[var(--mkt-navy)] shadow-xs transition-colors hover:border-[var(--mkt-blue)]/40 hover:bg-[var(--mkt-cloud)]"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Connectors to Integration & Analytics */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <ArrowDown className="h-3.5 w-3.5 text-[var(--mkt-blue)]" />
          <div className="w-full max-w-sm rounded-lg border border-[var(--mkt-blue)]/35 bg-[var(--mkt-cloud)] px-3 py-1.5 text-center text-xs font-semibold text-[var(--mkt-blue)]">
            Integration Hub
          </div>
          <ArrowDown className="h-3.5 w-3.5 text-[var(--mkt-navy)]" />
          <div className="w-full max-w-sm rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-navy)] px-3 py-1.5 text-center text-xs font-medium text-white">
            Data &amp; Analytics
          </div>
        </div>
      </div>

      {/* Lifecycle footer */}
      <div className="border-t border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-1">
          {FLOW_STEPS.map((step, index) => (
            <span key={step} className="flex items-center gap-1">
              <span className="text-[0.68rem] font-medium text-[var(--mkt-muted)]">
                {step}
              </span>
              {index < FLOW_STEPS.length - 1 && (
                <span className="text-[0.62rem] text-[var(--mkt-border)]">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
