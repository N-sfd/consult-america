import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";
import SectionLabel from "@/components/marketing/SectionLabel";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SUITE_FLOWS, SUITE_MODULES } from "@/lib/platforms/suite";

export const metadata: Metadata = {
  title: "Consult America Platforms",
  description:
    "One Consult America enterprise platform — CRM, ATS, HR, Employee, Payroll, and Admin as connected modules, not separate products.",
};

export default function PlatformsPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing relative overflow-x-clip">
        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] pt-20 pb-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[10%] top-[-8%] hidden h-[440px] w-[440px] rounded-full border border-[var(--ca-teal-deep)]/[0.06] lg:block"
          />
          <HomeBackgroundArc className="-left-[16%] bottom-[-28%] opacity-45" />
          <div className="relative z-10 mkt-shell">
            <SectionLabel tone="teal">Consult America Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 max-w-3xl text-[var(--ca-ink)]">
              One enterprise platform.
              <br className="hidden sm:block" />
              Six connected modules.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ca-text-secondary)]">
              CRM, ATS, HR, Employee, Payroll, and Admin share identity, chrome, and continuous
              business data — sold as capabilities, operated as one system.
            </p>
          </div>
        </section>

        <section className="border-b border-[var(--ca-line)] bg-white py-14 sm:py-16">
          <div className="mkt-shell">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Suite modules
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-[var(--ca-ink)]">
              Parts of the same operating system.
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUITE_MODULES.map((platform) => (
                <Link
                  key={platform.id}
                  href={platform.marketingHref}
                  className="group flex flex-col justify-between rounded-xl border border-[var(--ca-line)] bg-[var(--ca-canvas)] p-6 transition-colors hover:border-[var(--ca-teal)] hover:bg-white"
                >
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">
                      {platform.primaryModule}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--ca-ink)] group-hover:text-[var(--ca-teal-chrome)]">
                      {platform.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[var(--ca-text-secondary)]">
                      {platform.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                      {platform.role}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--ca-line)] pt-4 text-xs font-semibold text-[var(--ca-teal)]">
                    <span>Explore {platform.name}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-mist)] py-14 sm:py-16">
          <div className="relative z-10 mkt-shell">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Connected suite
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-[var(--ca-ink)]">
              How the modules relate.
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {SUITE_FLOWS.map((flow) => (
                <div
                  key={flow.id}
                  className="rounded-xl border border-[var(--ca-line)] bg-white/90 p-5"
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">
                    {flow.title}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-[var(--ca-ink)]">
                    {flow.steps.map((step, i) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        {i > 0 ? (
                          <span className="text-[var(--ca-teal-soft)]" aria-hidden>
                            →
                          </span>
                        ) : null}
                        {step}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                    {flow.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--ca-line)] bg-[var(--ca-teal-deep)] py-14 sm:py-16">
          <div className="mkt-shell flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-white">
                Enter the workspace.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Authenticated modules share chrome, switcher, and brand tokens — so the
                relationship is obvious the moment you sign in.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-accent-hover)]"
            >
              Sign in to the platform
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
