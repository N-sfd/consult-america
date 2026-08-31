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
    <div className="overflow-hidden rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_12px_36px_rgba(38,31,27,0.06)]">
      <div className="flex items-center justify-between border-b border-[#D7CCBD] bg-[#F4EFE6] px-4 py-2.5">
        <span className="text-[0.68rem] font-bold tracking-[0.14em] text-[#261F1B] uppercase">
          Oracle Cloud Architecture
        </span>
        <span className="text-[0.65rem] font-bold text-[#7D2639]">
          Fusion · EPM · Analytics
        </span>
      </div>

      <div className={compact ? "p-4 space-y-3" : "p-5 space-y-4"}>
        {/* Modules Grid */}
        <div className="grid grid-cols-3 gap-2">
          {ROW_1.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] px-2.5 py-2 text-center text-xs font-semibold text-[#261F1B] shadow-xs transition-colors hover:border-[#7D2639]/40 hover:bg-[#FFFAF2]"
            >
              {item}
            </div>
          ))}
          {ROW_2.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] px-2.5 py-2 text-center text-xs font-semibold text-[#261F1B] shadow-xs transition-colors hover:border-[#7D2639]/40 hover:bg-[#FFFAF2]"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Connectors to Integration & Analytics */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <ArrowDown className="h-3.5 w-3.5 text-[#657766]" />
          <div className="w-full max-w-sm rounded-lg border border-[#657766]/50 bg-[#DFE4DA] px-3 py-1.5 text-center text-xs font-bold text-[#261F1B]">
            Integration Hub
          </div>
          <ArrowDown className="h-3.5 w-3.5 text-[#7D2639]" />
          <div className="w-full max-w-sm rounded-lg border border-[#D8C5AA] bg-[#2B2420] px-3 py-1.5 text-center text-xs font-semibold text-[#F7F0E7]">
            Data &amp; Analytics Platform
          </div>
        </div>
      </div>

      {/* Lifecycle footer */}
      <div className="border-t border-[#D7CCBD] bg-[#F4EFE6] px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-1">
          {FLOW_STEPS.map((step, index) => (
            <span key={step} className="flex items-center gap-1">
              <span className="text-[0.68rem] font-medium text-[#695F57]">
                {step}
              </span>
              {index < FLOW_STEPS.length - 1 && (
                <span className="text-[0.62rem] text-[#D7CCBD]">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
