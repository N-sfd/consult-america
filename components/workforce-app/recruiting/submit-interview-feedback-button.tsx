"use client";

import { useState, useTransition } from "react";

import { submitInterviewFeedback } from "@/lib/recruiting/actions";

const fieldClass =
  "mt-1 h-8 w-full border border-black/10 bg-white px-2 text-xs outline-none focus:border-[var(--ca-blue)]";

export default function SubmitInterviewFeedbackButton({
  interviewId,
  applicationId,
  candidateId,
}: {
  interviewId: string;
  applicationId: string;
  candidateId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <span className="text-[0.65rem] font-medium text-[var(--ca-success,#16865b)]">
        Feedback saved
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="text-[0.65rem] font-medium text-[var(--ca-blue)] hover:underline"
        onClick={() => setOpen(true)}
      >
        Add feedback
      </button>
    );
  }

  return (
    <form
      className="mt-2 space-y-2 rounded border border-black/8 bg-black/[0.02] p-2"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await submitInterviewFeedback({
            interviewId,
            applicationId,
            candidateId,
            recommendation: String(
              formData.get("recommendation") ?? "YES",
            ) as "STRONG_YES" | "YES" | "NEUTRAL" | "NO" | "STRONG_NO",
            score: formData.get("score")
              ? Number(formData.get("score"))
              : undefined,
            notes: String(formData.get("notes") ?? "") || undefined,
          });
          if (result.ok) {
            setDone(true);
          } else {
            setError(result.error);
          }
        });
      }}
    >
      <select name="recommendation" className={fieldClass} defaultValue="YES">
        <option value="STRONG_YES">Strong yes</option>
        <option value="YES">Yes</option>
        <option value="NEUTRAL">Mixed</option>
        <option value="NO">No</option>
        <option value="STRONG_NO">Strong no</option>
      </select>
      <input
        name="score"
        type="number"
        min={1}
        max={5}
        placeholder="Score (optional)"
        className={fieldClass}
      />
      <input name="notes" placeholder="Notes (optional)" className={fieldClass} />
      {error ? <p className="text-[0.65rem] text-[var(--ca-error)]">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-7 border border-[var(--ca-blue)] bg-[var(--ca-blue)] px-2 text-[0.65rem] font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Submit"}
        </button>
        <button
          type="button"
          className="h-7 px-2 text-[0.65rem] text-black/50"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
