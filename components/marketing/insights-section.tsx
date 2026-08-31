"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredInsight = {
  category: "ENTERPRISE AI ARCHITECTURE",
  readTime: "7 min read",
  title: "Designing AI-Native Enterprise Workflows: From Prototype to Production",
  summary:
    "Why enterprise AI proofs-of-concept frequently stall before production, and the data governance, citation boundaries, and human-in-the-loop workflows required to deploy with confidence.",
  href: "/insights",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
};

const supportingInsights = [
  {
    category: "ORACLE CLOUD TRANSFORMATION",
    readTime: "6 min read",
    title: "What Oracle Cloud Modernization Requires Beyond Implementation",
    summary: "How operating model redesign, subledger reconciliation, and change governance ensure long-term ERP ROI.",
    href: "/insights",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "DOCUMENT INTELLIGENCE",
    readTime: "5 min read",
    title: "Building Trustworthy Document Intelligence with Grounded Source Verification",
    summary: "Extracting FAR/DFARS compliance clauses and financial schedules with verified, auditable citation lineage.",
    href: "/insights",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    category: "DIGITAL ENGINEERING",
    readTime: "6 min read",
    title: "Enterprise Integration in the Agentic Era: Connecting Core ERP to AI Swarms",
    summary: "Architecting event-driven middleware and OIC bridges to support autonomous operational decisioning.",
    href: "/insights",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
];

export default function InsightsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="insights" className="bg-[#FFFAF2] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">PERSPECTIVES &amp; ANALYSIS</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Enterprise Insights
            </h2>
          </div>

          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
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
            className="lg:col-span-6 rounded-[14px] border border-[#D7CCBD] bg-[#FFFDF8] overflow-hidden flex flex-col justify-between shadow-[0_12px_36px_rgba(38,31,27,0.06)] hover:border-[#B63A3A]/40 transition-all"
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

              <div className="mt-6 pt-4 border-t border-[#D7CCBD]/80">
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
                className="group rounded-[14px] border border-[#D7CCBD] bg-[#FFFDF8] p-4.5 hover:border-[#B63A3A]/40 hover:bg-[#FFFAF2] transition-all flex items-center gap-4 flex-1"
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

                  <h4 className="mt-1 text-sm sm:text-base font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors leading-snug line-clamp-2">
                    {insight.title}
                  </h4>

                  <Link
                    href={insight.href}
                    className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#7D2639] hover:underline"
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
