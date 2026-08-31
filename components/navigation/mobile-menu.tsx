"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import {
  whatWeDoMegaMenu,
  platformLinks,
  industryLinks,
} from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Level = "root" | "what-we-do" | "applications" | "industries";

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
            className="fixed inset-0 z-[60] bg-[#261F1B]/40 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-[#FFFDF8] text-[#261F1B] shadow-[-8px_0_40px_rgba(38,31,27,0.12)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-[#D7CCBD] px-5">
              {level === "root" ? (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  Menu
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setLevel("root")}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639] cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#261F1B] hover:bg-[#F4EFE6] cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              {level === "root" && (
                <div className="divide-y divide-[#D7CCBD]">
                  <button
                    type="button"
                    onClick={() => setLevel("what-we-do")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#261F1B]"
                  >
                    What we do
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <Link
                    href="/oracle"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#261F1B] hover:text-[#7D2639]"
                  >
                    Oracle
                  </Link>

                  <Link
                    href="/platforms/crm"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#261F1B] hover:text-[#7D2639]"
                  >
                    CRM &amp; Customer Experience
                  </Link>

                  <Link
                    href="/ai-data"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#261F1B] hover:text-[#7D2639]"
                  >
                    AI &amp; Data
                  </Link>

                  <button
                    type="button"
                    onClick={() => setLevel("applications")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#261F1B]"
                  >
                    Applications
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("industries")}
                    className="flex w-full min-h-11 items-center justify-between py-4 text-left text-base font-semibold text-[#261F1B]"
                  >
                    Industries
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <Link
                    href="/work"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#261F1B] hover:text-[#7D2639]"
                  >
                    Our Work
                  </Link>

                  <Link
                    href="/about"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-4 text-base font-semibold text-[#261F1B] hover:text-[#7D2639]"
                  >
                    Company
                  </Link>

                  <div className="pt-4 pb-2 space-y-2">
                    <Link
                      href="/insights"
                      onClick={handleClose}
                      className="block text-sm text-[#695F57] hover:text-[#7D2639]"
                    >
                      Insights &amp; Perspectives
                    </Link>
                    <Link
                      href="/careers"
                      onClick={handleClose}
                      className="block text-sm text-[#695F57] hover:text-[#7D2639]"
                    >
                      Careers
                    </Link>
                    <Link
                      href="/login"
                      onClick={handleClose}
                      className="block text-sm font-semibold text-[#261F1B] hover:text-[#7D2639]"
                    >
                      Employee Portal Login →
                    </Link>
                  </div>
                </div>
              )}

              {/* WHAT WE DO SUB-PANEL */}
              {level === "what-we-do" && (
                <div className="space-y-6 pt-4">
                  {[
                    whatWeDoMegaMenu.transform,
                    whatWeDoMegaMenu.modernize,
                    whatWeDoMegaMenu.intelligence,
                    whatWeDoMegaMenu.build,
                    whatWeDoMegaMenu.operate,
                  ].map((sec) => (
                    <div key={sec.category}>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                        {sec.category}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {sec.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={handleClose}
                              className="block text-sm font-medium text-[#261F1B] hover:text-[#7D2639]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Labs Highlight */}
                  <div className="rounded-xl border border-[#D7CCBD] bg-[#F0E8DC] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      Consult America Labs
                    </p>
                    <div className="mt-3 space-y-2">
                      {whatWeDoMegaMenu.labs.products.map((prod) => (
                        <Link
                          key={prod.label}
                          href={prod.href}
                          onClick={handleClose}
                          className="block text-xs font-semibold text-[#261F1B] hover:text-[#7D2639]"
                        >
                          {prod.label} · <span className="font-normal text-[#695F57]">{prod.detail}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS SUB-PANEL */}
              {level === "applications" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    Software Platform Suite
                  </p>
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 transition-colors hover:border-[#7D2639]"
                    >
                      <p className="text-sm font-bold text-[#261F1B]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#695F57]">{item.detail}</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* INDUSTRIES SUB-PANEL */}
              {level === "industries" && (
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    Industries
                  </p>
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block border-b border-[#D7CCBD] py-2 text-sm font-semibold text-[#261F1B] hover:text-[#7D2639]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {/* Drawer Footer CTA */}
            <div className="border-t border-[#D7CCBD] p-5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setContactOpen(true);
                }}
                className="ca-button-primary flex w-full items-center justify-center gap-2 font-semibold"
              >
                Talk to an expert
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
