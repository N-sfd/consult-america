"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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

export default function JobBoard({ jobs, filterOptions }: JobBoardProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [careerArea, setCareerArea] = useState(initialCategory);
  const [workplaceType, setWorkplaceType] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");

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

  return (
    <div>
      <div className="grid gap-4 border-b border-white/10 pb-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
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

        <div>
          <label htmlFor="job-location" className="ca-eyebrow text-white/45">
            Location
          </label>
          <select
            id="job-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="ca-underline-input mt-3 w-full bg-transparent"
          >
            <option value="all">All Locations</option>
            {filterOptions.locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="job-career-area" className="ca-eyebrow text-white/45">
            Career Area
          </label>
          <select
            id="job-career-area"
            value={careerArea}
            onChange={(event) => setCareerArea(event.target.value)}
            className="ca-underline-input mt-3 w-full bg-transparent"
          >
            <option value="all">All Career Areas</option>
            {filterOptions.careerAreas.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="job-workplace" className="ca-eyebrow text-white/45">
            Workplace
          </label>
          <select
            id="job-workplace"
            value={workplaceType}
            onChange={(event) => setWorkplaceType(event.target.value)}
            className="ca-underline-input mt-3 w-full bg-transparent"
          >
            <option value="all">All Types</option>
            {filterOptions.workplaceTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <p className="text-sm text-white/55">
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          {careerArea !== "all" && (
            <span className="text-white/35">
              {" "}
              · {careerAreaLabels[careerArea as keyof typeof careerAreaLabels]}
            </span>
          )}
        </p>

        <div className="flex items-center gap-3">
          <label htmlFor="job-employment" className="sr-only">
            Employment Type
          </label>
          <select
            id="job-employment"
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
            className="ca-underline-input bg-transparent py-2 text-sm"
          >
            <option value="all">All Employment Types</option>
            {filterOptions.employmentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
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
