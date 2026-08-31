"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Database, Cpu, Layers, ArrowRight, ShieldCheck, Users, Workflow, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const stages = [
  {
    id: "oracle",
    step: "01",
    title: "Oracle Fusion Cloud",
    category: "ERP · SCM · HCM · EPM",
    icon: Layers,
    description: "Transactional backbone managing financials, procurement, workforce, and supply chain records.",
    detail: "Multi-entity accounting, automated ledger reconciliation, global supply routing.",
    status: "Active Source",
    metrics: "99.99% Reliability",
  },
  {
    id: "integration",
    step: "02",
    title: "Integration & OIC Hub",
    category: "APIs · Event Streams · OIC",
    icon: Workflow,
    description: "Low-latency data pipelines and event bridges syncing transactions across legacy and cloud fabrics.",
    detail: "Real-time Kafka pub/sub streams, zero-data-loss buffering, schema validation.",
    status: "Synchronized",
    metrics: "<15ms Bridge Latency",
  },
  {
    id: "data",
    step: "03",
    title: "Enterprise Data Foundation",
    category: "Lakehouse · Grounding · Vector",
    icon: Database,
    description: "Governed semantic layer indexing unstructured contracts, operational logs, and data marts.",
    detail: "Strict data sovereignty, vector embeddings, human-in-the-loop audit logs.",
    status: "Governed",
    metrics: "100% Audit Grounding",
  },
  {
    id: "ai",
    step: "04",
    title: "AI Agents & Intelligence",
    category: "Data Agent · MediGuide · Decisioning",
    icon: Sparkles,
    description: "Autonomous agents extracting complex clauses, generating actions, and triaging exceptions.",
    detail: "DFARS compliance check, document parsing, proactive workflow recommendations.",
    status: "Autonomous",
    metrics: "99.8% Extraction Accuracy",
  },
  {
    id: "apps",
    step: "05",
    title: "Business Applications",
    category: "CRM · ATS · Talent · Portals",
    icon: Cpu,
    description: "Production-ready enterprise workspaces where teams collaborate, close deals, and hire talent.",
    detail: "Customer 360 workspaces, applicant tracking pipelines, self-service portals.",
    status: "Production",
    metrics: "4 Specialized Portals",
  },
  {
    id: "people",
    step: "06",
    title: "Employees & Customers",
    category: "Action · Decision · Value",
    icon: Users,
    description: "End users equipped with real-time insight, simplified approvals, and high-trust experiences.",
    detail: "Mobile-responsive approvals, guided intelligence, seamless user adoption.",
    status: "Empowered",
    metrics: "100% Adoption Velocity",
  },
];

export default function EnterpriseMotion() {
  const [selectedStage, setSelectedStage] = useState(stages[0]);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#2B2420] text-[#F7F3EC] py-20 sm:py-24 lg:py-28 relative overflow-hidden border-b border-[#3A302B]">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #F7F3EC 1px, transparent 1px), linear-gradient(to bottom, #F7F3EC 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mkt-shell relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#52443D] bg-[#342B27] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D8C5AA]" />
            CONNECTED DIGITAL CORE
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Enterprise systems.
            <br />
            <span className="text-[#D8C5AA]">Working as one.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#C5BCB3]">
            Connect applications, data, AI and people across the workflows that run the enterprise.
            We architect and deploy the end-to-end fabric that eliminates friction between core systems and production software.
          </p>
        </div>

        {/* Architecture Flow Visualization */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Flow Stepper / Node Selection Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage.id === stage.id;

              return (
                <motion.div
                  key={stage.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left rounded-xl border p-4.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#D8C5AA] bg-[#3A302B] shadow-[0_8px_30px_rgba(0,0,0,0.3)] ring-1 ring-[#D8C5AA]"
                        : "border-[#3A302B] bg-[#342B27]/70 hover:border-[#52443D] hover:bg-[#342B27]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.68rem] font-bold tracking-wider text-[#D8C5AA]">
                        {stage.step}
                      </span>
                      <span className="rounded bg-[#2B2420] px-2 py-0.5 text-[0.62rem] font-bold text-[#A4B1BE] border border-[#52443D]">
                        {stage.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-[#7D2639] text-white" : "bg-[#2B2420] text-[#D8C5AA]"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {stage.title}
                        </h4>
                        <p className="text-[0.68rem] text-[#A4B1BE]">
                          {stage.category}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#C5BCB3] line-clamp-2">
                      {stage.description}
                    </p>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Detailed Architectural Inspection Card (Right Panel) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#52443D] bg-[#342B27] p-6 lg:p-7 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#52443D] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#657766] animate-pulse" />
                <span className="font-mono text-xs font-bold text-[#D8C5AA] uppercase tracking-wider">
                  Live System Fabric
                </span>
              </div>
              <span className="font-mono text-xs text-[#A4B1BE]">
                NODE #{selectedStage.step}
              </span>
            </div>

            <div className="mt-6">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#A4B1BE]">
                {selectedStage.category}
              </span>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                {selectedStage.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#C5BCB3]">
                {selectedStage.description}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-[#52443D] bg-[#2B2420] p-4.5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A4B1BE]">Operational Health:</span>
                <span className="font-bold text-[#657766] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A4B1BE]">Performance Target:</span>
                <span className="font-mono font-bold text-[#D8C5AA]">{selectedStage.metrics}</span>
              </div>
              <div className="pt-2 border-t border-[#3A302B] text-xs text-[#C5BCB3]">
                <strong className="text-white block mb-1">Architecture Execution:</strong>
                {selectedStage.detail}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#52443D] flex items-center justify-between">
              <Link
                href="/oracle"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
              >
                Explore Connected Architecture <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/capabilities/digital-engineering"
                className="text-xs text-[#A4B1BE] hover:underline"
              >
                API Specifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
