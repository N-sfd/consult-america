"use client";

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
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    tagline: "Connected enterprise systems.",
    href: "/oracle",
  },
  {
    number: "03",
    title: "AI & Data",
    tagline: "Production intelligence.",
    href: "/ai-data",
  },
  {
    number: "04",
    title: "Digital Engineering",
    tagline: "Modern digital platforms.",
    href: "/capabilities/digital-engineering",
  },
  {
    number: "05",
    title: "Managed Delivery",
    tagline: "Execution at scale.",
    href: "/capabilities/managed-delivery",
  },
];

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="capabilities" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Capabilities</SectionLabel>
        <EditorialHeading className="mt-5 max-w-2xl text-[var(--mkt-navy)]">
          From strategy to execution, we transform what matters.
        </EditorialHeading>

        <div className="mt-10 border-t border-[var(--mkt-border)]">
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
                  "py-5 md:flex md:items-center md:justify-between md:gap-8 md:py-6",
                  isActive && "bg-[#f6f9fd]",
                )}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
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
                    <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)] md:hidden">
                      {capability.tagline}
                    </p>
                  </div>
                  <p className="hidden shrink-0 text-sm text-[var(--mkt-muted)] md:block md:min-w-[12rem] md:text-right">
                    {capability.tagline}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between md:mt-0 md:shrink-0">
                  <span className="text-sm font-medium text-[var(--mkt-blue)] md:hidden">
                    Explore
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
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
