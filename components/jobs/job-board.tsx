"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
}

const ALL = "all";

export default function JobBoard({ jobs, filterOptions }: JobBoardProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? ALL;

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(ALL);
  const [careerArea, setCareerArea] = useState(initialCategory);
  const [workplaceType, setWorkplaceType] = useState(ALL);
  const [employmentType, setEmploymentType] = useState(ALL);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setQuery("");
    setLocation(ALL);
    setCareerArea(ALL);
    setWorkplaceType(ALL);
    setEmploymentType(ALL);
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
      <div className="cr-card space-y-6 p-6 md:p-8 bg-[#FFFDF8] border border-[#D7CCBD]">
        <div className="grid gap-4">
          <div>
            <label htmlFor="job-search" className="cr-label text-[#261F1B]">
              Search
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#261F1B]"
              />
              <input
                id="job-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search role or skill…"
                className="cr-input pl-12 h-12 text-sm bg-[#FFFDF8] border-[#D7CCBD]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border border-[var(--cr-border)] bg-white px-5 text-sm font-medium text-[var(--cr-text)] transition hover:border-[#B8AA96] md:hidden"
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

        <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
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
          filteredJobs.map((job) => <JobListItem key={job.id} job={job} />)
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
