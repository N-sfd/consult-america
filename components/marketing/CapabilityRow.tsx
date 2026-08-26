"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface CapabilityRowProps {
  number: string;
  title: string;
  description?: string;
  href: string;
  active?: boolean;
  onFocus?: () => void;
  compact?: boolean;
}

export default function CapabilityRow({
  number,
  title,
  description,
  href,
  active = false,
  onFocus,
  compact = false,
}: CapabilityRowProps) {
  return (
    <Link
      href={href}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      className={cn(
        "group relative grid items-center gap-4 border-b border-white/12 py-7 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:py-9",
        active && "bg-white/[0.03]",
        "hover:bg-white/[0.03]",
      )}
    >
      <span
        className={cn(
          "mkt-eyebrow md:col-span-2",
          active ? "text-[var(--mkt-blue-soft)]" : "text-white/40",
        )}
      >
        {number}
      </span>

      <div className={cn(compact ? "md:col-span-9" : "md:col-span-5")}>
        <h3
          className={cn(
            "text-2xl font-medium tracking-[-0.035em] transition-colors duration-200 md:text-3xl",
            active ? "text-[var(--mkt-blue-soft)]" : "text-white group-hover:text-[var(--mkt-blue-soft)]",
          )}
        >
          {title}
        </h3>
        {!compact && description ? (
          <p className="mt-3 max-w-md text-sm leading-6 text-white/50 md:hidden">
            {description}
          </p>
        ) : null}
      </div>

      {!compact && description ? (
        <p className="hidden max-w-xl text-base leading-7 text-white/50 md:col-span-4 md:block">
          {description}
        </p>
      ) : null}

      <div className="flex md:col-span-1 md:justify-end">
        <ArrowUpRight
          className={cn(
            "h-5 w-5 text-white/70 transition-transform duration-200",
            "group-hover:translate-x-1 group-hover:-translate-y-1",
            active && "translate-x-1 -translate-y-1 text-[var(--mkt-blue-soft)]",
          )}
        />
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 h-px bg-[var(--mkt-blue)] transition-all duration-500",
          active ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </Link>
  );
}
