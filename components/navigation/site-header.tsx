"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import MobileMenu from "@/components/navigation/mobile-menu";
import {
  aiDataMegaMenu,
  engineeringMegaMenu,
  industryLinks,
  oracleMegaMenu,
  transformationMegaMenu,
  whatWeDoMegaMenu,
} from "@/lib/site-data";

type MenuType =
  | "transformation"
  | "oracle"
  | "crm"
  | "ai-data"
  | "engineering"
  | "industries"
  | "company"
  | null;

const utilityLinks = [
  { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation" },
  { href: "/oracle", label: "Oracle" },
  { href: "/ai-data", label: "AI" },
  { href: "/capabilities/digital-engineering", label: "Application Engineering" },
];

const crmJourney = [
  { label: "Discover", detail: "Account intelligence" },
  { label: "Engage", detail: "Multi-channel outreach" },
  { label: "Sell", detail: "Pipeline governance" },
  { label: "Serve", detail: "Service automation" },
  { label: "Expand", detail: "Lifecycle expansion" },
];

function NavButton({
  label,
  menuKey,
  openMenu,
  setOpenMenu,
}: {
  label: string;
  menuKey: MenuType;
  openMenu: MenuType;
  setOpenMenu: (menu: MenuType) => void;
}) {
  return (
    <button
      type="button"
      data-open={openMenu === menuKey}
      className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[14px] font-medium text-[#122D2E] hover:text-[#B83A3A] cursor-pointer"
      onMouseEnter={() => setOpenMenu(menuKey)}
      onClick={() => setOpenMenu(openMenu === menuKey ? null : menuKey)}
      aria-expanded={openMenu === menuKey}
    >
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200" />
    </button>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
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

  const headerSurface =
    scrolled || openMenu || drawerOpen
      ? "bg-white/96 backdrop-blur-[12px] border-b border-[rgba(7,59,58,0.08)] shadow-[0_4px_20px_rgba(7,59,58,0.04)]"
      : "bg-white/96 backdrop-blur-[12px] border-b border-[rgba(7,59,58,0.08)]";

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="hidden h-7 border-b border-[#052F2E] bg-[#073B3A] text-[11px] font-medium text-white/88 lg:block">
          <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-8 xl:px-10">
            <div className="flex items-center gap-4">
              {utilityLinks.map((link, idx) => (
                <span key={link.href + link.label} className="flex items-center gap-4">
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                  {idx < utilityLinks.length - 1 && (
                    <span className="text-white/30" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <Link href="/careers" className="transition-colors hover:text-white">
                Careers
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className={`transition-[background,border-color,box-shadow] duration-200 ${headerSurface}`}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
            <div className="flex h-[76px] items-center justify-between gap-6">
              <BrandLogo tone="dark" />

              <nav
                className="hidden items-center justify-center gap-[26px] lg:flex flex-nowrap shrink-0"
                aria-label="Primary navigation"
              >
                <NavButton label="Transformation" menuKey="transformation" openMenu={openMenu} setOpenMenu={setOpenMenu} />
                <NavButton label="Oracle" menuKey="oracle" openMenu={openMenu} setOpenMenu={setOpenMenu} />
                <NavButton label="CRM" menuKey="crm" openMenu={openMenu} setOpenMenu={setOpenMenu} />
                <NavButton label="AI & Data" menuKey="ai-data" openMenu={openMenu} setOpenMenu={setOpenMenu} />
                <NavButton label="Engineering" menuKey="engineering" openMenu={openMenu} setOpenMenu={setOpenMenu} />
                <NavButton label="Industries" menuKey="industries" openMenu={openMenu} setOpenMenu={setOpenMenu} />
              </nav>

              <div className="hidden items-center gap-[26px] lg:flex shrink-0">
                <Link
                  href="/work"
                  className="ca-nav-link whitespace-nowrap text-[14px] font-medium text-[#122D2E] hover:text-[#B83A3A]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Work
                </Link>
                <Link
                  href="/insights"
                  className="ca-nav-link whitespace-nowrap text-[14px] font-medium text-[#122D2E] hover:text-[#B83A3A]"
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  Insights
                </Link>
                <button
                  type="button"
                  data-open={openMenu === "company"}
                  className="ca-nav-link whitespace-nowrap flex items-center gap-1 text-[14px] font-medium text-[#122D2E] hover:text-[#B83A3A] cursor-pointer"
                  onMouseEnter={() => setOpenMenu("company")}
                  onClick={() => setOpenMenu(openMenu === "company" ? null : "company")}
                  aria-expanded={openMenu === "company"}
                >
                  <span>Company</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary hidden !min-h-[44px] !px-5 text-xs sm:text-sm font-semibold sm:!inline-flex cursor-pointer whitespace-nowrap"
                >
                  <span>Talk to an Expert</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#DCE4E1] bg-white lg:hidden cursor-pointer"
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
          <div
            className="hidden border-t border-[#DCE4E1] bg-white shadow-[0_18px_50px_rgba(7,59,58,0.08)] lg:block"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 py-8">
              {openMenu === "transformation" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                      TRANSFORMATION
                    </p>
                    <ul className="mt-4 space-y-2">
                      {transformationMegaMenu.links.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="block py-1 text-sm text-[#122D2E] hover:text-[#B83A3A] transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-7 rounded-xl border border-[#DCE4E1] bg-[#F0F6F4] overflow-hidden grid grid-cols-2">
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                          FEATURED
                        </span>
                        <h4 className="mt-2 font-serif text-xl font-semibold text-[#073B3A]">
                          {transformationMegaMenu.featured.title}
                        </h4>
                        <p className="mt-2 text-sm text-[#5B6D6B] leading-relaxed">
                          {transformationMegaMenu.featured.detail}
                        </p>
                      </div>
                      <Link
                        href={transformationMegaMenu.featured.href}
                        onClick={() => setOpenMenu(null)}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]"
                      >
                        Explore Transformation <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="relative min-h-[200px]">
                      <Image
                        src={transformationMegaMenu.featured.image}
                        alt="Enterprise transformation program delivery"
                        fill
                        className="object-cover object-top"
                        sizes="400px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {openMenu === "oracle" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">TRANSFORM</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {oracleMegaMenu.transform.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">CONNECT</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {oracleMegaMenu.connect.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">DELIVER</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {oracleMegaMenu.deliver.map((item) => (
                          <li key={item.label}>
                            <Link href={item.href} onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-span-4 rounded-xl border border-[#DCE4E1] bg-[#F0F6F4] p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">FEATURED</span>
                      <h4 className="mt-2 font-serif text-lg font-semibold text-[#073B3A]">
                        {oracleMegaMenu.featured.title}
                      </h4>
                      <p className="mt-2 text-sm text-[#5B6D6B]">{oracleMegaMenu.featured.detail}</p>
                    </div>
                    <Link
                      href={oracleMegaMenu.featured.href}
                      onClick={() => setOpenMenu(null)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]"
                    >
                      Explore Oracle <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {openMenu === "crm" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-7">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">CUSTOMER JOURNEY</p>
                    <div className="mt-4 grid grid-cols-5 gap-3">
                      {crmJourney.map((step) => (
                        <div key={step.label} className="border-t-2 border-[#9BC4B8] pt-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#073B3A]">{step.label}</p>
                          <p className="mt-1 text-xs text-[#5B6D6B]">{step.detail}</p>
                        </div>
                      ))}
                    </div>
                    <ul className="mt-6 space-y-2 text-sm">
                      <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">Customer 360 Workspace</Link></li>
                      <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">Salesforce &amp; Oracle Integration</Link></li>
                      <li><Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="text-[#122D2E] hover:text-[#B83A3A]">Revenue Cloud &amp; CPQ</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-5 rounded-xl border border-[#DCE4E1] bg-[#F0F6F4] p-6">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">CONNECTED CRM</span>
                    <h4 className="mt-2 font-serif text-lg font-semibold text-[#073B3A]">
                      Connect every customer moment to the enterprise behind it.
                    </h4>
                    <Link href="/platforms/crm" onClick={() => setOpenMenu(null)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                      Explore CRM <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {openMenu === "ai-data" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">AI &amp; DATA</p>
                    <ul className="mt-4 space-y-2">
                      {aiDataMegaMenu.links.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={() => setOpenMenu(null)} className="block py-1 text-sm text-[#122D2E] hover:text-[#B83A3A]">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-7 rounded-xl border border-[#DCE4E1] overflow-hidden grid grid-cols-2 bg-[#F0F6F4]">
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">FEATURED</span>
                        <h4 className="mt-2 font-serif text-xl font-semibold text-[#073B3A]">{aiDataMegaMenu.featured.title}</h4>
                        <p className="mt-2 text-sm text-[#5B6D6B]">{aiDataMegaMenu.featured.detail}</p>
                      </div>
                      <Link href={aiDataMegaMenu.featured.href} onClick={() => setOpenMenu(null)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                        Explore Data Agent <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="relative min-h-[200px]">
                      <Image
                        src={aiDataMegaMenu.featured.image}
                        alt="Data Agent document intelligence screenshot"
                        fill
                        className="object-cover object-top"
                        sizes="400px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {openMenu === "engineering" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">ENGINEERING</p>
                    <ul className="mt-4 space-y-2">
                      {engineeringMegaMenu.links.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href} onClick={() => setOpenMenu(null)} className="block py-1 text-sm text-[#122D2E] hover:text-[#B83A3A]">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-7 rounded-xl border border-[#DCE4E1] bg-[#E1ECE8] p-6">
                    <div className="flex items-center justify-between border-b border-[#DCE4E1] pb-3">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                        Consult America Labs
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {whatWeDoMegaMenu.labs.products.slice(0, 4).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="rounded-lg border border-transparent bg-white p-3 transition-all hover:border-[#DCE4E1] hover:shadow-sm"
                        >
                          <p className="text-sm font-semibold text-[#073B3A]">{item.label}</p>
                          <p className="mt-0.5 text-xs text-[#5B6D6B]">{item.detail}</p>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={whatWeDoMegaMenu.labs.ctaHref}
                      onClick={() => setOpenMenu(null)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]"
                    >
                      Explore Applications <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {openMenu === "industries" && (
                <div className="grid grid-cols-3 gap-4">
                  {industryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group rounded-xl border border-[#DCE4E1] bg-white p-4 transition-all hover:border-[#176A63]/30 hover:shadow-sm"
                    >
                      <p className="text-sm font-semibold text-[#073B3A] group-hover:text-[#B83A3A]">{item.label}</p>
                      <p className="mt-1 text-xs text-[#5B6D6B]">{item.detail}</p>
                    </Link>
                  ))}
                </div>
              )}

              {openMenu === "company" && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { href: "/about", label: "About Consult America", desc: "Our firm and delivery focus" },
                    { href: "/about", label: "Delivery Philosophy", desc: "Senior practitioners on outcomes" },
                    { href: "/careers", label: "Careers", desc: "Join our consulting teams" },
                    { href: "/insights", label: "Insights", desc: "Executive perspectives" },
                    { href: "/contact", label: "Contact", desc: "Speak with practice leads" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group rounded-xl border border-[#DCE4E1] bg-white p-4 hover:border-[#176A63]/30"
                    >
                      <p className="text-sm font-semibold text-[#073B3A] group-hover:text-[#B83A3A]">{item.label}</p>
                      <p className="mt-1 text-xs text-[#5B6D6B]">{item.desc}</p>
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
