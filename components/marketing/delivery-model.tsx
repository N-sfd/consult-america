"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Layout, Code2, Workflow, ShieldCheck } from "lucide-react";
import SectionLabel from "@/components/marketing/SectionLabel";

const phases = [
  {
    step: "01",
    title: "STRATEGY",
    icon: Compass,
    headline: "Align on Outcomes & Scope",
    description: "Business case validation, architectural roadmaps, regulatory alignment, and prioritized value streams.",
    deliverables: ["Target Architecture", "ROI Quantification", "Cutover Roadmap"],
  },
  {
    step: "02",
    title: "DESIGN",
    icon: Layout,
    headline: "Architect Operating Systems",
    description: "Target operating models, process blueprints, UX design systems, and governed data schema contracts.",
    deliverables: ["Process Blueprints", "Interface Mockups", "Data Contracts"],
  },
  {
    step: "03",
    title: "BUILD",
    icon: Code2,
    headline: "Engineer Production Software",
    description: "Custom platform engineering, Oracle Cloud configuration, AI agent development, and secure APIs.",
    deliverables: ["Production Code", "Cloud Config", "Agentic Pipelines"],
  },
  {
    step: "04",
    title: "INTEGRATE",
    icon: Workflow,
    headline: "Connect Data & Pipelines",
    description: "Enterprise integration hubs, event streaming, data migration validation, and automated test suites.",
    deliverables: ["OIC Connectors", "Migration Batches", "Automated QA"],
  },
  {
    step: "05",
    title: "OPERATE",
    icon: ShieldCheck,
    headline: "Govern & Continuously Evolve",
    description: "Zero-downtime cutover management, managed delivery pods, SLA support, and continuous optimization.",
    deliverables: ["Cutover Command", "Managed Pods", "SLA Assurance"],
  },
];

export default function DeliveryModel() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <section className="bg-[#F4EFE6] text-[#261F1B] py-16 sm:py-20 lg:py-24 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">DELIVERY CAPABILITY</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              From strategy through production.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#695F57]">
            We stay attached to outcomes through every phase of the lifecycle—ensuring strategic intent is never lost in engineering execution.
          </p>
        </div>

        {/* Horizontal Interactive Strip */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            const isHovered = activePhase === idx;

            return (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onMouseEnter={() => setActivePhase(idx)}
                onMouseLeave={() => setActivePhase(null)}
                className={`group rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isHovered
                    ? "border-[#7D2639] bg-[#FFFDF8] shadow-[0_12px_30px_rgba(38,31,27,0.08)] -translate-y-1"
                    : "border-[#D7CCBD] bg-[#FFFAF2] hover:bg-[#FFFDF8]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#7D2639]">
                      PHASE {phase.step}
                    </span>
                    <Icon className="h-4 w-4 text-[#695F57] group-hover:text-[#7D2639] transition-colors" />
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                    {phase.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-[#261F1B]">
                    {phase.headline}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-[#695F57]">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D7CCBD]/60 space-y-1">
                  {phase.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-1.5 text-[0.68rem] text-[#695F57]">
                      <span className="h-1 w-1 rounded-full bg-[#7D2639]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
