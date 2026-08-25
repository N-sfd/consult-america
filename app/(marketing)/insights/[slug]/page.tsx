import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionEyebrow } from "@/components/section";
import { insightCategoryLabels } from "@/data/insights";
import {
  formatInsightDate,
  getAllInsightSlugs,
  getInsightBySlug,
  getRelatedInsights,
} from "@/lib/insights";

interface InsightDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: InsightDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) {
    return { title: "Insight Not Found | ConsultAmerica" };
  }

  return {
    title: `${insight.title} | ConsultAmerica Insights`,
    description: insight.summary,
  };
}

export default async function InsightDetailPage({
  params,
}: InsightDetailPageProps) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const related = getRelatedInsights(insight.slug, 3);

  return (
    <>
      <Section tone="navy">
        <Link href="/insights" className="ca-link text-sm">
          All Insights
        </Link>

        <SectionEyebrow onDark>
          {insightCategoryLabels[insight.category]}
        </SectionEyebrow>

        <h1 className="ca-h1 mt-6 max-w-4xl">{insight.title}</h1>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <span>{formatInsightDate(insight.publishedAt)}</span>
          <span>{insight.readingTime} read</span>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
          {insight.summary}
        </p>
      </Section>

      <Section tone="navy" className="!pt-0">
        <article className="max-w-3xl space-y-6">
          {insight.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-white/70">
              {paragraph}
            </p>
          ))}
        </article>

        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="ca-eyebrow text-white/45">Continue the conversation</p>
              <p className="mt-4 max-w-xl text-white/65">
                Discuss how these ideas apply to your Oracle, AI, or
                transformation program.
              </p>
            </div>
            <Link href="/contact" className="ca-button-primary shrink-0">
              Contact ConsultAmerica
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-10">
            <p className="ca-eyebrow text-white/45">Related Insights</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  className="group border-t border-white/15 pt-5"
                >
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                    {insightCategoryLabels[item.category]}
                  </p>
                  <h2 className="mt-3 text-lg font-medium tracking-[-0.03em] transition-colors group-hover:text-[#93c5fd]">
                    {item.title}
                  </h2>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
