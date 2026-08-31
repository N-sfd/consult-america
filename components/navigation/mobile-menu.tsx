"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import { platformLinks, industryLinks, whatWeDoMegaMenu } from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Level = "root" | "what-we-do" | "oracle" | "crm" | "ai-data" | "applications" | "industries" | "company";

const WHAT_WE_DO_COLUMN_COLORS: Record<string, string> = {
  TRANSFORM: "#B83A3A",
  MODERNIZE: "#122D2E",
  INTELLIGENCE: "#0B4A47",
  BUILD: "#176A63",
  OPERATE: "#5B6D6B",
};

const whatWeDoColumns = [
  whatWeDoMegaMenu.transform,
  whatWeDoMegaMenu.modernize,
  whatWeDoMegaMenu.intelligence,
  whatWeDoMegaMenu.build,
  whatWeDoMegaMenu.operate,
];

const oracleGroups = [
  {
    label: "Core Cloud Practices",
    items: [
      { href: "/oracle", label: "Financials & General Ledger" },
      { href: "/oracle", label: "Procurement & Source-to-Pay" },
      { href: "/oracle", label: "Supply Chain Management (SCM)" },
      { href: "/oracle", label: "Projects & Portfolio (PPM)" },
    ],
  },
  {
    label: "Enterprise Foundation",
    items: [
      { href: "/oracle", label: "Oracle Integration Cloud (OIC)" },
      { href: "/oracle", label: "Fusion Data Intelligence" },
      { href: "/oracle", label: "Multi-Entity Ledgers" },
      { href: "/work", label: "Oracle Case Studies" },
    ],
  },
];

const crmGroups = [
  {
    label: "Customer Journey",
    items: [
      { href: "/platforms/crm", label: "Discover: Account Intelligence" },
      { href: "/platforms/crm", label: "Engage: Multi-Channel Outreach" },
      { href: "/platforms/crm", label: "Sell: Pipeline & Deal Governance" },
      { href: "/platforms/crm", label: "Serve: Case Deflection & Automation" },
    ],
  },
  {
    label: "Enterprise Integration",
    items: [
      { href: "/platforms/crm", label: "Customer 360 Workspace" },
      { href: "/platforms/crm", label: "Salesforce & Oracle Integration" },
      { href: "/platforms/crm", label: "Revenue Cloud & CPQ Workflows" },
      { href: "/platforms/crm", label: "Customer Data Platform (CDP)" },
    ],
  },
];

const aiDataGroups = [
  {
    label: "Governed AI & Agents",
    items: [
      { href: "/ai-data", label: "Document Intelligence & Clause Extraction" },
      { href: "/ai-data", label: "Task-Oriented Enterprise Agents" },
      { href: "/ai-data", label: "Governed RAG & Source Grounding" },
      { href: "/ai-data", label: "FAR / DFARS Regulatory Extraction" },
    ],
  },
  {
    label: "Data Foundations",
    items: [
      { href: "/ai-data", label: "Data Engineering & Modern Pipelines" },
      { href: "/ai-data", label: "Enterprise Knowledge Graphs" },
      { href: "/ai-data", label: "AI Governance & Access Controls" },
      { href: "/ai-data", label: "Human-in-the-Loop Validation Queues" },
    ],
  },
];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [level, setLevel] = useState<Level>("root");
  const { setOpen: setContactOpen } = useContactPanel();

  const handleClose = useCallback(() => {
    setLevel("root");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-[#122D2E]/50 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white text-[#122D2E] shadow-[-8px_0_40px_rgba(16,32,51,0.12)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-[#C9DDD7] px-5">
              {level === "root" ? (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B4A47]">
                  Navigation
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setLevel("root")}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0B4A47] cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#122D2E] hover:bg-[#F8FAFA] cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              {level === "root" && (
                <div className="divide-y divide-[#C9DDD7]">
                  <button
                    type="button"
                    onClick={() => setLevel("what-we-do")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    What We Do
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("oracle")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    Oracle
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("crm")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    CRM
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("ai-data")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    AI &amp; Data
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("applications")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    Applications
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("industries")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    Industries
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <Link
                    href="/work"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#122D2E] hover:text-[#B83A3A]"
                  >
                    Our Work
                  </Link>

                  <Link
                    href="/insights"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#122D2E] hover:text-[#B83A3A]"
                  >
                    Insights
                  </Link>

                  <button
                    type="button"
                    onClick={() => setLevel("company")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#122D2E]"
                  >
                    Company
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <div className="pt-4 pb-2 space-y-2">
                    <Link
                      href="/careers"
                      onClick={handleClose}
                      className="block text-sm text-[#5B6D6B] hover:text-[#B83A3A]"
                    >
                      Careers
                    </Link>
                    <Link
                      href="/login"
                      onClick={handleClose}
                      className="block text-sm font-semibold text-[#122D2E] hover:text-[#B83A3A]"
                    >
                      Employee Portal Login →
                    </Link>
                  </div>
                </div>
              )}

              {/* WHAT WE DO SUB-PANEL — sourced from whatWeDoMegaMenu so header/mobile menu never drift */}
              {level === "what-we-do" && (
                <div className="space-y-6 pt-4">
                  {whatWeDoColumns.map((column) => (
                    <div key={column.category}>
                      <p
                        className="text-xs font-bold uppercase tracking-[0.14em]"
                        style={{ color: WHAT_WE_DO_COLUMN_COLORS[column.category] }}
                      >
                        {column.category.charAt(0) + column.category.slice(1).toLowerCase()}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {column.items.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={handleClose} className="block text-sm text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="rounded-xl border border-[#C9DDD7] bg-[#E1ECE8] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                      Consult America Labs
                    </p>
                    <div className="mt-3 space-y-2">
                      {whatWeDoMegaMenu.labs.products.map((prod) => (
                        <Link
                          key={prod.label}
                          href={prod.href}
                          onClick={handleClose}
                          className="block text-xs font-medium text-[#122D2E] hover:text-[#B83A3A]"
                        >
                          {prod.label} · <span className="text-[#5B6D6B]">{prod.detail}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ORACLE SUB-PANEL */}
              {level === "oracle" && (
                <div className="space-y-6 pt-4">
                  {oracleGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                        {group.label}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={handleClose} className="block text-sm text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="rounded-xl border border-[#C9DDD7] bg-[#0C2233] p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">Flagship Practice</p>
                    <p className="mt-1.5 text-sm font-semibold">Modernize the digital core.</p>
                    <Link href="/oracle" onClick={handleClose} className="mt-2 inline-block text-xs font-bold text-white hover:text-[#B83A3A]">
                      Explore Oracle Transformation →
                    </Link>
                  </div>
                </div>
              )}

              {/* CRM SUB-PANEL */}
              {level === "crm" && (
                <div className="space-y-6 pt-4">
                  {crmGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                        {group.label}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={handleClose} className="block text-sm text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="rounded-xl border border-[#C9DDD7] bg-[#E1ECE8] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">Connected CRM</p>
                    <p className="mt-1.5 text-sm font-semibold text-[#122D2E]">Connect every customer moment to the enterprise behind it.</p>
                    <Link href="/platforms/crm" onClick={handleClose} className="mt-2 inline-block text-xs font-bold text-[#B83A3A]">
                      Explore CRM Platform →
                    </Link>
                  </div>
                </div>
              )}

              {/* AI & DATA SUB-PANEL */}
              {level === "ai-data" && (
                <div className="space-y-6 pt-4">
                  {aiDataGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B4A47]">
                        {group.label}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={handleClose} className="block text-sm text-[#122D2E] hover:text-[#0B4A47]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="rounded-xl border border-[#C9DDD7] bg-[#E1ECE8] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B4A47]">Applied Intelligence</p>
                    <p className="mt-1.5 text-sm font-semibold text-[#122D2E]">Put intelligence into the work.</p>
                    <Link href="/ai-data" onClick={handleClose} className="mt-2 inline-block text-xs font-bold text-[#0B4A47]">
                      Explore AI &amp; Data →
                    </Link>
                  </div>
                </div>
              )}

              {/* APPLICATIONS SUB-PANEL */}
              {level === "applications" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                    Applications Suite
                  </p>
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block rounded-lg border border-[#C9DDD7] bg-[#E1ECE8] p-3 transition-colors hover:border-[#B83A3A]"
                    >
                      <p className="text-sm font-bold text-[#122D2E]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#5B6D6B]">{item.detail}</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* INDUSTRIES SUB-PANEL */}
              {level === "industries" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                    Industries
                  </p>
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block border-b border-[#C9DDD7] py-2.5 text-sm font-semibold text-[#122D2E] hover:text-[#B83A3A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* COMPANY SUB-PANEL */}
              {level === "company" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                    Company
                  </p>
                  {[
                    { href: "/about", label: "About Consult America" },
                    { href: "/about", label: "Delivery Philosophy" },
                    { href: "/about", label: "National Delivery Centers" },
                    { href: "/careers", label: "Careers & Open Positions" },
                    { href: "/insights", label: "Insights & Publications" },
                    { href: "/contact", label: "Contact Practice Leads" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block border-b border-[#C9DDD7] py-2.5 text-sm font-semibold text-[#122D2E] hover:text-[#B83A3A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {/* Drawer Footer CTA */}
            <div className="border-t border-[#C9DDD7] p-5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setContactOpen(true);
                }}
                className="ca-button-primary flex w-full items-center justify-center gap-2 font-semibold cursor-pointer"
              >
                Talk to an Expert
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
