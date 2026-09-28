import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type LoadingStateProps = {
  label?: string;
  compact?: boolean;
  className?: string;
};

/** Standard loading indicator — replaces ad hoc inline Loader2/animate-spin usage. */
export function LoadingState({ label = "Loading…", compact, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-2 text-sm text-[var(--ca-app-muted)]",
        compact ? "py-2" : "justify-center py-10",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
