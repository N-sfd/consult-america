"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    number: "01",
    title: "Enterprise Transformation",
    tagline: "Strategy through execution.",
    href: "/capabilities/enterprise-transformation",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise transformation strategy session",
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    tagline: "Connected enterprise systems.",
    href: "/oracle",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Oracle Cloud enterprise platform environment",
  },
  {
    number: "03",
    title: "AI & Data",
    tagline: "Production intelligence.",
    href: "/ai-data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "AI and data analytics workspace",
  },
  {
    number: "04",
    title: "Digital Engineering",
    tagline: "Modern digital platforms.",
    href: "/capabilities/digital-engineering",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Digital engineering and product delivery",
  },
  {
    number: "05",
    title: "Managed Delivery",
    tagline: "Execution at scale.",
    href: "/capabilities/managed-delivery",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Program delivery and enterprise execution",
  },
];

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = capabilities[activeIndex];

  return (
    <section id="capabilities" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Capabilities</SectionLabel>
        <EditorialHeading className="mt-5 max-w-2xl text-[var(--mkt-navy)]">
          From strategy to execution, we transform what matters.
        </EditorialHeading>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="border-t border-[var(--mkt-border)]">
              {capabilities.map((capability, index) => {
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={capability.title}
                    href={capability.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={cn(
                      "group block border-b border-[var(--mkt-border)] transition-colors duration-200",
                      "py-5 md:py-6",
                      isActive && "bg-[#f6f9fd]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
                          <span className="mkt-eyebrow shrink-0 text-[var(--mkt-muted)]">
                            {capability.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3
                              className={cn(
                                "mkt-h3 transition-colors duration-200 md:text-xl lg:text-2xl",
                                isActive
                                  ? "text-[var(--mkt-blue)]"
                                  : "text-[var(--mkt-navy)] group-hover:text-[var(--mkt-blue)]",
                              )}
                            >
                              {capability.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                              {capability.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--mkt-border)] lg:hidden">
                          <Image
                            src={capability.image}
                            alt={capability.imageAlt}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                        </div>
                      </div>

                      <ArrowUpRight
                        className={cn(
                          "mt-1 h-5 w-5 shrink-0 transition-all duration-200",
                          isActive
                            ? "translate-x-1 text-[var(--mkt-blue)]"
                            : "text-[var(--mkt-muted)] group-hover:translate-x-1 group-hover:text-[var(--mkt-blue)]",
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--mkt-border)] shadow-[0_24px_60px_rgba(16,42,67,0.08)]">
                <Image
                  key={active.image}
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="42vw"
                  priority={activeIndex === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="mkt-eyebrow text-white/50">{active.number}</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {active.title}
                  </p>
                  <p className="mt-2 text-sm text-white/70">{active.tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/capabilities" className="ca-link">
            Explore All Capabilities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
