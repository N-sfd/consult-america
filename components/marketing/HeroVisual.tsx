"use client";

import { useState } from "react";
import { Users, UserCheck, FolderGit2, Briefcase, BarChart3, Cpu, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOMAINS = [
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    header: "Customer Operations",
    metric1: "Active Pipelines",
    val1: "Multi-Tier",
    metric2: "Account Intelligence",
    val2: "Customer 360",
    status: "Connected to Enterprise Core",
  },
  {
    id: "ats",
    label: "ATS & Talent",
    icon: UserCheck,
    header: "Talent Acquisition Pipeline",
    metric1: "Hiring Workflow",
    val1: "Requisition → Hire",
    metric2: "Candidate Review",
    val2: "Screening Loops",
    status: "Integrated with Core HR",
  },
  {
    id: "hr",
    label: "Core HR",
    icon: FolderGit2,
    header: "Workforce & Compliance",
    metric1: "Employee Records",
    val1: "Unified Ledger",
    metric2: "Document Vault",
    val2: "Verified E-Sign",
    status: "RBAC & Audit Governed",
  },
  {
    id: "workforce",
    label: "Workforce",
    icon: Briefcase,
    header: "Time, Leave & Payroll",
    metric1: "Time Tracking",
    val1: "Weekly Approvals",
    metric2: "Payroll Engine",
    val2: "Automated Runs",
    status: "Direct GL Integration",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    header: "Executive Intelligence",
    metric1: "Cross-Domain Data",
    val1: "Real-Time",
    metric2: "Audit Trails",
    val2: "Production-Grade",
    status: "Oracle Fusion + AI Agent Core",
  },
];

export default function HeroVisual({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("crm");
  const current = DOMAINS.find((d) => d.id === activeTab) ?? DOMAINS[0];

  return (
    <div
      className={`ca-app-window-dark relative flex flex-col overflow-hidden bg-[#2B2420] border border-[#6F6259] p-4 sm:p-6 shadow-[0_24px_60px_rgba(38,31,27,0.3)] ${
        className ?? ""
      }`}
    >
      {/* Top Application Bar with Traffic Lights */}
      <div className="flex items-center justify-between border-b border-[#6F6259]/60 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B93838]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#C77A16]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#657766]" />
          <span className="ml-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#F7F0E7]">
            ConsultAmerica Enterprise Platform
          </span>
        </div>
        <span className="rounded-full bg-[#7D2639]/40 border border-[#7D2639]/60 px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#D8C5AA]">
          Production Environment
        </span>
      </div>

      {/* Platform Domain Tabs */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-b border-[#6F6259]/60 pb-3">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isActive = activeTab === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => setActiveTab(domain.id)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#7D2639] text-white shadow-[0_0_12px_rgba(125,38,57,0.5)]"
                  : "bg-white/[0.05] text-[#CFC4BA] hover:bg-white/[0.1] hover:text-[#F7F0E7]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Workspace View */}
      <div className="mt-4 rounded-xl border border-[#6F6259] bg-[#342B27] p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#D8C5AA]">
                  Domain Workspace
                </span>
                <h4 className="mt-0.5 text-base font-semibold text-[#F7F0E7] sm:text-lg">
                  {current.header}
                </h4>
              </div>
              <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[0.68rem] text-[#CFC4BA]">
                Active Node
              </span>
            </div>

            {/* 2-Column Capability Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#6F6259] bg-[#3A302B] p-3">
                <p className="text-[0.68rem] text-[#CFC4BA] uppercase tracking-[0.08em] font-medium">
                  {current.metric1}
                </p>
                <p className="mt-1 text-sm font-bold text-[#F7F0E7] sm:text-base">
                  {current.val1}
                </p>
              </div>
              <div className="rounded-lg border border-[#6F6259] bg-[#3A302B] p-3">
                <p className="text-[0.68rem] text-[#CFC4BA] uppercase tracking-[0.08em] font-medium">
                  {current.metric2}
                </p>
                <p className="mt-1 text-sm font-bold text-[#F7F0E7] sm:text-base">
                  {current.val2}
                </p>
              </div>
            </div>

            {/* Underlying Architecture Connector */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-[#657766]/50 bg-[#2B2420] px-3.5 py-2.5 text-xs text-[#F7F0E7]">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#D8C5AA]" />
                <span className="font-semibold text-[#DFE4DA]">Core Backbone:</span>
                <span className="text-[#CFC4BA]">{current.status}</span>
              </div>
              <ShieldCheck className="h-4 w-4 text-[#657766]" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enterprise Platform Core Footer Strip */}
      <div className="mt-4 flex items-center justify-between border-t border-[#6F6259]/60 pt-3 text-[0.72rem] text-[#CFC4BA]">
        <span>Oracle Cloud · AI &amp; Data · Integration Hub</span>
        <span className="font-semibold text-[#D8C5AA]">Unified Platform</span>
      </div>
    </div>
  );
}
