"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import {
  aiDataMegaMenuGrouped,
  applicationsMegaMenu,
  companyMegaMenu,
  industryLinks,
  oracleMegaMenuGrouped,
  resourcesMegaMenu,
  solutionsMegaMenu,
} from "@/lib/site-data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type AccordionKey =
  | "solutions"
  | "oracle"
  | "ai-data"
  | "applications"
  | "industries"
  | "resources"
  | "company"
  | null;

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
  const reduceMotion = useReducedMotion();
  return (
    <div className="border-b border-[#DCE4E1]">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        className="flex min-h-[48px] w-full cursor-pointer items-center justify-between py-4 text-left text-base font-semibold text-[#073B3A]"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {reduceMotion ? (
        isOpen ? <div className="space-y-2 pb-4">{children}</div> : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pb-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function MobileLinks({
  links,
  onClose,
}: {
  links: { href: string; label: string }[];
  onClose: () => void;
}) {
  return (
    <>
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block min-h-[44px] py-2.5 text-[0.9375rem] text-[#122D2E] hover:text-[#B83A3A]"
        >
          {item.label}
        </Link>
      ))}
    </>
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
            className="fixed inset-0 z-[100] bg-[#073B3A]/40 backdrop-blur-[2px] min-[1280px]:hidden"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-sm flex-col bg-white text-[#073B3A] shadow-[-8px_0_40px_rgba(7,59,58,0.12)] min-[1280px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-[#DCE4E1] px-5">
              <ConsultAmericaLogo lockup="horizontal" href="/" onNavigate={handleClose} />
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#073B3A] hover:bg-[#F0F6F4]"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-8">
              <AccordionSection title="Solutions" sectionKey="solutions" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks links={[...solutionsMegaMenu.links, ...solutionsMegaMenu.transform]} onClose={handleClose} />
              </AccordionSection>

              <AccordionSection title="Oracle" sectionKey="oracle" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks
                  links={[
                    ...oracleMegaMenuGrouped.finance,
                    ...oracleMegaMenuGrouped.operations,
                    ...oracleMegaMenuGrouped.platform,
                  ]}
                  onClose={handleClose}
                />
              </AccordionSection>

              <AccordionSection title="AI & Data" sectionKey="ai-data" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks
                  links={[...aiDataMegaMenuGrouped.ai, ...aiDataMegaMenuGrouped.data]}
                  onClose={handleClose}
                />
              </AccordionSection>

              <AccordionSection title="Applications" sectionKey="applications" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks
                  links={[
                    ...applicationsMegaMenu.build,
                    ...applicationsMegaMenu.products,
                    ...applicationsMegaMenu.workforce,
                  ]}
                  onClose={handleClose}
                />
              </AccordionSection>

              <AccordionSection title="Industries" sectionKey="industries" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks links={industryLinks.map((i) => ({ href: i.href, label: i.label }))} onClose={handleClose} />
              </AccordionSection>

              <AccordionSection title="Resources" sectionKey="resources" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks links={resourcesMegaMenu.links} onClose={handleClose} />
              </AccordionSection>

              <AccordionSection title="Company" sectionKey="company" openSection={openSection} setOpenSection={setOpenSection}>
                <MobileLinks links={companyMegaMenu.links} onClose={handleClose} />
                <p className="pt-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#176A63]">Portals</p>
                <MobileLinks links={companyMegaMenu.portals} onClose={handleClose} />
              </AccordionSection>
            </nav>

            <div className="border-t border-[#DCE4E1] p-5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setContactOpen(true);
                }}
                className="ca-button-primary flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 font-semibold"
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
