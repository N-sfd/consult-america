"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import MegaMenuPanels, { type MegaMenuKey } from "@/components/navigation/mega-menu-panels";
import MobileMenu from "@/components/navigation/mobile-menu";
import { useContactPanel } from "@/components/providers/contact-provider";

const navItems: { label: string; key: MegaMenuKey }[] = [
  { label: "Solutions", key: "solutions" },
  { label: "Oracle", key: "oracle" },
  { label: "AI & Data", key: "ai-data" },
  { label: "Applications", key: "applications" },
  { label: "Industries", key: "industries" },
  { label: "Resources", key: "resources" },
  { label: "Company", key: "company" },
];

function NavButton({
  label,
  menuKey,
  openMenu,
  setOpenMenu,
}: {
  label: string;
  menuKey: MegaMenuKey;
  openMenu: MegaMenuKey | null;
  setOpenMenu: (menu: MegaMenuKey | null) => void;
}) {
  return (
    <button
      type="button"
      data-open={openMenu === menuKey}
      className="ca-nav-link flex cursor-pointer items-center gap-1 whitespace-nowrap text-[15px] font-medium text-[#122D2E]"
      onMouseEnter={() => setOpenMenu(menuKey)}
      onClick={() => setOpenMenu(openMenu === menuKey ? null : menuKey)}
      aria-expanded={openMenu === menuKey}
    >
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
    </button>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const { setOpen: setContactOpen } = useContactPanel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1280) setOpenMenu(null);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const headerSurface = scrolled || openMenu || drawerOpen
    ? "ca-header-scrolled border-b"
    : "ca-header-glass border-b";

  return (
    <>
      <header
        className="sticky top-0 z-[60] transition-[background,box-shadow,border-color] duration-300"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className={`relative ${headerSurface}`}>
          <div className="ca-header-container">
            <div className="ca-header-inner">
              <div className="ca-header-brand min-w-0">
                <ConsultAmericaLogo lockup="header" maxHeight="44px" maxWidth="min(235px, 28vw)" />
              </div>

              <nav
                className="ca-header-nav max-[1279px]:hidden min-[1280px]:flex"
                aria-label="Primary navigation"
              >
                {navItems.map((item) => (
                  <NavButton
                    key={item.key}
                    label={item.label}
                    menuKey={item.key}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                  />
                ))}
              </nav>

              <div className="ca-header-actions">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary ca-header-cta ca-header-cta--full items-center gap-2 text-sm font-semibold cursor-pointer"
                >
                  <span>Talk to an Expert</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary ca-header-cta ca-header-cta--tablet items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>Talk to an Expert</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-[#DCE4E1] bg-white max-[1279px]:flex min-[1280px]:hidden cursor-pointer shrink-0"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                >
                  <span className="h-0.5 w-4.5 bg-[#122D2E]" />
                  <span className="h-0.5 w-4.5 bg-[#122D2E]" />
                </button>
              </div>
            </div>
          </div>

          {openMenu && (
            <div className="pointer-events-none absolute inset-x-0 top-full z-[70] hidden min-[1280px]:block">
              <div
                className="ca-mega-surface pointer-events-auto"
                onMouseEnter={() => setOpenMenu(openMenu)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <div className="ca-mega-panel">
                  <MegaMenuPanels
                    activeMenu={openMenu}
                    onNavigate={() => setOpenMenu(null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
