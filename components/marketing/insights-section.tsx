"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredInsight = {
  category: "ENTERPRISE AI ARCHITECTURE",
  readTime: "7 min read",
  title: "Designing AI-Native Enterprise Workflows: From Prototype to Production",
  summary:
    "Why 80% of enterprise AI proofs-of-concept stall before production, and the data governance, citation boundaries, and human-in-the-loop workflows required to deploy with confidence.",
  href: "/insights",
};

const supportingInsights = [
  {
    category: "ORACLE CLOUD TRANSFORMATION",
    readTime: "6 min read",
    title: "What Oracle Cloud Modernization Requires Beyond Implementation",
    summary: "How operating model redesign, subledger reconciliation, and change governance ensure long-term ERP ROI.",
    href: "/insights",
  },
  {
    category: "DOCUMENT INTELLIGENCE",
    readTime: "5 min read",
    title: "Building Trustworthy Document Intelligence with Grounded Source Verification",
    summary: "Extracting FAR/DFARS compliance clauses and financial schedules with 100% auditable citation lineage.",
    href: "/insights",
  },
  {
    category: "DIGITAL ENGINEERING",
    readTime: "6 min read",
    title: "Enterprise Integration in the Agentic Era: Connecting Core ERP to AI Swarms",
    summary: "Architecting event-driven middleware and OIC bridges to support autonomous operational decisioning.",
    href: "/insights",
  },
];

export default function InsightsSection() {
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-8 flex flex-col justify-between shadow-[0_12px_36px_rgba(38,31,27,0.06)] hover:border-[#7D2639]/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#7D2639]">
                  {featuredInsight.category}
                </span>
                <span className="flex items-center gap-1 text-[#695F57]">
                  <Clock className="h-3 w-3" /> {featuredInsight.readTime}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-[#261F1B] leading-snug">
                {featuredInsight.title}
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#695F57]">
                {featuredInsight.summary}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#D7CCBD]/80">
              <Link
                href={featuredInsight.href}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7D2639] hover:text-[#681F30]"
              >
                Read publication <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>

          {/* Supporting Articles Column (~50%) */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            {supportingInsights.map((insight, idx) => (
              <motion.article
                key={insight.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-5.5 hover:border-[#7D2639]/40 hover:bg-[#FFFAF2] transition-all flex flex-col justify-between flex-1"
              >
                <div>
                  <div className="flex items-center justify-between text-[0.68rem] font-mono">
                    <span className="font-bold text-[#7D2639] uppercase tracking-wider">
                      {insight.category}
                    </span>
                    <span className="text-[#695F57]">{insight.readTime}</span>
                  </div>

                  <h4 className="mt-2 text-base font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors leading-snug">
                    {insight.title}
                  </h4>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#695F57]">
                    {insight.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2">
                  <Link
                    href={insight.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors"
                  >
                    Read article <ArrowUpRight className="h-3 w-3" />
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
