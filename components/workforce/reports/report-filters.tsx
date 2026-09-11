"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import type { FilterOption, ReportFilters, ReportSection } from "@/lib/reports/types";

const SECTIONS: { id: ReportSection; label: string }[] = [
  { id: "recruiting", label: "Recruiting" },
  { id: "workforce", label: "Workforce" },
  { id: "onboarding", label: "Onboarding" },
  { id: "time-leave", label: "Time & Leave" },
  { id: "hr", label: "HR Service Desk" },
];

function hrefFor(section: ReportSection, filters: ReportFilters) {
  const params = new URLSearchParams();
  params.set("section", section);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.departmentId) params.set("department", filters.departmentId);
  if (filters.locationId) params.set("location", filters.locationId);
  if (filters.jobRequisitionId) params.set("job", filters.jobRequisitionId);
  if (filters.recruiterUserId) params.set("recruiter", filters.recruiterUserId);
  return `/workforce/reports?${params.toString()}`;
}

export default function ReportFiltersBar({
  section,
  allowedSections,
  filters,
  departments,
  locations,
  jobs,
  recruiters,
}: {
  section: ReportSection;
  allowedSections: ReportSection[];
  filters: ReportFilters;
  departments: FilterOption[];
  locations: FilterOption[];
  jobs: FilterOption[];
  recruiters: FilterOption[];
}) {
  const router = useRouter();
  const showDepartment =
    section === "recruiting" || section === "workforce" || section === "onboarding";
  const showLocation =
    section === "recruiting" || section === "workforce" || section === "onboarding";
  const showJob = section === "recruiting";
  const showRecruiter = section === "recruiting";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: ReportFilters = {
      from: String(form.get("from") || "") || undefined,
      to: String(form.get("to") || "") || undefined,
      departmentId: String(form.get("department") || "") || undefined,
      locationId: String(form.get("location") || "") || undefined,
      jobRequisitionId: String(form.get("job") || "") || undefined,
      recruiterUserId: String(form.get("recruiter") || "") || undefined,
    };
    router.push(hrefFor(section, next));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.filter((item) => allowedSections.includes(item.id)).map((item) => (
          <Link
            key={item.id}
            href={hrefFor(item.id, filters)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              section === item.id
                ? "bg-[var(--ca-platform-deep)] text-white"
                : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">From</span>
          <input
            type="date"
            name="from"
            defaultValue={filters.from ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">To</span>
          <input
            type="date"
            name="to"
            defaultValue={filters.to ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          />
        </label>
        {showDepartment ? (
          <label className="block text-xs">
            <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
              Department
            </span>
            <select
              name="department"
              defaultValue={filters.departmentId ?? ""}
              className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
            >
              <option value="">All departments</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showLocation ? (
          <label className="block text-xs">
            <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
              Location
            </span>
            <select
              name="location"
              defaultValue={filters.locationId ?? ""}
              className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
            >
              <option value="">All locations</option>
              {locations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showJob ? (
          <label className="block text-xs">
            <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Job</span>
            <select
              name="job"
              defaultValue={filters.jobRequisitionId ?? ""}
              className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
            >
              <option value="">All jobs</option>
              {jobs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showRecruiter ? (
          <label className="block text-xs">
            <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
              Recruiter
            </span>
            <select
              name="recruiter"
              defaultValue={filters.recruiterUserId ?? ""}
              className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
            >
              <option value="">All recruiters</option>
              {recruiters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-6">
          <button
            type="submit"
            className="rounded-md bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
          >
            Apply filters
          </button>
          <Link
            href={`/workforce/reports?section=${section}`}
            className="rounded-md border border-black/15 px-3.5 py-2 text-sm font-medium text-black/65"
          >
            Clear
          </Link>
        </div>
      </form>
    </div>
  );
}
