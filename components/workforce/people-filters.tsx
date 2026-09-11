"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export type PeopleFilterOption = { id: string; label: string };

export type PeopleFilters = {
  q?: string;
  department?: string;
  location?: string;
  status?: string;
  manager?: string;
  workAuth?: string;
  startFrom?: string;
  startTo?: string;
  sort?: string;
};

function hrefFor(filters: PeopleFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.department) params.set("department", filters.department);
  if (filters.location) params.set("location", filters.location);
  if (filters.status) params.set("status", filters.status);
  if (filters.manager) params.set("manager", filters.manager);
  if (filters.workAuth) params.set("workAuth", filters.workAuth);
  if (filters.startFrom) params.set("startFrom", filters.startFrom);
  if (filters.startTo) params.set("startTo", filters.startTo);
  if (filters.sort) params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `/workforce/people?${qs}` : "/workforce/people";
}

const fieldClass =
  "mt-1 w-full rounded-md border border-black/15 bg-white px-2.5 py-2 text-sm";

export default function PeopleFiltersBar({
  filters,
  departments,
  locations,
  managers,
  workAuthTypes,
  statuses,
}: {
  filters: PeopleFilters;
  departments: PeopleFilterOption[];
  locations: PeopleFilterOption[];
  managers: PeopleFilterOption[];
  workAuthTypes: PeopleFilterOption[];
  statuses: PeopleFilterOption[];
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    router.push(
      hrefFor({
        q: String(form.get("q") || "") || undefined,
        department: String(form.get("department") || "") || undefined,
        location: String(form.get("location") || "") || undefined,
        status: String(form.get("status") || "") || undefined,
        manager: String(form.get("manager") || "") || undefined,
        workAuth: String(form.get("workAuth") || "") || undefined,
        startFrom: String(form.get("startFrom") || "") || undefined,
        startTo: String(form.get("startTo") || "") || undefined,
        sort: String(form.get("sort") || "") || undefined,
      }),
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-black/10 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <label className="block text-xs sm:col-span-2 lg:col-span-2">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Search
          </span>
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Name, email, employee #"
            className={fieldClass}
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Department
          </span>
          <select name="department" defaultValue={filters.department ?? ""} className={fieldClass}>
            <option value="">All departments</option>
            {departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Location
          </span>
          <select name="location" defaultValue={filters.location ?? ""} className={fieldClass}>
            <option value="">All locations</option>
            {locations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Employment Status
          </span>
          <select name="status" defaultValue={filters.status ?? ""} className={fieldClass}>
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Manager
          </span>
          <select name="manager" defaultValue={filters.manager ?? ""} className={fieldClass}>
            <option value="">All managers</option>
            {managers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Work Authorization
          </span>
          <select name="workAuth" defaultValue={filters.workAuth ?? ""} className={fieldClass}>
            <option value="">All types</option>
            {workAuthTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Start from
          </span>
          <input
            type="date"
            name="startFrom"
            defaultValue={filters.startFrom ?? ""}
            className={fieldClass}
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Start to
          </span>
          <input
            type="date"
            name="startTo"
            defaultValue={filters.startTo ?? ""}
            className={fieldClass}
          />
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Sort
          </span>
          <select name="sort" defaultValue={filters.sort ?? "name"} className={fieldClass}>
            <option value="name">Name</option>
            <option value="employeeNumber">Employee #</option>
            <option value="startDate">Start date</option>
            <option value="status">Status</option>
            <option value="department">Department</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
        >
          Apply filters
        </button>
        <Link
          href="/workforce/people"
          className="rounded-md border border-black/15 px-3.5 py-2 text-sm font-medium text-black/65"
        >
          Clear filters
        </Link>
      </div>
    </form>
  );
}
