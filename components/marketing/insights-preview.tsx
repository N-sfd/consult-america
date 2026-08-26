import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import InsightCard from "@/components/marketing/InsightCard";
import SectionLabel from "@/components/marketing/SectionLabel";
import { insightCategoryLabels } from "@/data/insights";
import { getFeaturedInsights } from "@/lib/insights";

const insightImages = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=75",
];

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);
  const [featured, ...rest] = insights;

  if (!featured) return null;

  return (
    <section
      id="insights"
      className="mkt-section border-t border-[var(--mkt-border)] bg-[var(--mkt-white)]"
    >
      <div className="mkt-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionLabel tone="dark">Insights</SectionLabel>
          </div>

          <div className="lg:col-span-8">
            <EditorialHeading className="max-w-3xl text-[var(--mkt-navy)]">
              Thinking from the work.
            </EditorialHeading>
            <p className="mkt-body-lg mt-6 max-w-2xl">
              Practical briefings from enterprise programs—focused on what
              actually reaches production.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <InsightCard
            size="large"
            className="lg:col-span-7"
            href={`/insights/${featured.slug}`}
            image={insightImages[0]}
            categoryLabel={insightCategoryLabels[featured.category]}
            title={featured.title}
            summary={featured.summary}
            readingTime={featured.readingTime}
          />

          <div className="flex flex-col gap-10 lg:col-span-5">
            {rest.map((item, index) => (
              <InsightCard
                key={item.slug}
                className="flex-1"
                href={`/insights/${item.slug}`}
                image={insightImages[(index + 1) % insightImages.length]}
                categoryLabel={insightCategoryLabels[item.category]}
                title={item.title}
                readingTime={item.readingTime}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-end border-t border-[var(--mkt-border)] pt-10">
          <Link href="/insights" className="ca-link">
            View all insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
