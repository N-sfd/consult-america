"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const primaryLinks = [
  { label: "Industries", href: "/industries" },
  { label: "Oracle", href: "/oracle" },
  { label: "AI & Data", href: "/ai-data" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

const capabilityLinks = [
  {
    label: "Enterprise Transformation",
    href: "/capabilities/enterprise-transformation",
  },
  {
    label: "Oracle & Enterprise Applications",
    href: "/oracle",
  },
  {
    label: "AI & Data",
    href: "/ai-data",
  },
  {
    label: "Digital Engineering",
    href: "/capabilities/digital-engineering",
  },
  {
    label: "Cloud & Integration",
    href: "/capabilities/cloud-integration",
  },
  {
    label: "Business Consulting",
    href: "/capabilities/business-consulting",
  },
];

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);

  const handleClose = useCallback(() => {
    setCapabilitiesOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-[var(--ca-off-white)] xl:hidden"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="flex h-full flex-col"
          >
            <div className="border-b border-[var(--ca-border-light)]">
              <div className="flex h-20 items-center justify-between px-5 sm:px-8">
                <Link
                  href="/"
                  onClick={handleClose}
                  className="text-[15px] font-semibold tracking-[0.14em]"
                  aria-label="ConsultAmerica homepage"
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
            </div>

            <nav
              className="flex-1 overflow-y-auto px-5 py-6 sm:px-8"
              aria-label="Mobile navigation"
            >
              <button
                type="button"
                onClick={() => setCapabilitiesOpen((value) => !value)}
                className="flex w-full items-center justify-between border-b border-[var(--ca-border-light)] py-5 text-left text-2xl font-medium sm:text-3xl"
                aria-expanded={capabilitiesOpen}
              >
                Capabilities
                {capabilitiesOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {capabilitiesOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="overflow-hidden border-b border-[var(--ca-border-light)]"
                  >
                    <div className="py-4 pl-4">
                      {capabilityLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleClose}
                          className="block py-3 text-base text-[var(--ca-text)] transition-opacity hover:opacity-60"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <Link
                        href="/capabilities"
                        onClick={handleClose}
                        className="ca-mobile-nav-link mt-3 inline-flex items-center gap-2 py-3 font-medium"
                      >
                        View All Capabilities
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {primaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="ca-mobile-nav-link flex items-center justify-between border-b border-[var(--ca-border-light)] py-5 text-2xl font-medium sm:text-3xl"
                >
                  {item.label}
                  <ArrowUpRight className="h-5 w-5 opacity-40" />
                </Link>
              ))}
            </nav>

            <div className="border-t border-[var(--ca-border-light)] px-5 py-6 sm:px-8">
              <div className="mb-6">
                <p className="ca-eyebrow text-[var(--ca-muted)]">
                  CONNECT
                </p>

                <a
                  href="mailto:info@consultamerica.net"
                  className="mt-3 block text-lg"
                >
                  info@consultamerica.net
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={handleClose}
                  className="flex min-h-12 items-center justify-center rounded-full border border-[var(--ca-border)] px-5 font-medium"
                >
                  Employee Login
                </Link>

                <Link
                  href="/contact"
                  onClick={handleClose}
                  className="ca-button-dark min-h-12"
                >
                  Let&apos;s Talk
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
