import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  compact?: boolean;
};

/**
 * Strong empty state for tables, queues, and panels.
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center border border-dashed border-[var(--ca-app-border)] bg-[var(--ca-app-panel)] text-left",
        compact ? "gap-2 px-4 py-6" : "gap-3 px-5 py-10",
        className,
      )}
    >
      {icon ? (
        <div className="text-[var(--ca-app-muted)]" aria-hidden>
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--ca-app-ink)]">{title}</p>
        {description ? (
          <p className="max-w-md text-sm leading-relaxed text-[var(--ca-app-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
