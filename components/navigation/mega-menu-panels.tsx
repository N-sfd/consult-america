"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  aiDataMegaMenuGrouped,
  applicationsMegaMenu,
  companyMegaMenu,
  industryLinks,
  oracleMegaMenuGrouped,
  resourcesMegaMenu,
  solutionsMegaMenu,
} from "@/lib/site-data";

export type MegaMenuKey =
  | "solutions"
  | "oracle"
  | "ai-data"
  | "applications"
  | "industries"
  | "resources"
  | "company";

type MenuLink = { href: string; label: string; detail?: string };

function LinkList({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: MenuLink[];
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
        {title}
      </p>
      <ul className="mt-2.5 space-y-0.5">
        {links.map((item) => (
          <li key={`${title}-${item.label}`}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="ca-mega-link group"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span>{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                {item.detail ? (
                  <span className="ca-mega-link-desc">{item.detail}</span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
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
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-[#DCE4E1] bg-[#F7FAF9] shadow-[0_8px_24px_rgba(7,59,58,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(7,59,58,0.08)]">
      {image ? (
        <div className="relative h-[120px] w-full border-b border-[#DCE4E1]">
          <Image src={image} alt="" fill className="object-cover object-top" sizes="280px" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {eyebrow ? (
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
              {eyebrow}
            </span>
          ) : null}
          <h4 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#073B3A]">
            {title}
          </h4>
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
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <LinkList title="Finance" links={oracleMegaMenuGrouped.finance} onNavigate={onNavigate} />
        </div>
        <div className="col-span-2">
          <LinkList title="Operations" links={oracleMegaMenuGrouped.operations} onNavigate={onNavigate} />
        </div>
        <div className="col-span-2">
          <LinkList title="Workforce" links={oracleMegaMenuGrouped.workforce} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <LinkList title="Platform" links={oracleMegaMenuGrouped.platform} onNavigate={onNavigate} />
        </div>
        <div className="col-span-3">
          <FeaturedPanel
            eyebrow="Featured"
            title={oracleMegaMenuGrouped.featured.title}
            detail={oracleMegaMenuGrouped.featured.detail}
            href={oracleMegaMenuGrouped.featured.href}
            cta={oracleMegaMenuGrouped.featured.cta}
            image={oracleMegaMenuGrouped.featured.image}
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
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 grid grid-cols-2 gap-2">
          {industryLinks.slice(0, 6).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className="ca-mega-link"
            >
              <span className="min-w-0">
                <span className="font-medium">{item.label}</span>
                <span className="ca-mega-link-desc">{item.detail}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="col-span-4">
          <FeaturedPanel
            eyebrow="Featured"
            title="Financial Services"
            detail="Modernize operations without losing control across regulated environments."
            href="/industries/financial-services"
            cta="Explore industry"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "resources") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 grid grid-cols-2 gap-2">
          {resourcesMegaMenu.links.map((item) => (
            <Link key={item.label} href={item.href} onClick={onNavigate} className="ca-mega-link">
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="col-span-4">
          <FeaturedPanel
            eyebrow="Featured"
            title="Ideas for modern enterprise technology."
            detail="Practical notes from Oracle, AI, and transformation delivery."
            href="/insights"
            cta="Browse resources"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (activeMenu === "company") {
    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5">
          <LinkList
            title="Company"
            links={companyMegaMenu.links.map((l) => ({ ...l, detail: undefined }))}
            onNavigate={onNavigate}
          />
        </div>
        <div className="col-span-3 border-l border-[#E1ECE8] pl-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5B6D6B]">
            Portals
          </p>
          <ul className="mt-3 space-y-1">
            {companyMegaMenu.portals.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="ca-mega-link text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-4">
          <FeaturedPanel
            eyebrow="Featured"
            title="Built to move from strategy to production."
            detail="Enterprise transformation, Oracle, AI, and application engineering."
            href="/about"
            cta="About Consult America"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  return null;
}
