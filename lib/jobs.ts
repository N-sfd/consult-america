/**
 * Public careers Job view-model.
 * Backed by `Job` (types/recruiting.ts), aliased to `JobPosting` here since
 * this file's own `Job` view-model export would otherwise collide with it.
 */

import {
  employmentTypeLabels,
  workplaceTypeLabels,
} from "@/types/organization";
import type { CareerArea, Job as JobPosting } from "@/types/recruiting";
import { careerAreaLabels as recruitingCareerLabels } from "@/data/jobs";
import {
  getPostingBySlug,
  listPublishedPostings,
} from "@/lib/recruiting";

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  careerArea: CareerArea;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full Time" | "Part Time" | "Contract";
  summary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications?: string[];
  postedAt: string;
  status: "open" | "closed";
  isDemo: boolean;
  requisitionId: string;
};

export type JobFilters = {
  query?: string;
  location?: string;
  careerArea?: string;
  workplaceType?: string;
  employmentType?: string;
};

export { careerAreaLabels } from "@/data/jobs";

function toPublicJob(posting: JobPosting): Job {
  return {
    id: posting.id,
    slug: posting.slug,
    title: posting.title,
    department: posting.departmentName,
    careerArea: posting.careerArea,
    location: posting.locationName,
    workplaceType: workplaceTypeLabels[posting.workplaceType] as Job["workplaceType"],
    employmentType: employmentTypeLabels[
      posting.employmentType
    ] as Job["employmentType"],
    summary: posting.summary,
    description: posting.description,
    responsibilities: posting.responsibilities,
    qualifications: posting.qualifications,
    preferredQualifications: posting.preferredQualifications,
    postedAt: (posting.publishedAt ?? posting.createdAt).slice(0, 10),
    status: posting.status === "PUBLISHED" ? "open" : "closed",
    isDemo: posting.isDemo,
    requisitionId: posting.requisitionId,
  };
}

export async function getOpenJobs(): Promise<Job[]> {
  const postings = await listPublishedPostings();
  return postings.map(toPublicJob);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const posting = await getPostingBySlug(slug);
  return posting ? toPublicJob(posting) : undefined;
}

export async function getAllJobSlugs(): Promise<string[]> {
  const jobs = await getOpenJobs();
  return jobs.map((job) => job.slug);
}

export function filterJobs(allJobs: Job[], filters: JobFilters): Job[] {
  const query = filters.query?.trim().toLowerCase();

  return allJobs.filter((job) => {
    if (filters.careerArea && filters.careerArea !== "all") {
      if (filters.careerArea === "experienced-professionals") {
        if (job.careerArea === "early-careers") return false;
      } else if (job.careerArea !== filters.careerArea) {
        return false;
      }
    }

    if (filters.location && filters.location !== "all") {
      if (job.location !== filters.location) return false;
    }

    if (filters.workplaceType && filters.workplaceType !== "all") {
      if (job.workplaceType !== filters.workplaceType) return false;
    }

    if (filters.employmentType && filters.employmentType !== "all") {
      if (job.employmentType !== filters.employmentType) return false;
    }

    if (query) {
      const haystack = [
        job.title,
        job.department,
        job.summary,
        recruitingCareerLabels[job.careerArea],
        job.location,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function getJobFilterOptions(allJobs: Job[]) {
  return {
    locations: [...new Set(allJobs.map((job) => job.location))].sort(),
    careerAreas: Object.entries(recruitingCareerLabels).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
    workplaceTypes: [...new Set(allJobs.map((job) => job.workplaceType))],
    employmentTypes: [...new Set(allJobs.map((job) => job.employmentType))],
  };
}

export function formatPostedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
