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
    <div className="overflow-hidden rounded-xl border border-[#DDE4E8] bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#E9EEF1] bg-[#F7F9FA] px-4 py-2.5">
        <span className="text-[0.68rem] font-bold tracking-[0.14em] text-[#102033] uppercase">
          CONNECTED ORACLE ENTERPRISE ARCHITECTURE
        </span>
        <span className="text-[0.65rem] font-bold text-[#BA3535]">
          High Availability · Zero Touch
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Layer 1: Fusion Applications */}
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#526170]">
            01 · Core Enterprise Cloud
          </p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {apps.map((app) => (
              <div
                key={app}
                className="rounded-lg border border-[#DDE4E8] bg-[#F7F9FA] px-2.5 py-2 text-center text-xs font-semibold text-[#102033] shadow-xs"
              >
                {app}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow / Bus */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="w-full max-w-md rounded-lg border border-[#357C78]/40 bg-[#DCEAE7] px-3 py-1.5 text-center text-xs font-bold text-[#102033]">
            Oracle Integration Cloud (OIC) &amp; FDI Analytics Fabric
          </div>
          <ArrowDown className="h-3.5 w-3.5 text-[#BA3535]" />
          <div className="w-full max-w-md rounded-lg border border-[#1E3752] bg-[#0C2233] px-3 py-1.5 text-center text-xs font-semibold text-white">
            Enterprise Data Warehouse &amp; Governed AI Layer
          </div>
        </div>

        {/* Layer 2: Extensions & AI */}
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#526170]">
            02 · Custom Applications &amp; AI Agents (Consult America Labs)
          </p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {extensions.map((ext) => (
              <div
                key={ext}
                className="rounded-lg border border-[#DDE4E8] bg-[#F7F9FA] px-2.5 py-2 text-center text-xs font-semibold text-[#102033] shadow-xs"
              >
                {ext}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#E9EEF1] bg-[#F7F9FA] px-4 py-2.5">
        <p className="text-[0.68rem] font-mono text-[#526170]">
          Clean core architecture with zero invasive ERP modifications
        </p>
      </div>
    </div>
  );
}
