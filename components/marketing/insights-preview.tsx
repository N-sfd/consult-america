import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import InsightCard from "@/components/marketing/InsightCard";
import SectionLabel from "@/components/marketing/SectionLabel";
import { insightCategoryLabels } from "@/data/insights";
import { getFeaturedInsights } from "@/lib/insights";

const insightImages = [
  "https://images.unsplash.com/photo-1507679799987-4e924a4c2b4b?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=75",
];

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);

  if (!insights.length) return null;

  return (
    <section
      id="insights"
      className="mkt-section border-t border-[var(--mkt-border)] bg-[var(--mkt-white)]"
    >
      <div className="mkt-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel tone="dark">Insights</SectionLabel>
            <EditorialHeading className="mt-5 max-w-2xl text-[var(--mkt-navy)]">
              Thinking from the work.
            </EditorialHeading>
          </div>
          <Link href="/insights" className="ca-link shrink-0">
            All insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.slug}
              href={`/insights/${insight.slug}`}
              image={insightImages[index] ?? insightImages[0]}
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
