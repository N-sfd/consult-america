import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";
import SectionLabel from "@/components/marketing/SectionLabel";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  SUITE_FLOWS,
  SUITE_MODULES,
  type SuiteModuleId,
} from "@/lib/platforms/suite";
import { cn } from "@/lib/utils";

export type PlatformCapability = { title: string; detail: string };

export type PlatformSuitePageProps = {
  moduleId: SuiteModuleId;
  /** Hero H1 — may include emphasis */
  headline: string;
  /** Business problem statement */
  problem: string;
  capabilities: PlatformCapability[];
  /** Workflow / product visual — optional custom node */
  workflowVisual: React.ReactNode;
  /** Short outcomes */
  outcomes: string[];
  /** CTA into the live app */
  ctaLabel: string;
  /** Optional secondary CTA */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Which suite flows to emphasize (defaults by module) */
  flowIds?: Array<(typeof SUITE_FLOWS)[number]["id"]>;
  className?: string;
};

const DEFAULT_FLOWS: Record<SuiteModuleId, Array<(typeof SUITE_FLOWS)[number]["id"]>> = {
  crm: ["client", "govern"],
  ats: ["hire", "govern"],
  hr: ["hire", "govern"],
  employee: ["hire"],
  payroll: ["hire"],
  admin: ["govern", "hire", "client"],
};

/**
 * Shared marketing framework for Consult America platform pages:
 * Hero → problem → capabilities → workflow visual → connected suite → outcomes → CTA
 */
export default function PlatformSuitePage({
  moduleId,
  headline,
  problem,
  capabilities,
  workflowVisual,
  outcomes,
  ctaLabel,
  secondaryHref = "/platforms",
  secondaryLabel = "View all platforms",
  flowIds,
  className,
}: PlatformSuitePageProps) {
  const module = SUITE_MODULES.find((m) => m.id === moduleId)!;
  const flows = (flowIds ?? DEFAULT_FLOWS[moduleId])
    .map((id) => SUITE_FLOWS.find((f) => f.id === id))
    .filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main className={cn("experience-marketing relative overflow-x-clip", className)}>
        {/* Hero */}
        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] pt-20 pb-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[8%] top-[-10%] hidden h-[420px] w-[420px] rounded-full border border-[var(--ca-teal-deep)]/[0.06] lg:block"
          />
          <HomeBackgroundArc className="-left-[18%] bottom-[-30%] opacity-50" />
          <div className="relative z-10 mkt-shell">
            <SectionLabel tone="teal">Consult America Platforms</SectionLabel>
            <p className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              {module.name}
              <span className="mx-2 text-[var(--ca-mist)]">·</span>
              {module.primaryModule}
            </p>
            <h1 className="mkt-hero-heading mt-3 max-w-3xl text-[var(--ca-ink)]">{headline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ca-text-secondary)]">
              {module.role}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={module.appHref}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-accent-hover)]"
              >
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--ca-line)] bg-white px-6 text-sm font-semibold text-[var(--ca-ink)] hover:border-[var(--ca-teal)]"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* Business problem */}
        <section className="border-b border-[var(--ca-line)] bg-white py-14 sm:py-16">
          <div className="mkt-shell grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                The operating challenge
              </p>
            </div>
            <div className="lg:col-span-8">
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-snug tracking-[-0.02em] text-[var(--ca-ink)]">
                {problem}
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-14 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-6%] bottom-[-20%] hidden h-[280px] w-[280px] rounded-full border border-[var(--ca-teal)]/[0.08] lg:block"
          />
          <div className="relative z-10 mkt-shell">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Capabilities
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-[var(--ca-ink)]">
              What {module.name} contributes to the suite.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="border-t border-[var(--ca-teal)] pt-4"
                >
                  <h3 className="text-sm font-semibold text-[var(--ca-ink)]">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                    {cap.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow / product visual */}
        <section className="border-b border-[var(--ca-line)] bg-white py-14 sm:py-16">
          <div className="mkt-shell">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              In the workflow
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-[var(--ca-ink)]">
              Operational surface — not a demo island.
            </h2>
            <div className="mt-10">{workflowVisual}</div>
          </div>
        </section>

        {/* Connected suite */}
        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-mist)] py-14 sm:py-16">
          <div className="relative z-10 mkt-shell">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Connected platform
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-[var(--ca-ink)]">
              One Consult America operating system.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ca-text-secondary)]">
              Modules share chrome, identity, and continuous business data. Integration is lineage —
              not duplicated master records.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {flows.map((flow) =>
                flow ? (
                  <div
                    key={flow.id}
                    className="rounded-xl border border-[var(--ca-line)] bg-white/80 p-5"
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
                          <span
                            className={
                              step === module.name
                                ? "rounded-md bg-[var(--ca-lime-soft)] px-1.5 py-0.5 text-[var(--ca-ink)]"
                                : undefined
                            }
                          >
                            {step}
                          </span>
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                      {flow.detail}
                    </p>
                  </div>
                ) : null,
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {SUITE_MODULES.map((m) => (
                <Link
                  key={m.id}
                  href={m.marketingHref}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    m.id === moduleId
                      ? "border-[var(--ca-teal)] bg-[var(--ca-teal-deep)] text-white"
                      : "border-[var(--ca-line)] bg-white text-[var(--ca-ink)] hover:border-[var(--ca-teal)]",
                  )}
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes + CTA */}
        <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-teal-deep)] py-14 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[18%] top-[-30%] hidden h-[360px] w-[360px] rounded-full border border-white/[0.07] lg:block"
          />
          <div className="relative z-10 mkt-shell grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
                Outcomes
              </p>
              <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-white">
                What changes when {module.name} is part of the suite.
              </h2>
              <ul className="mt-6 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ca-lime)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href={module.appHref}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-accent-hover)]"
              >
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** Compact product-window chrome for workflow visuals */
export function PlatformWorkflowWindow({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--ca-line)] bg-white shadow-[0_18px_48px_rgba(16,47,53,0.08)]">
      <div className="flex items-center justify-between border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-[var(--ca-teal-soft)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ca-mist)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ca-line)]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ca-ink)]">
            {title}
          </span>
        </div>
        {badge ? (
          <span className="text-[0.68rem] font-semibold text-[var(--ca-text-secondary)]">{badge}</span>
        ) : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
