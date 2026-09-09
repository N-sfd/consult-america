"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import JobFilterSelect from "@/components/jobs/job-filter-select";
import JobListItem from "@/components/jobs/job-list-item";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { careerAreaLabels, filterJobs, type Job } from "@/lib/jobs";

interface JobBoardProps {
  jobs: Job[];
  filterOptions: {
    locations: string[];
    careerAreas: { value: string; label: string }[];
    workplaceTypes: string[];
    employmentTypes: string[];
  };
  /** Optional per-requisition CTAs for signed-in candidate portal */
  applicationCtasByRequisitionId?: Record<
    string,
    { label: string; href: string }
  >;
}

const ALL = "all";

export default function JobBoard({
  jobs,
  filterOptions,
  applicationCtasByRequisitionId,
}: JobBoardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQueryState] = useState(searchParams.get("q") ?? "");
  const [location, setLocationState] = useState(
    searchParams.get("location") ?? ALL,
  );
  const [careerArea, setCareerAreaState] = useState(
    searchParams.get("category") ?? ALL,
  );
  const [workplaceType, setWorkplaceTypeState] = useState(
    searchParams.get("workplaceType") ?? ALL,
  );
  const [employmentType, setEmploymentTypeState] = useState(
    searchParams.get("employmentType") ?? ALL,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const syncParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === ALL || value === "") params.delete(key);
      else params.set(key, value);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  function setQuery(value: string) {
    setQueryState(value);
    syncParam("q", value);
  }
  function setLocation(value: string) {
    setLocationState(value);
    syncParam("location", value);
  }
  function setCareerArea(value: string) {
    setCareerAreaState(value);
    syncParam("category", value);
  }
  function setWorkplaceType(value: string) {
    setWorkplaceTypeState(value);
    syncParam("workplaceType", value);
  }
  function setEmploymentType(value: string) {
    setEmploymentTypeState(value);
    syncParam("employmentType", value);
  }

  const filteredJobs = useMemo(
    () =>
      filterJobs(jobs, {
        query,
        location,
        careerArea,
        workplaceType,
        employmentType,
      }),
    [jobs, query, location, careerArea, workplaceType, employmentType],
  );

  const activeFilterCount = [location, careerArea, workplaceType, employmentType].filter(
    (value) => value !== ALL,
  ).length;

  const hasActiveFilters = query !== "" || activeFilterCount > 0;

  function clearFilters() {
    setQueryState("");
    setLocationState(ALL);
    setCareerAreaState(ALL);
    setWorkplaceTypeState(ALL);
    setEmploymentTypeState(ALL);
    router.replace(pathname, { scroll: false });
  }

  const filterFields = [
    {
      key: "location",
      label: "Location",
      placeholder: "All Locations",
      value: location,
      onValueChange: setLocation,
      options: [
        { value: ALL, label: "All Locations" },
        ...filterOptions.locations.map((item) => ({ value: item, label: item })),
      ],
    },
    {
      key: "careerArea",
      label: "Career Area",
      placeholder: "All Career Areas",
      value: careerArea,
      onValueChange: setCareerArea,
      options: [
        { value: ALL, label: "All Career Areas" },
        ...filterOptions.careerAreas,
      ],
    },
    {
      key: "workplaceType",
      label: "Workplace",
      placeholder: "All Types",
      value: workplaceType,
      onValueChange: setWorkplaceType,
      options: [
        { value: ALL, label: "All Types" },
        ...filterOptions.workplaceTypes.map((item) => ({ value: item, label: item })),
      ],
    },
    {
      key: "employmentType",
      label: "Employment Type",
      placeholder: "All Employment Types",
      value: employmentType,
      onValueChange: setEmploymentType,
      options: [
        { value: ALL, label: "All Employment Types" },
        ...filterOptions.employmentTypes.map((item) => ({ value: item, label: item })),
      ],
    },
  ];

  return (
    <div>
      <div className="job-filter-panel space-y-6 p-6 md:p-8">
        <div className="grid gap-4">
          <div>
            <label htmlFor="job-search" className="cr-label">
              Search
            </label>
            <div className="job-search-input">
              <Search aria-hidden="true" className="search-icon" />
              <input
                id="job-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search role or skill…"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border border-[var(--cr-border)] bg-white px-5 text-sm font-medium text-[var(--cr-text)] transition hover:border-[#B5C4CD] md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--cr-blue)] px-1 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-4">
          {filterFields.map(({ key, ...field }) => (
            <JobFilterSelect key={key} {...field} />
          ))}
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl bg-[#FFFDF8] text-[#261F1B]">
          <SheetHeader>
            <SheetTitle className="text-[#261F1B]">Filter Jobs</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 px-4">
            {filterFields.map(({ key, ...field }) => (
              <JobFilterSelect key={key} {...field} />
            ))}
          </div>

          <SheetFooter className="flex-row gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="h-12 flex-1 rounded-lg border border-[var(--cr-border)] text-sm font-medium text-[var(--cr-text)] transition hover:border-[#B8AA96]"
            >
              Clear
            </button>
            <SheetClose
              render={
                <button
                  type="button"
                  className="h-12 flex-1 rounded-lg bg-[var(--cr-blue)] text-sm font-semibold text-white transition hover:bg-[var(--cr-blue-hover)]"
                >
                  {`Show ${filteredJobs.length} ${filteredJobs.length === 1 ? "Job" : "Jobs"}`}
                </button>
              }
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--cr-text-secondary)]">
          <span className="font-semibold text-[var(--cr-navy)]">
            {filteredJobs.length}
          </span>{" "}
          {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          {careerArea !== ALL && (
            <span>
              {" "}
              · {careerAreaLabels[careerArea as keyof typeof careerAreaLabels]}
            </span>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[var(--cr-blue)] hover:text-[var(--cr-blue-hover)]"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              applicationCta={
                applicationCtasByRequisitionId?.[job.requisitionId]
              }
            />
          ))
        ) : (
          <p className="cr-card py-12 text-center text-[var(--cr-text-secondary)]">
            No roles match your search. Try adjusting filters or explore all
            career areas.
          </p>
        )}
      </div>
    </div>
  );
}
