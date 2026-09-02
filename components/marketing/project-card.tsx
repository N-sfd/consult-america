"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import type { PortfolioProject } from "@/lib/marketing/portfolio-data";

interface ProjectCardProps {
  project: PortfolioProject;
  onViewDetails?: (project: PortfolioProject) => void;
  className?: string;
}

const spanClasses: Record<string, string> = {
  flagship: "lg:col-span-12",
  large: "lg:col-span-6",
  standard: "lg:col-span-4",
};

const imageHeights: Record<number, string> = {
  1: "h-[240px] sm:h-[280px] lg:h-[300px]",
  2: "h-[220px] sm:h-[250px] lg:h-[260px]",
  3: "h-[200px] sm:h-[220px] lg:h-[240px]",
};

export default function ProjectCard({ project, onViewDetails, className = "" }: ProjectCardProps) {
  const isExternalDetail = project.detailHref.startsWith("http");
  const imageHeight = imageHeights[project.tier] ?? imageHeights[3];
  const span = spanClasses[project.layoutSpan ?? "standard"];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className={`group flex flex-col bg-white border border-[#DDE6E3] rounded-xl shadow-[0_2px_12px_rgba(7,59,58,0.04)] transition-all duration-[600ms] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(7,59,58,0.08)] ${span} ${className}`}
    >
      <div className={`relative w-full overflow-hidden ${imageHeight} rounded-t-[11px] bg-white`}>
        <div className="absolute inset-2 sm:inset-2.5 overflow-hidden rounded-[10px] border border-[#DDE6E3] bg-white shadow-[0_18px_50px_rgba(7,59,58,0.08)]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className={`transition-transform duration-[600ms] group-hover:scale-[1.02] ${
              project.imageFit === "contain" || project.image.includes("/innovation/")
                ? "object-contain object-top bg-[#F7FAF9] p-1"
                : "object-cover object-top"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#176A63]">
          {project.categoryLabel}
        </p>

        <h3 className="mt-2 font-serif text-lg sm:text-xl font-semibold text-[#073B3A] leading-tight">
          {project.name}
        </h3>

        <p className="mt-2 text-sm text-[#5B6D6B] leading-relaxed line-clamp-2">
          {project.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="rounded px-2 py-0.5 text-[0.68rem] font-medium text-[#173E3A] bg-[#E8F1EE]"
            >
              {cap}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 flex flex-wrap items-center gap-4 text-xs font-semibold">
          {onViewDetails ? (
            <button
              type="button"
              onClick={() => onViewDetails(project)}
              className="inline-flex min-h-[44px] items-center gap-1 text-[#B83A3A] hover:gap-2 transition-all cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          ) : isExternalDetail ? (
            <a
              href={project.detailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 text-[#B83A3A] hover:gap-2 transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link
              href={project.detailHref}
              className="inline-flex min-h-[44px] items-center gap-1 text-[#B83A3A] hover:gap-2 transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 text-[#5B6D6B] hover:text-[#073B3A] hover:gap-2 transition-all"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export { spanClasses };
