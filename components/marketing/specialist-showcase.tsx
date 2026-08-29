"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDown, Cpu, Server, Shield, Database, Network, Code, Layers } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const TECH_STREAMS = [
  {
    icon: Layers,
    title: "Enterprise Applications",
    detail: "Oracle Fusion ERP, Financials, HCM, SCM, and EPM suites.",
  },
  {
    icon: Server,
    title: "Cloud Platforms",
    detail: "High-reliability hybrid cloud architectures and automated infrastructure.",
  },
  {
    icon: Database,
    title: "Data Engineering",
    detail: "Governed lakes, real-time streaming pipelines, and audit trails.",
  },
  {
    icon: Cpu,
    title: "AI & Automation",
    detail: "Document intelligence, source-grounded RAG, and agentic workflows.",
  },
  {
    icon: Network,
    title: "Integration & APIs",
    detail: "Microservices, REST connectors, and n8n workflow orchestration.",
  },
  {
    icon: Shield,
    title: "Cybersecurity & Zero Trust",
    detail: "Continuous compliance, role-based access control, and vulnerability hardening.",
  },
  {
    icon: Code,
    title: "Digital Engineering",
    detail: "Full-stack cloud-native applications, APIs, and modern frontends.",
  },
];

export default function SpecialistShowcase() {
  return (
    <section id="technology" className="mkt-section bg-[#071a2b] text-white">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="light">Technology</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-white">
              Engineering the modern enterprise.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/65">
            Mission-critical platform architecture, connected Oracle Cloud suites,
            and autonomous AI systems built for production reliability.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Enterprise Architecture Stack Graphic (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="ca-app-window-dark flex flex-col justify-between p-6 sm:p-7 lg:col-span-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#31a8ff]">
                Enterprise Stack Blueprint
              </span>
              <span className="text-[0.65rem] text-white/50">Tier-1 Architecture</span>
            </div>

            <div className="mt-6 flex flex-col items-center space-y-3">
              {/* Oracle Cloud Top Tier */}
              <div className="w-full rounded-xl border border-[#31a8ff]/40 bg-[#0b2844] p-4 text-center shadow-[0_8px_24px_rgba(49,168,255,0.15)]">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#31a8ff]">
                  Top Layer
                </span>
                <h4 className="mt-0.5 text-base font-bold text-white sm:text-lg">
                  Oracle Cloud Fusion
                </h4>
                <p className="mt-1 text-xs text-white/70">
                  Financials · Procurement · HCM · SCM · EPM
                </p>
              </div>

              {/* Connecting arrow */}
              <div className="flex flex-col items-center">
                <ArrowDown className="h-4 w-4 text-[#31a8ff] animate-bounce" />
              </div>

              {/* Integration Mid Tier */}
              <div className="w-full rounded-xl border border-white/15 bg-[#10385f] p-4 text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#31a8ff]">
                  Integration Tier
                </span>
                <h4 className="mt-0.5 text-base font-bold text-white sm:text-lg">
                  Integration &amp; API Hub
                </h4>
                <p className="mt-1 text-xs text-white/70">
                  Secure Conduits · REST APIs · n8n Workflows
                </p>
              </div>

              {/* Connecting arrow */}
              <div className="flex flex-col items-center">
                <ArrowDown className="h-4 w-4 text-[#31a8ff]" />
              </div>

              {/* AI & Data Foundation Tier */}
              <div className="w-full rounded-xl border border-white/15 bg-[#071a2b] p-4 text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#31a8ff]">
                  Intelligence Core
                </span>
                <h4 className="mt-0.5 text-base font-bold text-white sm:text-lg">
                  AI &amp; Data Platform
                </h4>
                <p className="mt-1 text-xs text-white/70">
                  Data Agent · Governed Lake · Source Citations
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
              <Link href="/oracle" className="ca-link text-xs font-semibold text-[#31a8ff] hover:text-white">
                Explore Oracle Systems
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/ai-data" className="ca-link text-xs text-white/60 hover:text-white">
                AI &amp; Data Overview
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: 7 Structured Technology Streams (7 Cols) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {TECH_STREAMS.map((stream, idx) => {
              const Icon = stream.icon;
              return (
                <motion.div
                  key={stream.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4.5 backdrop-blur-sm transition-all duration-200 hover:border-[#31a8ff]/40 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563eb]/20 text-[#31a8ff]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {stream.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/65">
                    {stream.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
