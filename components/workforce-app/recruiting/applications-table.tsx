"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import ScheduleInterviewButton from "@/components/workforce-app/recruiting/schedule-interview-button";
import StageBadge, { CandidateAvatar } from "@/components/workforce-app/recruiting/stage-badge";
import RelativeTime from "@/components/shared/relative-time";
import { moveApplicationStage } from "@/lib/recruiting/actions";
import { candidateStageFor, CANDIDATE_STAGES, type CandidateStage } from "@/lib/recruiting/candidate-stage";
import type { ApplicationQueueItem } from "@/lib/recruiting/repository";
import { APPLICATION_PIPELINE, applicationStatusLabels, type ApplicationStatus } from "@/types/recruiting";

type SortKey = "newest" | "oldest" | "lastActivity" | "name";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  oldest: "Oldest",
  lastActivity: "Last Activity",
  name: "Candidate Name",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationsTable({
  applications,
}: {
  applications: ApplicationQueueItem[];
}) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<CandidateStage | "ALL">("ALL");
  const [jobFilter, setJobFilter] = useState("ALL");
  const [recruiterFilter, setRecruiterFilter] = useState("ALL");
  const [managerFilter, setManagerFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const jobsPresent = useMemo(
    () => [...new Set(applications.map((a) => a.jobTitle).filter((v) => v !== "—"))].sort(),
    [applications],
  );
  const recruitersPresent = useMemo(
    () =>
      [...new Set(applications.map((a) => a.recruiterName).filter((v): v is string => Boolean(v)))].sort(),
    [applications],
  );
  const managersPresent = useMemo(
    () =>
      [...new Set(applications.map((a) => a.hiringManagerName).filter((v): v is string => Boolean(v)))].sort(),
    [applications],
  );
  const locationsPresent = useMemo(
    () => [...new Set(applications.map((a) => a.locationName).filter((v) => v !== "—"))].sort(),
    [applications],
  );

  const hasActiveFilters =
    query.trim() !== "" ||
    stageFilter !== "ALL" ||
    jobFilter !== "ALL" ||
    recruiterFilter !== "ALL" ||
    managerFilter !== "ALL" ||
    locationFilter !== "ALL" ||
    dateFrom !== "" ||
    dateTo !== "";

  function clearFilters() {
    setQuery("");
    setStageFilter("ALL");
    setJobFilter("ALL");
    setRecruiterFilter("ALL");
    setManagerFilter("ALL");
    setLocationFilter("ALL");
    setDateFrom("");
    setDateTo("");
  }

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((app) => {
      if (stageFilter !== "ALL" && candidateStageFor(app.status) !== stageFilter) return false;
      if (jobFilter !== "ALL" && app.jobTitle !== jobFilter) return false;
      if (recruiterFilter !== "ALL" && app.recruiterName !== recruiterFilter) return false;
      if (managerFilter !== "ALL" && app.hiringManagerName !== managerFilter) return false;
      if (locationFilter !== "ALL" && app.locationName !== locationFilter) return false;
      if (dateFrom && new Date(app.appliedAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(app.appliedAt) > new Date(dateTo)) return false;

      if (!normalizedQuery) return true;
      return (
        app.candidateName.toLowerCase().includes(normalizedQuery) ||
        app.candidateEmail.toLowerCase().includes(normalizedQuery) ||
        app.jobTitle.toLowerCase().includes(normalizedQuery) ||
        (app.skills ?? []).some((skill) => skill.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [applications, query, stageFilter, jobFilter, recruiterFilter, managerFilter, locationFilter, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortKey) {
      case "oldest":
        copy.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
        break;
      case "lastActivity":
        copy.sort(
          (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime(),
        );
        break;
      case "name":
        copy.sort((a, b) => a.candidateName.localeCompare(b.candidateName));
        break;
      default:
        copy.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    }
    return copy;
  }, [filtered, sortKey]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 lg:px-8 lg:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
            Applications
          </h1>
          <p className="mt-1 text-sm text-black/50">
            Review and move applications across the hiring pipeline.
          </p>
        </div>
        <a
          href="/api/exports/application-pipeline"
          className="h-9 rounded-md border border-black/15 px-3 text-sm font-medium leading-9 text-black/70 hover:bg-black/[0.03]"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="relative block lg:max-w-xs lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidate, email, position, or skill…"
            className="h-9 w-full border border-black/10 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-black/35 focus:border-[var(--ca-blue)]"
          />
        </label>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as CandidateStage | "ALL")}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All stages</option>
          {CANDIDATE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All jobs</option>
          {jobsPresent.map((job) => (
            <option key={job} value={job}>
              {job}
            </option>
          ))}
        </select>

        <select
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All recruiters</option>
          {recruitersPresent.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={managerFilter}
          onChange={(e) => setManagerFilter(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All hiring managers</option>
          {managersPresent.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All locations</option>
          {locationsPresent.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        />
        <span className="text-sm text-black/35">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              Sort: {label}
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
            Clear Filters
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 border border-dashed border-black/10 bg-white px-5 py-14 text-center">
          <p className="text-sm text-black/55">
            {applications.length === 0
              ? "No applications found"
              : "No applications match these filters."}
          </p>
          <p className="mt-1 text-sm text-black/40">
            {applications.length === 0
              ? "Applications will appear here when candidates apply to published roles."
              : ""}
          </p>
          {applications.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex h-9 items-center border border-black/10 px-3 text-sm text-black/60 hover:border-black/20"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto border border-black/8 bg-white">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-black/8 bg-[var(--ca-app-bg)] text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
              <tr>
                <th className="px-4 py-2.5 font-medium">Candidate</th>
                <th className="px-4 py-2.5 font-medium">Position</th>
                <th className="px-4 py-2.5 font-medium">Applied</th>
                <th className="px-4 py-2.5 font-medium">Candidate Stage</th>
                <th className="px-4 py-2.5 font-medium">Internal Status</th>
                <th className="px-4 py-2.5 font-medium">Recruiter</th>
                <th className="px-4 py-2.5 font-medium">Hiring Manager</th>
                <th className="px-4 py-2.5 font-medium">Last Activity</th>
                <th className="px-4 py-2.5 font-medium">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((app) => (
                <ApplicationRow key={app.applicationId} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ApplicationRow({ app }: { app: ApplicationQueueItem }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleMoveStatus(next: ApplicationStatus) {
    if (!app.requisitionId) return;
    setError(null);
    startTransition(async () => {
      const result = await moveApplicationStage(app.applicationId, next, app.requisitionId!);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <tr className="border-b border-black/5 align-top last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <CandidateAvatar name={app.candidateName} />
          <div>
            <Link
              href={`/app/recruiting/candidates/${app.candidateId}`}
              className="font-medium text-[var(--ca-app-ink)] hover:underline"
            >
              {app.candidateName}
            </Link>
            <p className="text-xs text-black/45">{app.candidateEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-black/70">
        {app.jobTitle}
        <p className="text-xs text-black/40">{app.departmentName} · {app.locationName}</p>
      </td>
      <td className="px-4 py-3 text-black/70">{formatDate(app.appliedAt)}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-sm bg-black/[0.06] px-2 py-0.5 text-xs font-medium text-black/60">
          {candidateStageFor(app.status)}
        </span>
      </td>
      <td className="px-4 py-3">
        <StageBadge stage={app.status} />
      </td>
      <td className="px-4 py-3 text-black/70">{app.recruiterName || "—"}</td>
      <td className="px-4 py-3 text-black/70">{app.hiringManagerName || "—"}</td>
      <td className="px-4 py-3 text-black/60">
        <RelativeTime iso={app.lastActivityAt} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          {error ? <p className="text-xs text-[var(--ca-error)]">{error}</p> : null}
          <select
            defaultValue=""
            disabled={pending || !app.requisitionId}
            onChange={(e) => {
              const value = e.target.value as ApplicationStatus;
              if (value) handleMoveStatus(value);
              e.target.value = "";
            }}
            className="h-7 border border-black/15 bg-white px-1.5 text-xs text-black/70 outline-none focus:border-[var(--ca-blue)]"
          >
            <option value="" disabled>
              Move status…
            </option>
            {APPLICATION_PIPELINE.filter((status) => status !== app.status).map((status) => (
              <option key={status} value={status}>
                {applicationStatusLabels[status]}
              </option>
            ))}
          </select>
          {app.requisitionId ? (
            <ScheduleInterviewButton applicationId={app.applicationId} requisitionId={app.requisitionId} />
          ) : null}
          {app.requisitionId ? (
            <Link
              href={`/app/recruiting/jobs/${app.requisitionId}/pipeline`}
              className="text-xs text-[var(--ca-blue)] hover:underline"
            >
              View / Create Offer
            </Link>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
