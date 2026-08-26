"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { cn } from "@/lib/utils";

const projects = [
  {
    number: "01",
    category: "Oracle",
    title: "Oracle Cloud Transformation",
    description:
      "Modernizing finance and procurement for complex multi-entity operations.",
    href: "/projects/oracle-cloud-transformation",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    tone: "white" as const,
  },
  {
    number: "02",
    category: "AI + Data",
    title: "AI Document Intelligence",
    description:
      "Turning complex contracts into structured, searchable enterprise intelligence.",
    href: "/projects/ai-document-intelligence",
    image: null,
    tone: "cloud" as const,
  },
  {
    number: "03",
    category: "Public Sector",
    title: "Public Sector Data Platform",
    description:
      "Shared analytics with role-based access, controls, and audit trails.",
    href: "/projects/public-sector-finance-procurement",
    image:
      "https://images.unsplash.com/photo-1523285367489-d38aec03f3d3?auto=format&fit=crop&w=1200&q=80",
    tone: "navy" as const,
  },
];

export default function FeaturedWork() {
  return (
    <section id="work" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="dark">Selected Work</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Outcomes you can see.
            </h2>
          </div>
          <Link href="/projects" className="ca-link">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
            >
              <Link
                href={project.href}
                className={cn(
                  "group grid overflow-hidden border lg:grid-cols-12",
                  project.tone === "navy"
                    ? "border-transparent bg-[var(--mkt-navy)] text-white"
                    : project.tone === "cloud"
                      ? "border-[var(--mkt-border)] bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]"
                      : "border-[var(--mkt-border)] bg-[var(--mkt-white)] text-[var(--mkt-navy)]",
                )}
              >
                <div className="flex flex-col justify-between p-6 md:p-8 lg:col-span-7">
                  <div>
                    <p
                      className={cn(
                        "mkt-eyebrow",
                        project.tone === "navy"
                          ? "text-white/50"
                          : "text-[var(--mkt-blue)]",
                      )}
                    >
                      {project.number} / {project.category}
                    </p>
                    <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                      {project.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-xl text-sm leading-6 md:text-base",
                        project.tone === "navy"
                          ? "text-white/65"
                          : "text-[var(--mkt-muted)]",
                      )}
                    >
                      {project.description}
                    </p>
                  </div>
                  <span className="ca-link mt-6 w-fit">
                    Explore the work
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="relative min-h-[180px] lg:col-span-5 lg:min-h-[240px]">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/70 p-6">
                      <div className="w-full max-w-xs border border-[var(--mkt-border)] bg-white p-4">
                        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
                          Data Agent
                        </p>
                        <p className="mt-2 text-sm font-medium text-[var(--mkt-navy)]">
                          Contract extraction · 96% confidence
                        </p>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--mkt-cloud)]">
                          <div className="h-full w-[96%] bg-[var(--mkt-blue)]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
