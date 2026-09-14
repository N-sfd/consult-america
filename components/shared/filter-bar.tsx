import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FilterBarItem = {
  key: string;
  label: string;
  href?: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
};

export type FilterBarProps = {
  items: FilterBarItem[];
  trailing?: ReactNode;
  className?: string;
  label?: string;
};

/**
 * Compact chip filter row for queues and tables.
 */
export function FilterBar({
  items,
  trailing,
  className,
  label = "Filter",
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2" role="group" aria-label={label}>
        {items.map((item) => {
          const classes = cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-colors",
            item.active
              ? "border-[var(--ca-burgundy)] bg-[var(--ca-burgundy)] text-white"
              : "border-[var(--ca-app-border)] bg-white text-[var(--ca-app-ink)] hover:border-[var(--ca-burgundy)]/40 hover:text-[var(--ca-burgundy)]",
          );

          const body = (
            <>
              <span>{item.label}</span>
              {typeof item.count === "number" ? (
                <span
                  className={cn(
                    "tabular-nums",
                    item.active ? "text-white/80" : "text-[var(--ca-app-muted)]",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </>
          );

          if (item.href) {
            return (
              <Link key={item.key} href={item.href} className={classes} aria-current={item.active ? "page" : undefined}>
                {body}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              className={classes}
              aria-pressed={item.active}
            >
              {body}
            </button>
          );
        })}
      </div>
      {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
    </div>
  );
}
