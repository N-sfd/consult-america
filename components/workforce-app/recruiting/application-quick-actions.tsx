"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { moveApplicationStage } from "@/lib/recruiting/actions";
import { canTransitionApplication } from "@/lib/recruiting/status-machine";
import {
  applicationStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

/**
 * Status moves only — never HIRED here.
 * Hire must go through offer accept → convertHire so HR gets an Employee record.
 */
const QUICK_ACTIONS: Array<{
  label: string;
  target: ApplicationStatus;
}> = [
  { label: "Move to Review", target: "REVIEW" },
  { label: "Schedule Interview", target: "INTERVIEW" },
  { label: "Create Offer", target: "OFFER" },
  { label: "Reject", target: "REJECTED" },
];

export default function ApplicationQuickActions({
  applicationId,
  requisitionId,
  currentStatus,
}: {
  applicationId: string;
  requisitionId?: string;
  currentStatus: ApplicationStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const allowed = QUICK_ACTIONS.filter((action) =>
    canTransitionApplication(currentStatus, action.target),
  );

  function run(target: ApplicationStatus) {
    if (!requisitionId) {
      setError("Missing requisition for this application.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await moveApplicationStage(applicationId, target, requisitionId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (allowed.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-[var(--ca-app-muted)]">
          No status transitions available from{" "}
          {applicationStatusLabels[currentStatus]}.
        </p>
        {currentStatus === "OFFER" || currentStatus === "HIRED" ? (
          <p className="text-xs text-[var(--ca-app-muted)]">
            To hire into HR, accept the offer then use{" "}
            <strong className="font-semibold text-[var(--ca-app-ink)]">
              Hire → Create Employee
            </strong>{" "}
            — that creates the Employee record (not a status-only flip).
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allowed.map((action) => (
          <button
            key={action.target}
            type="button"
            disabled={pending}
            onClick={() => run(action.target)}
            className="rounded-md border border-[var(--ca-app-border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--ca-app-ink)] hover:border-[var(--ca-burgundy)]/40 disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
