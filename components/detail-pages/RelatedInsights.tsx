import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import InsightCard from "@/components/marketing/InsightCard";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { insightCategoryLabels, type InsightCategory } from "@/data/insights";
import { getInsightsByCategory } from "@/lib/insights";
import { stockImage } from "@/lib/marketing/stock-images";

const FALLBACK_IMAGES = [
  stockImage("relatedInsights1", { w: 1200, q: 80 }),
  stockImage("relatedInsights2", { w: 900, q: 75 }),
  stockImage("relatedInsights3", { w: 900, q: 75 }),
];

export default function RelatedInsights({
  category,
  limit = 2,
}: {
  category?: InsightCategory;
  limit?: number;
}) {
  if (!category) return null;

  const insights = getInsightsByCategory(category).slice(0, limit);
  if (insights.length === 0) return null;

  return (
    <PageSection
      tone="sage"
      eyebrow="Related Insights"
      title="Continue reading"
      headerClassName="!mb-8"
    >
      <div className="mb-8 flex justify-end">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]"
        >
          All insights
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {insights.map((insight, index) => (
          <Reveal key={insight.slug} delay={index * 0.1}>
            <InsightCard
              href={`/insights/${insight.slug}`}
              image={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
              imageAlt={insight.title}
              categoryLabel={insightCategoryLabels[insight.category]}
              title={insight.title}
              readingTime={insight.readingTime}
            />
          </Reveal>
        ))}
      </div>
    </PageSection>
  );
}
