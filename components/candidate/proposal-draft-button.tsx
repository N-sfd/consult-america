"use client";

import { useState, useTransition } from "react";

import { generateProposalDraftAction } from "@/app/actions/candidate-actions";
import type { JobMatchResult } from "@/lib/candidate/job-match";

export default function ProposalDraftButton({
  jobRequisitionId,
  jobTitle,
  jobSummary,
  location,
  match,
}: {
  jobRequisitionId?: string;
  jobTitle: string;
  jobSummary?: string;
  location?: string;
  match?: JobMatchResult | null;
}) {
  const [body, setBody] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onGenerate() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const response = await generateProposalDraftAction({
        jobRequisitionId,
        jobTitle,
        jobSummary,
        location,
        matchScore: match?.overallMatch,
        skillsFound: match?.skillsFound,
        skillsMissing: match?.skillsMissing,
      });
      if (response.ok && response.body) {
        setBody(response.body);
        setMessage(response.message);
      } else {
        setError(response.message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGenerate}
        disabled={pending}
        className="rounded-lg bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Generating…" : "Create tailored proposal"}
      </button>
      {message ? (
        <p className="text-sm text-[var(--ca-platform-muted)]">{message}</p>
      ) : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {body ? (
        <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[var(--ca-platform-ink)]">
              Proposal draft
            </h3>
            <button
              type="button"
              className="text-xs font-semibold text-[var(--ca-platform-mid)] hover:underline"
              onClick={async () => {
                await navigator.clipboard.writeText(body);
                setMessage("Copied to clipboard.");
              }}
            >
              Copy
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--ca-platform-ink)]">
            {body}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
