"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import {
  aiDataMegaMenu,
  engineeringMegaMenu,
  industryLinks,
  oracleMegaMenu,
  transformationMegaMenu,
} from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type AccordionKey = "transformation" | "oracle" | "crm" | "ai-data" | "engineering" | "industries" | null;

const crmLinks = [
  { href: "/platforms/crm", label: "Customer 360 Workspace" },
  { href: "/platforms/crm", label: "Salesforce & Oracle Integration" },
  { href: "/platforms/crm", label: "Revenue Cloud & CPQ" },
];

function AccordionSection({
  title,
  sectionKey,
  openSection,
  setOpenSection,
  children,
}: {
  title: string;
  sectionKey: AccordionKey;
  openSection: AccordionKey;
  setOpenSection: (key: AccordionKey) => void;
  children: React.ReactNode;
}) {
  const isOpen = openSection === sectionKey;
  return (
    <div className="border-b border-[#DCE4E1]">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        className="flex w-full min-h-[48px] items-center justify-between py-4 text-left text-base font-semibold text-[#073B3A] cursor-pointer"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<AccordionKey>(null);
  const { setOpen: setContactOpen } = useContactPanel();

  const handleClose = useCallback(() => {
    setOpenSection(null);
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
            className="fixed inset-0 z-[60] bg-[#073B3A]/40 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white text-[#073B3A] shadow-[-8px_0_40px_rgba(7,59,58,0.12)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-[#DCE4E1] px-5">
              <BrandLogo tone="dark" />
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#073B3A] hover:bg-[#F0F6F4] cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              <AccordionSection title="Transformation" sectionKey="transformation" openSection={openSection} setOpenSection={setOpenSection}>
                {transformationMegaMenu.links.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">
                    {item.label}
                  </Link>
                ))}
              </AccordionSection>

              <AccordionSection title="Oracle" sectionKey="oracle" openSection={openSection} setOpenSection={setOpenSection}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#176A63]">Transform</p>
                {oracleMegaMenu.transform.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
                <p className="pt-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#176A63]">Connect</p>
                {oracleMegaMenu.connect.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
                <p className="pt-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#176A63]">Deliver</p>
                {oracleMegaMenu.deliver.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
              </AccordionSection>

              <AccordionSection title="CRM" sectionKey="crm" openSection={openSection} setOpenSection={setOpenSection}>
                {crmLinks.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
              </AccordionSection>

              <AccordionSection title="AI & Data" sectionKey="ai-data" openSection={openSection} setOpenSection={setOpenSection}>
                {aiDataMegaMenu.links.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
              </AccordionSection>

              <AccordionSection title="Engineering" sectionKey="engineering" openSection={openSection} setOpenSection={setOpenSection}>
                {engineeringMegaMenu.links.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
              </AccordionSection>

              <AccordionSection title="Industries" sectionKey="industries" openSection={openSection} setOpenSection={setOpenSection}>
                {industryLinks.map((item) => (
                  <Link key={item.label} href={item.href} onClick={handleClose} className="block py-1.5 text-sm text-[#122D2E] hover:text-[#B83A3A]">{item.label}</Link>
                ))}
              </AccordionSection>

              <div className="divide-y divide-[#DCE4E1]">
                <Link href="/work" onClick={handleClose} className="flex min-h-[48px] items-center py-4 text-base font-semibold text-[#073B3A] hover:text-[#B83A3A]">Work</Link>
                <Link href="/insights" onClick={handleClose} className="flex min-h-[48px] items-center py-4 text-base font-semibold text-[#073B3A] hover:text-[#B83A3A]">Insights</Link>
                <Link href="/about" onClick={handleClose} className="flex min-h-[48px] items-center py-4 text-base font-semibold text-[#073B3A] hover:text-[#B83A3A]">Company</Link>
                <Link href="/careers" onClick={handleClose} className="flex min-h-[48px] items-center py-4 text-base font-semibold text-[#073B3A] hover:text-[#B83A3A]">Careers</Link>
                <Link href="/contact" onClick={handleClose} className="flex min-h-[48px] items-center py-4 text-base font-semibold text-[#073B3A] hover:text-[#B83A3A]">Contact</Link>
              </div>
            </nav>

            <div className="border-t border-[#DCE4E1] p-5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setContactOpen(true);
                }}
                className="ca-button-primary flex w-full min-h-[48px] items-center justify-center gap-2 font-semibold cursor-pointer"
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
