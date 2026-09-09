"use client";

import { useState, useTransition } from "react";

import { getCandidateDocumentSignedUrlAction } from "@/app/actions/candidate-document-actions";

export default function SubmittedDocumentLink({
  documentId,
}: {
  documentId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onView() {
    setError(null);
    startTransition(async () => {
      const result = await getCandidateDocumentSignedUrlAction(documentId);
      if (!result.ok || !result.signedUrl) {
        setError(result.message);
        return;
      }
      window.open(result.signedUrl, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="shrink-0 text-right text-sm font-semibold">
      <button
        type="button"
        disabled={pending}
        onClick={onView}
        className="text-[var(--ca-blue)] hover:underline disabled:opacity-60"
      >
        {pending ? "Opening…" : "View"}
      </button>
      {error ? <p className="mt-1 text-xs font-normal text-red-700">{error}</p> : null}
    </div>
  );
}
