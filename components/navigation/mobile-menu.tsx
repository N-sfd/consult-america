"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import {
  capabilityGroups,
  industryLinks,
  navLinks,
} from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Level = "root" | "industries" | "capabilities" | string;

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

  const activeGroup = capabilityGroups.find((group) => group.title === level);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black xl:hidden"
        >
          <div className="flex h-20 items-center justify-between px-5">
            <Link
              href="/"
              onClick={handleClose}
              className="tracking-[0.08em]"
            >
              CONSULTAMERICA
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-11 w-11 items-center justify-center"
              aria-label="Close navigation menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="h-[calc(100%-5rem)] overflow-y-auto px-5 pb-10">
            {level === "root" && (
              <>
                <button
                  type="button"
                  onClick={() => setLevel("industries")}
                  className="flex w-full items-center justify-between border-b border-white/15 py-5 text-left text-3xl"
                >
                  Industries
                  <ChevronRight className="h-5 w-5 opacity-50" />
                </button>
                <button
                  type="button"
                  onClick={() => setLevel("capabilities")}
                  className="flex w-full items-center justify-between border-b border-white/15 py-5 text-left text-3xl"
                >
                  What We Do
                  <ChevronRight className="h-5 w-5 opacity-50" />
                </button>
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className="flex items-center justify-between border-b border-white/15 py-5 text-3xl"
                  >
                    {item.label}
                    <ArrowUpRight className="h-5 w-5 opacity-40" />
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setContactOpen(true);
                  }}
                  className="ca-button-primary mt-10"
                >
                  Contact
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </>
            )}

            {level === "industries" && (
              <>
                <button
                  type="button"
                  onClick={() => setLevel("root")}
                  className="mb-4 flex items-center gap-3 py-3 text-white/50"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Industries
                </button>
                {industryLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleClose}
                    className="block border-b border-white/15 py-5 text-2xl"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            {level === "capabilities" && (
              <>
                <button
                  type="button"
                  onClick={() => setLevel("root")}
                  className="mb-4 flex items-center gap-3 py-3 text-white/50"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Capabilities
                </button>
                {capabilityGroups.map((group) => (
                  <button
                    key={group.title}
                    type="button"
                    onClick={() => setLevel(group.title)}
                    className="flex w-full items-center justify-between border-b border-white/15 py-5 text-left text-2xl"
                  >
                    {group.title}
                    <ChevronRight className="h-5 w-5 opacity-50" />
                  </button>
                ))}
              </>
            )}

            {activeGroup && (
              <>
                <button
                  type="button"
                  onClick={() => setLevel("capabilities")}
                  className="mb-4 flex items-center gap-3 py-3 text-white/50"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  {activeGroup.title}
                </button>
                {activeGroup.services.map((service) => (
                  <Link
                    key={service.label}
                    href={service.href}
                    onClick={handleClose}
                    className="block border-b border-white/15 py-5 text-2xl"
                  >
                    {service.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
