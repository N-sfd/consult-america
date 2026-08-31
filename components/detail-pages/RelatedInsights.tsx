import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import InsightCard from "@/components/marketing/InsightCard";
import SectionLabel from "@/components/marketing/SectionLabel";
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
    <section className="mkt-section border-t border-[var(--mkt-border)] bg-white">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel tone="dark">Related Insights</SectionLabel>
          <Link href="/insights" className="ca-link">
            All insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              image={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
              imageAlt={insight.title}
              categoryLabel={insightCategoryLabels[insight.category]}
              title={insight.title}
              readingTime={insight.readingTime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
