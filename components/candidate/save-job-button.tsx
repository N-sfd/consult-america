"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { toggleSavedJobAction } from "@/app/actions/candidate-actions";
import { cn } from "@/lib/utils";

export default function SaveJobButton({
  jobRequisitionId,
  initiallySaved = false,
  className,
}: {
  jobRequisitionId: string;
  initiallySaved?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onToggle() {
    setMessage(null);
    startTransition(async () => {
      const response = await toggleSavedJobAction({ jobRequisitionId });
      if (response.ok && typeof response.saved === "boolean") {
        setSaved(response.saved);
        setMessage(response.message);
      } else {
        setMessage(response.message);
      }
    });
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
          saved
            ? "border-[var(--ca-platform-accent)] bg-[var(--ca-app-selected)] text-[var(--ca-platform-ink)]"
            : "border-[var(--ca-platform-border)] bg-white text-[var(--ca-platform-ink)] hover:border-[var(--ca-platform-mid)]",
        )}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4" aria-hidden />
        ) : (
          <Bookmark className="h-4 w-4" aria-hidden />
        )}
        {pending ? "Saving…" : saved ? "Saved" : "Save job"}
      </button>
      {message ? (
        <span className="text-xs text-[var(--ca-platform-muted)]">{message}</span>
      ) : null}
    </div>
  );
}
