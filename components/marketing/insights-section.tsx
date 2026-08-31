"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { stockImage } from "@/lib/marketing/stock-images";

const featuredInsight = {
  category: "AI & DATA ARCHITECTURE",
  readTime: "7 min read",
  title: "Operationalizing Enterprise AI: Moving from Experimentation to Production Delivery",
  summary:
    "Why enterprise AI initiatives stall before reaching production workflows, and the data governance, citation boundaries, and human review needed for reliable operational deployment.",
  href: "/insights",
  image: stockImage("insightsHero", { w: 1200, q: 85 }),
};

const supportingInsights = [
  {
    category: "ORACLE CLOUD",
    readTime: "6 min read",
    title: "What Oracle Cloud Modernization Requires Beyond Technology Implementation",
    summary: "Operating model redesign, financial subledger reconciliation, and change governance for long-term ERP ROI.",
    href: "/insights",
    image: stockImage("insightsCard1", { w: 600, q: 80 }),
  },
  {
    category: "DOCUMENT INTELLIGENCE",
    readTime: "5 min read",
    title: "Building Trustworthy Document Intelligence with Grounded Source Verification",
    summary: "Extracting contract terms and complex financial schedules with traceable source citation lineage.",
    href: "/insights",
    image: stockImage("insightsCard2", { w: 600, q: 80 }),
  },
  {
    category: "DIGITAL ENGINEERING",
    readTime: "6 min read",
    title: "Enterprise Integration Architecture: Connecting Core ERP to Modern AI Workflows",
    summary: "Architecting event-driven integration and API bridges to support reliable operational decisioning across legacy environments.",
    href: "/insights",
    image: stockImage("insightsCard3", { w: 600, q: 80 }),
  },
];

export default function InsightsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="insights" className="bg-[#F8FAF9] text-[#163536] py-16 sm:py-20 lg:py-24 border-b border-[#DCE4E1]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DCE4E1]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#596968]">
                PERSPECTIVES &amp; ANALYSIS
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#163536]">
              Enterprise Insights
            </h2>
          </div>

          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#103F3E] hover:text-[#B63A3A] transition-colors"
          >
            <span>Explore all publications</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 60% Featured Insight Left + 3 Smaller Stories Right */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Featured Article (~58-60%) */}
          <motion.article
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 rounded-[10px] border border-[#DCE4E1] bg-white overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#103F3E]/40 transition-all duration-300"
          >
            <div className="relative aspect-[16/10] w-full bg-[#0B3332]">
              <Image
                src={featuredInsight.image}
                alt={featuredInsight.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                    {featuredInsight.category}
                  </span>
                  <span className="text-[0.72rem] text-[#596968]">
                    {featuredInsight.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#163536] leading-snug">
                  {featuredInsight.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#596968]">
                  {featuredInsight.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DCE4E1]">
                <Link
                  href={featuredInsight.href}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B63A3A] hover:text-[#992F31] transition-colors"
                >
                  <span>Read Article →</span>
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Right Column: 3 Smaller Stories (~40-42%) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {supportingInsights.map((insight, idx) => (
              <motion.article
                key={insight.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group rounded-[10px] border border-[#DCE4E1] bg-white p-4.5 hover:border-[#103F3E]/40 transition-all duration-300 flex items-center gap-4 flex-1 shadow-2xs"
              >
                <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded bg-[#0B3332]">
                  <Image
                    src={insight.image}
                    alt={insight.title}
                    fill
                    className="object-cover mkt-img-graded"
                    sizes="120px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[0.65rem]">
                    <span className="font-bold uppercase tracking-wider text-[#103F3E] truncate">
                      {insight.category}
                    </span>
                    <span className="text-[#596968] shrink-0">{insight.readTime}</span>
                  </div>

                  <h4 className="mt-1 text-sm font-bold text-[#163536] group-hover:text-[#103F3E] transition-colors leading-snug line-clamp-2">
                    {insight.title}
                  </h4>

                  <Link
                    href={insight.href}
                    className="mt-2 inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#B63A3A] hover:text-[#992F31]"
                  >
                    <span>Read Article →</span>
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
