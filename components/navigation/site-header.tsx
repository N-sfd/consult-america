"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles, Building2, Layers, Cpu, Database, Workflow, ShieldCheck, FileText, Activity, Users } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import { industryLinks, platformLinks } from "@/lib/site-data";

type MenuType = "what-we-do" | "oracle" | "crm" | "ai-data" | "applications" | "industries" | "company" | null;

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const { setOpen: setContactOpen } = useContactPanel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isSolid = scrolled || openMenu !== null || drawerOpen;

  const headerSurface = isSolid
    ? "bg-[#FFFDF8]/96 backdrop-blur-[18px] border-b border-[#261F1B]/10 shadow-[0_2px_14px_rgba(20,24,28,0.04)]"
    : "bg-transparent border-b border-white/10";

  const topStripStyle = isSolid
    ? "border-b border-[#D7CCBD]/50 bg-[#FFFDF8]/90 text-[#695F57]"
    : "border-b border-white/10 bg-black/25 text-white/75 backdrop-blur-xs";

  const navLinkClass = isSolid
    ? "ca-nav-link flex items-center gap-1 text-[0.85rem] xl:text-[0.88rem] font-medium text-[#261F1B] hover:text-[#B63A3A] cursor-pointer transition-colors"
    : "ca-nav-link flex items-center gap-1 text-[0.85rem] xl:text-[0.88rem] font-medium text-white/90 hover:text-white cursor-pointer transition-colors";

  const directLinkClass = isSolid
    ? "ca-nav-link text-[0.85rem] xl:text-[0.88rem] font-medium text-[#261F1B] hover:text-[#B63A3A] transition-colors"
    : "ca-nav-link text-[0.85rem] xl:text-[0.88rem] font-medium text-white/90 hover:text-white transition-colors";

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Top Announcement / Utility Strip */}
        <div className={`hidden py-1.5 text-[0.75rem] font-medium transition-colors duration-300 lg:block ${topStripStyle}`}>
          <div className="ca-shell flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className={`font-semibold tracking-wide text-[0.7rem] flex items-center gap-2 ${isSolid ? "text-[#261F1B]" : "text-white"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
                ENTERPRISE TRANSFORMATION · ORACLE · AI &amp; DATA · ENGINEERING
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/careers"
                className={`transition-colors ${isSolid ? "hover:text-[#B63A3A]" : "hover:text-white"}`}
              >
                Careers
              </Link>
              <Link
                href="/insights"
                className={`transition-colors ${isSolid ? "hover:text-[#B63A3A]" : "hover:text-white"}`}
              >
                Insights
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className={`cursor-pointer transition-colors ${isSolid ? "hover:text-[#B63A3A]" : "hover:text-white"}`}
              >
                Contact
              </button>
              <span className={`h-3 w-px ${isSolid ? "bg-[#D7CCBD]" : "bg-white/20"}`} />
              <Link
                href="/login"
                className={`font-semibold transition-colors ${isSolid ? "text-[#261F1B] hover:text-[#B63A3A]" : "text-white hover:text-white/80"}`}
              >
                Employee Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className={`transition-[background,border-color,box-shadow] duration-300 ${headerSurface}`}>
          <div className="ca-shell">
            <div className="flex h-20 items-center justify-between gap-4 lg:h-[82px]">
              <BrandLogo
                tone={isSolid ? "dark" : "light"}
                priority
                markClassName="h-10 sm:h-[42px] lg:h-11 w-auto max-w-[170px] sm:max-w-[195px] lg:max-w-[215px]"
              />

              {/* Desktop Navigation Links */}
              <nav
                className="hidden items-center justify-center gap-2.5 xl:gap-4 lg:flex"
                aria-label="Primary navigation"
              >
                {/* What We Do Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "what-we-do"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("what-we-do")}
                  onClick={() => setOpenMenu(openMenu === "what-we-do" ? null : "what-we-do")}
                  aria-expanded={openMenu === "what-we-do"}
                >
                  What We Do
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200" />
                </button>

                {/* Oracle Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "oracle"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("oracle")}
                  onClick={() => setOpenMenu(openMenu === "oracle" ? null : "oracle")}
                  aria-expanded={openMenu === "oracle"}
                >
                  Oracle
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* CRM Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "crm"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("crm")}
                  onClick={() => setOpenMenu(openMenu === "crm" ? null : "crm")}
                  aria-expanded={openMenu === "crm"}
                >
                  CRM
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* AI & Data Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "ai-data"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("ai-data")}
                  onClick={() => setOpenMenu(openMenu === "ai-data" ? null : "ai-data")}
                  aria-expanded={openMenu === "ai-data"}
                >
                  AI &amp; Data
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* Applications Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "applications"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("applications")}
                  onClick={() => setOpenMenu(openMenu === "applications" ? null : "applications")}
                  aria-expanded={openMenu === "applications"}
                >
                  Applications
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                {/* Industries Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "industries"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("industries")}
                  onClick={() => setOpenMenu(openMenu === "industries" ? null : "industries")}
                  aria-expanded={openMenu === "industries"}
                >
                  Industries
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                <Link
                  href="/work"
                  className={directLinkClass}
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Our Work
                </Link>

                <Link
                  href="/insights"
                  className={directLinkClass}
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Insights
                </Link>

                {/* Company Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "company"}
                  className={navLinkClass}
                  onMouseEnter={() => setOpenMenu("company")}
                  onClick={() => setOpenMenu(openMenu === "company" ? null : "company")}
                  aria-expanded={openMenu === "company"}
                >
                  Company
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </nav>

              {/* Utility / Right Action */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/careers"
                  className={`hidden text-xs font-semibold md:block transition-colors ${isSolid ? "text-[#695F57] hover:text-[#B63A3A]" : "text-white/80 hover:text-white"}`}
                >
                  Careers
                </Link>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-[42px] !px-5 text-xs sm:text-sm font-semibold sm:!inline-flex cursor-pointer !bg-[#B63A3A] hover:!bg-[#9E2E2E] !text-white rounded-[6px]"
                >
                  Talk to an Expert
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border lg:hidden cursor-pointer transition-colors ${
                    isSolid
                      ? "border-[#D7CCBD] bg-white"
                      : "border-white/20 bg-white/10"
                  }`}
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className={`h-0.5 w-4.5 ${isSolid ? "bg-[#261F1B]" : "bg-white"}`} />
                  <span className={`h-0.5 w-4.5 ${isSolid ? "bg-[#261F1B]" : "bg-white"}`} />
                  <span className={`h-0.5 w-4.5 ${isSolid ? "bg-[#261F1B]" : "bg-white"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 1. What We Do Mega Menu */}
        {openMenu === "what-we-do" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("what-we-do")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-10">
                {/* TRANSFORM */}
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    TRANSFORM
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    {[
                      "Enterprise Transformation",
                      "Operating Model & Process",
                      "Program Delivery",
                      "Testing & Quality",
                      "Change & Adoption",
                    ].map((label) => (
                      <li key={label}>
                        <Link
                          href="/capabilities/enterprise-transformation"
                          onClick={() => setOpenMenu(null)}
                          className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A] transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* MODERNIZE & INTELLIGENCE */}
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    MODERNIZE
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    {[
                      { href: "/oracle", label: "Oracle Transformation" },
                      { href: "/platforms/crm", label: "CRM Transformation" },
                      { href: "/capabilities/digital-engineering", label: "Cloud Modernization" },
                      { href: "/ai-data", label: "Data Modernization" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A] transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#357C78]">
                    INTELLIGENCE
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {[
                      "AI Strategy",
                      "Generative AI & Agents",
                      "Document Intelligence",
                      "Data Engineering & RAG",
                      "AI Governance",
                    ].map((label) => (
                      <li key={label}>
                        <Link
                          href="/ai-data"
                          onClick={() => setOpenMenu(null)}
                          className="block py-0.5 text-[#261F1B] hover:text-[#357C78] transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BUILD & OPERATE */}
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                    BUILD
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    {[
                      "Application Modernization",
                      "Custom Platform Engineering",
                      "Full-Stack Web & Mobile",
                      "API & Microservices Architecture",
                      "Legacy-to-Cloud Migration",
                    ].map((label) => (
                      <li key={label}>
                        <Link
                          href="/capabilities/digital-engineering"
                          onClick={() => setOpenMenu(null)}
                          className="block py-0.5 text-[#261F1B] hover:text-[#47739B] transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#526170]">
                    OPERATE
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {[
                      "Managed Delivery",
                      "Optimization & Support",
                      "Cloud Operations (FinOps)",
                    ].map((label) => (
                      <li key={label}>
                        <Link
                          href="/capabilities/managed-delivery"
                          onClick={() => setOpenMenu(null)}
                          className="block py-0.5 text-[#261F1B] hover:text-[#526170] transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PRACTICE OVERVIEW CARD */}
                <div className="rounded-xl border border-[#D7CCBD] bg-[#F7F3EC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#B63A3A]" />
                      ENGINEERING THE CORE
                    </span>
                    <h4 className="mt-2 font-serif text-base font-bold text-[#261F1B]">
                      Integrated enterprise capabilities from strategy to code.
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#695F57]">
                      We combine deep enterprise ERP depth with modern software engineering and production AI agents.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#D7CCBD]/80">
                    <Link
                      href="/capabilities"
                      onClick={() => setOpenMenu(null)}
                      className="ca-link text-xs font-semibold text-[#B63A3A] flex items-center gap-1.5"
                    >
                      <span>Explore all capabilities</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Oracle Mega Menu */}
        {openMenu === "oracle" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("oracle")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-10">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    FUSION CLOUD SUITE
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Financials &amp; General Ledger</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Procurement &amp; Source-to-Pay</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Supply Chain Management (SCM)</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Projects &amp; Portfolio (PPM)</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Human Capital Management (HCM)</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Enterprise Performance (EPM)</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                    INTEGRATION &amp; DATA
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Oracle Integration Cloud (OIC)</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">REST APIs &amp; Kafka Connectors</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Fusion Data Intelligence (FDI)</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Subledger Data Pipeline</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#357C78]">
                    LIFECYCLE SERVICES
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Full Lifecycle Implementation</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Period Close Optimization</Link></li>
                    <li><Link href="/oracle" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Subledger Reconciliation</Link></li>
                    <li><Link href="/work" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Oracle Case Studies</Link></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#211E1B] p-5 text-white flex flex-col justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                      ORACLE SPECIALIZATION
                    </span>
                    <h4 className="mt-2 font-serif text-base font-bold text-white">
                      Modernize the enterprise core around Oracle Fusion.
                    </h4>
                    <p className="mt-2 text-xs text-[#A4B1BE] leading-relaxed">
                      Structured enterprise cutover methodology, OIC integrations, and clean subledger reconciliations.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/15">
                    <Link
                      href="/oracle"
                      onClick={() => setOpenMenu(null)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
                    >
                      <span>Explore Oracle Practice</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CRM Mega Menu */}
        {openMenu === "crm" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("crm")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    PLATFORMS &amp; CLOUDS
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Salesforce Sales Cloud</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Service Cloud &amp; Omnichannel</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Revenue &amp; CPQ Solutions</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Oracle CX &amp; Service</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                    INTEGRATIONS &amp; AI
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">ERP-to-CRM Lead-to-Cash Bridge</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Customer 360 Data Models</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Pipeline Health Telemetry</Link></li>
                    <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">AI Next Best Action Engine</Link></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#F7F3EC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      CUSTOMER 360 ARCHITECTURE
                    </span>
                    <h4 className="mt-2 font-serif text-base font-bold text-[#261F1B]">
                      Connect customer touchpoints directly to core operations.
                    </h4>
                    <p className="mt-2 text-xs text-[#695F57] leading-relaxed">
                      Unified accounts, pipeline velocity, automated billing synchronization, and telemetry.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#D7CCBD]/80">
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
            </div>
          </div>
        )}

        {/* 4. AI & Data Mega Menu */}
        {openMenu === "ai-data" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("ai-data")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#357C78]">
                    INTELLIGENCE CAPABILITIES
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Document Intelligence &amp; Extraction</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Agentic Workflow Automation</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">Enterprise Retrieval Augmented Generation</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#357C78]">AI Governance &amp; Grounding</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                    DATA ARCHITECTURE
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Operational Data Fabric</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Real-Time Streaming Pipelines</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Schema Normalization &amp; Catalog</Link></li>
                    <li><Link href="/ai-data" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Vector Stores &amp; Hybrid Search</Link></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#211E1B] p-5 text-white flex flex-col justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                      AI IN ACTION
                    </span>
                    <h4 className="mt-2 font-serif text-base font-bold text-white">
                      Data Agent · Document Intelligence
                    </h4>
                    <p className="mt-2 text-xs text-[#A4B1BE] leading-relaxed">
                      Extract structured tables, verify citations against source PDFs, and trigger downstream ERP &amp; CRM workflows.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/15">
                    <Link
                      href="/work/innovation/data-agent"
                      onClick={() => setOpenMenu(null)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
                    >
                      <span>Explore Data Agent</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Applications Mega Menu */}
        {openMenu === "applications" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("applications")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {platformLinks.map((plat) => (
                  <Link
                    key={plat.href}
                    href={plat.href}
                    onClick={() => setOpenMenu(null)}
                    className="group block rounded-xl border border-[#D7CCBD] bg-white p-4.5 transition-all hover:border-[#B63A3A]/40 hover:bg-[#F7F3EC] shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#261F1B] group-hover:text-[#B63A3A] transition-colors">
                        {plat.label}
                      </h4>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#B63A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="mt-1 text-xs text-[#695F57] line-clamp-2">
                      {plat.detail}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Industries Mega Menu */}
        {openMenu === "industries" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("industries")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {industryLinks.map((ind) => (
                  <Link
                    key={ind.href}
                    href={ind.href}
                    onClick={() => setOpenMenu(null)}
                    className="group block rounded-xl border border-[#D7CCBD] bg-white p-4 transition-all hover:border-[#B63A3A]/40 hover:bg-[#F7F3EC] shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#261F1B] group-hover:text-[#B63A3A] transition-colors">
                        {ind.label}
                      </h4>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#B63A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="mt-1 text-xs text-[#695F57] line-clamp-2">
                      {ind.detail}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. Company Mega Menu */}
        {openMenu === "company" && (
          <div
            className="absolute inset-x-0 top-full border-b border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] shadow-[0_20px_40px_rgba(20,24,28,0.08)] backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setOpenMenu("company")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    WHO WE ARE
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/about" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">About Consult America</Link></li>
                    <li><Link href="/about" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Leadership &amp; Advisory</Link></li>
                    <li><Link href="/careers" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Careers &amp; Opportunities</Link></li>
                    <li><Link href="/contact" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#B63A3A]">Offices &amp; Locations</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                    EVIDENCE &amp; THOUGHT LEADERSHIP
                  </p>
                  <ul className="mt-3 space-y-2 text-xs">
                    <li><Link href="/work" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Selected Client Work</Link></li>
                    <li><Link href="/insights" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Executive Perspectives &amp; Whitepapers</Link></li>
                    <li><Link href="/work/innovation/data-agent" onClick={() => setOpenMenu(null)} className="block py-0.5 text-[#261F1B] hover:text-[#47739B]">Consult America Labs</Link></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#F7F3EC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      JOIN OUR PRACTICE
                    </span>
                    <h4 className="mt-2 font-serif text-base font-bold text-[#261F1B]">
                      Build what comes next with Consult America.
                    </h4>
                    <p className="mt-2 text-xs text-[#695F57] leading-relaxed">
                      We are expanding our Oracle Cloud, AI, data, and digital engineering practices across the United States.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#D7CCBD]/80">
                    <Link
                      href="/careers"
                      onClick={() => setOpenMenu(null)}
                      className="ca-link text-xs font-semibold text-[#B63A3A]"
                    >
                      View Open Roles →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
