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
  getPostingBySlugAny,
  listPublishedPostings,
} from "@/lib/recruiting";
import { isNewListing, isPubliclyOpen } from "@/lib/jobs/eligibility";

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
  acceptingApplications: boolean;
  isNew: boolean;
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
  const open = isPubliclyOpen(posting);
  const postedAt = (posting.publishedAt ?? posting.createdAt).slice(0, 10);
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
    postedAt,
    status: open ? "open" : "closed",
    acceptingApplications: open,
    isNew: open && isNewListing(posting.publishedAt ?? posting.createdAt),
    isDemo: posting.isDemo,
    requisitionId: posting.requisitionId,
  };
}

export const JOBS_PAGE_SIZE = 20;

export type JobSearch = {
  q?: string;
  location?: string;
  department?: string;
  arrangement?: string;
  type?: string;
  sort?: "newest" | "oldest" | "title";
  page?: number;
};

export async function searchPublicJobs(search: JobSearch): Promise<{
  jobs: Job[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const filtered = filterJobs(await getOpenJobs(), {
    query: search.q,
    location: search.location,
    careerArea: search.department,
    workplaceType: search.arrangement,
    employmentType: search.type,
  }).sort((a, b) => {
    if (search.sort === "title") return a.title.localeCompare(b.title);
    if (search.sort === "oldest") return a.postedAt.localeCompare(b.postedAt);
    return b.postedAt.localeCompare(a.postedAt);
  });
  const page = Math.max(1, search.page ?? 1);
  const start = (page - 1) * JOBS_PAGE_SIZE;
  return {
    jobs: filtered.slice(start, start + JOBS_PAGE_SIZE),
    total: filtered.length,
    page,
    pageCount: Math.max(1, Math.ceil(filtered.length / JOBS_PAGE_SIZE)),
  };
}
export async function getOpenJobs(): Promise<Job[]> {
  const postings = await listPublishedPostings();
  return postings.map(toPublicJob);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const posting = await getPostingBySlugAny(slug);
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
      const needle = filters.location.trim().toLowerCase();
      const haystack = `${job.location} ${job.workplaceType}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
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
        job.id,
        job.department,
        job.summary,
        job.description,
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
