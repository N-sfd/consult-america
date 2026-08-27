import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import RelatedWork from "@/components/detail-pages/RelatedWork";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectNarrative from "@/components/projects/ProjectNarrative";
import ProjectOutcomes from "@/components/projects/ProjectOutcomes";
import TransformationDiagram from "@/components/projects/TransformationDiagram";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/data/case-studies";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);
  if (!project) return { title: "Project Not Found | ConsultAmerica" };

  return {
    title: `${project.title} | ConsultAmerica`,
    description: project.metaDescription,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <ProjectHero
        category={project.category}
        headline={project.headline}
        summary={project.summary}
        capabilities={project.capabilities}
      >
        <TransformationDiagram />
      </ProjectHero>

      <ProjectNarrative
        eyebrow="Client Context"
        heading="Where this transformation started."
        body={project.clientContext}
        tone="white"
      />

      <ProjectNarrative
        eyebrow="The Challenge"
        heading="More than a system replacement."
        body={project.challenge}
        tone="ice"
      />

      <ProjectNarrative
        eyebrow="The Approach"
        heading="An end-to-end transformation, sequenced with care."
        body={project.approach}
        tone="white"
      />

      <ProjectNarrative
        eyebrow="Solution & Delivery"
        heading="What's running today."
        body={project.solution}
        tone="ice"
      />

      <ProjectCapabilities items={project.capabilities} />

      <ProjectOutcomes items={project.outcomes} />

      <RelatedWork items={project.relatedWork} />

      <ContactCTA headline="Ready to move from plan to production?" />
    </>
  );
}
