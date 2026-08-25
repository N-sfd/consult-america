"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

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
        className="fixed inset-x-0 top-0 z-50"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="bg-[#05070d]">
          <Link
            href={announcement.href}
            className="ca-shell flex items-center justify-center gap-3 py-2 text-center text-[0.72rem] tracking-[0.04em] text-white/80 transition-opacity hover:opacity-70 sm:text-[0.8rem]"
          >
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div
          className={`border-b transition-colors duration-300 ${
            scrolled || openMenu
              ? "border-white/10 bg-black"
              : "border-transparent bg-black/20"
          }`}
        >
          <div className="ca-shell">
            <div className="ca-grid h-[4.5rem] items-center">
            <Link
              href="/"
              className="col-span-5 text-[0.95rem] font-semibold tracking-[0.08em] sm:col-span-4 sm:text-[1.05rem] xl:col-span-3"
              aria-label="ConsultAmerica homepage"
            >
              CONSULTAMERICA
            </Link>

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
                Capabilities
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
                <Link href="/capabilities" className="ca-nav-link whitespace-nowrap">
                  Capabilities
                </Link>
                <Link
                  href="/projects"
                  className="ca-nav-link hidden whitespace-nowrap min-[420px]:inline-flex"
                >
                  Projects
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
                className="hidden text-sm text-white/70 transition-opacity hover:opacity-100 xl:inline"
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
                <span className="h-px w-5 bg-white" />
                <span className="h-px w-5 bg-white" />
              </button>
            </div>
            </div>
          </div>
        </div>

        {openMenu && (
          <div
            className="hidden border-t border-white/10 bg-black xl:block"
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
                      className="ca-nav-link text-lg text-white/75 hover:text-white"
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
                      <Link href={group.href} className="text-sm">
                        {group.title}
                      </Link>
                      <div className="mt-4 space-y-2">
                        {group.services.map((service) => (
                          <Link
                            key={service.label}
                            href={service.href}
                            className="block text-sm text-white/50 transition-colors hover:text-white"
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
