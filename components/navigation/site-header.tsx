"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";

import Container from "@/components/layout/container";
import MobileMenu from "@/components/navigation/mobile-menu";

const navItems = [
  {
    label: "Capabilities",
    href: "/capabilities",
    hasMegaMenu: true,
  },
  {
    label: "Industries",
    href: "/industries",
    hasMegaMenu: false,
  },
  {
    label: "Oracle",
    href: "/oracle",
    hasMegaMenu: false,
  },
  {
    label: "AI & Data",
    href: "/ai-data",
    hasMegaMenu: false,
  },
  {
    label: "Projects",
    href: "/projects",
    hasMegaMenu: false,
  },
  {
    label: "Insights",
    href: "/insights",
    hasMegaMenu: false,
  },
  {
    label: "About",
    href: "/about",
    hasMegaMenu: false,
  },
  {
    label: "Careers",
    href: "/careers",
    hasMegaMenu: false,
  },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-black/5 bg-[var(--ca-off-white)]/95 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <Container>
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="relative z-10 text-[15px] font-semibold tracking-[0.14em]"
              aria-label="ConsultAmerica homepage"
            >
              CONSULTAMERICA
            </Link>

            <nav
              className="hidden items-center gap-6 xl:flex"
              aria-label="Primary navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ca-nav-link flex items-center gap-1 text-sm font-medium"
                >
                  {item.label}

                  {item.hasMegaMenu && (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-5 xl:flex">
              <Link
                href="/login"
                className="text-sm font-medium transition-opacity hover:opacity-60"
              >
                Employee Login
              </Link>

              <Link
                href="/contact"
                className="ca-button-dark ca-header-cta min-h-11 px-5 text-sm"
              >
                Let&apos;s Talk
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
