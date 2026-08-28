"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { CandidateAvatar } from "@/components/workforce-app/recruiting/stage-badge";
import OfferActions from "@/components/workforce-app/recruiting/offer-actions";
import { moveApplicationStage } from "@/lib/recruiting/actions";
import { formatDate } from "@/lib/recruiting/format";
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
};

export default function PipelineBoard({
  requisitionId,
  jobTitle,
  cards,
  defaultEmploymentType,
  defaultWorkplaceType,
}: {
  requisitionId: string;
  jobTitle: string;
  cards: PipelineCard[];
  defaultEmploymentType: EmploymentType;
  defaultWorkplaceType: WorkplaceType;
}) {
  const [items, setItems] = useState(cards);
  const [isPending, startTransition] = useTransition();

  function handleMove(applicationId: string, status: ApplicationStatus) {
    setItems((prev) =>
      prev.map((item) =>
        item.applicationId === applicationId ? { ...item, status } : item,
      ),
    );
    startTransition(async () => {
      await moveApplicationStage(applicationId, status, requisitionId);
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

      <h1 className="mt-2 text-[1.5rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
        Pipeline
      </h1>

      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-max gap-3 pb-2">
          {APPLICATION_PIPELINE.map((status) => {
            const stageItems = items.filter((item) => item.status === status);
            return (
              <div key={status} className="w-[220px] shrink-0">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-black/50">
                    {applicationStatusLabels[status]}
                  </p>
                  <span className="text-sm font-medium text-black/40">
                    {stageItems.length}
                  </span>
                </div>

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
                        {APPLICATION_PIPELINE.map((option) => (
                          <option key={option} value={option}>
                            Move to {applicationStatusLabels[option]}
                          </option>
                        ))}
                        <option value="REJECTED">Move to Rejected</option>
                      </select>
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
