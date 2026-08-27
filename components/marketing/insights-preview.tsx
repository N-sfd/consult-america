import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SectionLabel from "@/components/marketing/SectionLabel";
import { insightCategoryLabels } from "@/data/insights";
import { getFeaturedInsights } from "@/lib/insights";

export default function InsightsPreview() {
  const insights = getFeaturedInsights(3);
  if (!insights.length) return null;

  const featured =
    insights.find((item) => item.category === "oracle") ?? insights[0];
  const supporting = insights
    .filter((item) => item.slug !== featured.slug)
    .slice(0, 2);

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

        <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7">
            <Link
              href={`/insights/${featured.slug}`}
              className="group block border border-[var(--mkt-border)] p-5 transition-colors hover:border-[var(--mkt-blue)]/30 md:p-6"
            >
              <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                Featured · {insightCategoryLabels[featured.category]}
              </p>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-[var(--mkt-navy)] transition-colors group-hover:text-[var(--mkt-blue)] md:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--mkt-muted)]">
                {featured.summary}
              </p>
              <span className="ca-link mt-4 inline-flex text-sm">
                Read insight
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </article>

          <ul className="flex flex-col gap-3 lg:col-span-5">
            {supporting.map((insight) => (
              <li key={insight.slug}>
                <Link
                  href={`/insights/${insight.slug}`}
                  className="group flex items-center justify-between gap-4 border border-[var(--mkt-border)] px-4 py-4 transition-colors hover:border-[var(--mkt-blue)]/30"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium tracking-[-0.02em] text-[var(--mkt-navy)] transition-colors group-hover:text-[var(--mkt-blue)] md:text-base">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--mkt-muted)]">
                      {insightCategoryLabels[insight.category]}
                      <span className="mx-2 text-[var(--mkt-border)]">·</span>
                      {insight.readingTime}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--mkt-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mkt-blue)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
