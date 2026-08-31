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
    <section id="technology" className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="light">Technology</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[#F7F0E7]">
              Engineering the modern enterprise.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#CFC4BA]">
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
            className="ca-app-window-dark flex flex-col justify-between border border-[#6F6259] bg-[#342B27] p-6 sm:p-7 lg:col-span-5"
          >
            <div className="flex items-center justify-between border-b border-[#6F6259]/60 pb-3">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                Enterprise Stack Blueprint
              </span>
              <span className="text-[0.65rem] text-[#CFC4BA]">Tier-1 Architecture</span>
            </div>

            <div className="mt-6 flex flex-col items-center space-y-3">
              {/* Oracle Cloud Top Tier */}
              <div className="w-full rounded-xl border border-[#D8C5AA]/40 bg-[#3A302B] p-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#D8C5AA]">
                  Top Layer
                </span>
                <h4 className="mt-0.5 text-base font-bold text-[#F7F0E7] sm:text-lg">
                  Oracle Cloud Fusion
                </h4>
                <p className="mt-1 text-xs text-[#CFC4BA]">
                  Financials · Procurement · HCM · SCM · EPM
                </p>
              </div>

              {/* Connecting arrow */}
              <div className="flex flex-col items-center">
                <ArrowDown className="h-4 w-4 text-[#657766] animate-bounce" />
              </div>

              {/* Integration Mid Tier */}
              <div className="w-full rounded-xl border border-[#657766]/40 bg-[#3A302B] p-4 text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#DFE4DA]">
                  Integration Tier
                </span>
                <h4 className="mt-0.5 text-base font-bold text-[#F7F0E7] sm:text-lg">
                  Integration &amp; API Hub
                </h4>
                <p className="mt-1 text-xs text-[#CFC4BA]">
                  Secure Conduits · REST APIs · n8n Workflows
                </p>
              </div>

              {/* Connecting arrow */}
              <div className="flex flex-col items-center">
                <ArrowDown className="h-4 w-4 text-[#7D2639]" />
              </div>

              {/* AI & Data Foundation Tier */}
              <div className="w-full rounded-xl border border-[#7D2639]/50 bg-[#3A302B] p-4 text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#D8C5AA]">
                  Intelligence Core
                </span>
                <h4 className="mt-0.5 text-base font-bold text-[#F7F0E7] sm:text-lg">
                  AI &amp; Data Platform
                </h4>
                <p className="mt-1 text-xs text-[#CFC4BA]">
                  Data Agent · Governed Lake · Source Citations
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#6F6259]/60 pt-4 flex items-center justify-between">
              <Link href="/oracle" className="ca-link text-xs font-semibold text-[#D8C5AA] hover:text-[#F7F0E7]">
                Explore Oracle Systems
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/ai-data" className="ca-link text-xs text-[#CFC4BA] hover:text-[#F7F0E7]">
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
                  className="rounded-xl border border-[#6F6259] bg-[#342B27] p-4.5 transition-all duration-200 hover:border-[#D8C5AA]/40 hover:bg-[#3A302B]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2B2420] text-[#D8C5AA]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#F7F0E7]">
                      {stream.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#CFC4BA]">
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
