import type { Metadata } from "next";
import Link from "next/link";

import InsightsIndex from "@/components/insights/insights-index";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import FeatureCard from "@/components/marketing/inner-page/feature-card";
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
      <PageHero
        variant="resources"
        layout="stacked"
        eyebrow="Resources"
        title="Ideas for modern enterprise technology."
        description="Short briefings on Oracle, AI and data, enterprise transformation, and the operating decisions that determine whether programs reach production."
        primaryCta={{ label: "Browse insights", href: "#insights-index" }}
      />

      <PageSection tone="soft" eyebrow="Featured Insight" title="Editorial perspectives from delivery.">
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((item, index) => (
            <FeatureCard key={item.slug} delay={index * 0.08}>
              <Link href={`/insights/${item.slug}`} className="group block">
                <p className="text-xs uppercase tracking-[0.12em] text-[#176A63]">
                  {insightCategoryLabels[item.category]}
                </p>
                <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#122D2E] transition-colors group-hover:text-[#B83A3A]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5B6D6B]">{item.summary}</p>
                <p className="mt-4 text-xs text-[#5B6D6B]/70">
                  {formatInsightDate(item.publishedAt)} · {item.readingTime}
                </p>
              </Link>
            </FeatureCard>
          ))}
        </div>
      </PageSection>

      <PageSection id="insights-index" tone="white" eyebrow="All insights" title="Case studies and perspectives.">
        <InsightsIndex insights={insights} categories={categories} />
      </PageSection>
    </>
  );
}
