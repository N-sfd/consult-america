"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles, Building2, Layers, Cpu, Users } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import {
  industryLinks,
  platformLinks,
} from "@/lib/site-data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"what-we-do" | "applications" | "industries" | "company" | null>(null);
  const { setOpen: setContactOpen } = useContactPanel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
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

  const headerSurface =
    scrolled || openMenu || drawerOpen
      ? "border-[#D7CCBD] bg-[#F4EFE6]/98 shadow-[0_4px_24px_rgba(38,31,27,0.06)] backdrop-blur-[12px]"
      : "border-[#D7CCBD] bg-[#F4EFE6]";

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Top Announcement / Utility Bar */}
        <div className="hidden border-b border-[#D7CCBD]/60 bg-[#FFFAF2] py-1.5 text-[0.75rem] font-medium text-[#695F57] lg:block">
          <div className="ca-shell flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-[#7D2639] font-semibold tracking-wide uppercase text-[0.68rem] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7D2639]" />
                Enterprise Transformation · AI · Oracle · Engineering
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/insights"
                className="transition-colors hover:text-[#7D2639]"
              >
                Insights
              </Link>
              <Link
                href="/careers"
                className="transition-colors hover:text-[#7D2639]"
              >
                Careers
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="cursor-pointer transition-colors hover:text-[#7D2639]"
              >
                Contact
              </button>
              <span className="h-3 w-px bg-[#D7CCBD]" />
              <Link
                href="/login"
                className="font-semibold text-[#261F1B] transition-colors hover:text-[#7D2639]"
              >
                Employee Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={`border-b transition-[background,border-color,box-shadow] duration-200 ${headerSurface}`}
        >
          <div className="ca-shell">
            <div className="flex h-16 items-center justify-between gap-4 xl:h-[72px]">
              <BrandLogo tone="dark" priority />

              {/* Primary Navigation Links */}
              <nav
                className="hidden items-center justify-center gap-3.5 xl:gap-5 2xl:gap-6 lg:flex"
                aria-label="Primary navigation"
              >
                {/* What We Do Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "what-we-do"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-semibold text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("what-we-do")}
                  onClick={() =>
                    setOpenMenu(openMenu === "what-we-do" ? null : "what-we-do")
                  }
                  aria-expanded={openMenu === "what-we-do"}
                >
                  What we do
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Direct Practice Links */}
                <Link
                  href="/oracle"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Oracle
                </Link>

                <Link
                  href="/platforms/crm"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  CRM &amp; Customer Experience
                </Link>

                <Link
                  href="/ai-data"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  AI &amp; Data
                </Link>

                {/* Applications Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "applications"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("applications")}
                  onClick={() =>
                    setOpenMenu(openMenu === "applications" ? null : "applications")
                  }
                >
                  Applications
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {/* Industries Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "industries"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("industries")}
                  onClick={() =>
                    setOpenMenu(openMenu === "industries" ? null : "industries")
                  }
                >
                  Industries
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                <Link
                  href="/work"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Our Work
                </Link>

                {/* Company Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "company"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("company")}
                  onClick={() =>
                    setOpenMenu(openMenu === "company" ? null : "company")
                  }
                >
                  Company
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </nav>

              {/* Header Right CTA */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-10 !px-4 text-sm font-semibold sm:!inline-flex cursor-pointer"
                >
                  Talk to an expert
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] lg:hidden cursor-pointer"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-0.5 w-4.5 bg-[#261F1B]" />
                  <span className="h-0.5 w-4.5 bg-[#261F1B]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        {openMenu && (
          <div
            className="hidden border-b border-[#D7CCBD] bg-[#FFFDF8] shadow-2xl lg:block transition-all duration-200"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              {/* WHAT WE DO MEGA MENU */}
              {openMenu === "what-we-do" && (
                <div className="grid grid-cols-12 gap-8">
                  {/* 3 Columns: Consulting, Technology, Build */}
                  <div className="col-span-8 grid grid-cols-3 gap-6">
                    {/* CONSULTING */}
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#7D2639]" />
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                          Consulting
                        </p>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {[
                          { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation", desc: "Operating models & program modernization" },
                          { href: "/capabilities/enterprise-transformation", label: "Process Architecture", desc: "End-to-end workflow optimization" },
                          { href: "/capabilities/managed-delivery", label: "Program Delivery & Governance", desc: "Cutover control & PMO delivery" },
                          { href: "/capabilities/managed-delivery", label: "Managed Services", desc: "Production support & continuous evolution" },
                        ].map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="group block rounded-md p-1.5 -mx-1.5 hover:bg-[#FFFAF2] transition-colors"
                            >
                              <span className="block text-[0.84rem] font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-[0.7rem] text-[#695F57]">
                                {item.desc}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* TECHNOLOGY */}
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-[#7D2639]" />
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                          Technology
                        </p>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {[
                          { href: "/oracle", label: "Oracle Cloud Modernization", desc: "Fusion ERP, SCM, HCM & EPM" },
                          { href: "/ai-data", label: "AI & Data Engineering", desc: "Document intelligence & governed RAG" },
                          { href: "/capabilities/digital-engineering", label: "Cloud Platforms & Infra", desc: "Scalable zero-trust cloud foundations" },
                          { href: "/capabilities/digital-engineering", label: "API & Integration Hub", desc: "OIC & modern microservices bridges" },
                        ].map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="group block rounded-md p-1.5 -mx-1.5 hover:bg-[#FFFAF2] transition-colors"
                            >
                              <span className="block text-[0.84rem] font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-[0.7rem] text-[#695F57]">
                                {item.desc}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* BUILD */}
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#7D2639]" />
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                          Build
                        </p>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {[
                          { href: "/capabilities/digital-engineering", label: "Digital Engineering", desc: "Modern full-stack enterprise systems" },
                          { href: "/platforms", label: "Enterprise Portals & Platforms", desc: "Customer 360, ATS & Core HR suites" },
                          { href: "/capabilities/digital-engineering", label: "Experience & Product Design", desc: "Human-centered enterprise interfaces" },
                          { href: "/capabilities/managed-delivery", label: "Quality Engineering & Testing", desc: "Automated regression & validation" },
                        ].map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="group block rounded-md p-1.5 -mx-1.5 hover:bg-[#FFFAF2] transition-colors"
                            >
                              <span className="block text-[0.84rem] font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                                {item.label}
                              </span>
                              <span className="block text-[0.7rem] text-[#695F57]">
                                {item.desc}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Featured Panel: CONSULT AMERICA LABS */}
                  <div className="col-span-4 rounded-xl border border-[#D7CCBD] bg-[#FFFAF2] p-5.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639] flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#7D2639]" />
                          Consult America Labs
                        </span>
                        <span className="text-[0.65rem] font-semibold text-[#657766] uppercase tracking-wider">
                          Product R&amp;D
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#695F57]">
                        Turning recurring enterprise operational gaps into focused software applications.
                      </p>

                      <div className="mt-4 space-y-2">
                        {[
                          { href: "/work/innovation/data-agent", label: "Data Agent", detail: "AI Contract & Document Intelligence", tag: "AI Flagship" },
                          { href: "/work/innovation/mediguide-ai", label: "MediGuide AI", detail: "Clinical Evidence & Patient Summaries", tag: "HealthTech" },
                          { href: "/platforms/crm", label: "CRM Workspace", detail: "Connected Customer 360 & Pipeline", tag: "Enterprise" },
                          { href: "/platforms/ats", label: "ATS & Talent Suite", detail: "Applicant Tracking & Convert to Hire", tag: "Workforce" },
                        ].map((prod) => (
                          <Link
                            key={prod.label}
                            href={prod.href}
                            onClick={() => setOpenMenu(null)}
                            className="group/p flex items-center justify-between rounded-lg border border-[#D7CCBD]/80 bg-[#FFFDF8] p-2.5 transition-all hover:border-[#7D2639]/40 hover:bg-[#F4EFE6]"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#261F1B] group-hover/p:text-[#7D2639] transition-colors">
                                  {prod.label}
                                </span>
                                <span className="rounded bg-[#DFE4DA] px-1.5 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                                  {prod.tag}
                                </span>
                              </div>
                              <p className="text-[0.68rem] text-[#695F57]">
                                {prod.detail}
                              </p>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#7D2639] opacity-0 group-hover/p:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D7CCBD]">
                      <Link
                        href="/work/innovation"
                        onClick={() => setOpenMenu(null)}
                        className="ca-link text-xs font-semibold text-[#7D2639] inline-flex items-center gap-1"
                      >
                        Explore all innovation software →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS MEGA MENU */}
              {openMenu === "applications" && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#D7CCBD]">
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                        Enterprise Platform Suite &amp; Software Products
                      </p>
                      <p className="text-xs text-[#695F57] mt-0.5">
                        Connected operational applications built and deployed by Consult America
                      </p>
                    </div>
                    <Link
                      href="/platforms"
                      onClick={() => setOpenMenu(null)}
                      className="text-xs font-semibold text-[#7D2639] hover:underline"
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
                        className="group block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4 transition-all hover:border-[#7D2639]/40 hover:bg-[#FFFAF2] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                            {item.label}
                          </h4>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#7D2639] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-[#695F57]">
                          {item.detail}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* INDUSTRIES MEGA MENU */}
              {openMenu === "industries" && (
                <div>
                  <div className="pb-4 border-b border-[#D7CCBD]">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      Industry Practices
                    </p>
                    <p className="text-xs text-[#695F57] mt-0.5">
                      Tailored regulatory frameworks, compliance boundaries, and proven delivery accelerators
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {industryLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4.5 transition-all hover:border-[#7D2639]/40 hover:bg-[#FFFAF2] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                            {item.label}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#7D2639] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-[#695F57]">
                          {item.detail}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPANY MEGA MENU */}
              {openMenu === "company" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-4">
                    {[
                      { href: "/about", label: "About Consult America", desc: "Our mission, consulting model, and production focus" },
                      { href: "/about", label: "Delivery Philosophy", desc: "Senior practitioners attached directly to client outcomes" },
                      { href: "/about", label: "National Delivery Centers", desc: "Hubs across Washington DC, New York, Chicago, Dallas & SF" },
                      { href: "/careers", label: "Careers & Open Roles", desc: "Join senior teams delivering high-stakes transformation" },
                      { href: "/insights", label: "Insights & Publications", desc: "Executive perspectives on Oracle, AI, and digital engineering" },
                      { href: "/contact", label: "Contact Practice Leads", desc: "Schedule a scoping and architecture session" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4 transition-all hover:border-[#7D2639]/40 hover:bg-[#FFFAF2] shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                            {item.label}
                          </h4>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#7D2639] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-[#695F57]">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#D7CCBD] bg-[#2B2420] text-[#F7F3EC] p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                        CONSULT AMERICA
                      </span>
                      <h4 className="mt-2 font-serif text-xl font-semibold text-white">
                        Built for execution, not just advice.
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#C5BCB3]">
                        From strategic operating models to production software deployment, we partner with enterprises to turn complex technology programs into working reality.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#52443D]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          setContactOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors cursor-pointer"
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
