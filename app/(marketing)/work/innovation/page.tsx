import type { Metadata } from "next";
import Link from "next/link";

import ProductCard from "@/components/innovation/ProductCard";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { listInnovationProducts } from "@/data/innovation-products";
import { portfolioProjects } from "@/lib/marketing/portfolio-data";

const strategicSlugs = ["mediguide-ai", "joblens"];
const otherApps = portfolioProjects.filter((project) => project.tier === 3);

export const metadata: Metadata = {
  title: "Consult America Labs",
  description:
    "Consult America Labs — internal innovation builds (Data Agent, MediGuide AI, JobLens) that prove new patterns. For client application engineering delivery, see Application Engineering.",
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
        eyebrow="Consult America Labs"
        title="Where we prove new patterns before we deliver them."
        description="Internal products Consult America Labs designs, builds, and operates to explore what governed AI and modern application patterns can do — separate from client application engineering delivery."
        productScreens={[
          { src: "/innovation/data-agent-hero.png", alt: "Data Agent platform" },
          { src: "/innovation/mediguide-hero.png", alt: "MediGuide AI" },
          { src: "/innovation/joblens-hero.png", alt: "JobLens" },
        ]}
        primaryCta={{ label: "Explore Data Agent", href: "/work/innovation/data-agent" }}
        secondaryCta={{ label: "View portfolio", href: "#portfolio", variant: "secondary" }}
      />

      <PageSection tone="white" eyebrow="Labs vs. Delivery" title="These are internal builds, not a product catalog.">
        <div className="max-w-3xl text-sm leading-relaxed text-[#5B6D6B] sm:text-base">
          <p>
            Everything on this page is something Consult America Labs designed, built, and runs
            ourselves — proof of what governed AI and modern application engineering can do, not a
            packaged product for sale. They inform how we deliver for clients; they aren&apos;t what we
            deliver.
          </p>
          <p className="mt-3">
            Looking for us to build, modernize, or integrate an application for your organization?
            That&apos;s a distinct service —{" "}
            <Link
              href="/capabilities/digital-engineering"
              className="font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              see Application Engineering
            </Link>
            .
          </p>
        </div>
      </PageSection>

      <PageSection id="portfolio" tone="soft" eyebrow="Flagship" title="Data Agent">
        {flagship ? (
          <Reveal>
            <div className="max-w-2xl">
              <ProductCard product={flagship} index={0} />
            </div>
          </Reveal>
        ) : null}
      </PageSection>

      <PageSection tone="white" eyebrow="More from the Labs" title="Additional internal products.">
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
          {otherApps.map((app) => (
            <a
              key={app.id}
              href={app.liveUrl ?? app.detailHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#C9DDD7] bg-white px-4 py-2 text-sm font-medium text-[#5B6D6B] transition-colors hover:border-[#176A63] hover:text-[#176A63]"
            >
              {app.name}
            </a>
          ))}
        </div>
      </PageSection>
    </>
  );
}
