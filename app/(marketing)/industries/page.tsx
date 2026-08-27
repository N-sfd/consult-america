import type { Metadata } from "next";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import EditorialHeading from "@/components/marketing/EditorialHeading";
import IndustryTile from "@/components/marketing/IndustryTile";
import SectionLabel from "@/components/marketing/SectionLabel";
import { getIndustryPageSlugs, industryPages } from "@/lib/marketing/industry-pages";

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
      <section className="mkt-section bg-[var(--mkt-warm)] text-[var(--mkt-navy)]">
        <div className="mkt-shell">
          <SectionLabel tone="dark">Industries</SectionLabel>
          <EditorialHeading as="h1" size="hero" className="mt-6 max-w-3xl text-[var(--mkt-navy)]">
            Sector context, not generic playbooks.
          </EditorialHeading>
          <p className="mkt-body-lg mt-6 max-w-xl">
            We work with public sector, regulated enterprise, and
            high-growth operators who need systems that hold up under
            scrutiny.
          </p>
        </div>
      </section>

      <section className="bg-[var(--mkt-warm)] pb-20 lg:pb-24">
        <div className="mkt-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>

      <ContactCTA />
    </>
  );
}
