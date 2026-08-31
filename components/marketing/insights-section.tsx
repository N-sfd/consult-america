"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredInsight = {
  category: "ENTERPRISE AI ARCHITECTURE",
  readTime: "7 min read",
  title: "Beyond the Demo: Architecting Production AI for Governed Enterprise Workflows",
  summary:
    "Why 80% of enterprise AI proofs-of-concept stall before production, and the data governance, citation boundaries, and human-in-the-loop workflows required to deploy with confidence.",
  href: "/insights",
  image:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
};

const supportingInsights = [
  {
    category: "ORACLE & ERP",
    readTime: "5 min read",
    title: "The Clean Core Playbook: Reducing Oracle Customizations During Cloud Migration",
    href: "/insights",
  },
  {
    category: "CRM & OPERATIONS",
    readTime: "6 min read",
    title: "Unifying the Front and Back Office: Connecting Salesforce to Enterprise ERP",
    href: "/insights",
  },
  {
    category: "DIGITAL ENGINEERING",
    readTime: "4 min read",
    title: "Contract Intelligence at Scale: Parsing 100,000+ DFARS Clauses with Accuracy",
    href: "/insights",
  },
];

export default function InsightsSection() {
  return (
    <section id="insights" className="mkt-section bg-[#F1F2EE] text-[#101828]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel tone="burgundy">Perspectives &amp; Analysis</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-4 font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              Enterprise Insights
            </motion.h2>
          </div>

          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
          >
            <span>Explore All Publications</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Magazine Editorial Layout: Featured Left (~60%) + Supporting Column Right (~40%) */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Featured Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] shadow-[0_12px_36px_rgba(20,30,45,0.06)] lg:col-span-7"
          >
            <div className="relative aspect-[16/9] w-full bg-[#EEF2F5]">
              <Image
                src={featuredInsight.image}
                alt={featuredInsight.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                  {featuredInsight.category}
                </span>
                <span className="text-xs text-[#475467]/60">·</span>
                <span className="text-xs text-[#475467]">
                  {featuredInsight.readTime}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#101828] sm:text-3xl">
                {featuredInsight.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475467]">
                {featuredInsight.summary}
              </p>
              <div className="mt-6 pt-4 border-t border-[#E2E7EC]">
                <Link
                  href={featuredInsight.href}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
                >
                  <span>Read Full Perspective</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Supporting Publications Column */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5 lg:space-y-0">
            {supportingInsights.map((art, idx) => (
              <motion.article
                key={art.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="flex flex-col justify-between rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-6 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                      {art.category}
                    </span>
                    <span className="text-xs text-[#475467]/60">·</span>
                    <span className="text-xs text-[#475467]">{art.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#101828]">
                    {art.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E7EC]/80">
                  <Link
                    href={art.href}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[#B63838] hover:text-[#8F292D]"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
