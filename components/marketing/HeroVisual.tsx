"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NODES = [
  {
    id: "oracle",
    label: "Oracle Cloud",
    category: "ERP & SCM",
    detail: "Financials · Procurement · HCM · EPM",
    x: 18,
    y: 50,
  },
  {
    id: "crm",
    label: "CRM",
    category: "Customer 360",
    detail: "Pipeline · Sales · Service · Analytics",
    x: 50,
    y: 16,
  },
  {
    id: "core",
    label: "Enterprise Core",
    category: "Architecture",
    detail: "Connected Data & Governance",
    x: 50,
    y: 50,
    isCenter: true,
  },
  {
    id: "ats",
    label: "ATS + Talent",
    category: "Workforce",
    detail: "Requisitions · Pipeline · Offers · Hires",
    x: 82,
    y: 50,
  },
  {
    id: "ai",
    label: "AI & Data",
    category: "Intelligence",
    detail: "Data Agent · Source Grounding · Agents",
    x: 35,
    y: 84,
  },
  {
    id: "integration",
    label: "Integration Hub",
    category: "APIs & Flows",
    detail: "REST · n8n · Microservices · Events",
    x: 68,
    y: 84,
  },
];

export default function HeroVisual({ className }: { className?: string }) {
  const [activeNodeId, setActiveNodeId] = useState<string>("core");
  const activeNode = NODES.find((n) => n.id === activeNodeId) ?? NODES[2];

  return (
    <div
      className={`relative flex min-h-[360px] sm:min-h-[390px] lg:min-h-[410px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#081a2f] via-[#0b223d] to-[#061424] p-5 sm:p-6 shadow-[0_24px_60px_rgba(8,26,47,0.25)] ${
        className ?? ""
      }`}
    >
      {/* Background glow & subtle constellation grid */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#2ea7ff]/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-[#2457f5]/20 blur-[70px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2ea7ff]/30 to-transparent" />

      {/* Constellation SVG Lines Connecting Nodes */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="v8-line-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(46,167,255,0.15)" />
            <stop offset="50%" stopColor="rgba(46,167,255,0.6)" />
            <stop offset="100%" stopColor="rgba(46,167,255,0.15)" />
          </linearGradient>
          <linearGradient id="v8-line-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(36,87,245,0.2)" />
            <stop offset="50%" stopColor="rgba(46,167,255,0.65)" />
            <stop offset="100%" stopColor="rgba(36,87,245,0.2)" />
          </linearGradient>
        </defs>

        {/* Horizontal main axis */}
        <line x1="18%" y1="50%" x2="50%" y2="50%" stroke="url(#v8-line-h)" strokeWidth="1.5" />
        <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="url(#v8-line-h)" strokeWidth="1.5" />

        {/* Vertical CRM axis */}
        <line x1="50%" y1="16%" x2="50%" y2="50%" stroke="url(#v8-line-v)" strokeWidth="1.5" />

        {/* Lower integration branches */}
        <line x1="50%" y1="50%" x2="35%" y2="84%" stroke="url(#v8-line-v)" strokeWidth="1.5" />
        <line x1="50%" y1="50%" x2="68%" y2="84%" stroke="url(#v8-line-v)" strokeWidth="1.5" />
      </svg>

      {/* Interactive Platform Nodes */}
      <div className="relative flex-1">
        {NODES.map((node) => {
          const isActive = activeNodeId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => setActiveNodeId(node.id)}
              onClick={() => setActiveNodeId(node.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-label={`Inspect ${node.label}`}
            >
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all duration-200 backdrop-blur-md ${
                  node.isCenter
                    ? "border-[#2ea7ff]/60 bg-[#2457f5]/30 shadow-[0_0_20px_rgba(46,167,255,0.3)]"
                    : isActive
                    ? "border-[#2ea7ff] bg-white/[0.14] scale-105 shadow-[0_0_16px_rgba(46,167,255,0.25)]"
                    : "border-white/15 bg-white/[0.06] hover:border-white/40 hover:bg-white/[0.1]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#2ea7ff] shadow-[0_0_8px_#2ea7ff]"
                      : node.isCenter
                      ? "bg-white"
                      : "bg-[#2ea7ff]/70"
                  }`}
                />
                <span className="text-xs font-semibold text-white sm:text-sm">
                  {node.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Detail Strip at bottom */}
      <div className="relative z-10 mt-auto rounded-xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#2ea7ff]">
                {activeNode.category}
              </span>
              <p className="text-xs font-medium text-white/85 sm:text-sm">
                {activeNode.label}: <span className="text-white/60">{activeNode.detail}</span>
              </p>
            </div>
            <span className="hidden text-[0.68rem] text-white/40 sm:inline">
              Interactive Platform
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
