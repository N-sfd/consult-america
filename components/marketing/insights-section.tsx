"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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
    shape: "rounded-[24px_6px_6px_6px]",
  },
  {
    category: "DOCUMENT INTELLIGENCE",
    readTime: "5 min read",
    title: "Building Trustworthy Document Intelligence with Grounded Source Verification",
    summary: "Extracting contract terms and complex financial schedules with traceable source citation lineage.",
    href: "/insights",
    image: stockImage("insightsCard2", { w: 600, q: 80 }),
    shape: "rounded-[6px_24px_6px_6px]",
  },
  {
    category: "DIGITAL ENGINEERING",
    readTime: "6 min read",
    title: "Enterprise Integration Architecture: Connecting Core ERP to Modern AI Workflows",
    summary: "Architecting event-driven integration and API bridges to support reliable operational decisioning across legacy environments.",
    href: "/insights",
    image: stockImage("insightsCard3", { w: 600, q: 80 }),
    shape: "rounded-[6px_6px_24px_6px]",
  },
];

export default function InsightsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="insights" className="bg-[#F0F6F4] text-[#122D2E] py-16 sm:py-20 lg:py-24 border-b border-[#C9DDD7]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#C9DDD7]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#176A63]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5B6D6B]">
                PERSPECTIVES &amp; ANALYSIS
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#122D2E]">
              Enterprise Insights
            </h2>
          </div>

          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B4A47] hover:text-[#B83A3A] transition-colors"
          >
            <span>Explore all publications</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 60% Featured Insight Left + 3 Smaller Stories Right */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Featured Article (~58-60%) with Asymmetric Arch */}
          <motion.article
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 rounded-[14px] border border-[#C9DDD7] bg-white overflow-hidden flex flex-col justify-between ca-shadow-elevated hover:border-[#0B4A47]/40 transition-all duration-300"
          >
            <div className="p-3 pb-0">
              <div className="relative aspect-[16/10] w-full bg-[#073B3A] overflow-hidden rounded-[80px_10px_10px_10px]">
                <Image
                  src={featuredInsight.image}
                  alt={featuredInsight.title}
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="mkt-overlay-soft" />
              </div>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                    {featuredInsight.category}
                  </span>
                  <span className="text-[0.72rem] text-[#5B6D6B]">
                    {featuredInsight.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#122D2E] leading-snug">
                  {featuredInsight.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                  {featuredInsight.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E1ECE8]">
                <Link
                  href={featuredInsight.href}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B83A3A] hover:text-[#992F31] transition-colors"
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
                className="group rounded-[12px] border border-[#C9DDD7] bg-white p-4.5 hover:border-[#0B4A47]/40 transition-all duration-300 flex items-center gap-4 flex-1 shadow-2xs"
              >
                <div className={`relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden bg-[#073B3A] ${insight.shape}`}>
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
                    <span className="font-bold uppercase tracking-wider text-[#176A63] truncate">
                      {insight.category}
                    </span>
                    <span className="text-[#5B6D6B] shrink-0">{insight.readTime}</span>
                  </div>

                  <h4 className="mt-1 text-sm font-bold text-[#122D2E] group-hover:text-[#0B4A47] transition-colors leading-snug line-clamp-2">
                    {insight.title}
                  </h4>

                  <Link
                    href={insight.href}
                    className="mt-2 inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#B83A3A] hover:text-[#992F31]"
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
