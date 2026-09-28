import Link from "next/link";

import { SUITE_FLOWS, SUITE_MODULES } from "@/lib/platforms/suite";

/**
 * Compact homepage band — CRM lives in the suite story, not a standalone chapter.
 */
export default function HomepagePlatformBand() {
  return (
    <section
      aria-label="Connected enterprise platform"
      className="border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
          Connected platform
        </p>
        <h2 className="mt-2 max-w-2xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
          One operating system for people, clients, and governance.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ca-text-secondary)]">
          CRM, ATS, HR, Employee, Payroll, and Admin stay on the same records. Detailed
          product stories live on each platform page.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {SUITE_MODULES.map((module) => (
            <li key={module.id}>
              <Link
                href={module.marketingHref}
                className="inline-flex rounded-full border border-[var(--ca-line)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ca-ink)] hover:border-[var(--ca-teal)]"
              >
                {module.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SUITE_FLOWS.map((flow) => (
            <article key={flow.id} className="rounded-xl border border-[var(--ca-line)] bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">
                {flow.title}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--ca-ink)]">
                {flow.steps.join(" → ")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                {flow.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
