"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { stockImage } from "@/lib/marketing/stock-images";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    number: "01",
    title: "Enterprise Transformation",
    tagline: "Strategy through execution.",
    description:
      "Align business models, operating processes, and modern digital capabilities into measurable enterprise outcomes.",
    href: "/capabilities/enterprise-transformation",
    image: stockImage("capabilitiesTransform", { w: 1200, q: 80 }),
    imageAlt: "Enterprise transformation strategy session",
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    tagline: "Connected enterprise systems.",
    description:
      "Fusion ERP, HCM, SCM, and EPM implementations integrated with mission-critical data pipelines.",
    href: "/oracle",
    image: stockImage("capabilitiesModernize", { w: 1200, q: 80 }),
    imageAlt: "Oracle Cloud enterprise platform environment",
  },
  {
    number: "03",
    title: "AI & Data",
    tagline: "Production intelligence.",
    description:
      "Document intelligence, multi-modal agents, source-grounded search, and governed data pipelines in production.",
    href: "/ai-data",
    image: stockImage("capabilitiesIntelligence", { w: 1200, q: 80 }),
    imageAlt: "AI and data analytics workspace",
  },
  {
    number: "04",
    title: "Digital Engineering",
    tagline: "Modern digital platforms.",
    description:
      "Cloud-native architectures, API platforms, and high-reliability software engineering for complex workloads.",
    href: "/capabilities/digital-engineering",
    image: stockImage("capabilitiesBuild", { w: 1200, q: 80 }),
    imageAlt: "Digital engineering and product delivery",
  },
  {
    number: "05",
    title: "Managed Delivery",
    tagline: "Execution at scale.",
    description:
      "Dedicated delivery squads, modern delivery governance, and continuous lifecycle support for enterprise platforms.",
    href: "/capabilities/managed-delivery",
    image: stockImage("capabilitiesOperate", { w: 1200, q: 80 }),
    imageAlt: "Program delivery and enterprise execution",
  },
];

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(0);
  const active = capabilities[activeIndex];

  return (
    <section id="capabilities" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Capabilities</SectionLabel>
        <EditorialHeading className="mt-4 max-w-2xl text-[var(--mkt-navy)]">
          From strategy to execution, we transform what matters.
        </EditorialHeading>

        <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="border-t border-[var(--mkt-border)]">
              {capabilities.map((capability, index) => {
                const isActive = index === activeIndex;
                const isMobileExpanded = index === expandedMobileIndex;

                return (
                  <div
                    key={capability.title}
                    className={cn(
                      "border-b border-[var(--mkt-border)] transition-colors duration-200",
                      isActive
                        ? "bg-[#f6f9fd] border-l-2 border-l-[var(--mkt-blue)]"
                        : "border-l-2 border-l-transparent hover:bg-[#f6f9fd]",
                    )}
                  >
                    {/* Desktop interactive link & hover target */}
                    <div
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      className="hidden lg:block"
                    >
                      <Link
                        href={capability.href}
                        className="group flex items-center justify-between gap-4 py-4.5 px-3"
                      >
                        <div className="flex flex-1 items-baseline gap-6">
                          <span className="mkt-eyebrow shrink-0 text-[var(--mkt-dim)]">
                            {capability.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3
                              className={cn(
                                "text-lg font-medium tracking-[-0.02em] transition-all duration-200 lg:text-[1.35rem]",
                                isActive
                                  ? "translate-x-1.5 text-[var(--mkt-blue)]"
                                  : "text-[var(--mkt-navy)] group-hover:translate-x-1.5 group-hover:text-[var(--mkt-blue)]",
                              )}
                            >
                              {capability.title}
                            </h3>
                            <p className="mt-1 text-xs text-[var(--mkt-muted)] sm:text-sm">
                              {capability.tagline}
                            </p>
                          </div>
                        </div>

                        <ArrowUpRight
                          className={cn(
                            "h-4.5 w-4.5 shrink-0 transition-all duration-200",
                            isActive
                              ? "translate-x-0.5 -translate-y-0.5 text-[var(--mkt-blue)]"
                              : "text-[var(--mkt-dim)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mkt-blue)]",
                          )}
                        />
                      </Link>
                    </div>

                    {/* Mobile interactive accordion button + inline expansion */}
                    <div className="block lg:hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedMobileIndex(isMobileExpanded ? null : index);
                          setActiveIndex(index);
                        }}
                        className="flex w-full items-center justify-between gap-3 py-4 px-3 text-left"
                      >
                        <div className="flex flex-1 items-baseline gap-3.5">
                          <span className="mkt-eyebrow shrink-0 text-[var(--mkt-dim)]">
                            {capability.number}
                          </span>
                          <div>
                            <h3 className="text-base font-medium tracking-[-0.015em] text-[var(--mkt-navy)] sm:text-lg">
                              {capability.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-[var(--mkt-muted)]">
                              {capability.tagline}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-[var(--mkt-dim)] transition-transform duration-200",
                            isMobileExpanded && "rotate-180 text-[var(--mkt-blue)]",
                          )}
                        />
                      </button>

                      {isMobileExpanded && (
                        <div className="px-3 pb-4 pt-1">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--mkt-border)]">
                            <Image
                              src={capability.image}
                              alt={capability.imageAlt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/80 via-transparent to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-3">
                              <p className="text-xs font-medium text-white">
                                {capability.title}
                              </p>
                              <p className="text-[0.68rem] text-white/75">
                                {capability.tagline}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2.5 text-xs leading-5.5 text-[var(--mkt-muted)]">
                            {capability.description}
                          </p>
                          <Link
                            href={capability.href}
                            className="ca-link mt-3 inline-flex text-xs font-semibold"
                          >
                            Explore practice
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contextual visual — sticky on desktop */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-ice)] shadow-[0_16px_40px_rgba(16,42,67,0.06)]">
                <Image
                  key={active.image}
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  priority={activeIndex === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/85 via-[var(--mkt-navy)]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="mkt-eyebrow text-white/55">
                    {active.number} · Capability Area
                  </span>
                  <p className="mt-1.5 text-lg font-medium text-white">
                    {active.title}
                  </p>
                  <p className="mt-1 text-xs text-white/80">{active.description}</p>
                  <Link
                    href={active.href}
                    className="ca-link mt-4 inline-flex text-xs font-medium text-white hover:text-white/80"
                  >
                    View capability details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link href="/capabilities" className="ca-link text-sm">
            Explore All Capabilities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
