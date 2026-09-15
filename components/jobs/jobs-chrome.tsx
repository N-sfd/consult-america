"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandLogo from "@/components/brand/brand-logo";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Jobs/Careers public chrome.
 * Browse + detail = marketing density (editorial).
 * Apply = calm operational app UI (no marketing hero density).
 */
export default function JobsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isApply = /\/jobs\/[^/]+\/apply\/?$/.test(pathname);

  if (isApply) {
    return (
      <>
        <header className="sticky top-0 z-[60] border-b border-[var(--ca-app-border,#E2E6EB)] bg-white">
          <div className="mx-auto flex min-h-[64px] max-w-[1440px] items-center justify-between gap-4 overflow-x-clip px-5 py-2 md:px-8">
            <BrandLogo variant="full" context="apply" href="/" priority />
            <Link
              href="/jobs"
              className="shrink-0 text-sm font-medium text-[var(--ca-app-muted,#5B6573)] transition-colors hover:text-[var(--ca-burgundy,#B83A3A)]"
            >
              All jobs
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="experience-careers bg-[var(--cr-bg)] pt-4 md:pt-6">{children}</main>
      <SiteFooter />
    </>
  );
}
