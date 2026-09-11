"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { moveApplicationStage } from "@/lib/recruiting/actions";
import { canTransitionApplication } from "@/lib/recruiting/status-machine";
import {
  applicationStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

const QUICK_ACTIONS: Array<{
  label: string;
  target: ApplicationStatus;
}> = [
  { label: "Move to Review", target: "REVIEW" },
  { label: "Schedule Interview", target: "INTERVIEW" },
  { label: "Create Offer", target: "OFFER" },
  { label: "Reject", target: "REJECTED" },
  { label: "Hire", target: "HIRED" },
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
      <p className="text-sm text-black/45">
        No status transitions available from {applicationStatusLabels[currentStatus]}.
      </p>
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
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/75 hover:bg-black/[0.03] disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
