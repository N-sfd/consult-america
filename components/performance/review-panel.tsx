"use client";

import { useState, useTransition } from "react";

import {
  acknowledgeReviewAction,
  submitSelfAssessmentAction,
} from "@/app/actions/performance-actions";
import { performanceReviewStatusLabels } from "@/types/self-service";
import type { PerformanceReview, ReviewCycle } from "@/types/self-service";

export default function ReviewPanel({
  review,
  cycle,
}: {
  review: PerformanceReview;
  cycle?: ReviewCycle;
}) {
  const [selfAssessment, setSelfAssessment] = useState(review.selfAssessment ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmitSelfAssessment(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await submitSelfAssessmentAction({
        reviewId: review.id,
        selfAssessment,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  function handleAcknowledge() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await acknowledgeReviewAction({ reviewId: review.id });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            {cycle?.name ?? "Review Cycle"}
          </h2>
          <span className="text-xs uppercase tracking-[0.1em] text-black/45">
            {performanceReviewStatusLabels[review.status]}
          </span>
        </div>

        <form onSubmit={handleSubmitSelfAssessment} className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="text-black/55">Your Self-Assessment</span>
            <textarea
              value={selfAssessment}
              onChange={(event) => setSelfAssessment(event.target.value)}
              rows={5}
              disabled={review.status !== "DRAFT"}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm disabled:bg-black/[0.03]"
              placeholder="Reflect on your accomplishments and growth this cycle."
            />
          </label>
          {review.status === "DRAFT" && (
            <button
              type="submit"
              disabled={pending || !selfAssessment.trim()}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Submit Self-Assessment
            </button>
          )}
        </form>
      </div>

      {(review.status === "SUBMITTED" || review.status === "ACKNOWLEDGED") && (
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Manager Assessment
          </h2>
          <p className="mt-3 text-sm text-black/70">{review.managerAssessment}</p>
          {review.rating != null && (
            <p className="mt-3 text-sm font-medium">Rating: {review.rating} / 5</p>
          )}

          {review.status === "SUBMITTED" && (
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={pending}
              className="mt-4 rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50"
            >
              Acknowledge Review
            </button>
          )}
        </div>
      )}

      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
