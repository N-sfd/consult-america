import type { Metadata } from "next";

import ReviewPanel from "@/components/performance/review-panel";
import { getPerformanceReviews, getReviewCycles } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Performance | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function EmployeePerformancePage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.performance.read");

  const reviews = getPerformanceReviews(actor.session.employeeId);
  const cycles = getReviewCycles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Performance
        </h1>
        <p className="mt-2 text-black/55">
          Review cycles, self-assessments, and manager feedback.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No review cycle is open for you right now.
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <ReviewPanel
              key={review.id}
              review={review}
              cycle={cycles.find((cycle) => cycle.id === review.cycleId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
