"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink, X } from "lucide-react";
import Link from "next/link";

import SectionLabel from "@/components/marketing/SectionLabel";
import ProjectCard from "@/components/marketing/project-card";
import {
  portfolioCategories,
  portfolioProjects,
  type PortfolioProject,
} from "@/lib/marketing/portfolio-data";

const editorialLayoutOrder = [
  "data-agent",
  "mediguide",
  "joblens",
  "data-explorer",
  "convera",
  "hr-talent",
  "importnest",
  "smartwrite",
  "bosiano",
  "sarco-appliances",
  "smart-appliances",
  "appointease",
];

export default function ApplicationPortfolio() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = useMemo(() => {
    const filtered =
      selectedFilter === "all"
        ? portfolioProjects
        : portfolioProjects.filter((p) => p.categoryKey === selectedFilter);

    return editorialLayoutOrder
      .map((id) => filtered.find((p) => p.id === id))
      .filter((p): p is PortfolioProject => Boolean(p));
  }, [selectedFilter]);

  return (
    <>
      <section className="bg-[#F0F6F4] text-[#122D2E] py-20 sm:py-24 border-b border-[#DCE4E1]">
        <div className="ca-shell">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DCE4E1]">
            <div>
              <SectionLabel tone="burgundy">APPLICATION DEVELOPMENT PORTFOLIO</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E]">
                From idea to working product.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#5B6D6B]">
              Real applications engineered by Consult America — from AI platforms to commerce and service workflows.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {portfolioCategories.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer min-h-[44px] ${
                    isSelected
                      ? "bg-[#073B3A] text-white shadow-xs"
                      : "bg-white text-[#5B6D6B] border border-[#DCE4E1] hover:border-[#176A63] hover:text-[#073B3A]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={setActiveProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-16 rounded-xl border border-[#DCE4E1] bg-white p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                  CUSTOM APPLICATION ENGINEERING
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#122D2E]">
                  Need software built around your workflow?
                </h3>
                <p className="text-sm text-[#5B6D6B] max-w-xl">
                  We design and ship applications, portals, and AI experiences that packaged software cannot deliver.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/capabilities/digital-engineering"
                  className="ca-button-primary inline-flex items-center justify-center gap-2 !min-h-[48px] text-sm font-semibold"
                >
                  <span>Explore Engineering</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://agentomatix-portfolio.pages.dev/portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 !min-h-[48px] rounded-lg border border-[#DCE4E1] px-5 text-sm font-semibold text-[#073B3A] hover:border-[#176A63] transition-colors"
                >
                  <span>Explore Full Portfolio</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-[#073B3A]/60 backdrop-blur-[2px] cursor-pointer"
            onClick={() => setActiveProject(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative z-10 w-full max-w-lg rounded-xl border border-[#DCE4E1] bg-white p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-[#5B6D6B] hover:bg-[#F0F6F4] cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#176A63]">
              {activeProject.categoryLabel}
            </p>
            <h3 id="project-modal-title" className="mt-2 font-serif text-2xl font-semibold text-[#073B3A]">
              {activeProject.name}
            </h3>
            <p className="mt-3 text-sm text-[#5B6D6B] leading-relaxed">{activeProject.summary}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {activeProject.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="rounded px-2 py-0.5 text-[0.68rem] font-medium text-[#173E3A] bg-[#E8F1EE]"
                >
                  {cap}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
              {activeProject.detailHref.startsWith("http") ? (
                <a
                  href={activeProject.detailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1 text-[#B83A3A]"
                >
                  View Project <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={activeProject.detailHref}
                  onClick={() => setActiveProject(null)}
                  className="inline-flex min-h-[44px] items-center gap-1 text-[#B83A3A]"
                >
                  View Project <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1 text-[#5B6D6B]"
                >
                  Live Demo <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
