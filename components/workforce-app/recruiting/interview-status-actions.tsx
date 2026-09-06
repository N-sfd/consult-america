"use client";

import { useTransition } from "react";

import { updateInterviewStatus } from "@/lib/recruiting/actions";
import type { InterviewStatus } from "@/types/recruiting";

const buttonClass =
  "border border-black/10 px-2 py-0.5 text-[0.65rem] font-medium text-black/60 transition-colors hover:border-[var(--ca-blue)] hover:text-[var(--ca-blue)] disabled:opacity-50";

export default function InterviewStatusActions({
  interviewId,
  applicationId,
  requisitionId,
  status,
}: {
  interviewId: string;
  applicationId: string;
  requisitionId: string;
  status: InterviewStatus;
}) {
  const [pending, startTransition] = useTransition();

  if (status !== "SCHEDULED") {
    return (
      <span className="text-xs uppercase tracking-wide text-black/40">
        {status.replaceAll("_", " ")}
      </span>
    );
  }

  function setStatus(next: InterviewStatus) {
    startTransition(async () => {
      const result = await updateInterviewStatus({
        interviewId,
        applicationId,
        requisitionId,
        status: next,
      });
      if (!result.ok) {
        window.alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        disabled={pending}
        className={buttonClass}
        onClick={() => setStatus("COMPLETED")}
      >
        Complete
      </button>
      <button
        type="button"
        disabled={pending}
        className={buttonClass}
        onClick={() => setStatus("CANCELLED")}
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={pending}
        className={buttonClass}
        onClick={() => setStatus("NO_SHOW")}
      >
        No-show
      </button>
    </div>
  );
}
