import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusTone =
  | "neutral"
  | "info"
  | "accent"
  | "warning"
  | "success"
  | "danger"
  | "muted";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-black/[0.06] text-black/65",
  info: "bg-[var(--ca-app-info-soft)] text-[var(--ca-app-info)]",
  accent: "bg-[var(--ca-burgundy)]/10 text-[var(--ca-burgundy)]",
  warning: "bg-amber-500/15 text-amber-800",
  success: "bg-emerald-600/12 text-emerald-800",
  danger: "bg-red-600/10 text-red-700",
  muted: "bg-black/[0.04] text-black/45",
};

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
  title?: string;
};

/**
 * Dense operational status chip — uppercase micro-label for app surfaces.
 */
export function StatusBadge({
  children,
  tone = "neutral",
  className,
  title,
}: StatusBadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex w-fit max-w-full items-center truncate rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
