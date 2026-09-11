"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { CandidateAvatar } from "@/components/workforce-app/recruiting/stage-badge";
import OfferActions from "@/components/workforce-app/recruiting/offer-actions";
import ScheduleInterviewButton from "@/components/workforce-app/recruiting/schedule-interview-button";
import { moveApplicationStage } from "@/lib/recruiting/actions";
import { formatDate } from "@/lib/recruiting/format";
import { allowedApplicationTransitions } from "@/lib/recruiting/status-machine";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import {
  APPLICATION_PIPELINE,
  applicationStatusLabels,
  type ApplicationStatus,
  type Offer,
} from "@/types/recruiting";

export type PipelineCard = {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  status: ApplicationStatus;
  appliedAt: string;
  offer?: Offer;
  matchScore?: number;
};

function matchTone(score: number) {
  if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

export default function PipelineBoard({
  requisitionId,
  jobTitle,
  cards,
  defaultEmploymentType,
  defaultWorkplaceType,
  initialFocusStage = null,
}: {
  requisitionId: string;
  jobTitle: string;
  cards: PipelineCard[];
  defaultEmploymentType: EmploymentType;
  defaultWorkplaceType: WorkplaceType;
  initialFocusStage?: ApplicationStatus | null;
}) {
  const [items, setItems] = useState(cards);
  const [focusStage, setFocusStage] = useState<ApplicationStatus | null>(
    initialFocusStage,
  );
  const [isPending, startTransition] = useTransition();

  const visibleStages = useMemo(
    () =>
      focusStage
        ? APPLICATION_PIPELINE.filter((status) => status === focusStage)
        : APPLICATION_PIPELINE,
    [focusStage],
  );

  function handleMove(applicationId: string, status: ApplicationStatus) {
    const previous = items.find((i) => i.applicationId === applicationId);
    setItems((prev) =>
      prev.map((item) =>
        item.applicationId === applicationId ? { ...item, status } : item,
      ),
    );
    startTransition(async () => {
      const result = await moveApplicationStage(
        applicationId,
        status,
        requisitionId,
      );
      if (!result.ok) {
        if (previous) {
          setItems((prev) =>
            prev.map((item) =>
              item.applicationId === applicationId
                ? { ...item, status: previous.status }
                : item,
            ),
          );
        }
        window.alert(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 lg:px-8 lg:py-6">
      <Link
        href={`/app/recruiting/jobs/${requisitionId}`}
        className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-[var(--ca-blue)]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {jobTitle}
      </Link>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[1.5rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
          Pipeline
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          {focusStage ? (
            <button
              type="button"
              onClick={() => setFocusStage(null)}
              className="text-sm text-[var(--ca-blue)] hover:underline"
            >
              Show all stages
            </button>
          ) : (
            <p className="text-sm text-black/45">
              Click a stage header to filter
            </p>
          )}
          <Link
            href={`/app/recruiting/jobs/${requisitionId}?tab=match`}
            className="text-sm font-semibold text-[var(--ca-blue)] hover:underline"
          >
            Candidate Match
          </Link>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-max gap-3 pb-2">
          {visibleStages.map((status) => {
            const stageItems = items.filter((item) => item.status === status);
            const count = items.filter((item) => item.status === status).length;
            return (
              <div
                key={status}
                className={focusStage ? "w-[320px] shrink-0" : "w-[220px] shrink-0"}
              >
                <button
                  type="button"
                  onClick={() =>
                    setFocusStage((current) =>
                      current === status ? null : status,
                    )
                  }
                  className="flex w-full items-center justify-between border-b border-black/10 pb-2 text-left transition-colors hover:border-[var(--ca-blue)]"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-black/50">
                    {applicationStatusLabels[status]}
                  </p>
                  <span className="text-sm font-medium text-black/40">
                    {count}
                  </span>
                </button>

                <div className="mt-2 space-y-2">
                  {stageItems.map((item) => (
                    <div
                      key={item.applicationId}
                      className="border border-black/8 bg-white p-3"
                    >
                      <div className="flex items-center gap-2">
                        <CandidateAvatar name={item.candidateName} className="h-6 w-6" />
                        <Link
                          href={`/app/recruiting/candidates/${item.candidateId}`}
                          className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ca-app-ink)] hover:text-[var(--ca-blue)]"
                        >
                          {item.candidateName}
                        </Link>
                        {item.matchScore !== undefined ? (
                          <span
                            className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[0.65rem] font-semibold ${matchTone(item.matchScore)}`}
                          >
                            {Math.round(item.matchScore)}%
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-xs text-black/45">
                        Applied {formatDate(item.appliedAt)}
                      </p>
                      <select
                        value={item.status}
                        disabled={isPending}
                        onChange={(event) =>
                          handleMove(
                            item.applicationId,
                            event.target.value as ApplicationStatus,
                          )
                        }
                        className="mt-2 h-7 w-full border border-black/10 bg-white px-1.5 text-xs text-black/70 outline-none focus:border-[var(--ca-blue)] disabled:opacity-50"
                      >
                        <option value={item.status}>
                          {applicationStatusLabels[item.status]}
                        </option>
                        {allowedApplicationTransitions(item.status).map(
                          (option) => (
                            <option key={option} value={option}>
                              Move to {applicationStatusLabels[option]}
                            </option>
                          ),
                        )}
                      </select>
                      {(item.status === "INTERVIEW" ||
                        item.status === "HIRING_MANAGER_REVIEW" ||
                        item.status === "FINAL_INTERVIEW" ||
                        item.status === "RECRUITER_SCREEN") && (
                        <ScheduleInterviewButton
                          applicationId={item.applicationId}
                          requisitionId={requisitionId}
                        />
                      )}
                      <OfferActions
                        applicationId={item.applicationId}
                        requisitionId={requisitionId}
                        status={item.status}
                        offer={item.offer}
                        defaultEmploymentType={defaultEmploymentType}
                        defaultWorkplaceType={defaultWorkplaceType}
                      />
                    </div>
                  ))}
                  {stageItems.length === 0 && (
                    <p className="border border-dashed border-black/10 px-3 py-4 text-center text-xs text-black/35">
                      No candidates
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
