"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandLogo from "@/components/brand/brand-logo";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Jobs/Careers public chrome.
 * Browse + detail use the full marketing header.
 * Application flow uses a simplified compact-logo header.
 */
export default function JobsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isApply = /\/jobs\/[^/]+\/apply\/?$/.test(pathname);

  if (isApply) {
    return (
      <>
        <header className="sticky top-0 z-[60] border-b border-[#D8D0C5] bg-white">
          <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 overflow-x-clip px-5 py-2 md:px-8">
            <BrandLogo variant="full" context="apply" href="/" priority />
            <Link
              href="/jobs"
              className="shrink-0 text-sm font-medium text-[#695F57] transition-colors hover:text-[#B83A3A]"
            >
              All jobs
            </Link>
          </div>
        </header>
        <main className="experience-careers bg-[var(--cr-bg)]">{children}</main>
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
