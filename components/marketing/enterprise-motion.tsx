"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Database, Layers, Workflow, Activity, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const motionStages = [
  {
    step: "01",
    title: "Connected Core Operations",
    category: "ORACLE FUSION + CLOUD",
    description: "Multi-entity ledger synchronization, automated subledger accounting, and real-time period close governance.",
    metrics: "Period close cycle accelerated by 75%",
    proof: "Active across enterprise financial ledgers and procurement pipelines.",
  },
  {
    step: "02",
    title: "Unified Customer & Revenue Telemetry",
    category: "CUSTOMER 360 & CRM",
    description: "Account intelligence, pipeline risk indicators, and omni-channel customer service automated across backend ERP.",
    metrics: "Zero disconnect between pipeline and invoicing",
    proof: "Real-time sync between Salesforce, Dynamics, and Oracle Financials.",
  },
  {
    step: "03",
    title: "Governed AI & Document Intelligence",
    category: "DATA AGENT & APPLIED AI",
    description: "Automated FAR/DFARS clause extraction, complex document parsing, and audit-ready source citations.",
    metrics: "Verifiable extraction accuracy with source citations",
    proof: "Enterprise-wide compliance and legal verification repository.",
  },
  {
    step: "04",
    title: "Digital Workspaces & Workforce Platforms",
    category: "CONSULT AMERICA LABS",
    description: "Purpose-built platforms for talent management, ATS candidate conversion, employee portals, and payroll reporting.",
    metrics: "End-to-end recruit-to-pay automation",
    proof: "Adopted by enterprise workforce teams with role-based access control.",
  },
];

export default function EnterpriseMotion() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);
  const selectedStage = motionStages[activeTab];

  return (
    <section className="bg-[#0C2233] text-white py-20 sm:py-24 border-b border-[#1E3752]">
      <div className="ca-shell">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3752] bg-[#102033] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#B63A3A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
            ENTERPRISE IN MOTION
          </div>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
            Connected systems. Working as one.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#97A8B7]">
            When core enterprise platforms, customer channels, data intelligence, and digital products share unified architecture, organizations move with continuous velocity.
          </p>
        </div>

        {/* Interactive Architecture Motion Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: 4 Selectable System Stages */}
          <div className="lg:col-span-7 space-y-3">
            {motionStages.map((st, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`w-full rounded-lg border p-4.5 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#B63A3A] bg-[#102033] shadow-md ring-1 ring-[#B63A3A]"
                      : "border-[#1E3752] bg-[#102033]/60 hover:border-[#357C78] hover:bg-[#102033]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.68rem] font-bold tracking-wider text-[#B63A3A]">
                      {st.step} · {st.category}
                    </span>
                    <span className="rounded bg-[#1E3752] px-2 py-0.5 text-[0.62rem] font-bold text-[#97A8B7]">
                      Operational
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white">
                    {st.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#97A8B7] leading-relaxed">
                    {st.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Telemetry & Outcome Panel */}
          <div className="lg:col-span-5 rounded-xl border border-[#1E3752] bg-[#102033] p-6 lg:p-7 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E3752] pb-4">
              <span className="font-mono text-xs font-bold text-[#B63A3A] uppercase tracking-wider">
                Telemetry &amp; Lineage
              </span>
              <span className="rounded bg-[#DCEAE7] px-2 py-0.5 text-[0.62rem] font-bold text-[#357C78]">
                Real-Time Verified
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#97A8B7]">Current Architecture Focus</p>
                <h4 className="mt-1 font-serif text-xl font-bold text-white">
                  {selectedStage.title}
                </h4>
              </div>

              <div className="rounded-lg border border-[#1E3752] bg-[#0C2233] p-4 space-y-2">
                <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#B63A3A]">Validated Outcome</p>
                <p className="font-mono font-bold text-white text-sm">{selectedStage.metrics}</p>
                <p className="text-xs text-[#97A8B7] pt-2 border-t border-[#1E3752]">{selectedStage.proof}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
