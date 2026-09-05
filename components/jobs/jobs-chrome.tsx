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
        <header className="sticky top-0 z-[60] border-b border-[#DCE4E1] bg-white">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8">
            <BrandLogo variant="compact" context="apply" href="/" priority />
            <Link
              href="/jobs"
              className="text-sm font-medium text-[#5B6D6B] transition-colors hover:text-[#073B3A]"
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
