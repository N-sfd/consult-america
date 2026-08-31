"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronDown, Sparkles, Building2, Layers, Cpu, Database, Workflow, ShieldCheck, FileText, Activity, Users } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import { industryLinks, platformLinks, whatWeDoMegaMenu } from "@/lib/site-data";

const WHAT_WE_DO_COLUMN_COLORS: Record<string, string> = {
  TRANSFORM: "#B63A3A",
  MODERNIZE: "#163536",
  INTELLIGENCE: "#103F3E",
  BUILD: "#103F3E",
  OPERATE: "#596968",
};

const whatWeDoColumns = [
  whatWeDoMegaMenu.transform,
  whatWeDoMegaMenu.modernize,
  whatWeDoMegaMenu.intelligence,
  whatWeDoMegaMenu.build,
  whatWeDoMegaMenu.operate,
];

type MenuType = "what-we-do" | "oracle" | "crm" | "ai-data" | "applications" | "industries" | "company" | null;

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const { setOpen: setContactOpen } = useContactPanel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const headerSurface =
    scrolled || openMenu || drawerOpen
      ? "bg-white/95 backdrop-blur-[12px] border-b border-[#DCE4E1] shadow-[0_4px_20px_rgba(16,63,62,0.04)]"
      : "bg-white/94 backdrop-blur-[8px] border-b border-[#DCE4E1]";

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Top Dark Green Utility Bar: #103F3E, 28-32px */}
        <div className="hidden border-b border-[#0B3332] bg-[#103F3E] py-1.5 text-[11px] sm:text-[12px] font-medium text-white/90 lg:block">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#72C2A4]" />
              <span className="tracking-wide">
                Enterprise Transformation · Oracle · AI · Application Engineering
              </span>
            </div>
            <div className="flex items-center gap-5 text-white/85">
              <Link
                href="/insights"
                className="transition-colors hover:text-white"
              >
                Insights
              </Link>
              <Link
                href="/careers"
                className="transition-colors hover:text-white"
              >
                Careers
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Section 5 Specification: 74-82px, Max Width 1440px) */}
        <div className={`transition-[background,border-color,box-shadow] duration-200 ${headerSurface}`}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
            <div className="flex h-[76px] xl:h-[80px] items-center justify-between gap-4 xl:gap-8">
              <BrandLogo tone="dark" priority />

              {/* Desktop Navigation Links — whitespace-nowrap prevents any line breaking */}
              <nav
                className="hidden items-center justify-center gap-3 xl:gap-5.5 lg:flex flex-nowrap shrink-0"
                aria-label="Primary navigation"
              >
                {/* What We Do Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "what-we-do"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("what-we-do")}
                  onClick={() => setOpenMenu(openMenu === "what-we-do" ? null : "what-we-do")}
                  aria-expanded={openMenu === "what-we-do"}
                >
                  <span>What We Do</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200" />
                </button>

                {/* Oracle Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "oracle"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("oracle")}
                  onClick={() => setOpenMenu(openMenu === "oracle" ? null : "oracle")}
                  aria-expanded={openMenu === "oracle"}
                >
                  <span>Oracle</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* CRM Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "crm"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("crm")}
                  onClick={() => setOpenMenu(openMenu === "crm" ? null : "crm")}
                  aria-expanded={openMenu === "crm"}
                >
                  <span>CRM</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* AI & Data Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "ai-data"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("ai-data")}
                  onClick={() => setOpenMenu(openMenu === "ai-data" ? null : "ai-data")}
                  aria-expanded={openMenu === "ai-data"}
                >
                  <span>AI &amp; Data</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* Applications Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "applications"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("applications")}
                  onClick={() => setOpenMenu(openMenu === "applications" ? null : "applications")}
                  aria-expanded={openMenu === "applications"}
                >
                  <span>Applications</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* Industries Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "industries"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("industries")}
                  onClick={() => setOpenMenu(openMenu === "industries" ? null : "industries")}
                  aria-expanded={openMenu === "industries"}
                >
                  <span>Industries</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                <Link
                  href="/work"
                  className="ca-nav-link whitespace-nowrap text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  <span>Our Work</span>
                </Link>

                <Link
                  href="/insights"
                  className="ca-nav-link whitespace-nowrap text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  <span>Insights</span>
                </Link>

                {/* Company Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "company"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[0.84rem] xl:text-[0.88rem] font-medium text-[#163536] hover:text-[#B63A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("company")}
                  onClick={() => setOpenMenu(openMenu === "company" ? null : "company")}
                  aria-expanded={openMenu === "company"}
                >
                  <span>Company</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </nav>

              {/* Right Action CTA */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-[44px] !px-5 text-xs sm:text-sm font-semibold sm:!inline-flex cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <span>Talk to an Expert</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#DCE4E1] bg-white lg:hidden cursor-pointer"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-0.5 w-4.5 bg-[#163536]" />
                  <span className="h-0.5 w-4.5 bg-[#163536]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Mega Menus */}
        {openMenu && (
          <div
            className="hidden border-b border-[#DCE4E1] bg-white shadow-[0_18px_50px_rgba(16,32,51,0.08)] lg:block transition-all duration-200"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 py-8">
              {/* 1. WHAT WE DO MEGA MENU (Section 6 Specification: 5 Columns + Labs Panel) */}
              {openMenu === "what-we-do" && (
                <div className="grid grid-cols-12 gap-6">
                  {/* Left 5 Pillars: Transform, Modernize, Intelligence, Build, Operate — sourced from whatWeDoMegaMenu so header/mobile menu never drift */}
                  <div className="col-span-9 grid grid-cols-5 gap-4">
                    {whatWeDoColumns.map((column) => (
                      <div key={column.category}>
                        <p
                          className="text-[0.68rem] font-bold uppercase tracking-[0.14em]"
                          style={{ color: WHAT_WE_DO_COLUMN_COLORS[column.category] }}
                        >
                          {column.category}
                        </p>
                        <ul className="mt-3 space-y-1.5 text-xs">
                          {column.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={() => setOpenMenu(null)}
                                className="block py-0.5 text-[#163536] hover:text-[#B63A3A] transition-colors leading-snug"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Right Side Feature: CONSULT AMERICA LABS in #EEF3F1 */}
                  <div className="col-span-3 rounded-xl border border-[#DCE4E1] bg-[#EEF3F1] p-4.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#DCE4E1]">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A] flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#B63A3A]" />
                          Consult America Labs
                        </span>
                        <span className="text-[0.62rem] font-semibold text-[#103F3E] uppercase">
                          Portfolio
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1">
                        {whatWeDoMegaMenu.labs.products.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="group/item flex items-center justify-between rounded-md border border-transparent bg-white p-1.5 px-2 transition-all hover:border-[#DCE4E1] hover:shadow-2xs"
                          >
                            <div>
                              <span className="text-[0.75rem] font-bold text-[#163536] group-hover/item:text-[#B63A3A] transition-colors">
                                {item.label}
                              </span>
                              <p className="text-[0.6rem] text-[#526170] leading-tight">{item.detail}</p>
                            </div>
                            <ArrowUpRight className="h-3 w-3 text-[#B63A3A] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#DCE4E1]">
                      <Link
                        href={whatWeDoMegaMenu.labs.ctaHref}
                        onClick={() => setOpenMenu(null)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                      >
                        <span>Explore Applications</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ORACLE MEGA MENU */}
              {openMenu === "oracle" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        CORE CLOUD PRACTICES
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Financials &amp; General Ledger</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Procurement &amp; Source-to-Pay</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Supply Chain Management (SCM)</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Projects &amp; Portfolio (PPM)</Link></li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                        ENTERPRISE FOUNDATION
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Oracle Integration Cloud (OIC)</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Fusion Data Intelligence</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Multi-Entity Ledgers</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Testing &amp; Cutover Control</Link></li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#526170]">
                        DELIVERY ENGAGEMENTS
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Full Lifecycle Implementation</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Period Close Optimization</Link></li>
                        <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Subledger Reconciliation</Link></li>
                        <li><Link href="/work" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#B63A3A]">Oracle Case Studies</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#DCE4E1] bg-[#0C2233] text-white p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        FLAGSHIP PRACTICE
                      </span>
                      <h4 className="mt-2 font-serif text-lg font-semibold">
                        Modernize the digital core.
                      </h4>
                      <p className="mt-2 text-xs text-[#97A8B7] leading-relaxed">
                        Connect Oracle applications, processes, data and integrations around the way the enterprise actually operates.
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-[#1E3752]">
                      <Link
                        href="/oracle"
                        onClick={() => setOpenMenu(null)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FFFFFF] hover:text-[#B63A3A] transition-colors"
                      >
                        Explore Oracle Transformation →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CRM MEGA MENU */}
              {openMenu === "crm" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        CUSTOMER JOURNEY
                      </p>
                      <ul className="mt-3 space-y-2.5 text-xs">
                        <li><strong className="text-[#163536]">01 Discover:</strong> <span className="text-[#526170]">Account intelligence &amp; intent signals</span></li>
                        <li><strong className="text-[#163536]">02 Engage:</strong> <span className="text-[#526170]">Personalized multi-channel outreach</span></li>
                        <li><strong className="text-[#163536]">03 Sell:</strong> <span className="text-[#526170]">Pipeline, pricing &amp; deal governance</span></li>
                        <li><strong className="text-[#163536]">04 Serve:</strong> <span className="text-[#526170]">Case deflection &amp; service automation</span></li>
                        <li><strong className="text-[#163536]">05 Expand:</strong> <span className="text-[#526170]">Renewal telemetry &amp; lifecycle expansion</span></li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                        ENTERPRISE INTEGRATION
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Customer 360 Workspace</Link></li>
                        <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Salesforce &amp; Oracle Integration</Link></li>
                        <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Revenue Cloud &amp; CPQ Workflows</Link></li>
                        <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Customer Data Platform (CDP)</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#DCE4E1] bg-[#EEF3F1] p-5.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        CONNECTED CRM
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-[#163536]">
                        Connect every customer moment to the enterprise behind it.
                      </h4>
                      <p className="mt-1.5 text-xs text-[#526170]">
                        Unify Customer Data, CRM, Service, Marketing, AI, ERP, Integration, and Analytics.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#DCE4E1]">
                      <Link
                        href="/platforms/crm"
                        onClick={() => setOpenMenu(null)}
                        className="ca-link text-xs font-semibold text-[#B63A3A]"
                      >
                        Explore CRM Platform →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. AI & DATA MEGA MENU */}
              {openMenu === "ai-data" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                        GOVERNED AI &amp; AGENTS
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#103F3E]">Document Intelligence &amp; Clause Extraction</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#103F3E]">Task-Oriented Enterprise Agents</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#103F3E]">Governed RAG &amp; Source Grounding</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#103F3E]">FAR / DFARS Regulatory Extraction</Link></li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                        DATA FOUNDATIONS
                      </p>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Data Engineering &amp; Modern Pipelines</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Enterprise Knowledge Graphs</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">AI Governance &amp; Access Controls</Link></li>
                        <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#163536] hover:text-[#47739B]">Human-in-the-Loop Validation Queues</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#DCE4E1] bg-[#EEF3F1] p-5.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                        APPLIED INTELLIGENCE
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-[#163536]">
                        Put intelligence into the work.
                      </h4>
                      <p className="mt-1.5 text-xs text-[#526170]">
                        AI creates value when trusted data, useful models, business context and real workflows come together.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#DCE4E1]">
                      <Link
                        href="/ai-data"
                        onClick={() => setOpenMenu(null)}
                        className="ca-link text-xs font-semibold text-[#103F3E]"
                      >
                        Explore AI &amp; Data →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. APPLICATIONS MEGA MENU */}
              {openMenu === "applications" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E9EEF1]">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        ENTERPRISE APPLICATIONS &amp; LABS SOFTWARE
                      </p>
                      <p className="text-xs text-[#526170] mt-0.5">
                        Focused operational software engineered and deployed by Consult America
                      </p>
                    </div>
                    <Link
                      href="/platforms"
                      onClick={() => setOpenMenu(null)}
                      className="text-xs font-semibold text-[#B63A3A] hover:underline"
                    >
                      View platform architecture →
                    </Link>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {platformLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group block rounded-xl border border-[#DCE4E1] bg-white p-4 transition-all hover:border-[#B63A3A]/40 hover:bg-[#EEF3F1] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#163536] group-hover:text-[#B63A3A] transition-colors">
                            {item.label}
                          </h4>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#B63A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-[#526170]">
                          {item.detail}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. INDUSTRIES MEGA MENU */}
              {openMenu === "industries" && (
                <div>
                  <div className="pb-4 border-b border-[#E9EEF1]">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      INDUSTRY PRACTICES
                    </p>
                    <p className="text-xs text-[#526170] mt-0.5">
                      Tailored compliance boundaries, operational workflows, and delivery accelerators
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {industryLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group rounded-xl border border-[#DCE4E1] bg-white p-4.5 transition-all hover:border-[#B63A3A]/40 hover:bg-[#EEF3F1] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#163536] group-hover:text-[#B63A3A] transition-colors">
                            {item.label}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#B63A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1.5 text-xs text-[#526170]">
                          {item.detail}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. COMPANY MEGA MENU */}
              {openMenu === "company" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-4">
                    {[
                      { href: "/about", label: "About Consult America", desc: "Our firm, consulting methodology, and delivery focus" },
                      { href: "/about", label: "Delivery Philosophy", desc: "Senior practitioners attached directly to code and outcomes" },
                      { href: "/about", label: "National Delivery Centers", desc: "Offices in Washington DC, New York, Chicago, Dallas & SF" },
                      { href: "/careers", label: "Careers & Open Positions", desc: "Join senior practitioners delivering complex programs" },
                      { href: "/insights", label: "Insights & Perspectives", desc: "Executive publications on Oracle, AI, and digital core" },
                      { href: "/contact", label: "Contact Practice Leads", desc: "Schedule an architecture scoping session" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group block rounded-xl border border-[#DCE4E1] bg-white p-4 transition-all hover:border-[#B63A3A]/40 hover:bg-[#EEF3F1] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#163536] group-hover:text-[#B63A3A] transition-colors">
                            {item.label}
                          </h4>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#B63A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-[#526170]">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#DCE4E1] bg-[#163536] text-white p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                        CONSULT AMERICA
                      </span>
                      <h4 className="mt-2 font-serif text-lg font-semibold text-white">
                        Built for execution, not just advice.
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#97A8B7]">
                        From operating model design to production software deployment, we partner with enterprises to turn complex technology programs into working reality.
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[#1E3752]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          setContactOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#B63A3A] transition-colors cursor-pointer"
                      >
                        Start a conversation →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
