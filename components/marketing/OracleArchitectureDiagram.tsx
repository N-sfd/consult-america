"use client";

import { ArrowDown } from "lucide-react";

const apps = [
  "Finance (GL/AP/AR)",
  "Procurement & S2P",
  "Supply Chain (SCM)",
  "Projects (PPM)",
];

const extensions = [
  "Custom Workspaces",
  "Document Intelligence",
  "Partner Portals",
  "Task-Oriented Agents",
];

export default function OracleArchitectureDiagram() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#C9DDD7] bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#C9DDD7] bg-[#F0F6F4] px-4 py-2.5">
        <span className="text-[0.68rem] font-bold tracking-[0.14em] text-[#122D2E] uppercase">
          CONNECTED ORACLE ENTERPRISE ARCHITECTURE
        </span>
        <span className="text-[0.65rem] font-bold text-[#B83A3A]">
          High Availability · Zero Touch
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Layer 1: Fusion Applications */}
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#5B6D6B]">
            01 · Core Enterprise Cloud
          </p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {apps.map((app) => (
              <div
                key={app}
                className="rounded-lg border border-[#C9DDD7] bg-[#F0F6F4] px-2.5 py-2 text-center text-xs font-semibold text-[#122D2E] shadow-xs"
              >
                {app}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow / Bus */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="w-full max-w-md rounded-lg border border-[#0B4A47]/30 bg-[#E1ECE8] px-3 py-1.5 text-center text-xs font-bold text-[#122D2E]">
            Oracle Integration Cloud (OIC) &amp; FDI Analytics Fabric
          </div>
          <ArrowDown className="h-3.5 w-3.5 text-[#B83A3A]" />
          <div className="w-full max-w-md rounded-lg border border-[#073B3A] bg-[#0B4A47] px-3 py-1.5 text-center text-xs font-semibold text-white">
            Enterprise Data Warehouse &amp; Governed AI Layer
          </div>
        </div>

        {/* Layer 2: Extensions & AI */}
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#5B6D6B]">
            02 · Custom Applications &amp; AI Agents (Consult America Labs)
          </p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {extensions.map((ext) => (
              <div
                key={ext}
                className="rounded-lg border border-[#C9DDD7] bg-[#F0F6F4] px-2.5 py-2 text-center text-xs font-semibold text-[#122D2E] shadow-xs"
              >
                {ext}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#C9DDD7] bg-[#F0F6F4] px-4 py-2.5">
        <p className="text-[0.68rem] font-mono text-[#5B6D6B]">
          Clean core architecture with zero invasive ERP modifications
        </p>
      </div>
    </div>
  );
}
