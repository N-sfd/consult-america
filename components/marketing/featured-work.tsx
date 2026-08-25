"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";

const projects = [
  {
    number: "01",
    category: "Oracle Cloud Transformation",
    title: "Modernizing enterprise operations with Oracle Fusion Cloud",
    description:
      "Supporting the transformation of complex finance, procurement, projects, integration, testing, and reporting processes through a connected Oracle Cloud environment.",
    capabilities: [
      "Oracle Fusion Cloud",
      "Finance",
      "Procurement",
      "Projects",
      "Integration",
    ],
    href: "/projects/oracle-cloud-transformation",
    featured: true,
  },
  {
    number: "02",
    category: "Public Sector",
    title: "Transforming finance and procurement operations",
    description:
      "Modernizing public-sector financial management, purchasing, project accounting, approvals, reporting, and end-to-end business processes.",
    capabilities: ["Financials", "Procurement", "PPM", "Testing"],
    href: "/projects/public-sector-finance-procurement",
    featured: false,
  },
  {
    number: "03",
    category: "AI & Automation",
    title: "Turning complex documents into structured enterprise intelligence",
    description:
      "Using AI-assisted extraction, classification, search, and workflow automation to turn contracts and technical documents into actionable information.",
    capabilities: [
      "Document Intelligence",
      "Enterprise AI",
      "Search",
      "Automation",
    ],
    href: "/projects/ai-document-intelligence",
    featured: false,
  },
];

const additionalWork = [
  {
    title: "Integration Modernization",
    description:
      "Connecting enterprise applications, APIs, data flows, and business processes across cloud and legacy environments.",
    href: "/projects/integration-modernization",
  },
  {
    title: "Data & Analytics",
    description:
      "Improving enterprise reporting, decision support, dashboards, data integration, and operational visibility.",
    href: "/projects/data-analytics",
  },
];

type Project = (typeof projects)[number];

export default function FeaturedWork() {
  const featuredProject = projects.find((project) => project.featured);
  const supportingProjects = projects.filter((project) => !project.featured);

  return (
    <Section id="work" className="bg-[var(--ca-off-white)] text-[#05070d]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-black/45">FEATURED WORK</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-[#05070d]">
              Transformation is measured
              <br />
              by what goes live.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65">
              Selected examples of how ConsultAmerica brings strategy,
              enterprise platforms, data, AI, and delivery together to solve
              complex operational and technology challenges.
            </p>
          </motion.div>
        </div>

        {featuredProject && <FeaturedProject project={featuredProject} />}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {supportingProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>

        <div className="mt-20 border-t border-black/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="ca-eyebrow text-black/40">OTHER SELECTED WORK</p>
            </div>

            <div className="lg:col-span-8">
              {additionalWork.map((project) => (
                <Link
                  key={project.title}
                  href={project.href}
                  className="group grid gap-4 border-b border-black/10 py-7 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-medium tracking-[-0.03em] text-[#05070d] transition-colors duration-200 group-hover:text-[var(--ca-blue)]">
                      {project.title}
                    </h3>
                  </div>

                  <div className="md:col-span-7">
                    <p className="text-sm leading-6 text-black/50">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex md:col-span-1 md:justify-end">
                    <ArrowUpRight className="h-5 w-5 text-[#05070d] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Link href="/projects" className="ca-link">
            View All Projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65 }}
      className="mt-20"
    >
      <Link
        href={project.href}
        className="group grid overflow-hidden bg-[#071A2F] text-white lg:grid-cols-12"
      >
        <div className="flex min-h-[420px] flex-col justify-between p-8 md:p-12 lg:col-span-7 lg:min-h-[560px]">
          <div className="flex items-center justify-between gap-4">
            <span className="ca-eyebrow text-white/45">{project.number}</span>
            <span className="ca-eyebrow text-right text-white/45">
              {project.category}
            </span>
          </div>

          <div>
            <h3 className="max-w-3xl text-3xl font-medium leading-[1.05] tracking-[-0.04em] md:text-5xl">
              {project.title}
            </h3>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/65"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-white/5 lg:col-span-5 lg:min-h-full">
          <ProjectVisual />

          <ArrowUpRight className="absolute bottom-8 right-8 h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </Link>
    </motion.article>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
      }}
    >
      <Link
        href={project.href}
        className="group flex h-full flex-col border-t border-black/15 py-8"
      >
        <div className="flex items-center justify-between">
          <span className="ca-eyebrow text-black/40">{project.number}</span>

          <ArrowUpRight className="h-5 w-5 text-[#05070d] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        <p className="mt-8 text-sm font-medium text-[var(--ca-blue)]">
          {project.category}
        </p>

        <h3 className="mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-0.04em] text-[#05070d] transition-colors duration-200 group-hover:text-[var(--ca-blue)]">
          {project.title}
        </h3>

        <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-8">
          {project.capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-black/50"
            >
              {capability}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}

function ProjectVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute left-[15%] top-[12%] h-[76%] w-px bg-white/10" />
      <div className="absolute left-[40%] top-[12%] h-[76%] w-px bg-white/10" />
      <div className="absolute left-[65%] top-[12%] h-[76%] w-px bg-white/10" />

      <div className="absolute left-[10%] top-[24%] h-px w-[78%] bg-white/10" />
      <div className="absolute left-[10%] top-[50%] h-px w-[78%] bg-white/10" />
      <div className="absolute left-[10%] top-[76%] h-px w-[78%] bg-white/10" />

      <div className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full bg-[var(--ca-blue)]" />
      <div className="absolute left-[43%] top-[54%] h-3 w-3 rounded-full bg-white/70" />
      <div className="absolute left-[68%] top-[32%] h-3 w-3 rounded-full bg-[var(--ca-blue)]" />

      <div className="absolute bottom-8 left-8">
        <p className="ca-eyebrow text-white/35">ENTERPRISE TRANSFORMATION</p>
      </div>
    </div>
  );
}
