"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { getCaseStudyBySlug } from "@/data/case-studies";

const FEATURED_SLUGS = [
  "oracle-cloud-transformation",
  "ai-document-intelligence",
  "public-sector-finance-procurement",
] as const;

export default function FeaturedWork() {
  const studies = FEATURED_SLUGS.map((slug) => getCaseStudyBySlug(slug)).filter(
    (study): study is NonNullable<typeof study> => Boolean(study),
  );
  const [flagship, ...supportingProjects] = studies;

  if (!flagship) return null;

  return (
    <section id="work" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="dark">Selected Work</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Proof through delivery.
            </h2>
          </div>
          <Link href="/work/case-studies" className="ca-link text-sm">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {/* Flagship Case Study — Dominant Story */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/work/case-studies/${flagship.slug}`}
              className="group grid overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-ice)] transition-colors hover:border-[var(--mkt-blue)]/40 lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-auto lg:col-span-7 lg:min-h-[340px]">
                <Image
                  src={flagship.image}
                  alt={flagship.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-600 group-hover:scale-[1.025]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
                <div>
                  <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                    01 / {flagship.category}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.025em] text-[var(--mkt-navy)] sm:text-2xl">
                    {flagship.title}
                  </h3>

                  <div className="mt-4 space-y-2 border-t border-[var(--mkt-border)] pt-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[var(--mkt-navy)]">
                        Challenge:
                      </span>{" "}
                      <span className="text-[var(--mkt-muted)]">
                        {flagship.challenge}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--mkt-navy)]">
                        Outcome:
                      </span>{" "}
                      <span className="text-[var(--mkt-muted)]">
                        {flagship.outcomes[0]?.description ?? flagship.summary}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--mkt-border)] flex items-center justify-between">
                  <span className="ca-link text-sm font-semibold">
                    Explore case study
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>

          {/* 2 Supporting Cases */}
          <div className="grid gap-4 sm:grid-cols-2">
            {supportingProjects.map((project, index) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.06 + index * 0.05 }}
              >
                <Link
                  href={`/work/case-studies/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-white)] transition-colors hover:border-[var(--mkt-blue)]/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-600 group-hover:scale-[1.025]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                        {String(index + 2).padStart(2, "0")} / {project.category}
                      </p>
                      <h3 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)]">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5.5 text-[var(--mkt-muted)] sm:text-sm">
                        {project.summary}
                      </p>
                    </div>
                    <span className="ca-link mt-4 text-xs font-semibold sm:text-sm">
                      Explore case study
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
