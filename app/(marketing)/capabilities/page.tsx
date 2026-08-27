import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { capabilityPages } from "@/lib/marketing/capability-pages";

export const metadata: Metadata = {
  title: "Capabilities | Consult America",
  description:
    "Strategy, Oracle, AI and data, digital engineering, and managed delivery — together.",
};

const capabilities = [
  {
    number: "01",
    title: capabilityPages["enterprise-transformation"].title,
    description: capabilityPages["enterprise-transformation"].description,
    href: "/capabilities/enterprise-transformation",
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    description:
      "Modernize finance, supply chain, HR, projects, planning, integration, and analytics across Oracle Cloud and enterprise applications.",
    href: "/oracle",
  },
  {
    number: "03",
    title: "AI & Data",
    description:
      "Turn enterprise data into intelligent workflows, AI agents, automation, analytics, and decision support that can operate in production.",
    href: "/ai-data",
  },
  {
    number: "04",
    title: capabilityPages["digital-engineering"].title,
    description: capabilityPages["digital-engineering"].description,
    href: "/capabilities/digital-engineering",
  },
  {
    number: "05",
    title: capabilityPages["managed-delivery"].title,
    description: capabilityPages["managed-delivery"].description,
    href: "/capabilities/managed-delivery",
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <section className="mkt-section bg-[var(--mkt-navy)] text-white">
        <div className="mkt-shell">
          <SectionLabel tone="light">Capabilities</SectionLabel>
          <EditorialHeading as="h1" size="hero" className="mt-6 max-w-3xl !text-white">
            From strategy to execution, we transform what matters.
          </EditorialHeading>
          <p className="mkt-body-lg mt-6 max-w-xl text-white/60">
            Enterprise delivery across strategy, platforms, and operations —
            with the program leadership to see it through to production.
          </p>
        </div>
      </section>

      <section className="bg-[var(--mkt-navy)] pb-24 text-white lg:pb-28">
        <div className="mkt-shell border-t border-white/12">
          {capabilities.map((capability) => (
            <Link
              key={capability.href}
              href={capability.href}
              className="group relative flex items-center justify-between gap-6 border-b border-white/12 py-6 transition-colors duration-300 hover:bg-white/[0.04] md:py-8"
            >
              <div className="flex min-w-0 items-baseline gap-6 md:gap-10">
                <span className="mkt-eyebrow shrink-0 text-white/40">
                  {capability.number}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-medium tracking-[-0.03em] text-white transition-colors duration-200 group-hover:text-[var(--mkt-bright)] md:text-2xl lg:text-[1.75rem]">
                    {capability.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/50 lg:text-base lg:leading-7">
                    {capability.description}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/50 transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--mkt-bright)]" />
            </Link>
          ))}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
