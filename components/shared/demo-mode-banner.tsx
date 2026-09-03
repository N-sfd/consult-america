import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";

/** Shown in every portal shell only when Supabase auth isn't configured. */
export default function DemoModeBanner() {
  if (isSupabaseBrowserConfigured()) return null;

  return (
    <p className="border-t border-[var(--ca-app-border)] px-4 py-2 text-[0.7rem] text-[var(--ca-app-muted)]">
      Demo Mode — Supabase not configured, sign-in is bypassed.
    </p>
  );
}
