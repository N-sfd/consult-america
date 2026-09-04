"use client";

import { useState, useTransition } from "react";

import { submitManagerAssessmentAction } from "@/app/actions/performance-actions";
import { performanceReviewStatusLabels } from "@/types/self-service";
import type { PerformanceReview } from "@/types/self-service";

export default function ManagerAssessmentForm({
  review,
}: {
  review: PerformanceReview;
}) {
  const [managerAssessment, setManagerAssessment] = useState(
    review.managerAssessment ?? "",
  );
  const [rating, setRating] = useState(review.rating ?? 3);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canSubmit = review.status === "DRAFT" && Boolean(review.selfAssessment);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await submitManagerAssessmentAction({
        reviewId: review.id,
        managerAssessment,
        rating,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Performance Review
        </h2>
        <span className="text-xs uppercase tracking-[0.1em] text-black/45">
          {performanceReviewStatusLabels[review.status]}
        </span>
      </div>

      {review.selfAssessment ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.1em] text-black/40">
            Employee Self-Assessment
          </p>
          <p className="mt-2 text-sm text-black/70">{review.selfAssessment}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/50">
          Waiting on the employee&apos;s self-assessment before you can respond.
        </p>
      )}

      {review.status === "DRAFT" ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block text-sm">
            <span className="text-black/55">Your Assessment</span>
            <textarea
              value={managerAssessment}
              onChange={(event) => setManagerAssessment(event.target.value)}
              rows={5}
              disabled={!review.selfAssessment}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm disabled:bg-black/[0.03]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-black/55">Rating (1–5)</span>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              disabled={!review.selfAssessment}
              className="mt-1 w-24 rounded-md border border-black/15 px-3 py-2 text-sm disabled:bg-black/[0.03]"
            />
          </label>
          <button
            type="submit"
            disabled={pending || !canSubmit || !managerAssessment.trim()}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Submit to Employee
          </button>
        </form>
      ) : (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.1em] text-black/40">
            Your Assessment
          </p>
          <p className="mt-2 text-sm text-black/70">{review.managerAssessment}</p>
          {review.rating != null && (
            <p className="mt-2 text-sm font-medium">Rating: {review.rating} / 5</p>
          )}
        </div>
      )}

      {message && (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
