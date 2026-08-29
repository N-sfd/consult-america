"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import {
  announcement,
  consultingGroups,
  technologyGroups,
  platformLinks,
  industryLinks,
  navLinks,
} from "@/lib/site-data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "consulting" | "technology" | "platforms" | "industries" | null
  >(null);
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
      ? "border-[var(--ca-header-border)] bg-white/95 shadow-[0_2px_16px_rgba(8,26,47,0.05)] backdrop-blur-[12px]"
      : "border-[var(--ca-header-border)] bg-white";

  return (
    <>
      <header
        className="sticky top-0 z-50"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="hidden bg-[var(--ca-navy)] md:block">
          <Link
            href={announcement.href}
            className="ca-shell flex items-center justify-center gap-3 py-1.5 text-center text-[0.72rem] tracking-[0.04em] text-white/85 transition-opacity hover:opacity-75"
          >
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div
          className={`border-b transition-[background,border-color,box-shadow] duration-200 ${headerSurface}`}
        >
          <div className="ca-shell">
            <div className="flex h-16 items-center justify-between gap-4 xl:h-[72px]">
              <BrandLogo tone="dark" priority />

              <nav
                className="hidden items-center justify-center gap-5.5 2xl:gap-7 xl:flex"
                aria-label="Primary navigation"
              >
                {/* Consulting Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "consulting"}
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium cursor-pointer"
                  onMouseEnter={() => setOpenMenu("consulting")}
                  onClick={() =>
                    setOpenMenu(openMenu === "consulting" ? null : "consulting")
                  }
                >
                  Consulting
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {/* Technology Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "technology"}
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium cursor-pointer"
                  onMouseEnter={() => setOpenMenu("technology")}
                  onClick={() =>
                    setOpenMenu(openMenu === "technology" ? null : "technology")
                  }
                >
                  Technology
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {/* Platforms Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "platforms"}
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium cursor-pointer"
                  onMouseEnter={() => setOpenMenu("platforms")}
                  onClick={() =>
                    setOpenMenu(openMenu === "platforms" ? null : "platforms")
                  }
                >
                  Platforms
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {/* Industries Dropdown */}
                <button
                  type="button"
                  data-open={openMenu === "industries"}
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium cursor-pointer"
                  onMouseEnter={() => setOpenMenu("industries")}
                  onClick={() =>
                    setOpenMenu(openMenu === "industries" ? null : "industries")
                  }
                >
                  Industries
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ca-nav-link text-[0.9125rem] font-medium"
                    onMouseEnter={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="hidden min-h-10 items-center px-3 text-[0.875rem] font-medium text-[var(--ca-slate)] transition-colors hover:text-[var(--ca-blue)] xl:inline-flex"
                >
                  Employee Login
                </Link>

                <Link
                  href="/careers"
                  className="ca-nav-link hidden text-[0.9125rem] md:inline-flex xl:hidden"
                >
                  Careers
                </Link>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-10 !px-4 text-sm font-semibold md:!inline-flex"
                >
                  Contact
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--ca-border)] xl:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-px w-4.5 bg-[var(--ca-navy)]" />
                  <span className="h-px w-4.5 bg-[var(--ca-navy)]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        {openMenu && (
          <div
            className="hidden border-b border-[var(--ca-header-border)] bg-white shadow-xl xl:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              {/* Consulting Mega Menu */}
              {openMenu === "consulting" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                      Transformation
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {consultingGroups.transformation.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm text-[var(--ca-text-primary)] transition-colors hover:text-[var(--ca-blue)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                      Delivery
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {consultingGroups.delivery.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm text-[var(--ca-text-primary)] transition-colors hover:text-[var(--ca-blue)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[var(--ca-border)] bg-[var(--ca-cloud)] p-5">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                      Featured Case Study
                    </span>
                    <h4 className="mt-2 text-base font-semibold text-[var(--ca-navy)]">
                      {consultingGroups.featured.title}
                    </h4>
                    <p className="mt-1 text-xs text-[var(--ca-slate)]">
                      {consultingGroups.featured.detail}
                    </p>
                    <Link
                      href={consultingGroups.featured.href}
                      className="ca-link mt-4 inline-flex text-xs font-semibold"
                    >
                      Read case study
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Technology Mega Menu */}
              {openMenu === "technology" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                      Platforms &amp; Apps
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {technologyGroups.platforms.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm text-[var(--ca-text-primary)] transition-colors hover:text-[var(--ca-blue)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-dim)]">
                      Engineering &amp; Cloud
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {technologyGroups.engineering.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm text-[var(--ca-text-primary)] transition-colors hover:text-[var(--ca-blue)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[var(--ca-border)] bg-[var(--ca-cloud)] p-5">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                      Innovation Flagship
                    </span>
                    <h4 className="mt-2 text-base font-semibold text-[var(--ca-navy)]">
                      {technologyGroups.innovation.title}
                    </h4>
                    <p className="mt-1 text-xs text-[var(--ca-slate)]">
                      {technologyGroups.innovation.detail}
                    </p>
                    <Link
                      href={technologyGroups.innovation.href}
                      className="ca-link mt-4 inline-flex text-xs font-semibold"
                    >
                      Explore platform
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Platforms Mega Menu */}
              {openMenu === "platforms" && (
                <div className="grid grid-cols-3 gap-6">
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group block rounded-xl border border-[var(--ca-border)] p-4 transition-all hover:border-[var(--ca-blue)]/40 hover:bg-[var(--ca-cloud)]"
                    >
                      <h4 className="text-sm font-semibold text-[var(--ca-navy)] group-hover:text-[var(--ca-blue)]">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-xs text-[var(--ca-slate)]">
                        {item.detail}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Industries Mega Menu */}
              {openMenu === "industries" && (
                <div className="grid max-w-3xl grid-cols-2 gap-x-12 gap-y-3">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm text-[var(--ca-text-primary)] transition-colors hover:text-[var(--ca-blue)]"
                    >
                      {item.label}
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
