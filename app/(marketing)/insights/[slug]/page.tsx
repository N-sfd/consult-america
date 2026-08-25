import type { Metadata } from "next";
import { notFound } from "next/navigation";

import InsightArticle from "@/components/insights/insight-article";
import {
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

  return <InsightArticle insight={insight} related={related} />;
}
