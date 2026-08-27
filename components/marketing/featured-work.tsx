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
          <Link href="/work/case-studies" className="ca-link">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/work/case-studies/${flagship.slug}`}
              className="group grid overflow-hidden border border-[var(--mkt-border)] lg:grid-cols-12"
            >
              <div className="relative order-2 aspect-[16/10] lg:order-1 lg:col-span-7 lg:aspect-auto lg:min-h-[320px]">
                <Image
                  src={flagship.image}
                  alt={flagship.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="order-1 flex flex-col justify-between p-6 md:p-8 lg:order-2 lg:col-span-5">
                <div>
                  <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                    01 / {flagship.category}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-3xl">
                    {flagship.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--mkt-muted)]">
                    Client challenge
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--mkt-muted)]">
                    {flagship.challenge}
                  </p>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-[var(--mkt-muted)]">
                    Business outcomes
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--mkt-muted)]">
                    {flagship.outcomes[0]?.description}
                  </p>
                </div>
                <span className="ca-link mt-6 w-fit">
                  Explore case study
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.article>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {supportingProjects.map((project, index) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.06 + index * 0.04 }}
              >
                <Link
                  href={`/work/case-studies/${project.slug}`}
                  className="group block overflow-hidden border border-[var(--mkt-border)]"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                      {String(index + 2).padStart(2, "0")} / {project.category}
                    </p>
                    <h3 className="mt-2 mkt-h3 text-[var(--mkt-navy)]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                      {project.summary}
                    </p>
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
