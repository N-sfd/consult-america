"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    number: "01",
    title: "Enterprise Transformation",
    description:
      "Align strategy, processes, operating models, and technology to modernize the enterprise and create measurable business value.",
    href: "/capabilities/enterprise-transformation",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise strategy and transformation planning",
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    description:
      "Modernize finance, supply chain, HR, projects, planning, integration, and analytics across Oracle Cloud and enterprise applications.",
    href: "/oracle",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise systems and cloud infrastructure",
  },
  {
    number: "03",
    title: "AI & Data",
    description:
      "Turn enterprise data into intelligent workflows, AI agents, automation, analytics, and decision support that can operate in production.",
    href: "/ai-data",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "AI and data visualization environment",
  },
  {
    number: "04",
    title: "Digital Engineering",
    description:
      "Design and build modern digital products, applications, APIs, integrations, and experiences that connect people, processes, and platforms.",
    href: "/capabilities/digital-engineering",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Digital engineering and product development",
  },
  {
    number: "05",
    title: "Managed Delivery",
    description:
      "Provide the program leadership, functional expertise, technical delivery, testing, and operational support needed to keep transformation moving.",
    href: "/capabilities/managed-delivery",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Managed delivery and program leadership",
  },
];

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = capabilities[activeIndex];

  return (
    <section
      id="capabilities"
      className="mkt-section bg-[var(--mkt-navy)] text-white"
    >
      <div className="mkt-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionLabel tone="light">Capabilities</SectionLabel>
          </div>
          <div className="lg:col-span-8">
            <EditorialHeading className="max-w-4xl !text-white">
              From strategy to execution, we transform what matters.
            </EditorialHeading>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65">
              Enterprise strategy, Oracle platforms, AI and data, digital
              engineering, and managed delivery—brought together to move complex
              programs forward.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="border-t border-white/12 lg:col-span-7">
            {capabilities.map((capability, index) => {
              const isActive = index === activeIndex;
              return (
                <Link
                  key={capability.title}
                  href={capability.href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={cn(
                    "group relative flex items-center justify-between gap-6 border-b border-white/12 py-7 transition-colors duration-300 md:py-8",
                    isActive && "bg-white/[0.04]",
                  )}
                >
                  <div className="flex min-w-0 items-baseline gap-6 md:gap-10">
                    <span
                      className={cn(
                        "mkt-eyebrow shrink-0",
                        isActive ? "text-[var(--mkt-bright)]" : "text-white/40",
                      )}
                    >
                      {capability.number}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "text-xl font-medium tracking-[-0.03em] transition-colors duration-200 md:text-2xl lg:text-[1.75rem]",
                          isActive
                            ? "text-[var(--mkt-bright)]"
                            : "text-white group-hover:text-[var(--mkt-bright)]",
                        )}
                      >
                        {capability.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/50 lg:hidden">
                        {capability.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-200",
                      isActive
                        ? "translate-x-1 -translate-y-1 text-[var(--mkt-bright)]"
                        : "text-white/50 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--mkt-bright)]",
                    )}
                  />

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 h-px bg-[var(--mkt-bright)] transition-all duration-500",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0c2035]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.number}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.image}
                      alt={active.imageAlt}
                      fill
                      className="object-cover"
                      sizes="40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/85 via-[var(--mkt-navy)]/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="mkt-eyebrow text-white/45">
                        {active.number} / Capability
                      </p>
                      <p className="mt-3 text-xl font-medium tracking-[-0.03em] text-white">
                        {active.title}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/60">
                        {active.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Link href="/capabilities" className="ca-link">
            Explore All Capabilities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
