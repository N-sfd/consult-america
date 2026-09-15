"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setServiceEnrollmentStatusAction } from "@/app/actions/contact-actions";
import { StatusBadge } from "@/components/shared";
import { nextEnrollmentStatus } from "@/lib/clientflow/enrollments";
import type { ClientFlowServiceEnrollment } from "@/lib/clientflow/types";

function formatWhen(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ownerLabel(ownerUserId: string) {
  if (!ownerUserId || ownerUserId === "profile-clientflow-system") return "Unassigned";
  return ownerUserId;
}

export function ClientFlowEnrollmentRows({
  enrollments,
}: {
  enrollments: ClientFlowServiceEnrollment[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (enrollments.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-black/15 bg-white px-4 py-8 text-center text-sm text-black/50">
        No service enrollments yet. Talk to Expert inquiries create them automatically.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {enrollments.map((enrollment) => {
        const next = nextEnrollmentStatus(enrollment.status);
        return (
          <article
            key={enrollment.id}
            className="rounded-lg border border-black/10 bg-white px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-[var(--ca-app-ink)]">
                  {enrollment.serviceName}
                </h3>
                <p className="mt-1 text-xs text-black/40">
                  Updated {formatWhen(enrollment.updatedAt)}
                </p>
              </div>
              <StatusBadge tone="accent">{enrollment.status}</StatusBadge>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-black/40">Source inquiry</dt>
                <dd className="font-medium">{enrollment.sourceInquiryId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-black/40">Owner</dt>
                <dd className="font-medium">{ownerLabel(enrollment.ownerUserId)}</dd>
              </div>
            </dl>

            {enrollment.recentStatusChanges.length > 0 ? (
              <div className="mt-4 border-t border-black/5 pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                  Recent state changes
                </p>
                <ul className="mt-2 space-y-1.5">
                  {enrollment.recentStatusChanges.map((change) => (
                    <li key={change.id} className="text-sm text-black/65">
                      {change.subject}
                      <span className="ml-2 text-xs text-black/35">
                        {formatWhen(change.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {next ? (
              <div className="mt-4">
                <button
                  type="button"
                  disabled={isPending && pendingId === enrollment.id}
                  className="rounded-md bg-[var(--ca-app-ink)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                  onClick={() => {
                    setError(null);
                    setPendingId(enrollment.id);
                    startTransition(async () => {
                      const result = await setServiceEnrollmentStatusAction(
                        enrollment.id,
                        next,
                      );
                      if (!result.ok) setError(result.message);
                      else router.refresh();
                      setPendingId(null);
                    });
                  }}
                >
                  Advance to {next}
                </button>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
