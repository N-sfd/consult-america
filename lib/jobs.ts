import {
  careerAreaLabels,
  jobs,
  type CareerArea,
  type Job,
} from "@/data/jobs";

export type JobFilters = {
  query?: string;
  location?: string;
  careerArea?: string;
  workplaceType?: string;
  employmentType?: string;
};

export function getOpenJobs(): Job[] {
  return jobs.filter((job) => job.status === "open");
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug && job.status === "open");
}

export function getAllJobSlugs(): string[] {
  return getOpenJobs().map((job) => job.slug);
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
        careerAreaLabels[job.careerArea],
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
    careerAreas: Object.entries(careerAreaLabels).map(([value, label]) => ({
      value: value as CareerArea,
      label,
    })),
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
