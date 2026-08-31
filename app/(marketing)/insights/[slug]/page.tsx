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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.summary,
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    author: {
      "@type": "Organization",
      name: "Consult America",
    },
    publisher: {
      "@type": "Organization",
      name: "Consult America",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/insights/${insight.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Insights", item: `${siteUrl}/insights` },
      { "@type": "ListItem", position: 2, name: insight.title, item: `${siteUrl}/insights/${insight.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <InsightArticle insight={insight} related={related} />
    </>
  );
}
