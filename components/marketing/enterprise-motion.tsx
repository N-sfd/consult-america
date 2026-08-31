"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Database, Cpu, Layers, ArrowDown, ShieldCheck, Users, Workflow, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const stages = [
  {
    id: "oracle",
    step: "01",
    title: "Oracle Fusion Cloud",
    subtitle: "Transactional Core",
    category: "ERP · SCM · HCM · EPM",
    icon: Layers,
    description: "Transactional backbone managing global financials, automated subledger accounting, supplier procurement, and workforce records.",
    keyCapabilities: ["Multi-Entity Fusion Financials", "Real-time Subledger Accounting", "Automated Period-Close Engine"],
    status: "Active Source Core",
    latency: "<5ms",
  },
  {
    id: "integration",
    step: "02",
    title: "Integration & OIC Hub",
    subtitle: "Event Mesh & Middleware",
    category: "APIs · Event Streams · OIC",
    icon: Workflow,
    description: "Low-latency message routing and API gateways streaming transactions across legacy infrastructure and cloud fabrics without data loss.",
    keyCapabilities: ["Managed OIC Bridges", "Event-Driven Microservices", "Schema Transformation & Zero-Loss Queues"],
    status: "Synchronized",
    latency: "<15ms",
  },
  {
    id: "data",
    step: "03",
    title: "Enterprise Data Foundation",
    subtitle: "Governed Semantic Layer",
    category: "Lakehouse · Grounding · Vector",
    icon: Database,
    description: "Unified data foundation indexing unstructured documents, operational logs, and data marts with strict compliance lineage.",
    keyCapabilities: ["Governed Semantic Layer", "Vector Retrieval & Citations", "Zero-Trust Data Sovereignty"],
    status: "Governed",
    latency: "Real-time",
  },
  {
    id: "ai",
    step: "04",
    title: "AI Agents & Intelligence",
    subtitle: "Autonomous Decisioning",
    category: "Data Agent · MediGuide · Decisioning",
    icon: Sparkles,
    description: "Autonomous reasoning agents extracting regulatory clauses, synthesizing complex medical histories, and routing exceptions.",
    keyCapabilities: ["Data Agent Regulatory Extraction", "Grounded Citation Evidence", "Exception Triage & Proactive Routing"],
    status: "Autonomous",
    latency: "Instant",
  },
  {
    id: "apps",
    step: "05",
    title: "Business Applications",
    subtitle: "Production Workspaces",
    category: "CRM · ATS · Talent · Portals",
    icon: Cpu,
    description: "Custom enterprise workspaces where teams collaborate, manage accounts, track pipeline, and hire talent without friction.",
    keyCapabilities: ["Customer 360 Revenue Workspace", "Applicant Tracking & Hiring Suite", "Self-Service Employee Portals"],
    status: "Production Ready",
    latency: "Sub-second",
  },
  {
    id: "people",
    step: "06",
    title: "Employees & Customers",
    subtitle: "Target State Adoption",
    category: "Action · Decision · Value",
    icon: Users,
    description: "Equipping knowledge workers and customers with live intelligence, simplified approvals, and high-trust digital experiences.",
    keyCapabilities: ["Streamlined Executive Approvals", "Grounded Contextual Answers", "Measurable Operational Value"],
    status: "Empowered",
    latency: "Continuous",
  },
];

export default function EnterpriseMotion() {
  const [selectedStage, setSelectedStage] = useState(stages[0]);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#211E1B] text-[#F7F3EC] py-24 sm:py-28 lg:py-32 relative overflow-hidden border-b border-[#3A302B]">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #F7F3EC 1px, transparent 1px), linear-gradient(to bottom, #F7F3EC 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mkt-shell relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#52443D] bg-[#2B2420] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D8C5AA]" />
            CONNECTED DIGITAL CORE
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Enterprise systems.
            <br />
            <span className="text-[#D8C5AA]">Working as one.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#C5BCB3]">
            Connect applications, data, AI, and people across the core workflows that run the business.
            We architect and deploy the end-to-end fabric that eliminates friction between systems of record and production software.
          </p>
        </div>

        {/* Central Architecture Flow Visualization & Single Inspection Panel */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Flow Stack (~55%) */}
          <div className="lg:col-span-7 space-y-2.5">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage.id === stage.id;

              return (
                <div key={stage.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-[#D8C5AA] bg-[#2B2420] shadow-lg shadow-black/40 translate-x-1"
                        : "border-[#3A302B] bg-[#2B2420]/60 hover:border-[#52443D] hover:bg-[#2B2420]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? "bg-[#7D2639] text-white"
                            : "bg-[#342B27] text-[#D8C5AA]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[0.62rem] font-bold text-[#D8C5AA]">
                            {stage.step}
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-white truncate">
                            {stage.title}
                          </h4>
                        </div>
                        <p className="text-[0.68rem] text-[#A4B1BE] truncate">
                          {stage.subtitle} · {stage.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block rounded bg-[#342B27] px-2 py-0.5 text-[0.6rem] font-bold text-[#D8C5AA]">
                        {stage.status}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform ${
                          isSelected ? "text-[#D8C5AA] translate-x-1" : "text-[#52443D]"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Flow Arrow Connection */}
                  {idx < stages.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="h-3.5 w-3.5 text-[#52443D]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Single Focused Inspection Panel (~45%) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#3A302B] pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#D8C5AA]">
                    STAGE {selectedStage.step}
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="font-mono text-xs text-[#A4B1BE] uppercase">
                    Architectural Telemetry
                  </span>
                </div>
                <span className="rounded bg-[#342B27] border border-[#52443D] px-2.5 py-1 text-[0.62rem] font-bold text-[#D8C5AA]">
                  {selectedStage.latency}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedStage.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {selectedStage.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#C5BCB3]">
                      {selectedStage.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[#D8C5AA]">
                      Key Capabilities &amp; Standards
                    </p>
                    <div className="space-y-2">
                      {selectedStage.keyCapabilities.map((cap) => (
                        <div
                          key={cap}
                          className="flex items-center gap-2.5 rounded-lg border border-[#3A302B] bg-[#1C1815] p-3 text-xs text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#D8C5AA] shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#3A302B] flex items-center justify-between">
                    <Link
                      href="/capabilities/enterprise-transformation"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
                    >
                      Explore Architectural Patterns →
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
