"use client";

import { useState } from "react";
import { Search, Compass, Cpu, Workflow, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const deliveryStages = [
  {
    step: "01",
    name: "STRATEGY & ARCHITECTURE",
    icon: Compass,
    headline: "Target operating model & feasibility",
    detail: "Define business outcomes, enterprise architecture standards, data boundaries, and phased deployment milestones.",
    deliverables: ["Target Operating Model", "Technical Feasibility Matrix", "Business Case & ROI Model"],
  },
  {
    step: "02",
    name: "CLEAN-CORE DESIGN",
    icon: Search,
    headline: "Standardized schemas & configuration",
    detail: "Configure Oracle Cloud, CRM, and data pipelines around core capabilities with zero invasive customizations.",
    deliverables: ["Process Decomposition", "Data Migration Mapping", "Security & RBAC Architecture"],
  },
  {
    step: "03",
    name: "ENGINEERING & LABS BUILD",
    icon: Cpu,
    headline: "Platform extension & applied AI",
    detail: "Build custom digital applications, document intelligence agents, and low-latency API bridges where packaged software stops.",
    deliverables: ["Custom Portals & Workspaces", "Task-Oriented AI Agents", "Integration Event Streamers"],
  },
  {
    step: "04",
    name: "CUTOVER & TESTING",
    icon: Workflow,
    headline: "Automated regression & financial reconciliation",
    detail: "Execute end-to-end user acceptance, subledger balance validation, and zero-downtime cutover governance.",
    deliverables: ["Automated Regression Suites", "Mock Cutover Rehearsals", "Audit Sign-off Protocols"],
  },
  {
    step: "05",
    name: "ADOPTION & MANAGED RUN",
    icon: CheckCircle2,
    headline: "Continuous optimization & support",
    detail: "Provide 24/7 SLA-backed managed support, periodic patch validation, and ongoing workflow enhancements.",
    deliverables: ["24/7 Production Support", "Quarterly Upgrade Validation", "Workflow Telemetry Monitoring"],
  },
];

export default function DeliveryModel() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="bg-[#F7F9FA] text-[#163536] py-20 sm:py-24 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DDE4E8]">
          <div>
            <SectionLabel tone="burgundy">DELIVERY METHODOLOGY</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#163536]">
              From architecture through production run.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#526170]">
            Our proven 5-stage transformation lifecycle engineered for predictable enterprise cutovers.
          </p>
        </div>

        {/* 5-Stage Stepper Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {deliveryStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <motion.button
                key={stage.step}
                type="button"
                onClick={() => setActiveStage(idx)}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group flex flex-col justify-between rounded-lg border p-5 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#B63A3A] bg-white shadow-sm ring-1 ring-[#B63A3A]"
                    : "border-[#DDE4E8] bg-white hover:border-[#B63A3A]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#B63A3A]">
                      {stage.step}
                    </span>
                    <Icon className="h-4 w-4 text-[#526170] group-hover:text-[#B63A3A] transition-colors" />
                  </div>
                  <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-[#163536] group-hover:text-[#B63A3A] transition-colors">
                    {stage.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-[#163536]">
                    {stage.headline}
                  </p>
                  <p className="mt-2 text-[0.68rem] leading-relaxed text-[#526170]">
                    {stage.detail}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E9EEF1] space-y-1">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#526170]">Deliverables</p>
                  {stage.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-[0.65rem] text-[#526170]">
                      <span className="h-1 w-1 rounded-full bg-[#B63A3A]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
