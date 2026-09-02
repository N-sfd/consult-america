import type { Metadata } from "next";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import IndustryTile from "@/components/marketing/IndustryTile";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import { getIndustryPageSlugs, industryPages } from "@/lib/marketing/industry-pages";
import { stockImage } from "@/lib/marketing/stock-images";

export const metadata: Metadata = {
  title: "Industries | Consult America",
  description:
    "Sector context, not generic playbooks — for public sector, regulated enterprise, and high-growth operators.",
};

export default function IndustriesPage() {
  const industries = getIndustryPageSlugs().map(
    (slug, index) => [slug, index] as const,
  );

  return (
    <>
      <PageHero
        variant="industries"
        layout="split-right"
        imageShape="wide"
        eyebrow="Industries"
        title="Technology grounded in industry operations."
        description="Bring enterprise platforms, data, AI and engineering into the context of how organizations actually operate."
        image={stockImage("industriesSectionFinancial", { w: 1400, q: 80 })}
        imageAlt="Industry operations and enterprise technology"
        primaryCta={{ label: "Explore industries", href: "/industries/financial-services" }}
      />

      <PageSection tone="soft" eyebrow="Sectors" title="Domain context, not generic playbooks.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map(([slug, index]) => {
            const page = industryPages[slug];
            return (
              <IndustryTile
                key={slug}
                number={String(index + 1).padStart(2, "0")}
                title={page.title}
                description={page.description}
                href={`/industries/${slug}`}
                image={page.heroImage}
                imageAlt={page.heroImageAlt}
              />
            );
          })}
        </div>
      </PageSection>

      <ContactCTA />
    </>
  );
}
