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
      ? "border-[#D7CCBD] bg-[#F4EFE6]/96 shadow-[0_4px_20px_rgba(38,31,27,0.06)] backdrop-blur-[12px]"
      : "border-[#D7CCBD] bg-[#F4EFE6]";

  return (
    <>
      <header
        className="sticky top-0 z-50"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="hidden bg-[#2B2420] md:block">
          <Link
            href={announcement.href}
            className="ca-shell flex items-center justify-center gap-3 py-1.5 text-center text-[0.72rem] tracking-[0.04em] text-[#F7F0E7] transition-colors hover:text-[#D8C5AA]"
          >
            <span>{announcement.text}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#D8C5AA]" />
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
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
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
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
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
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
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
                  className="ca-nav-link flex items-center gap-1 text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639] cursor-pointer"
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
                    className="ca-nav-link text-[0.9125rem] font-medium text-[#261F1B] hover:text-[#7D2639]"
                    onMouseEnter={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="hidden min-h-10 items-center px-3 text-[0.875rem] font-medium text-[#695F57] transition-colors hover:text-[#7D2639] xl:inline-flex"
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
                  className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] xl:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-px w-4.5 bg-[#261F1B]" />
                  <span className="h-px w-4.5 bg-[#261F1B]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        {openMenu && (
          <div
            className="hidden border-b border-[#D7CCBD] bg-[#FFFDF8] shadow-xl xl:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="ca-shell py-8">
              {/* Consulting Mega Menu */}
              {openMenu === "consulting" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D2639]">
                      Transformation
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {consultingGroups.transformation.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm font-medium text-[#261F1B] transition-colors hover:text-[#7D2639]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D2639]">
                      Delivery
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {consultingGroups.delivery.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm font-medium text-[#261F1B] transition-colors hover:text-[#7D2639]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#D7CCBD] bg-[#F0E8DC] p-5">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      Featured Case Study
                    </span>
                    <h4 className="mt-2 text-base font-semibold text-[#261F1B]">
                      {consultingGroups.featured.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#695F57]">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D2639]">
                      Platforms &amp; Apps
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {technologyGroups.platforms.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm font-medium text-[#261F1B] transition-colors hover:text-[#7D2639]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7D2639]">
                      Engineering &amp; Cloud
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {technologyGroups.engineering.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-sm font-medium text-[#261F1B] transition-colors hover:text-[#7D2639]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-4 rounded-xl border border-[#D7CCBD] bg-[#DFE4DA] p-5">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      Innovation Flagship
                    </span>
                    <h4 className="mt-2 text-base font-semibold text-[#261F1B]">
                      {technologyGroups.innovation.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#695F57]">
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
                <div className="grid grid-cols-3 gap-5">
                  {platformLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4 transition-all hover:border-[#7D2639]/40 hover:bg-[#FFFAF2]"
                    >
                      <h4 className="text-sm font-semibold text-[#261F1B] group-hover:text-[#7D2639]">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-xs text-[#695F57]">
                        {item.detail}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Industries Mega Menu */}
              {openMenu === "industries" && (
                <div className="grid max-w-3xl grid-cols-2 gap-x-12 gap-y-3.5">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium text-[#261F1B] transition-colors hover:text-[#7D2639]"
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
