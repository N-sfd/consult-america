"use client";

import Link from "next/link";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";

/** Compact top banner — only when Supabase auth is not configured. */
export default function DemoEnvironmentBanner() {
  if (isSupabaseBrowserConfigured()) return null;

  return (
    <div className="ca-platform-demo-banner" role="status">
      <div>
        <strong>Demo environment</strong>
        <span className="ml-2 hidden sm:inline">
          Authentication and live persistence are disabled.
        </span>
      </div>
      <Link
        href="/app/dashboard"
        className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-[#7a6a3d] underline-offset-2 hover:underline"
      >
        Configure Supabase
      </Link>
    </div>
  );
}
