"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import { insightCategoryLabels } from "@/data/insights";
import { formatInsightDate, getFeaturedInsights } from "@/lib/insights";

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);

  return (
    <Section id="insights" className="bg-[#05070d] text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-white/60">INSIGHTS</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl">
              Notes from Oracle, AI, and transformation delivery.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65">
              Practical briefings from enterprise programs—focused on what
              actually reaches production.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-white/10">
          {insights.map((item, index) => (
            <motion.article
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="border-b border-white/10"
            >
              <Link
                href={`/insights/${item.slug}`}
                className="group grid gap-4 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:px-4"
              >
                <div className="md:col-span-3">
                  <p className="text-sm text-white/45">
                    {formatInsightDate(item.publishedAt)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                    {insightCategoryLabels[item.category]}
                  </p>
                </div>

                <div className="md:col-span-8">
                  <h3 className="text-xl font-medium tracking-[-0.03em] transition-colors group-hover:text-[#93c5fd] md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                    {item.summary}
                  </p>
                </div>

                <div className="flex md:col-span-1 md:justify-end">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/insights" className="ca-link">
            View All Insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
