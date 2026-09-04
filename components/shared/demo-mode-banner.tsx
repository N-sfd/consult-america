import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";

/** @deprecated Prefer DemoEnvironmentBanner in PlatformShell. Kept for any leftover imports. */
export default function DemoModeBanner() {
  if (isSupabaseBrowserConfigured()) return null;
  return null;
}
