"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getCandidateDrawerData,
  type CandidateDrawerData,
} from "@/lib/recruiting/actions";
import type { CandidateListItem } from "@/lib/recruiting/repository";
import { applicationStatusLabels } from "@/types/recruiting";

export default function CandidateDrawer({
  candidate,
  onClose,
}: {
  candidate: CandidateListItem | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<CandidateDrawerData | null>(null);
  const [loadedForId, setLoadedForId] = useState<string | null>(null);

  useEffect(() => {
    if (!candidate) return;

    let cancelled = false;
    getCandidateDrawerData(candidate.candidateId).then((data) => {
      if (cancelled) return;
      setDetail(data);
      setLoadedForId(candidate.candidateId);
    });

    return () => {
      cancelled = true;
    };
  }, [candidate]);

  const loading = candidate != null && loadedForId !== candidate.candidateId;

  return (
    <Sheet
      open={Boolean(candidate)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-sm">
        {candidate && (
          <>
            <SheetHeader className="border-b border-black/8 px-5 py-5">
              <SheetTitle className="text-lg">{candidate.name}</SheetTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-black/55">
                <span>
                  {candidate.stage
                    ? applicationStatusLabels[candidate.stage]
                    : "—"}
                </span>
                <span className="text-black/25">·</span>
                <span>Match —</span>
              </div>
            </SheetHeader>

            <div className="space-y-5 px-5 py-5">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Role
                </p>
                <p className="mt-1 text-sm text-[var(--ca-app-ink)]">
                  {candidate.role}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                    Experience
                  </p>
                  <p className="mt-1 text-sm text-[var(--ca-app-ink)]">
                    {loading
                      ? "Loading…"
                      : detail?.experienceYears != null
                        ? `${detail.experienceYears} years`
                        : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-[var(--ca-app-ink)]">
                    {candidate.location}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Work Authorization
                </p>
                <p className="mt-1 text-sm text-[var(--ca-app-ink)]">
                  {candidate.workAuthorization ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Skills
                </p>
                {loading ? (
                  <p className="mt-1 text-sm text-black/45">Loading…</p>
                ) : detail?.skills.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {detail.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-black/10 px-2 py-0.5 text-xs text-black/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-black/45">
                    No skills on file.
                  </p>
                )}
              </div>

              <Link
                href={`/app/recruiting/candidates/${candidate.candidateId}`}
                className="block w-full border border-[var(--ca-blue)] px-4 py-2 text-center text-sm font-medium text-[var(--ca-blue)] transition-colors hover:bg-[var(--ca-blue)]/5"
              >
                Open Full Profile
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
