"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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
      <div className="space-y-6 border-b border-white/10 pb-8">
        <div>
          <label htmlFor="job-search" className="ca-eyebrow text-white/45">
            Search
          </label>
          <input
            id="job-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs..."
            className="ca-underline-input mt-3 w-full"
          />
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <p className="text-sm text-white/55">
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          {careerArea !== ALL && (
            <span className="text-white/35">
              {" "}
              · {careerAreaLabels[careerArea as keyof typeof careerAreaLabels]}
            </span>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-white/60 hover:text-white"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="mt-2">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobListItem key={job.id} job={job} />)
        ) : (
          <p className="py-12 text-white/55">
            No roles match your search. Try adjusting filters or explore all
            career areas.
          </p>
        )}
      </div>
    </div>
  );
}
