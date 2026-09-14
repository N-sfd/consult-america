"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

export type ApprovalActionKind = "approve" | "reject" | "return";

export type ApprovalActionsProps = {
  onAction: (action: ApprovalActionKind, comment: string) => Promise<void> | void;
  allowReturn?: boolean;
  requireCommentOn?: ApprovalActionKind[];
  className?: string;
  disabled?: boolean;
};

/**
 * Explicit approve / reject / return with optional required comments.
 */
export function ApprovalActions({
  onAction,
  allowReturn = true,
  requireCommentOn = ["reject", "return"],
  className,
  disabled = false,
}: ApprovalActionsProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: ApprovalActionKind) => {
    setError(null);
    if (requireCommentOn.includes(action) && !comment.trim()) {
      setError("A comment is required for this action.");
      return;
    }
    startTransition(async () => {
      try {
        await onAction(action, comment.trim());
        setComment("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed.");
      }
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ca-app-muted)]">
          Comment
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          disabled={disabled || pending}
          placeholder="Add context for the requester…"
          className="w-full resize-y rounded-md border border-[var(--ca-app-border)] bg-white px-3 py-2 text-sm text-[var(--ca-app-ink)] outline-none focus:border-[var(--ca-burgundy)]"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => run("approve")}
          className="inline-flex h-9 items-center rounded-md bg-[var(--ca-burgundy)] px-3 text-sm font-semibold text-white hover:bg-[var(--ca-burgundy-hover)] disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => run("reject")}
          className="inline-flex h-9 items-center rounded-md border border-[var(--ca-app-border)] bg-white px-3 text-sm font-semibold text-[var(--ca-app-ink)] hover:border-red-300 hover:text-red-700 disabled:opacity-50"
        >
          Reject
        </button>
        {allowReturn ? (
          <button
            type="button"
            disabled={disabled || pending}
            onClick={() => run("return")}
            className="inline-flex h-9 items-center rounded-md border border-[var(--ca-app-border)] bg-white px-3 text-sm font-semibold text-[var(--ca-app-ink)] hover:border-amber-300 hover:text-amber-800 disabled:opacity-50"
          >
            Return
          </button>
        ) : null}
      </div>
    </div>
  );
}
