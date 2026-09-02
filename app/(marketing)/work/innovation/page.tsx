import type { Metadata } from "next";
import Link from "next/link";

import ProductCard from "@/components/innovation/ProductCard";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { listInnovationProducts } from "@/data/innovation-products";

export const metadata: Metadata = {
  title: "Innovation & Products | ConsultAmerica",
  description:
    "AI platforms and digital products built by ConsultAmerica's Innovation Lab — working technology, not just consulting claims.",
};

export default function InnovationPage() {
  const products = listInnovationProducts();
  const flagship = products.find((p) => p.slug === "data-agent");
  const strategic = products.filter((p) => p.slug !== "data-agent");

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
        secondaryCta={{ label: "View all products", href: "#portfolio", variant: "secondary" }}
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

      <PageSection
        tone="white"
        eyebrow="Strategic Applications"
        title="Focused products from delivery programs."
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {strategic.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} index={index + 1} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-sm text-[#5B6D6B]">
          Additional portfolio applications include Data Explorer and Convera —{" "}
          <Link href="/ai-data" className="font-semibold text-[#B83A3A] hover:underline">
            explore AI &amp; Data
          </Link>
          .
        </p>
      </PageSection>
    </>
  );
}
