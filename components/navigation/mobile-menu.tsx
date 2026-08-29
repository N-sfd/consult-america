"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import {
  consultingGroups,
  technologyGroups,
  platformLinks,
  industryLinks,
  navLinks,
} from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Level = "root" | "consulting" | "technology" | "platforms" | "industries";

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
            className="fixed inset-0 z-[60] bg-[var(--ca-navy)]/40 backdrop-blur-[2px] xl:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white text-[var(--ca-navy)] shadow-[-8px_0_40px_rgba(8,26,47,0.14)] xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--ca-border)] px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ca-dim)]">
                Menu
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--ca-navy)] hover:bg-[var(--ca-ice)]"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              {level === "root" && (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel("consulting")}
                    className="flex w-full min-h-11 items-center justify-between border-b border-[var(--ca-border)] py-4 text-left text-base font-semibold text-[var(--ca-navy)]"
                  >
                    Consulting
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("technology")}
                    className="flex w-full min-h-11 items-center justify-between border-b border-[var(--ca-border)] py-4 text-left text-base font-semibold text-[var(--ca-navy)]"
                  >
                    Technology
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("platforms")}
                    className="flex w-full min-h-11 items-center justify-between border-b border-[var(--ca-border)] py-4 text-left text-base font-semibold text-[var(--ca-navy)]"
                  >
                    Platforms
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLevel("industries")}
                    className="flex w-full min-h-11 items-center justify-between border-b border-[var(--ca-border)] py-4 text-left text-base font-semibold text-[var(--ca-navy)]"
                  >
                    Industries
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>

                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className="flex min-h-11 items-center justify-between border-b border-[var(--ca-border)] py-4 text-base font-semibold text-[var(--ca-navy)]"
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </Link>
                  ))}

                  <div className="my-6 border-t border-[var(--ca-border)]" />

                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="flex min-h-11 items-center py-2.5 text-sm font-medium text-[var(--ca-slate)]"
                  >
                    Employee Login
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setContactOpen(true);
                    }}
                    className="ca-button-primary mt-3 w-full font-semibold"
                  >
                    Contact Us
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {level === "consulting" && (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel("root")}
                    className="mb-2 flex min-h-11 items-center gap-2 py-3 text-sm font-medium text-[var(--ca-slate)]"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                    Transformation
                  </p>
                  {consultingGroups.transformation.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-10 border-b border-[var(--ca-border)] py-3 text-sm text-[var(--ca-navy)]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <p className="pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                    Delivery
                  </p>
                  {consultingGroups.delivery.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-10 border-b border-[var(--ca-border)] py-3 text-sm text-[var(--ca-navy)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {level === "technology" && (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel("root")}
                    className="mb-2 flex min-h-11 items-center gap-2 py-3 text-sm font-medium text-[var(--ca-slate)]"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                    Platforms &amp; Apps
                  </p>
                  {technologyGroups.platforms.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-10 border-b border-[var(--ca-border)] py-3 text-sm text-[var(--ca-navy)]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <p className="pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                    Engineering &amp; Cloud
                  </p>
                  {technologyGroups.engineering.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-10 border-b border-[var(--ca-border)] py-3 text-sm text-[var(--ca-navy)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {level === "platforms" && (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel("root")}
                    className="mb-2 flex min-h-11 items-center gap-2 py-3 text-sm font-medium text-[var(--ca-slate)]"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-11 border-b border-[var(--ca-border)] py-3 text-sm"
                    >
                      <p className="font-semibold text-[var(--ca-navy)]">{item.label}</p>
                      <p className="text-xs text-[var(--ca-slate)]">{item.detail}</p>
                    </Link>
                  ))}
                </>
              )}

              {level === "industries" && (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel("root")}
                    className="mb-2 flex min-h-11 items-center gap-2 py-3 text-sm font-medium text-[var(--ca-slate)]"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back
                  </button>
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClose}
                      className="block min-h-11 border-b border-[var(--ca-border)] py-3 text-sm text-[var(--ca-navy)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
