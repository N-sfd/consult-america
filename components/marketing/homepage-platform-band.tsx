import Link from "next/link";

const flow = [
  { name: "CRM", detail: "Clients and opportunities", href: "/platforms/crm" },
  { name: "ATS", detail: "Recruiting through hire", href: "/platforms/ats" },
  { name: "HR", detail: "People operations", href: "/platforms/hr" },
  { name: "Employee", detail: "Self-service", href: "/platforms/employee" },
  { name: "Payroll", detail: "Pay operations", href: "/platforms/payroll" },
];

export default function HomepagePlatformBand() {
  return (
    <section
      aria-label="Connected enterprise platform"
      className="border-b border-[var(--ca-line)] bg-[var(--ca-mist)] py-12 sm:py-14"
    >
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Connected platform
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
              How enterprise work stays connected.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ca-text-secondary)]">
              One environment from the client record through hire, people operations, and pay. Admin governs the platform.
            </p>
            <Link
              href="/platforms/admin"
              className="mt-4 inline-flex text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
            >
              Administration →
            </Link>
          </div>

          <ol className="lg:col-span-7">
            {flow.map((step, index) => (
              <li key={step.name} className="border-t border-[var(--ca-line)] first:border-t-0">
                <Link
                  href={step.href}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
                >
                  <span className="text-[0.68rem] font-bold tracking-[0.14em] text-[var(--ca-teal)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-semibold text-[var(--ca-ink)] group-hover:text-[var(--ca-teal)]">
                      {step.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-[var(--ca-text-secondary)]">{step.detail}</span>
                  </span>
                  <span aria-hidden="true" className="text-sm text-[var(--ca-teal)] transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
