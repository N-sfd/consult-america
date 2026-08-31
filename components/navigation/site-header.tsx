"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import {
  whatWeDoMegaMenu,
  industryLinks,
  platformLinks,
} from "@/lib/site-data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"what-we-do" | "applications" | "industries" | null>(null);
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
      ? "border-[#E2E7EC] bg-[#F7F8FA]/98 shadow-[0_4px_24px_rgba(20,30,45,0.06)] backdrop-blur-[12px]"
      : "border-[#E2E7EC] bg-[#F7F8FA]";

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Top Utility Bar */}
        <div className="hidden border-b border-[#E2E7EC]/60 bg-[#FCFCFD] py-1.5 text-[0.75rem] font-medium text-[#475467] lg:block">
          <div className="ca-shell flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-[#B63838] font-semibold tracking-wide uppercase text-[0.68rem]">
                Enterprise Transformation · AI · Engineering
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/insights"
                className="transition-colors hover:text-[#B63838]"
              >
                Insights
              </Link>
              <Link
                href="/careers"
                className="transition-colors hover:text-[#B63838]"
              >
                Careers
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="cursor-pointer transition-colors hover:text-[#B63838]"
              >
                Contact
              </button>
              <span className="h-3 w-px bg-[#E2E7EC]" />
              <Link
                href="/login"
                className="font-semibold text-[#101828] transition-colors hover:text-[#B63838]"
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
                className="hidden items-center justify-center gap-4 xl:gap-5.5 2xl:gap-6.5 lg:flex"
                aria-label="Primary navigation"
              >
                {/* What We Do Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "what-we-do"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-semibold text-[#101828] hover:text-[#B63838] cursor-pointer"
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
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Oracle
                </Link>

                <Link
                  href="/platforms/crm"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  CRM &amp; Customer Experience
                </Link>

                <Link
                  href="/ai-data"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  AI &amp; Data
                </Link>

                {/* Applications Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "applications"}
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838] cursor-pointer"
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
                  className="ca-nav-link flex items-center gap-1 text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838] cursor-pointer"
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
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Our Work
                </Link>

                <Link
                  href="/about"
                  className="ca-nav-link text-[0.88rem] xl:text-[0.9125rem] font-medium text-[#101828] hover:text-[#B63838]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Company
                </Link>
              </nav>

              {/* Header Right CTA */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-10 !px-4 text-sm font-semibold sm:!inline-flex"
                >
                  Talk to an expert
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] lg:hidden cursor-pointer"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-0.5 w-4.5 bg-[#101828]" />
                  <span className="h-0.5 w-4.5 bg-[#101828]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Mega Menu Overlay */}
        {openMenu && (
          <div
            className="hidden border-b border-[#E2E7EC] bg-[#FFFFFF] shadow-2xl lg:block transition-all duration-200"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              {/* WHAT WE DO MEGA MENU */}
              {openMenu === "what-we-do" && (
                <div className="grid grid-cols-12 gap-6 xl:gap-8">
                  {/* Category Columns: TRANSFORM, MODERNIZE, INTELLIGENCE, BUILD, OPERATE */}
                  <div className="col-span-8 grid grid-cols-5 gap-4">
                    {/* TRANSFORM */}
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                        {whatWeDoMegaMenu.transform.category}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {whatWeDoMegaMenu.transform.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="block text-[0.82rem] font-medium leading-tight text-[#101828] transition-colors hover:text-[#B63838]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* MODERNIZE */}
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                        {whatWeDoMegaMenu.modernize.category}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {whatWeDoMegaMenu.modernize.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="block text-[0.82rem] font-medium leading-tight text-[#101828] transition-colors hover:text-[#B63838]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* INTELLIGENCE */}
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                        {whatWeDoMegaMenu.intelligence.category}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {whatWeDoMegaMenu.intelligence.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="block text-[0.82rem] font-medium leading-tight text-[#101828] transition-colors hover:text-[#B63838]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* BUILD */}
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                        {whatWeDoMegaMenu.build.category}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {whatWeDoMegaMenu.build.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="block text-[0.82rem] font-medium leading-tight text-[#101828] transition-colors hover:text-[#B63838]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* OPERATE */}
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                        {whatWeDoMegaMenu.operate.category}
                      </p>
                      <ul className="mt-3.5 space-y-2">
                        {whatWeDoMegaMenu.operate.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="block text-[0.82rem] font-medium leading-tight text-[#101828] transition-colors hover:text-[#B63838]"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Featured Panel: CONSULT AMERICA LABS */}
                  <div className="col-span-4 rounded-xl border border-[#E2E7EC] bg-[#EEF2F5] p-5.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                          {whatWeDoMegaMenu.labs.title}
                        </span>
                        <span className="text-[0.65rem] font-semibold text-[#5F7D75] uppercase tracking-wider">
                          Product R&amp;D
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#475467]">
                        {whatWeDoMegaMenu.labs.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {whatWeDoMegaMenu.labs.products.map((prod) => (
                          <Link
                            key={prod.label}
                            href={prod.href}
                            onClick={() => setOpenMenu(null)}
                            className="group/p flex items-center justify-between rounded-lg border border-[#E2E7EC]/80 bg-[#FFFFFF] p-2.5 transition-all hover:border-[#B63838]/40 hover:bg-[#FCFCFD]"
                          >
                            <div>
                              <span className="text-xs font-bold text-[#101828] group-hover/p:text-[#B63838] transition-colors">
                                {prod.label}
                              </span>
                              <p className="text-[0.68rem] text-[#475467]">
                                {prod.detail}
                              </p>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#B63838] opacity-0 group-hover/p:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E7EC]">
                      <Link
                        href={whatWeDoMegaMenu.labs.ctaHref}
                        onClick={() => setOpenMenu(null)}
                        className="ca-link text-xs font-semibold text-[#B63838] inline-flex items-center gap-1"
                      >
                        {whatWeDoMegaMenu.labs.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS MEGA MENU */}
              {openMenu === "applications" && (
                <div className="grid grid-cols-3 gap-5">
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group block rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-4 transition-all hover:border-[#B63838]/40 hover:bg-[#FCFCFD]"
                    >
                      <h4 className="text-sm font-bold text-[#101828] group-hover:text-[#B63838] transition-colors">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-xs text-[#475467]">
                        {item.detail}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* INDUSTRIES MEGA MENU */}
              {openMenu === "industries" && (
                <div className="grid max-w-3xl grid-cols-2 gap-x-12 gap-y-4">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-center justify-between text-sm font-semibold text-[#101828] transition-colors hover:text-[#B63838]"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#B63838]" />
                    </Link>
                  ))}
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
