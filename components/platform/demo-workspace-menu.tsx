"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import {
  DEMO_WORKSPACES,
  type PlatformWorkspaceId,
} from "@/components/platform/platform-nav";
import { cn } from "@/lib/utils";

/** Collapsed demo-only workspace switcher — hidden when Supabase is configured. */
export default function DemoWorkspaceMenu({
  current,
  dark = false,
}: {
  current: PlatformWorkspaceId;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (isSupabaseBrowserConfigured()) return null;

  const others = DEMO_WORKSPACES.filter((item) => item.id !== current);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[0.75rem] font-semibold transition-colors",
          dark
            ? "bg-white/8 text-white/80 hover:bg-white/12 hover:text-white"
            : "bg-[var(--ca-platform-sage-light)] text-[var(--ca-platform-muted)] hover:text-[var(--ca-platform-deep)]",
        )}
        aria-expanded={open}
      >
        <span>Demo Workspace</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className={cn(
            "mt-1.5 overflow-hidden rounded-lg border text-[0.75rem]",
            dark
              ? "border-white/10 bg-[#052827] text-white/80"
              : "border-[var(--ca-platform-border)] bg-white text-[var(--ca-platform-muted)]",
          )}
        >
          {others.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 transition-colors",
                dark ? "hover:bg-white/8 hover:text-white" : "hover:bg-[var(--ca-platform-sage-light)] hover:text-[var(--ca-platform-deep)]",
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
