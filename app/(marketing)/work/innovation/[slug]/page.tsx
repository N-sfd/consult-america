import type { Metadata } from "next";
import { notFound } from "next/navigation";

import InnovationCTA from "@/components/innovation/InnovationCTA";
import InnovationFeatureList from "@/components/innovation/InnovationFeatureList";
import InnovationHero from "@/components/innovation/InnovationHero";
import ProductExperience from "@/components/innovation/ProductExperience";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import ProjectNarrative from "@/components/projects/ProjectNarrative";
import {
  getInnovationProductBySlug,
  getInnovationProductSlugs,
} from "@/data/innovation-products";

type InnovationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInnovationProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: InnovationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getInnovationProductBySlug(slug);
  if (!product) return { title: "Product Not Found | ConsultAmerica" };

  return {
    title: `${product.name} | ConsultAmerica Innovation Lab`,
    description: product.metaDescription,
  };
}

export default async function InnovationDetailPage({
  params,
}: InnovationDetailPageProps) {
  const { slug } = await params;
  const product = getInnovationProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <InnovationHero
        category={product.category}
        tagline={product.tagline}
        headline={product.headline}
        summary={product.summary}
        liveUrl={product.liveUrl}
        heroImage={product.heroImage}
        heroImageAlt={product.heroImageAlt}
      />

      <InnovationFeatureList items={product.theProduct} />

      <ProjectNarrative
        eyebrow="The Business Problem"
        heading="Why this needed to exist."
        body={product.businessProblem}
        tone="ice"
      />

      <ProductExperience items={product.experience} />

      <ProjectCapabilities items={product.capabilities} />

      <InnovationCTA
        productName={product.name}
        technology={product.technology}
        liveUrl={product.liveUrl}
      />
    </>
  );
}
