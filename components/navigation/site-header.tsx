"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import {
  announcement,
  capabilityGroups,
  industryLinks,
  navLinks,
} from "@/lib/site-data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"industries" | "capabilities" | null>(
    null,
  );
  const { setOpen: setContactOpen } = useContactPanel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="bg-[var(--ca-navy)]">
          <Link
            href={announcement.href}
            className="ca-shell flex items-center justify-center gap-3 py-2 text-center text-[0.72rem] tracking-[0.04em] text-white/85 transition-opacity hover:opacity-70 sm:text-[0.8rem]"
          >
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div
          className={`border-b transition-[background,border-color,box-shadow] duration-300 ${
            scrolled || openMenu
              ? "border-[var(--ca-header-border)] bg-white/92 shadow-[0_8px_30px_rgba(16,42,67,0.06)] backdrop-blur-[18px]"
              : "border-[var(--ca-header-border)] bg-white"
          }`}
        >
          <div className="ca-shell">
            <div className="ca-grid h-[4.5rem] items-center">
              <div className="col-span-5 sm:col-span-4 xl:col-span-3">
                <BrandLogo tone="dark" priority />
              </div>

              <nav
                className="col-span-6 hidden items-center justify-center gap-7 xl:flex"
                aria-label="Primary navigation"
              >
                <Link
                  href="/industries"
                  data-open={openMenu === "industries"}
                  className="ca-nav-link items-center gap-1 text-[0.95rem]"
                  onMouseEnter={() => setOpenMenu("industries")}
                >
                  Industries
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Link>

                <Link
                  href="/capabilities"
                  data-open={openMenu === "capabilities"}
                  className="ca-nav-link items-center gap-1 text-[0.95rem]"
                  onMouseEnter={() => setOpenMenu("capabilities")}
                >
                  What We Do
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Link>

                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ca-nav-link text-[0.95rem]"
                    onMouseEnter={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="col-span-7 ml-auto flex items-center justify-end gap-3 sm:col-span-8 sm:gap-4 xl:col-span-3">
                <nav
                  className="flex items-center gap-3 text-[0.72rem] sm:gap-4 sm:text-[0.85rem] xl:hidden"
                  aria-label="Quick navigation"
                >
                  <Link
                    href="/capabilities"
                    className="ca-nav-link whitespace-nowrap"
                  >
                    What We Do
                  </Link>
                  <Link
                    href="/projects"
                    className="ca-nav-link hidden whitespace-nowrap min-[420px]:inline-flex"
                  >
                    Work
                  </Link>
                  <Link
                    href="/insights"
                    className="ca-nav-link hidden whitespace-nowrap sm:inline-flex"
                  >
                    Insights
                  </Link>
                </nav>
                <Link
                  href="/login"
                  className="hidden text-sm text-[var(--ca-nav)] transition-colors hover:text-[var(--ca-blue)] xl:inline"
                >
                  Employee Login
                </Link>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary !min-h-9 !px-3 text-xs sm:!min-h-11 sm:!px-5 sm:text-sm"
                >
                  Contact
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 xl:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={mobileOpen}
                >
                  <span className="h-px w-5 bg-[var(--ca-navy)]" />
                  <span className="h-px w-5 bg-[var(--ca-navy)]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {openMenu && (
          <div
            className="hidden border-b border-[var(--ca-header-border)] bg-white xl:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-10">
              {openMenu === "industries" && (
                <div className="grid max-w-3xl grid-cols-2 gap-x-12 gap-y-4">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg text-[var(--ca-nav)] transition-colors hover:text-[var(--ca-blue)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              {openMenu === "capabilities" && (
                <div className="grid grid-cols-5 gap-8">
                  {capabilityGroups.map((group) => (
                    <div key={group.title}>
                      <Link
                        href={group.href}
                        className="text-sm font-medium text-[var(--ca-navy)]"
                      >
                        {group.title}
                      </Link>
                      <div className="mt-4 space-y-2">
                        {group.services.map((service) => (
                          <Link
                            key={service.label}
                            href={service.href}
                            className="block text-sm text-[var(--ca-text-secondary)] transition-colors hover:text-[var(--ca-blue)]"
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
