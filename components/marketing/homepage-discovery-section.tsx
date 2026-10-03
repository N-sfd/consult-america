import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const insights = [
  {
    title: "AI without a data contract",
    href: "/insights/ai-without-a-data-contract",
  },
  {
    title: "How to prepare for a successful Oracle Cloud transformation",
    href: "/insights/what-stalls-fusion-programs",
  },
  {
    title: "Cutover checklists that work",
    href: "/insights/cutover-checklists-that-work",
  },
  {
    title: "Integration before analytics",
    href: "/insights/integration-before-analytics",
  },
];

export default function HomepageDiscoverySection() {
  return (
    <section id="careers" className="border-b border-[var(--ca-line)] bg-white py-12 sm:py-14">
      <div className="mkt-shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                Insights
              </p>
              <h2 className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2.15rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                Briefings from the work.
              </h2>
            </div>
            <Link href="/insights" className="shrink-0 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]">
              All insights
            </Link>
          </div>
          <ul className="mt-5 border-t border-[var(--ca-line)]">
            {insights.map((item) => (
              <li key={item.href} className="border-b border-[var(--ca-line)]">
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 py-3.5 text-sm font-medium text-[var(--ca-ink)] hover:text-[var(--ca-teal)]"
                >
                  <span>{item.title}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ca-teal)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">Careers</p>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2.15rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
            Build what&apos;s next.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ca-text-secondary)]">
            Open roles are listed from the live job portal. Closed roles stay off the public list.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center">
            <form action="/jobs" method="get" className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="home-role-search">
                Search roles
              </label>
              <input
                id="home-role-search"
                name="q"
                placeholder="Search by title or skill"
                className="h-11 min-w-0 flex-1 rounded-lg border border-[var(--ca-line)] bg-[var(--ca-canvas)] px-3 text-sm text-[var(--ca-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-teal)]"
              />
              <button
                type="submit"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-[var(--ca-lime)] px-4 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-lime-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-teal)]"
              >
                Search Roles
              </button>
            </form>
          </div>

          <Link
            href="/jobs"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
          >
            View open roles
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <div className="relative mt-6 hidden aspect-[16/7] overflow-hidden rounded-md ring-1 ring-[var(--ca-line)] sm:block">
            <Image
              src="/company/source/quality-review.jpg"
              alt="Consult America consultants in a working session"
              fill
              unoptimized
              className="ca-home-photo object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
