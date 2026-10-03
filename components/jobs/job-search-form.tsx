"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

type Option = { value: string; label: string };

export default function JobSearchForm({
  q = "",
  location = "",
  department = "all",
  arrangement = "all",
  type = "all",
  sort = "newest",
  departments,
  arrangements,
  types,
}: {
  q?: string;
  location?: string;
  department?: string;
  arrangement?: string;
  type?: string;
  sort?: string;
  departments: Option[];
  arrangements: string[];
  types: string[];
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const query = String(data.get("q") ?? "").trim();
    const place = String(data.get("location") ?? "").trim();
    const dept = String(data.get("department") ?? "");
    const work = String(data.get("arrangement") ?? "");
    const employment = String(data.get("type") ?? "");
    const order = String(data.get("sort") ?? "newest");
    if (query) params.set("q", query);
    if (place) params.set("location", place);
    if (dept && dept !== "all") params.set("department", dept);
    if (work && work !== "all") params.set("arrangement", work);
    if (employment && employment !== "all") params.set("type", employment);
    if (order && order !== "newest") params.set("sort", order);
    const href = params.size ? `/jobs?${params.toString()}` : "/jobs";
    router.push(href);
  }

  const field =
    "mt-1 h-11 w-full rounded-md border border-[var(--cr-border)] bg-white px-3 text-base text-[var(--cr-navy)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-teal)]";

  return (
    <form onSubmit={onSubmit} action="/jobs" method="get" className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <label className="text-sm text-[var(--cr-navy)]">
        Search
        <input name="q" defaultValue={q} placeholder="Title, skill, or keyword" className={field} />
      </label>
      <label className="text-sm text-[var(--cr-navy)]">
        Location
        <input name="location" defaultValue={location} placeholder="City, state, or Remote" className={field} />
      </label>
      <label className="text-sm text-[var(--cr-navy)]">
        Department
        <select name="department" defaultValue={department || "all"} className={field}>
          <option value="all">All departments</option>
          {departments.map((area) => (
            <option key={area.value} value={area.value}>{area.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-[var(--cr-navy)]">
        Work arrangement
        <select name="arrangement" defaultValue={arrangement || "all"} className={field}>
          <option value="all">All arrangements</option>
          {arrangements.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-[var(--cr-navy)]">
        Employment type
        <select name="type" defaultValue={type || "all"} className={field}>
          <option value="all">All types</option>
          {types.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-[var(--cr-navy)]">
        Sort
        <select name="sort" defaultValue={sort || "newest"} className={field}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A–Z</option>
        </select>
      </label>
      <div className="flex items-end gap-3">
        <button
          type="submit"
          aria-label="Search roles"
          className="h-11 cursor-pointer rounded-md bg-[var(--ca-lime)] px-5 text-sm font-semibold text-[var(--ca-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-teal)] focus-visible:ring-offset-2"
        >
          Search Roles
        </button>
        <a href="/jobs" className="text-sm font-semibold text-[var(--ca-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-teal)]">
          Clear filters
        </a>
      </div>
    </form>
  );
}
