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
    <section id="work" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="burgundy">Selected Work</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[#261F1B]">
              Proof through production delivery.
            </h2>
          </div>
          <Link
            href="/work/case-studies"
            className="ca-link text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {/* Flagship Case Study — Large Dominant Visual Card */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/work/case-studies/${flagship.slug}`}
              className="ca-app-window group grid overflow-hidden border border-[#D7CCBD] bg-[#FFFDF8] transition-all duration-300 hover:border-[#7D2639]/50 lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-auto lg:col-span-7 lg:min-h-[380px]">
                <Image
                  src={flagship.image}
                  alt={flagship.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-600 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 bg-[#FFFDF8]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      01 / {flagship.category}
                    </span>
                    <span className="rounded-full bg-[#DFE4DA] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[#657766]">
                      Enterprise Case
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold tracking-[-0.025em] text-[#261F1B] sm:text-2xl group-hover:text-[#7D2639] transition-colors">
                    {flagship.title}
                  </h3>

                  <div className="mt-4 space-y-2.5 border-t border-[#D7CCBD] pt-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#7D2639]">Challenge:</span>{" "}
                      <span className="text-[#695F57]">{flagship.challenge}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7D2639]">Approach:</span>{" "}
                      <span className="text-[#695F57]">
                        Connected Fusion architecture, automated migration pipelines, and zero-downtime cutover.
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7D2639]">Outcome:</span>{" "}
                      <span className="text-[#695F57]">
                        {flagship.outcomes[0]?.description ?? flagship.summary}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#D7CCBD] pt-4 flex items-center justify-between">
                  <span className="ca-link text-sm font-semibold text-[#7D2639] group-hover:text-[#681F30]">
                    Explore case study
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>

          {/* 2 Supporting Case Studies */}
          <div className="grid gap-5 sm:grid-cols-2">
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
                  className="ca-app-window group flex h-full flex-col overflow-hidden border border-[#D7CCBD] bg-[#FFFDF8] transition-all duration-300 hover:border-[#7D2639]/50"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-600 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 bg-[#FFFDF8]">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                        {String(index + 2).padStart(2, "0")} / {project.category}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#695F57] sm:text-sm">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#D7CCBD] pt-3.5 flex items-center justify-between">
                      <span className="ca-link text-xs font-semibold text-[#7D2639] group-hover:text-[#681F30] sm:text-sm">
                        Explore case study
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
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
