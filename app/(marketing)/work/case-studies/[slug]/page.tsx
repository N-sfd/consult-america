import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import RelatedWork from "@/components/detail-pages/RelatedWork";
import ProjectCapabilities from "@/components/projects/ProjectCapabilities";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectNarrative from "@/components/projects/ProjectNarrative";
import ProjectOutcomes from "@/components/projects/ProjectOutcomes";
import TransformationDiagram from "@/components/projects/TransformationDiagram";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";
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
  if (!project) return { title: "Project Not Found | Consult America" };

  return {
    title: `${project.title} | Consult America`,
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
      <BreadcrumbJsonLd
        items={[
          { name: "Our Work", path: "/work" },
          { name: "Case Studies", path: "/work/case-studies" },
          { name: project.title, path: `/work/case-studies/${slug}` },
        ]}
      />
      <ProjectHero
        category={project.category}
        headline={project.headline}
        summary={project.summary}
        capabilities={project.capabilities}
      >
        <TransformationDiagram />
      </ProjectHero>

      <ProjectNarrative
        eyebrow="Client challenge"
        heading="More than a system replacement."
        body={`${project.clientContext} ${project.challenge}`}
        tone="white"
      />

      <ProjectNarrative
        eyebrow="Transformation"
        heading="How the program was sequenced."
        body={project.approach}
        tone="ice"
      />

      <ProjectNarrative
        eyebrow="What Consult America delivered"
        heading="What's running today."
        body={project.solution}
        tone="white"
      />

      <ProjectCapabilities items={project.capabilities} />

      <ProjectOutcomes items={project.outcomes} />

      <RelatedWork items={project.relatedWork} />

      <ContactCTA headline="Ready to move from plan to production?" />
    </>
  );
}
