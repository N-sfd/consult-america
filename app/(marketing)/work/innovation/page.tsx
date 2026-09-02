import type { Metadata } from "next";
import Link from "next/link";

import ProductCard from "@/components/innovation/ProductCard";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { listInnovationProducts } from "@/data/innovation-products";

const strategicSlugs = ["mediguide-ai", "joblens"];
const otherApps = [
  "ImportNest",
  "SmartWrite",
  "Bosiano",
  "Sarco",
  "Smart Appliances",
  "AppointEase",
];

export const metadata: Metadata = {
  title: "Applications | ConsultAmerica",
  description:
    "Application engineering portfolio — Data Agent, MediGuide, JobLens, and focused enterprise products.",
};

export default function InnovationPage() {
  const products = listInnovationProducts();
  const flagship = products.find((p) => p.slug === "data-agent");
  const strategic = products.filter((p) => strategicSlugs.includes(p.slug));

  return (
    <>
      <PageHero
        variant="applications"
        layout="product"
        eyebrow="Application Engineering"
        title="Build where packaged software stops."
        description="Design and engineer focused applications around real operational needs."
        productScreens={[
          { src: "/innovation/data-agent-hero.png", alt: "Data Agent platform" },
          { src: "/innovation/mediguide-hero.png", alt: "MediGuide AI" },
          { src: "/innovation/joblens-hero.png", alt: "JobLens" },
        ]}
        primaryCta={{ label: "Explore Data Agent", href: "/work/innovation/data-agent" }}
        secondaryCta={{ label: "View portfolio", href: "#portfolio", variant: "secondary" }}
      />

      <PageSection id="portfolio" tone="soft" eyebrow="Flagship" title="Data Agent">
        {flagship ? (
          <Reveal>
            <div className="max-w-2xl">
              <ProductCard product={flagship} index={0} />
            </div>
          </Reveal>
        ) : null}
      </PageSection>

      <PageSection tone="white" eyebrow="Strategic Applications" title="Products from delivery programs.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strategic.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} index={index + 1} />
            </Reveal>
          ))}
          <Reveal delay={0.16}>
            <Link
              href="/ai-data"
              className="ca-feature-card flex h-full flex-col justify-between rounded-2xl border border-[#C9DDD7] bg-[#F8FAF9] p-5"
            >
              <div>
                <h3 className="font-semibold text-[#122D2E]">Data Explorer</h3>
                <p className="mt-2 text-sm text-[#5B6D6B]">Enterprise analytics and repository intelligence.</p>
              </div>
              <span className="mt-4 text-sm font-semibold text-[#B83A3A]">Explore →</span>
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/capabilities/digital-engineering"
              className="ca-feature-card flex h-full flex-col justify-between rounded-2xl border border-[#C9DDD7] bg-[#F8FAF9] p-5"
            >
              <div>
                <h3 className="font-semibold text-[#122D2E]">Convera</h3>
                <p className="mt-2 text-sm text-[#5B6D6B]">API gateway and enterprise message hub.</p>
              </div>
              <span className="mt-4 text-sm font-semibold text-[#B83A3A]">Explore →</span>
            </Link>
          </Reveal>
        </div>
      </PageSection>

      <PageSection tone="sage" eyebrow="Other Applications" title="Additional portfolio products.">
        <div className="flex flex-wrap gap-2">
          {otherApps.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[#C9DDD7] bg-white px-4 py-2 text-sm font-medium text-[#5B6D6B]"
            >
              {name}
            </span>
          ))}
        </div>
      </PageSection>
    </>
  );
}
