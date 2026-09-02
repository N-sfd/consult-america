import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { getIndustryPageSlugs, industryPages } from "@/lib/marketing/industry-pages";
import { stockImage } from "@/lib/marketing/stock-images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Industries | Consult America",
  description:
    "Sector context, not generic playbooks — for public sector, regulated enterprise, and high-growth operators.",
};

export default function IndustriesPage() {
  const industries = getIndustryPageSlugs().map((slug) => {
    const page = industryPages[slug];
    return {
      slug,
      title: page.title,
      description: page.description,
      href: `/industries/${slug}`,
      image: page.heroImage,
    };
  });

  return (
    <>
      <PageHero
        variant="industries"
        layout="split-right"
        imageShape="offset"
        photoScale="editorial"
        eyebrow="Industries"
        title="Technology grounded in industry operations."
        description="Bring enterprise platforms, data, AI and engineering into the context of how organizations actually operate."
        image={stockImage("industriesSectionFinancial", { w: 1200, q: 82 })}
        imageAlt="Industry operations and enterprise technology"
        secondaryImage={{
          src: stockImage("industriesSectionHealthcare", { w: 800, q: 82 }),
          alt: "Healthcare operations context",
          shape: "arch",
        }}
        primaryCta={{ label: "Explore industries", href: "/industries/financial-services" }}
      />

      <PageSection tone="soft" eyebrow="Sectors" title="Domain context, not generic playbooks.">
        <div className="space-y-0">
          {industries.map((row, index) => (
            <Reveal key={row.slug} delay={index * 0.06}>
              <Link
                href={row.href}
                className="ca-editorial-row group grid items-center gap-8 border-b border-[#E1ECE8] py-9 first:border-t lg:grid-cols-12 lg:gap-12 lg:py-10"
              >
                <div className={index % 2 === 1 ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5"}>
                  <p className="mkt-eyebrow text-[#176A63]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#122D2E] group-hover:text-[#B83A3A] md:text-[1.65rem]">
                    {row.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5B6D6B]">
                    {row.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                    Learn more <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div
                  className={
                    index % 2 === 1
                      ? "lg:col-span-6 lg:col-start-1 lg:row-start-1"
                      : "lg:col-span-6"
                  }
                >
                  <div
                    className={cn(
                      "ca-hero-img-frame relative aspect-[16/10] max-h-[360px] overflow-hidden",
                      index % 3 === 0 && "ca-hero-shape-arch",
                      index % 3 === 1 && "ca-hero-shape-offset",
                      index % 3 === 2 && "ca-hero-shape-cut",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.image}
                      alt=""
                      className="mkt-img-hoverable h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageSection>

      <ContactCTA />
    </>
  );
}
