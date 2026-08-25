import type { Metadata } from "next";
import Link from "next/link";

import InsightsIndex from "@/components/insights/insights-index";
import { Section, SectionEyebrow, SectionLead } from "@/components/section";
import {
  getFeaturedInsights,
  getInsightCategories,
  getPublishedInsights,
  formatInsightDate,
} from "@/lib/insights";
import { insightCategoryLabels } from "@/data/insights";

export const metadata: Metadata = {
  title: "Insights | ConsultAmerica",
  description:
    "Practical notes on Oracle, AI & data, enterprise transformation, and industry delivery from ConsultAmerica.",
};

export default function InsightsPage() {
  const insights = getPublishedInsights();
  const categories = getInsightCategories();
  const featured = getFeaturedInsights(3);

  return (
    <>
      <Section tone="navy">
        <SectionEyebrow onDark>Insights</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">
          Practical notes from delivery, not thought-leadership filler.
        </h1>
        <SectionLead onDark>
          Short briefings on Oracle, AI and data, enterprise transformation, and
          the operating decisions that determine whether programs reach
          production.
        </SectionLead>
      </Section>

      <Section tone="navy" className="!pt-0">
        <div className="mb-16 border-t border-white/10 pt-10">
          <p className="ca-eyebrow text-white/45">Featured</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={`/insights/${item.slug}`}
                className="group border-t border-white/15 pt-6 transition-opacity hover:opacity-80"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                  {insightCategoryLabels[item.category]}
                </p>
                <h2 className="mt-4 text-xl font-medium tracking-[-0.03em] group-hover:text-[#93c5fd]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {item.summary}
                </p>
                <p className="mt-4 text-xs text-white/35">
                  {formatInsightDate(item.publishedAt)} · {item.readingTime}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <InsightsIndex insights={insights} categories={categories} />
      </Section>
    </>
  );
}
