import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SectionLabel from "@/components/marketing/SectionLabel";
import { insightCategoryLabels } from "@/data/insights";
import { getFeaturedInsights } from "@/lib/insights";

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);
  if (!insights.length) return null;

  return (
    <section
      id="insights"
      className="mkt-section-compact border-t border-[var(--mkt-border)] bg-[var(--mkt-white)]"
    >
      <div className="mkt-shell">
        <div className="flex items-end justify-between gap-6">
          <SectionLabel tone="dark">Insights</SectionLabel>
          <Link href="/insights" className="ca-link shrink-0 text-sm">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-[var(--mkt-border)] border-t border-[var(--mkt-border)]">
          {insights.map((insight) => (
            <li key={insight.slug}>
              <Link
                href={`/insights/${insight.slug}`}
                className="group flex items-center justify-between gap-6 py-4 md:py-5"
              >
                <div>
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)] transition-colors group-hover:text-[var(--mkt-blue)] md:text-xl">
                    {insight.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--mkt-muted)]">
                    {insightCategoryLabels[insight.category]}
                    <span className="mx-2 text-[var(--mkt-border)]">·</span>
                    {insight.readingTime}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--mkt-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mkt-blue)]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
