"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const featuredInsight = {
  title: "Why enterprise AI deployments stall before production — and how to ground them.",
  category: "AI & PLATFORM ARCHITECTURE",
  readTime: "6 min read",
  summary: "Most enterprise AI initiatives struggle not with model quality, but with source data governance, audit grounding, and bidirectional workflow integration.",
  image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
  href: "/insights/enterprise-ai-production-architecture",
};

const supportingInsights = [
  {
    title: "Clean-Core ERP Architecture: Modernizing Oracle Cloud without Customization Debt",
    category: "ORACLE & ERP TRANSFORMATION",
    readTime: "5 min read",
    summary: "How to decouple bespoke business logic using OIC, REST microservices, and autonomous data pipelines.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    href: "/insights/clean-core-erp-modernization",
  },
  {
    title: "Connecting CRM and Back-Office Operations for True Customer 360",
    category: "CUSTOMER EXPERIENCE & REVOPS",
    readTime: "4 min read",
    summary: "Bridging the gap between front-office sales interactions and back-office ERP fulfillment.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    href: "/insights/customer-360-data-lineage",
  },
  {
    title: "The Shift to Continuous Modernization in Public Sector & Regulated Enterprise",
    category: "DIGITAL ENGINEERING",
    readTime: "5 min read",
    summary: "Strategies for phasing mission-critical system overhauls while maintaining strict compliance continuity.",
    image: "https://images.unsplash.com/photo-1517976487502-8693c0429f55?auto=format&fit=crop&w=800&q=80",
    href: "/insights/regulated-systems-modernization",
  },
];

export default function InsightsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="insights" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D8D0C5]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D8D0C5]">
          <div>
            <SectionLabel tone="burgundy">PERSPECTIVES &amp; ANALYSIS</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Enterprise Insights
            </h2>
          </div>

          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B63A3A] hover:text-[#942E31]"
          >
            <span>Explore all publications</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Publication 50/50 Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Featured Article (~50%) */}
          <motion.article
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 rounded-[14px] border border-[#D8D0C5] bg-[#F7F3EC] overflow-hidden flex flex-col justify-between shadow-[0_12px_36px_rgba(38,31,27,0.06)] hover:border-[#B63A3A]/40 transition-all"
          >
            <div className="relative aspect-[16/10] w-full bg-[#211E1B]">
              <Image
                src={featuredInsight.image}
                alt={featuredInsight.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-3.5 left-4 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[0.62rem] font-bold text-[#D8C5AA] border border-white/15">
                Featured Analysis
              </span>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#B63A3A]">
                    {featuredInsight.category}
                  </span>
                  <span className="flex items-center gap-1 text-[#695F57]">
                    <Clock className="h-3 w-3" /> {featuredInsight.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#261F1B] leading-snug hover:text-[#B63A3A] transition-colors">
                  <Link href={featuredInsight.href}>{featuredInsight.title}</Link>
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#695F57]">
                  {featuredInsight.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8D0C5]">
                <Link
                  href={featuredInsight.href}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  Read publication <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Supporting Articles Column (~50%) */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {supportingInsights.map((insight, idx) => (
              <motion.article
                key={insight.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group rounded-[14px] border border-[#D8D0C5] bg-[#F7F3EC] p-4.5 hover:border-[#B63A3A]/40 hover:bg-[#FFFDF8] transition-all flex items-center gap-4 flex-1"
              >
                <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-[10px] bg-[#211E1B]">
                  <Image
                    src={insight.image}
                    alt={insight.title}
                    fill
                    className="object-cover mkt-img-graded"
                    sizes="120px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[0.65rem] font-mono">
                    <span className="font-bold text-[#B63A3A] uppercase tracking-wider truncate">
                      {insight.category}
                    </span>
                    <span className="text-[#695F57] shrink-0">{insight.readTime}</span>
                  </div>

                  <h4 className="mt-1 text-sm sm:text-base font-bold text-[#261F1B] group-hover:text-[#B63A3A] transition-colors leading-snug line-clamp-2">
                    <Link href={insight.href}>{insight.title}</Link>
                  </h4>

                  <Link
                    href={insight.href}
                    className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#B63A3A] hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
