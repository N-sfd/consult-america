import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CapabilityOverview from "@/components/detail-pages/CapabilityOverview";
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
  if (!page) return { title: "Industry Not Found | Consult America" };

  return {
    title: `${page.title} | Consult America`,
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
      />
      <CapabilityOverview heading="Where we focus" items={page.overview} />
      <OutcomeGrid items={page.outcomes} />
      <RelatedWork items={page.relatedWork ?? []} />
      <RelatedInsights category={page.insightCategory} />
      <ContactCTA headline={`Ready to modernize ${page.title.toLowerCase()}?`} />
    </>
  );
}
