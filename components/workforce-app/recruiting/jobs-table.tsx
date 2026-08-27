"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, X } from "lucide-react";

import { formatRelativeTime } from "@/lib/recruiting/format";
import type { JobListItem } from "@/lib/recruiting/repository";
import { RequisitionStatusBadge } from "@/components/workforce-app/recruiting/stage-badge";
import { requisitionStatusLabels, type RequisitionStatus } from "@/types/recruiting";
import { workplaceTypeLabels } from "@/types/organization";

export default function JobsTable({
  jobs,
  kpis,
}: {
  jobs: JobListItem[];
  kpis: { open: number; published: number; draft: number; onHold: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | "ALL">(
    () => (searchParams.get("status") as RequisitionStatus | null) ?? "ALL",
  );
  const [departmentFilter, setDepartmentFilter] = useState(
    () => searchParams.get("department") ?? "ALL",
  );
  const [locationFilter, setLocationFilter] = useState(
    () => searchParams.get("location") ?? "ALL",
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (departmentFilter !== "ALL") params.set("department", departmentFilter);
    if (locationFilter !== "ALL") params.set("location", locationFilter);

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter, departmentFilter, locationFilter]);

  const statusesPresent = useMemo(() => {
    const seen = new Set<RequisitionStatus>();
    for (const job of jobs) seen.add(job.status);
    return [...seen];
  }, [jobs]);

  const departmentsPresent = useMemo(() => {
    const seen = new Set<string>();
    for (const job of jobs) seen.add(job.departmentName);
    return [...seen].sort();
  }, [jobs]);

  const locationsPresent = useMemo(() => {
    const seen = new Set<string>();
    for (const job of jobs) seen.add(job.locationName);
    return [...seen].sort();
  }, [jobs]);

  const hasActiveFilters =
    query.trim() !== "" ||
    statusFilter !== "ALL" ||
    departmentFilter !== "ALL" ||
    locationFilter !== "ALL";

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (statusFilter !== "ALL" && job.status !== statusFilter) return false;
      if (departmentFilter !== "ALL" && job.departmentName !== departmentFilter) {
        return false;
      }
      if (locationFilter !== "ALL" && job.locationName !== locationFilter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.requisitionNumber.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [jobs, query, statusFilter, departmentFilter, locationFilter]);

  function clearFilters() {
    setQuery("");
    setStatusFilter("ALL");
    setDepartmentFilter("ALL");
    setLocationFilter("ALL");
  }

  const kpiCards = [
    { label: "Open Jobs", value: kpis.open },
    { label: "Published", value: kpis.published },
    { label: "Draft", value: kpis.draft },
    { label: "On Hold", value: kpis.onHold },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 lg:px-8 lg:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
            Jobs / Requisitions
          </h1>
          <p className="mt-1 text-sm text-black/50">
            Create, publish, and manage hiring requisitions.
          </p>
        </div>
        <Link
          href="/app/recruiting/jobs/new"
          className="inline-flex h-9 items-center gap-1.5 bg-[var(--ca-blue)] px-3.5 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)]"
        >
          <Plus className="h-4 w-4" />
          New Job
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="border border-black/8 bg-white px-4 py-3">
            <p className="text-2xl font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-black/50">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="relative block lg:max-w-xs lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs…"
            className="h-9 w-full border border-black/10 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-black/35 focus:border-[var(--ca-blue)]"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as RequisitionStatus | "ALL")
          }
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All statuses</option>
          {statusesPresent.map((status) => (
            <option key={status} value={status}>
              {requisitionStatusLabels[status]}
            </option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(event) => setDepartmentFilter(event.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All departments</option>
          {departmentsPresent.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(event) => setLocationFilter(event.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All locations</option>
          {locationsPresent.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 items-center gap-1 border border-black/10 px-2.5 text-sm text-black/55 hover:border-black/20"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Mobile: cards */}
      {filtered.length === 0 ? (
        <p className="mt-4 border border-black/8 bg-white px-5 py-10 text-center text-sm text-black/45 md:hidden">
          {jobs.length === 0 ? "No jobs yet." : "No jobs match your filters."}
        </p>
      ) : (
        <div className="mt-4 space-y-2 md:hidden">
          {filtered.map((job) => (
            <Link
              key={job.requisitionId}
              href={`/app/recruiting/jobs/${job.requisitionId}`}
              className="block border border-black/8 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-[var(--ca-app-ink)]">{job.title}</p>
                <RequisitionStatusBadge status={job.status} className="shrink-0" />
              </div>
              <p className="mt-1 text-sm text-black/55">{job.departmentName}</p>
              <p className="mt-0.5 text-sm text-black/45">
                {job.locationName} · {workplaceTypeLabels[job.workplaceType]}
              </p>
              <p className="mt-2 text-xs text-black/45">
                {job.candidateCount} candidate{job.candidateCount === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Desktop: table */}
      <div className="mt-4 hidden overflow-x-auto border border-black/8 bg-white md:block">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1.8fr_1fr_0.8fr_0.9fr_0.7fr] gap-3 border-b border-black/8 bg-[var(--ca-app-bg)] px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            <span>Job</span>
            <span>Department</span>
            <span>Candidates</span>
            <span>Status</span>
            <span>Updated</span>
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-black/45">
              {jobs.length === 0 ? "No jobs yet." : "No jobs match your filters."}
            </p>
          ) : (
            filtered.map((job) => (
              <Link
                key={job.requisitionId}
                href={`/app/recruiting/jobs/${job.requisitionId}`}
                className="grid grid-cols-[1.8fr_1fr_0.8fr_0.9fr_0.7fr] items-center gap-3 border-b border-black/6 px-5 py-3 text-sm transition-colors last:border-0 hover:bg-[var(--ca-app-bg)]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-[var(--ca-app-ink)]">
                    {job.title}
                  </span>
                  <span className="block truncate text-xs text-black/45">
                    {job.requisitionNumber} · {job.locationName}
                  </span>
                </span>
                <span className="truncate text-black/55">{job.departmentName}</span>
                <span className="text-black/55">{job.candidateCount}</span>
                <span>
                  <RequisitionStatusBadge status={job.status} />
                </span>
                <span className="text-black/45">
                  {formatRelativeTime(job.updatedAt)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
