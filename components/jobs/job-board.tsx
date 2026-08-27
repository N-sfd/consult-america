"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import JobFilterSelect from "@/components/jobs/job-filter-select";
import JobListItem from "@/components/jobs/job-list-item";
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

  const hasActiveFilters =
    query !== "" ||
    location !== ALL ||
    careerArea !== ALL ||
    workplaceType !== ALL ||
    employmentType !== ALL;

  function clearFilters() {
    setQuery("");
    setLocation(ALL);
    setCareerArea(ALL);
    setWorkplaceType(ALL);
    setEmploymentType(ALL);
  }

  return (
    <div>
      <div className="cr-card space-y-6 p-6 md:p-8">
        <div>
          <label htmlFor="job-search" className="cr-label">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a98a8]" />
            <input
              id="job-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role, skill or keyword…"
              className="cr-input pl-11"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <JobFilterSelect
            label="Location"
            placeholder="All Locations"
            value={location}
            onValueChange={setLocation}
            options={[
              { value: ALL, label: "All Locations" },
              ...filterOptions.locations.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />

          <JobFilterSelect
            label="Career Area"
            placeholder="All Career Areas"
            value={careerArea}
            onValueChange={setCareerArea}
            options={[
              { value: ALL, label: "All Career Areas" },
              ...filterOptions.careerAreas,
            ]}
          />

          <JobFilterSelect
            label="Workplace"
            placeholder="All Types"
            value={workplaceType}
            onValueChange={setWorkplaceType}
            options={[
              { value: ALL, label: "All Types" },
              ...filterOptions.workplaceTypes.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />

          <JobFilterSelect
            label="Employment Type"
            placeholder="All Employment Types"
            value={employmentType}
            onValueChange={setEmploymentType}
            options={[
              { value: ALL, label: "All Employment Types" },
              ...filterOptions.employmentTypes.map((item) => ({
                value: item,
                label: item,
              })),
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--cr-text-secondary)]">
          <span className="font-medium text-[var(--cr-navy)]">
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
            className="text-sm font-medium text-[var(--cr-blue)] hover:text-[var(--cr-blue-hover)]"
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
