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
        <Link
          href={announcement.href}
          className="flex items-center justify-center gap-3 bg-black px-4 py-2 text-center text-[0.72rem] tracking-[0.04em] text-white/80 transition-opacity hover:opacity-70 sm:text-[0.8rem]"
        >
          <span>{announcement.text}</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </Link>

        <div
          className={`border-b transition-colors duration-300 ${
            scrolled || openMenu
              ? "border-white/10 bg-black"
              : "border-transparent bg-black/20"
          }`}
        >
          <div className="mx-auto flex h-[4.25rem] max-w-[94.5em] items-center justify-between px-5 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="text-[1.05rem] font-normal tracking-[0.08em]"
              aria-label="ConsultAmerica homepage"
            >
              CONSULTAMERICA
            </Link>

            <nav
              className="hidden items-center gap-7 xl:flex"
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

            <div className="hidden items-center gap-6 xl:flex">
              <Link
                href="/login"
                className="text-sm text-white/70 transition-opacity hover:opacity-100"
              >
                Employee Login
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="ca-button-primary"
              >
                Contact
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

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

        {openMenu && (
          <div
            className="hidden border-t border-white/10 bg-black xl:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="mx-auto max-w-[94.5em] px-12 py-10">
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
