"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import { platformLinks, industryLinks } from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Level = "root" | "what-we-do" | "applications" | "industries" | "company";

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
            className="fixed inset-0 z-[60] bg-[#163536]/50 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white text-[#163536] shadow-[-8px_0_40px_rgba(16,32,51,0.12)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-[#DCE4E1] px-5">
              {level === "root" ? (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                  Navigation
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setLevel("root")}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#103F3E] cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#163536] hover:bg-[#F8FAFA] cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              {level === "root" && (
                <div className="divide-y divide-[#DCE4E1]">
                  <button
                    type="button"
                    onClick={() => setLevel("what-we-do")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#163536]"
                  >
                    What We Do
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <Link
                    href="/oracle"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#163536] hover:text-[#B63A3A]"
                  >
                    Oracle
                  </Link>

                  <Link
                    href="/platforms/crm"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#163536] hover:text-[#B63A3A]"
                  >
                    CRM &amp; Customer Experience
                  </Link>

                  <Link
                    href="/ai-data"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#163536] hover:text-[#B63A3A]"
                  >
                    AI &amp; Data
                  </Link>

                  <button
                    type="button"
                    onClick={() => setLevel("applications")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#163536]"
                  >
                    Applications
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("industries")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#163536]"
                  >
                    Industries
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <Link
                    href="/work"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#163536] hover:text-[#B63A3A]"
                  >
                    Our Work
                  </Link>

                  <Link
                    href="/insights"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#163536] hover:text-[#B63A3A]"
                  >
                    Insights
                  </Link>

                  <button
                    type="button"
                    onClick={() => setLevel("company")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#163536]"
                  >
                    Company
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <div className="pt-4 pb-2 space-y-2">
                    <Link
                      href="/careers"
                      onClick={handleClose}
                      className="block text-sm text-[#596968] hover:text-[#B63A3A]"
                    >
                      Careers
                    </Link>
                    <Link
                      href="/login"
                      onClick={handleClose}
                      className="block text-sm font-semibold text-[#163536] hover:text-[#B63A3A]"
                    >
                      Employee Portal Login →
                    </Link>
                  </div>
                </div>
              )}

              {/* WHAT WE DO SUB-PANEL */}
              {level === "what-we-do" && (
                <div className="space-y-6 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      Transform
                    </p>
                    <ul className="mt-2 space-y-2">
                      <li>
                        <Link href="/capabilities/enterprise-transformation" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          Enterprise Transformation
                        </Link>
                      </li>
                      <li>
                        <Link href="/capabilities/enterprise-transformation" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          Operating Model &amp; Process
                        </Link>
                      </li>
                      <li>
                        <Link href="/capabilities/managed-delivery" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          Program Delivery &amp; PMO
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      Modernize &amp; AI
                    </p>
                    <ul className="mt-2 space-y-2">
                      <li>
                        <Link href="/oracle" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          Oracle Transformation
                        </Link>
                      </li>
                      <li>
                        <Link href="/platforms/crm" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          CRM Transformation
                        </Link>
                      </li>
                      <li>
                        <Link href="/ai-data" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#357C78]">
                          AI &amp; Data Engineering
                        </Link>
                      </li>
                      <li>
                        <Link href="/capabilities/digital-engineering" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#47739B]">
                          Cloud Modernization &amp; APIs
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#47739B]">
                      Build &amp; Operate
                    </p>
                    <ul className="mt-2 space-y-2">
                      <li>
                        <Link href="/capabilities/digital-engineering" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#47739B]">
                          Application Engineering
                        </Link>
                      </li>
                      <li>
                        <Link href="/platforms" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#47739B]">
                          Enterprise Portals
                        </Link>
                      </li>
                      <li>
                        <Link href="/capabilities/managed-delivery" onClick={handleClose} className="block text-sm text-[#163536] hover:text-[#B63A3A]">
                          Managed Services
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[#DCE4E1] bg-[#EEF3F1] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      Consult America Labs
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        { href: "/work/innovation/data-agent", label: "Data Agent", detail: "AI Document Intelligence" },
                        { href: "/work/innovation/mediguide-ai", label: "MediGuide AI", detail: "Clinical Intelligence" },
                        { href: "/platforms/crm", label: "CRM Workspace", detail: "Customer 360 & Deals" },
                        { href: "/platforms/ats", label: "ATS & Talent", detail: "Recruiting Pipeline" },
                      ].map((prod) => (
                        <Link
                          key={prod.label}
                          href={prod.href}
                          onClick={handleClose}
                          className="block text-xs font-medium text-[#163536] hover:text-[#B63A3A]"
                        >
                          {prod.label} · <span className="text-[#596968]">{prod.detail}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS SUB-PANEL */}
              {level === "applications" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    Applications Suite
                  </p>
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block rounded-lg border border-[#DCE4E1] bg-[#EEF3F1] p-3 transition-colors hover:border-[#B63A3A]"
                    >
                      <p className="text-sm font-bold text-[#163536]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#596968]">{item.detail}</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* INDUSTRIES SUB-PANEL */}
              {level === "industries" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    Industries
                  </p>
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block border-b border-[#DCE4E1] py-2.5 text-sm font-semibold text-[#163536] hover:text-[#B63A3A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* COMPANY SUB-PANEL */}
              {level === "company" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
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
                      className="block border-b border-[#DCE4E1] py-2.5 text-sm font-semibold text-[#163536] hover:text-[#B63A3A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {/* Drawer Footer CTA */}
            <div className="border-t border-[#DCE4E1] p-5">
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
