"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import { insightCategoryLabels } from "@/data/insights";
import { formatInsightDate, getFeaturedInsights } from "@/lib/insights";

const insightImages = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
];

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);

  return (
    <Section id="insights" className="bg-[var(--ca-off-white)] text-[#05070d]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-black/45">INSIGHTS</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-[#05070d]">
              Notes from Oracle, AI, and transformation delivery.
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65">
              Practical briefings from enterprise programs—focused on what
              actually reaches production.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {insights.map((item, index) => (
            <motion.article
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/insights/${item.slug}`}
                className="group flex h-full flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                  <Image
                    src={insightImages[index % insightImages.length]}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="mt-5 flex flex-1 flex-col border-t border-black/10 pt-5">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em]">
                    <span className="text-[var(--ca-blue)]">
                      {insightCategoryLabels[item.category]}
                    </span>
                    <span className="text-black/30">·</span>
                    <span className="text-black/40">
                      {formatInsightDate(item.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.03em] text-[#05070d] transition-colors group-hover:text-[var(--ca-blue)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-black/55">
                    {item.summary}
                  </p>

                  <span className="ca-link mt-5 w-fit">
                    Read
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link href="/insights" className="ca-link">
            View All Insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
