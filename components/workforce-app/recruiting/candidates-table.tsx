"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

import CandidateDrawer from "@/components/workforce-app/recruiting/candidate-drawer";
import SupabaseConnectBanner from "@/components/workforce-app/supabase-connect-banner";
import { formatRelativeTime } from "@/lib/recruiting/format";
import type { CandidateListItem } from "@/lib/recruiting/repository";
import { cn } from "@/lib/utils";
import { applicationStatusLabels, type ApplicationStatus } from "@/types/recruiting";

type SortKey = "name" | "stage" | "lastActivityAt";

const PAGE_SIZE = 10;

export default function CandidatesTable({
  candidates,
  isSupabaseConnected,
}: {
  candidates: CandidateListItem[];
  isSupabaseConnected: boolean;
}) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [sortKey, setSortKey] = useState<SortKey>("lastActivityAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [openCandidateId, setOpenCandidateId] = useState<string | null>(null);

  const stagesPresent = useMemo(() => {
    const seen = new Set<ApplicationStatus>();
    for (const candidate of candidates) {
      if (candidate.stage) seen.add(candidate.stage);
    }
    return [...seen];
  }, [candidates]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return candidates.filter((candidate) => {
      if (stageFilter !== "ALL" && candidate.stage !== stageFilter) {
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
  }, [candidates, query, stageFilter]);

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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Recruiting
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
        Candidates
      </h1>
      <p className="mt-2 text-sm text-black/50">
        {candidates.length} candidate{candidates.length === 1 ? "" : "s"} in
        the pipeline
      </p>

      {!isSupabaseConnected && <SupabaseConnectBanner />}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search candidates, roles, req #…"
            className="h-9 w-full border border-black/10 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-black/35 focus:border-[var(--ca-blue)]"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setStageFilter("ALL");
              setPage(1);
            }}
            className={cn(
              "border px-2.5 py-1 text-xs font-medium transition-colors",
              stageFilter === "ALL"
                ? "border-[var(--ca-blue)] bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]"
                : "border-black/10 text-black/55 hover:border-black/20",
            )}
          >
            All
          </button>
          {stagesPresent.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setStageFilter(stage);
                setPage(1);
              }}
              className={cn(
                "border px-2.5 py-1 text-xs font-medium transition-colors",
                stageFilter === stage
                  ? "border-[var(--ca-blue)] bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]"
                  : "border-black/10 text-black/55 hover:border-black/20",
              )}
            >
              {applicationStatusLabels[stage]}
            </button>
          ))}
        </div>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[var(--ca-app-ink)]">
                    {candidate.name}
                  </p>
                  <p className="mt-0.5 text-sm text-black/55">{candidate.role}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-[var(--ca-blue)]">
                  {candidate.stage ? applicationStatusLabels[candidate.stage] : "—"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-black/45">
                <span>{candidate.location}</span>
                <span>Last activity: {formatRelativeTime(candidate.lastActivityAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 hidden overflow-x-auto border border-black/8 bg-white md:block">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr_1fr_0.7fr_1fr] gap-3 border-b border-black/8 bg-[var(--ca-app-bg)] px-5 py-3 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            <button
              type="button"
              onClick={() => toggleSort("name")}
              className="flex items-center gap-1 text-left"
            >
              Candidate {sortIcon("name")}
            </button>
            <span>Role</span>
            <span>Application</span>
            <button
              type="button"
              onClick={() => toggleSort("stage")}
              className="flex items-center gap-1 text-left"
            >
              Stage {sortIcon("stage")}
            </button>
            <span>Location</span>
            <span>Match</span>
            <button
              type="button"
              onClick={() => toggleSort("lastActivityAt")}
              className="flex items-center gap-1 text-left"
            >
              Last Activity {sortIcon("lastActivityAt")}
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
                className="grid w-full grid-cols-[1.4fr_1.4fr_1fr_1fr_1fr_0.7fr_1fr] items-center gap-3 border-b border-black/6 px-5 py-4 text-left text-sm transition-colors last:border-0 hover:bg-[var(--ca-app-bg)]"
              >
                <span className="font-medium text-[var(--ca-app-ink)]">
                  {candidate.name}
                </span>
                <span className="truncate text-black/55">{candidate.role}</span>
                <span className="text-black/45">{candidate.applicationNumber}</span>
                <span className="text-[var(--ca-blue)]">
                  {candidate.stage ? applicationStatusLabels[candidate.stage] : "—"}
                </span>
                <span className="text-black/45">{candidate.location}</span>
                <span className="text-black/45">—</span>
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
