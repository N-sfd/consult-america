import type { Metadata } from "next";
import Link from "next/link";

import JobListItem from "@/components/jobs/job-list-item";
import {
  getJobFilterOptions,
  getOpenJobs,
  searchPublicJobs,
  type JobSearch,
} from "@/lib/jobs";

export const metadata: Metadata = {
  title: { absolute: "Open Roles | Consult America Careers" },
  description:
    "Search open Consult America roles by title, skill, location, and work arrangement.",
};

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search: JobSearch = {
    q: one(params.q),
    location: one(params.location),
    department: one(params.department),
    arrangement: one(params.arrangement),
    type: one(params.type),
    sort: (one(params.sort) || "newest") as JobSearch["sort"],
    page: Number(one(params.page) || "1"),
  };
  const [{ jobs, total, page, pageCount }, openJobs] = await Promise.all([
    searchPublicJobs(search),
    getOpenJobs(),
  ]);
  const options = getJobFilterOptions(openJobs);
  const query = new URLSearchParams();
  if (search.q) query.set("q", search.q);
  if (search.location) query.set("location", search.location);
  if (search.department) query.set("department", search.department);
  if (search.arrangement) query.set("arrangement", search.arrangement);
  if (search.type) query.set("type", search.type);
  if (search.sort && search.sort !== "newest") query.set("sort", search.sort);

  function pageHref(nextPage: number) {
    const next = new URLSearchParams(query);
    if (nextPage > 1) next.set("page", String(nextPage));
    const text = next.toString();
    return text ? `/jobs?${text}` : "/jobs";
  }

  return (
    <div className="overflow-x-clip bg-[var(--cr-bg)]">
      <div className="cr-shell py-12 md:py-16">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
          Careers at Consult America
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.03em] text-[var(--cr-navy)] md:text-5xl">
          Find work that moves technology forward.
        </h1>
        <p className="mt-4 text-base text-[var(--cr-text-secondary)]">
          {openJobs.length} open {openJobs.length === 1 ? "position" : "positions"}
        </p>
      </div>

      <div className="cr-shell pb-16">
        <form method="get" action="/jobs" className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm text-[var(--cr-navy)]">
            Search
            <input
              name="q"
              defaultValue={search.q}
              placeholder="Title, skill, or keyword"
              className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base"
            />
          </label>
          <label className="text-sm text-[var(--cr-navy)]">
            Location
            <input
              name="location"
              defaultValue={search.location}
              placeholder="City, state, or Remote"
              className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base"
            />
          </label>
          <label className="text-sm text-[var(--cr-navy)]">
            Department
            <select name="department" defaultValue={search.department || "all"} className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base">
              <option value="all">All departments</option>
              {options.careerAreas.map((area) => (
                <option key={area.value} value={area.value}>{area.label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--cr-navy)]">
            Work arrangement
            <select name="arrangement" defaultValue={search.arrangement || "all"} className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base">
              <option value="all">All arrangements</option>
              {options.workplaceTypes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--cr-navy)]">
            Employment type
            <select name="type" defaultValue={search.type || "all"} className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base">
              <option value="all">All types</option>
              {options.employmentTypes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--cr-navy)]">
            Sort
            <select name="sort" defaultValue={search.sort || "newest"} className="mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <button type="submit" className="h-11 rounded-md bg-[var(--ca-lime)] px-5 text-sm font-semibold text-[var(--ca-ink)]">
              Search roles
            </button>
            <Link href="/jobs" className="text-sm font-semibold text-[var(--ca-teal)]">Clear filters</Link>
          </div>
        </form>

        <div className="mt-8 grid gap-3">
          {jobs.length === 0 ? (
            <div className="rounded-lg border border-[var(--cr-border)] bg-white p-6">
              <p className="text-base text-[var(--cr-navy)]">
                {openJobs.length === 0
                  ? "We don't have an opening matching your search right now."
                  : "No openings match your current filters."}
              </p>
              <Link href="/careers" className="mt-3 inline-flex text-sm font-semibold text-[var(--ca-teal)]">
                Explore Consult America
              </Link>
            </div>
          ) : (
            jobs.map((job) => <JobListItem key={job.id} job={job} />)
          )}
        </div>

        {pageCount > 1 ? (
          <div className="mt-6 flex items-center gap-4 text-sm">
            {page > 1 ? <Link href={pageHref(page - 1)}>Previous</Link> : null}
            <span>Page {page} of {pageCount}</span>
            {page < pageCount ? <Link href={pageHref(page + 1)}>Next</Link> : null}
          </div>
        ) : null}
        <p className="mt-10 border-t border-[var(--cr-border)] pt-6 text-xs leading-6 text-[var(--cr-text-secondary)]">
          Consult America is committed to providing equal employment opportunities
          to qualified applicants and employees in accordance with applicable law.
        </p>
      </div>
    </div>
  );
}
