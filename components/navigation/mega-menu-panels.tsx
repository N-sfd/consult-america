"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Briefcase,
  Building2,
  Cpu,
  Database,
  FileText,
  Landmark,
  LayoutGrid,
  Network,
  Newspaper,
  Rocket,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

import {
  aiDataMegaMenuGrouped,
  applicationsMegaMenu,
  companyMegaMenu,
  industryLinks,
  oracleMegaMenuGrouped,
  resourcesMegaMenu,
  solutionsMegaMenu,
} from "@/lib/site-data";

const menuIconsByTitle: Record<string, ComponentType<{ className?: string }>> = {
  Solutions: LayoutGrid,
  Transform: Rocket,
  Finance: Landmark,
  Operations: Settings,
  Platform: Network,
  AI: Sparkles,
  Data: Database,
  Build: Cpu,
  Products: Boxes,
  Workforce: Users,
};

function iconForLink(sectionTitle: string, index: number) {
  const Icon = menuIconsByTitle[sectionTitle];
  if (Icon) return Icon;
  const fallback = [FileText, Newspaper, Briefcase, Building2];
  return fallback[index % fallback.length];
}

export type MegaMenuKey =
  | "solutions"
  | "oracle"
  | "ai-data"
  | "applications"
  | "industries"
  | "resources"
  | "company";

function LinkList({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { href: string; label: string }[];
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">{title}</p>
      <ul className="mt-2 space-y-0.5">
        {links.map((item, index) => {
          const Icon = iconForLink(title, index);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-2 -mx-2 text-sm text-[#122D2E] transition-colors hover:bg-[#F0F6F4] hover:text-[#B83A3A]"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#4B9488] transition-colors group-hover:text-[#B83A3A]" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FeaturedPanel({
  eyebrow,
  title,
  detail,
  href,
  cta,
  image,
  onNavigate,
}: {
  eyebrow?: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  image?: string;
  onNavigate?: () => void;
}) {
  return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-[#DCE4E1] bg-[#F7FAF9] overflow-hidden shadow-[0_8px_24px_rgba(7,59,58,0.04)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(7,59,58,0.1)]">
      {image ? (
        <div className="relative h-[140px] w-full border-b border-[#DCE4E1]">
          <Image src={image} alt="" fill className="object-cover object-top" sizes="320px" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {eyebrow ? (
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
              {eyebrow}
            </span>
          ) : null}
          <h4 className="mt-2 font-serif text-xl font-semibold text-[#073B3A]">{title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{detail}</p>
        </div>
        <Link
          href={href}
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]"
        >
          {cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function MegaMenuPanels({
  activeMenu,
  onNavigate,
}: {
  activeMenu: MegaMenuKey;
  onNavigate?: () => void;
}) {
  if (activeMenu === "solutions") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <LinkList title="Solutions" links={solutionsMegaMenu.links} onNavigate={onNavigate} />
        </div>
        <div className="col-span-4">
          <LinkList title="Transform" links={solutionsMegaMenu.transform} onNavigate={onNavigate} />
        </div>
        <div className="col-span-5">
          <FeaturedPanel
            eyebrow="Featured"
            title={solutionsMegaMenu.featured.title}
            detail={solutionsMegaMenu.featured.detail}
            href={solutionsMegaMenu.featured.href}
            cta={solutionsMegaMenu.featured.cta}
            image={solutionsMegaMenu.featured.image}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "oracle") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <LinkList title="Finance" links={oracleMegaMenuGrouped.finance} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <LinkList title="Operations" links={oracleMegaMenuGrouped.operations} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <LinkList title="Platform" links={oracleMegaMenuGrouped.platform} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <FeaturedPanel
            title={oracleMegaMenuGrouped.featured.title}
            detail={oracleMegaMenuGrouped.featured.detail}
            href={oracleMegaMenuGrouped.featured.href}
            cta={oracleMegaMenuGrouped.featured.cta}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "ai-data") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <LinkList title="AI" links={aiDataMegaMenuGrouped.ai} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <LinkList title="Data" links={aiDataMegaMenuGrouped.data} onNavigate={onNavigate} />
        </div>
        <div className="col-span-6">
          <FeaturedPanel
            eyebrow="Featured"
            title={aiDataMegaMenuGrouped.featured.title}
            detail={aiDataMegaMenuGrouped.featured.detail}
            href={aiDataMegaMenuGrouped.featured.href}
            cta={aiDataMegaMenuGrouped.featured.cta}
            image={aiDataMegaMenuGrouped.featured.image}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "applications") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <LinkList title="Build" links={applicationsMegaMenu.build} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <LinkList title="Products" links={applicationsMegaMenu.products} onNavigate={onNavigate} />
        </div>
        <div className="col-span-2">
          <LinkList title="Workforce" links={applicationsMegaMenu.workforce} onNavigate={onNavigate} />
        </div>
        <div className="col-span-4">
          <FeaturedPanel
            eyebrow="Featured"
            title={applicationsMegaMenu.featured.title}
            detail={applicationsMegaMenu.featured.detail}
            href={applicationsMegaMenu.featured.href}
            cta={applicationsMegaMenu.featured.cta}
            image={applicationsMegaMenu.featured.image}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "industries") {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {industryLinks.slice(0, 5).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="group rounded-xl border border-[#DCE4E1] bg-white p-4 transition-all duration-200 hover:border-[#176A63]/30 hover:shadow-[0_12px_28px_rgba(7,59,58,0.08)] hover:-translate-y-0.5"
          >
            <p className="text-sm font-semibold text-[#073B3A] group-hover:text-[#B83A3A]">{item.label}</p>
            <p className="mt-1 text-xs text-[#5B6D6B]">{item.detail}</p>
          </Link>
        ))}
      </div>
    );
  }

  if (activeMenu === "resources") {
    return (
      <div className="grid grid-cols-4 gap-4">
        {resourcesMegaMenu.links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="rounded-xl border border-[#DCE4E1] bg-white p-5 text-sm font-semibold text-[#073B3A] transition-all duration-200 hover:border-[#176A63]/30 hover:text-[#B83A3A] hover:shadow-[0_12px_28px_rgba(7,59,58,0.08)] hover:-translate-y-0.5"
          >
            {item.label}
          </Link>
        ))}
      </div>
    );
  }

  if (activeMenu === "company") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 grid grid-cols-2 gap-4">
          {companyMegaMenu.links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="rounded-xl border border-[#DCE4E1] bg-white p-4 text-sm font-semibold text-[#073B3A] transition-all duration-200 hover:border-[#176A63]/30 hover:text-[#B83A3A] hover:shadow-[0_12px_28px_rgba(7,59,58,0.08)] hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="col-span-4 border-t border-[#DCE4E1] pt-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5B6D6B]">Portals</p>
          <ul className="mt-3 space-y-2">
            {companyMegaMenu.portals.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="text-sm text-[#122D2E] hover:text-[#B83A3A]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
