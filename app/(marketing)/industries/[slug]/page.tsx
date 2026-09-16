import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CapabilityOverview from "@/components/detail-pages/CapabilityOverview";
import ComplianceHighlights from "@/components/detail-pages/ComplianceHighlights";
import ContactCTA from "@/components/detail-pages/ContactCTA";
import DetailHero from "@/components/detail-pages/DetailHero";
import OutcomeGrid from "@/components/detail-pages/OutcomeGrid";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import RelatedWork from "@/components/detail-pages/RelatedWork";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import { getIndustryPageSlugs, industryPages } from "@/lib/marketing/industry-pages";

type IndustryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getIndustryPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = industryPages[slug];
  if (!page) return { title: "Industry Not Found" };

  return {
    title: `${page.title}`,
    description: page.metaDescription,
  };
}

export default async function IndustryDetailPage({
  params,
}: IndustryDetailPageProps) {
  const { slug } = await params;
  const page = industryPages[slug];

  if (!page) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Industries", path: "/industries" },
          { name: page.title, path: `/industries/${slug}` },
        ]}
      />
      <DetailHero
        kicker={page.kicker}
        title={page.headline}
        description={page.description}
        focusAreas={page.focusAreas}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        slug={slug}
        layout={slug === "financial-services" ? "split-right" : "split-left"}
      />
      <CapabilityOverview heading="Where we focus" items={page.overview} />
      {page.domainUseCases?.length ? (
        <CapabilityOverview
          eyebrow="Domain Use Cases"
          heading="Specialized patterns for this industry"
          items={page.domainUseCases}
        />
      ) : null}
      <OutcomeGrid items={page.outcomes} />
      {page.complianceHighlights?.length ? (
        <ComplianceHighlights items={page.complianceHighlights} />
      ) : null}
      <RelatedWork items={page.relatedWork ?? []} />
      <RelatedInsights category={page.insightCategory} />
      <ContactCTA headline={`Ready to modernize ${page.title.toLowerCase()}?`} />
    </>
  );
}
