import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CapabilityOverview from "@/components/detail-pages/CapabilityOverview";
import ContactCTA from "@/components/detail-pages/ContactCTA";
import DetailHero from "@/components/detail-pages/DetailHero";
import InlinePracticeCTA from "@/components/detail-pages/InlinePracticeCTA";
import OutcomeGrid from "@/components/detail-pages/OutcomeGrid";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import RelatedWork from "@/components/detail-pages/RelatedWork";
import PageSection from "@/components/marketing/inner-page/page-section";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
import {
  capabilityPages,
  getCapabilityPageSlugs,
} from "@/lib/marketing/capability-pages";

const SERVICE_KEY_BY_SLUG: Record<string, string> = {
  "enterprise-transformation": "general",
  "digital-engineering": "application_engineering",
  "managed-delivery": "general",
};

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
  if (!page) return { title: "Capability Not Found" };

  return {
    title: `${page.title}`,
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
      <BreadcrumbJsonLd
        items={[
          { name: "Capabilities", path: "/capabilities" },
          { name: page.title, path: `/capabilities/${slug}` },
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
        layout={slug === "managed-delivery" ? "split-right" : "split-left"}
      />
      <CapabilityOverview heading="Where we focus" items={page.overview} />
      <OutcomeGrid items={page.outcomes} />
      <PageSection tone="soft" accent={false}>
        <InlinePracticeCTA
          practice={page.title}
          serviceKey={SERVICE_KEY_BY_SLUG[slug]}
          prompt={`Have a specific ${page.title.toLowerCase()} challenge in mind? Talk it through with a practice lead.`}
        />
      </PageSection>
      <RelatedWork items={page.relatedWork ?? []} />
      <RelatedInsights category={page.insightCategory} />
      <ContactCTA headline={`Ready to talk ${page.title.toLowerCase()}?`} />
    </>
  );
}
