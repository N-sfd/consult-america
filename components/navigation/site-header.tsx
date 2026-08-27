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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"industries" | "capabilities" | null>(
    null,
  );
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
      ? "border-[var(--ca-header-border)] bg-white/[0.94] shadow-[0_4px_24px_rgba(16,42,67,0.05)] backdrop-blur-[12px]"
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
            className="ca-shell flex items-center justify-center gap-3 py-2 text-center text-[0.72rem] tracking-[0.04em] text-white/85 transition-opacity hover:opacity-70"
          >
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div className={`border-b transition-[background,border-color,box-shadow] duration-300 ${headerSurface}`}>
          <div className="ca-shell">
            <div className="flex h-[60px] items-center justify-between gap-4 md:h-16 xl:h-[72px]">
              <BrandLogo tone="dark" priority />

              <nav
                className="hidden items-center justify-center gap-6 xl:flex"
                aria-label="Primary navigation"
              >
                <Link
                  href="/capabilities"
                  data-open={openMenu === "capabilities"}
                  className="ca-nav-link items-center gap-1 text-[0.9375rem]"
                  onMouseEnter={() => setOpenMenu("capabilities")}
                >
                  What We Do
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Link>
                <Link
                  href="/industries"
                  data-open={openMenu === "industries"}
                  className="ca-nav-link items-center gap-1 text-[0.9375rem]"
                  onMouseEnter={() => setOpenMenu("industries")}
                >
                  Industries
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Link>
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ca-nav-link text-[0.9375rem]"
                    onMouseEnter={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="hidden min-h-11 items-center px-2 text-[0.9375rem] text-[var(--ca-nav)] transition-colors hover:text-[var(--ca-blue)] xl:inline-flex"
                >
                  Employee Login
                </Link>

                <Link
                  href="/careers"
                  className="ca-nav-link hidden text-[0.9375rem] md:inline-flex xl:hidden"
                >
                  Careers
                </Link>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-10 !px-4 text-sm md:!inline-flex md:!min-h-11"
                >
                  Contact
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 xl:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
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
            <div className="ca-shell py-8">
              {openMenu === "industries" && (
                <div className="grid max-w-3xl grid-cols-2 gap-x-12 gap-y-3">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-base text-[var(--ca-nav)] transition-colors hover:text-[var(--ca-blue)]"
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
                      <div className="mt-3 space-y-2">
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

      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
