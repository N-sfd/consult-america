import type { Metadata } from "next";

import CaseStudyCard from "@/components/marketing/CaseStudyCard";
import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { listCaseStudies } from "@/data/case-studies";

export const metadata: Metadata = {
  title: "Work | ConsultAmerica",
  description:
    "Case studies from ConsultAmerica's enterprise transformation, Oracle, and AI & data engagements.",
};

export default function CaseStudiesPage() {
  const projects = listCaseStudies();

  return (
    <>
      <section className="mkt-section bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]">
        <div className="mkt-shell">
          <SectionLabel tone="blue">Work</SectionLabel>
          <EditorialHeading
            as="h1"
            size="hero"
            className="mt-7 max-w-2xl text-[var(--mkt-navy)]"
          >
            Outcomes you can see.
          </EditorialHeading>
          <p className="mkt-body-lg mt-7 max-w-lg">
            Case studies from enterprise transformation, Oracle, and AI &amp;
            data engagements — from strategy through production.
          </p>
        </div>
      </section>

      <div>
        {projects.map((project, index) => (
          <CaseStudyCard
            key={project.slug}
            number={String(index + 1).padStart(2, "0")}
            category={project.category}
            title={project.title}
            description={project.summary}
            capabilities={project.capabilities.slice(0, 4)}
            href={`/work/case-studies/${project.slug}`}
            image={project.image}
            imageAlt={project.imageAlt}
            tone="light"
          />
        ))}
      </div>
    </>
  );
}
