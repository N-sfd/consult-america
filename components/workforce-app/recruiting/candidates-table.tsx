"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";

import CandidateDrawer from "@/components/workforce-app/recruiting/candidate-drawer";
import StageBadge, {
  CandidateAvatar,
} from "@/components/workforce-app/recruiting/stage-badge";
import SupabaseConnectBanner from "@/components/workforce-app/supabase-connect-banner";
import { formatRelativeTime } from "@/lib/recruiting/format";
import type { CandidateListItem } from "@/lib/recruiting/repository";
import { applicationStatusLabels, type ApplicationStatus } from "@/types/recruiting";

type SortKey = "name" | "stage" | "lastActivityAt";

const PAGE_SIZE = 10;

export type CandidateKpis = {
  active: number;
  newThisWeek: number;
  interviews: number;
  offers: number;
};

export default function CandidatesTable({
  candidates,
  kpis,
  isSupabaseConnected,
}: {
  candidates: CandidateListItem[];
  kpis: CandidateKpis;
  isSupabaseConnected: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [stageFilter, setStageFilter] = useState<ApplicationStatus | "ALL">(
    () => (searchParams.get("stage") as ApplicationStatus | null) ?? "ALL",
  );
  const [jobFilter, setJobFilter] = useState(
    () => searchParams.get("job") ?? "ALL",
  );
  const [locationFilter, setLocationFilter] = useState(
    () => searchParams.get("location") ?? "ALL",
  );
  const [sortKey, setSortKey] = useState<SortKey>("lastActivityAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [openCandidateId, setOpenCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (stageFilter !== "ALL") params.set("stage", stageFilter);
    if (jobFilter !== "ALL") params.set("job", jobFilter);
    if (locationFilter !== "ALL") params.set("location", locationFilter);

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, stageFilter, jobFilter, locationFilter]);

  const stagesPresent = useMemo(() => {
    const seen = new Set<ApplicationStatus>();
    for (const candidate of candidates) {
      if (candidate.stage) seen.add(candidate.stage);
    }
    return [...seen];
  }, [candidates]);

  const jobsPresent = useMemo(() => {
    const seen = new Set<string>();
    for (const candidate of candidates) {
      if (candidate.role && candidate.role !== "—") seen.add(candidate.role);
    }
    return [...seen].sort();
  }, [candidates]);

  const locationsPresent = useMemo(() => {
    const seen = new Set<string>();
    for (const candidate of candidates) {
      if (candidate.location && candidate.location !== "—") {
        seen.add(candidate.location);
      }
    }
    return [...seen].sort();
  }, [candidates]);

  const hasActiveFilters =
    query.trim() !== "" ||
    stageFilter !== "ALL" ||
    jobFilter !== "ALL" ||
    locationFilter !== "ALL";

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return candidates.filter((candidate) => {
      if (stageFilter !== "ALL" && candidate.stage !== stageFilter) {
        return false;
      }
      if (jobFilter !== "ALL" && candidate.role !== jobFilter) {
        return false;
      }
      if (locationFilter !== "ALL" && candidate.location !== locationFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      return (
        candidate.name.toLowerCase().includes(normalizedQuery) ||
        candidate.role.toLowerCase().includes(normalizedQuery) ||
        candidate.email.toLowerCase().includes(normalizedQuery) ||
        candidate.applicationNumber.toLowerCase().includes(normalizedQuery) ||
        candidate.location.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [candidates, query, stageFilter, jobFilter, locationFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;

    copy.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "stage") {
        return (a.stage ?? "").localeCompare(b.stage ?? "") * dir;
      }
      return (
        (new Date(a.lastActivityAt).getTime() -
          new Date(b.lastActivityAt).getTime()) *
        dir
      );
    });

    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
    setPage(1);
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown className="h-3 w-3 text-black/25" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-[var(--ca-blue)]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[var(--ca-blue)]" />
    );
  }

  function clearFilters() {
    setQuery("");
    setStageFilter("ALL");
    setJobFilter("ALL");
    setLocationFilter("ALL");
    setPage(1);
  }

  const kpiCards = [
    { label: "Active Candidates", value: kpis.active },
    { label: "New This Week", value: kpis.newThisWeek },
    { label: "Interviews", value: kpis.interviews },
    { label: "Offers", value: kpis.offers },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 lg:px-8 lg:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
            Candidates
          </h1>
          <p className="mt-1 text-sm text-black/50">
            Manage applicants across jobs and hiring stages.
          </p>
        </div>
      </div>

      {!isSupabaseConnected && <SupabaseConnectBanner />}

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
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search candidates…"
            className="h-9 w-full border border-black/10 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-black/35 focus:border-[var(--ca-blue)]"
          />
        </label>

        <select
          value={stageFilter}
          onChange={(event) => {
            setStageFilter(event.target.value as ApplicationStatus | "ALL");
            setPage(1);
          }}
          className="h-9 border border-black/10 bg-white px-2.5 text-sm text-black/70 outline-none focus:border-[var(--ca-blue)]"
        >
          <option value="ALL">All stages</option>
          {stagesPresent.map((stage) => (
            <option key={stage} value={stage}>
              {applicationStatusLabels[stage]}
            </option>
          ))}
        </select>

        <select
          value={jobFilter}
          onChange={(event) => {
            setJobFilter(event.target.value);
            setPage(1);
          }}
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
          value={locationFilter}
          onChange={(event) => {
            setLocationFilter(event.target.value);
            setPage(1);
          }}
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

      {pageItems.length === 0 ? (
        <p className="mt-4 border border-black/8 bg-white px-5 py-10 text-center text-sm text-black/45 md:hidden">
          {candidates.length === 0
            ? "No candidates yet."
            : "No candidates match your search or filters."}
        </p>
      ) : (
        <div className="mt-4 space-y-2 md:hidden">
          {pageItems.map((candidate) => (
            <button
              key={candidate.candidateId}
              type="button"
              onClick={() => setOpenCandidateId(candidate.candidateId)}
              className="w-full border border-black/8 bg-white p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <CandidateAvatar name={candidate.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-[var(--ca-app-ink)]">
                      {candidate.name}
                    </p>
                    <StageBadge stage={candidate.stage} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-black/55">
                    {candidate.role}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-black/45">
                    <span>{candidate.location}</span>
                    <span>Applied {formatRelativeTime(candidate.lastActivityAt)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 hidden overflow-x-auto border border-black/8 bg-white md:block">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[2fr_1.4fr_0.9fr_1fr_0.8fr] gap-3 border-b border-black/8 bg-[var(--ca-app-bg)] px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            <button
              type="button"
              onClick={() => toggleSort("name")}
              className="flex items-center gap-1 text-left"
            >
              Candidate {sortIcon("name")}
            </button>
            <span>Applied Role</span>
            <button
              type="button"
              onClick={() => toggleSort("stage")}
              className="flex items-center gap-1 text-left"
            >
              Stage {sortIcon("stage")}
            </button>
            <span>Location</span>
            <button
              type="button"
              onClick={() => toggleSort("lastActivityAt")}
              className="flex items-center gap-1 text-left"
            >
              Activity {sortIcon("lastActivityAt")}
            </button>
          </div>

          {pageItems.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-black/45">
              {candidates.length === 0
                ? "No candidates yet."
                : "No candidates match your search or filters."}
            </p>
          ) : (
            pageItems.map((candidate) => (
              <button
                key={candidate.candidateId}
                type="button"
                onClick={() => setOpenCandidateId(candidate.candidateId)}
                className="grid w-full grid-cols-[2fr_1.4fr_0.9fr_1fr_0.8fr] items-center gap-3 border-b border-black/6 px-5 py-3 text-left text-sm transition-colors last:border-0 hover:bg-[var(--ca-app-bg)]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <CandidateAvatar name={candidate.name} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-[var(--ca-app-ink)]">
                      {candidate.name}
                    </span>
                    <span className="block truncate text-xs text-black/45">
                      {candidate.email}
                    </span>
                  </span>
                </span>
                <span className="truncate text-black/55">{candidate.role}</span>
                <StageBadge stage={candidate.stage} />
                <span className="truncate text-black/45">{candidate.location}</span>
                <span className="text-black/45">
                  {formatRelativeTime(candidate.lastActivityAt)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-black/50">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border border-black/10 px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="border border-black/10 px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CandidateDrawer
        candidate={
          candidates.find((c) => c.candidateId === openCandidateId) ?? null
        }
        onClose={() => setOpenCandidateId(null)}
      />
    </div>
  );
}
