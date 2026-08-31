"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { insights } from "@/data/insights";

export default function InsightsSection() {
  const featured = insights.find((i) => i.featured) || insights[0];
  const secondary = insights.filter((i) => i.slug !== featured.slug).slice(0, 3);

  return (
    <section id="insights" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Insights &amp; Perspectives</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Perspectives from the field.
          </motion.h2>
          <Link
            href="/insights"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>View All Insights</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Editorial Magazine Layout */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Featured Large Story (~62% width) */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_12px_36px_rgba(38,31,27,0.06)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#2B2420]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80"
                alt={featured.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/80 via-[#261F1B]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded bg-[#7D2639] px-2.5 py-1 text-[0.68rem] font-bold tracking-wide uppercase text-white">
                  Featured Insight
                </span>
                <h3 className="mt-2.5 font-serif text-2xl font-semibold text-[#FFFDF8] sm:text-3xl group-hover:text-[#D8C5AA] transition-colors">
                  {featured.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-[#695F57]">
                {featured.summary}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[#D7CCBD] pt-4">
                <span className="text-xs font-semibold text-[#695F57]">
                  {featured.readingTime} read
                </span>
                <Link
                  href={`/insights/${featured.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D2639] group-hover:text-[#681F30]"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Secondary Stacked Articles (~38% width) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {secondary.map((article, idx) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-5 shadow-[0_4px_16px_rgba(38,31,27,0.03)] transition-all hover:border-[#7D2639]/40"
              >
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  {article.category.replace("-", " ")}
                </span>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                  <Link href={`/insights/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#695F57] line-clamp-2">
                  {article.summary}
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#D7CCBD]/60">
                  <span className="text-[0.68rem] font-medium text-[#695F57]">
                    {article.readingTime} read
                  </span>
                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D2639]"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="h-3 w-3" />
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
