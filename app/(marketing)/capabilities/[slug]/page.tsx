import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CapabilityOverview from "@/components/detail-pages/CapabilityOverview";
import ContactCTA from "@/components/detail-pages/ContactCTA";
import DetailHero from "@/components/detail-pages/DetailHero";
import OutcomeGrid from "@/components/detail-pages/OutcomeGrid";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import RelatedWork from "@/components/detail-pages/RelatedWork";
import {
  capabilityPages,
  getCapabilityPageSlugs,
} from "@/lib/marketing/capability-pages";

type CapabilityDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCapabilityPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CapabilityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = capabilityPages[slug];
  if (!page) return { title: "Capability Not Found | Consult America" };

  return {
    title: `${page.title} | Consult America`,
    description: page.metaDescription,
  };
}

export default async function CapabilityDetailPage({
  params,
}: CapabilityDetailPageProps) {
  const { slug } = await params;
  const page = capabilityPages[slug];

  if (!page) notFound();

  return (
    <>
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
      <ContactCTA headline={`Ready to talk ${page.title.toLowerCase()}?`} />
    </>
  );
}
