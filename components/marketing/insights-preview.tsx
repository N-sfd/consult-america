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
      className="mkt-section border-t border-[#D7CCBD] bg-[#FFFAF2] text-[#261F1B]"
    >
      <div className="mkt-shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel tone="burgundy">Insights</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[#261F1B]">
              Perspectives on enterprise transformation.
            </h2>
          </div>
          <Link href="/insights" className="ca-link shrink-0 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]">
            View all articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7">
            <Link
              href={`/insights/${featured.slug}`}
              className="group block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 transition-all duration-200 hover:border-[#7D2639]/40 hover:shadow-[0_16px_40px_rgba(38,31,27,0.06)] md:p-8"
            >
              <p className="mkt-eyebrow text-[#7D2639]">
                Featured · {insightCategoryLabels[featured.category]}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[#261F1B] transition-colors group-hover:text-[#7D2639] md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3.5 text-sm leading-relaxed text-[#695F57]">
                {featured.summary}
              </p>
              <span className="ca-link mt-5 inline-flex text-sm font-semibold text-[#7D2639] group-hover:text-[#681F30]">
                Read insight
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </article>

          <ul className="flex flex-col gap-4 lg:col-span-5">
            {supporting.map((insight) => (
              <li key={insight.slug}>
                <Link
                  href={`/insights/${insight.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] px-5 py-5 transition-all duration-200 hover:border-[#7D2639]/40 hover:shadow-[0_12px_32px_rgba(38,31,27,0.04)]"
                >
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#7D2639]">
                      {insightCategoryLabels[insight.category]}
                    </p>
                    <h3 className="mt-1 truncate text-base font-bold tracking-[-0.015em] text-[#261F1B] transition-colors group-hover:text-[#7D2639] md:text-lg">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#695F57]">
                      {insight.readingTime}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4.5 w-4.5 shrink-0 text-[#695F57] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#7D2639]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
