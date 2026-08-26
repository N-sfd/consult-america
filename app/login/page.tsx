import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Employee Login | ConsultAmerica Workforce",
  description:
    "Access ConsultAmerica Workforce — recruiting, people, time, and approvals.",
};

const portals = [
  {
    title: "Workforce Overview",
    description:
      "Hiring pipeline, open roles, candidates, and people metrics in one operational view.",
    href: "/workforce",
    badge: "Recommended",
  },
  {
    title: "Employee Self-Service",
    description: "Profile, time, leave, documents, and HR requests.",
    href: "/employee",
  },
  {
    title: "Manager Workspace",
    description: "Team approvals, time, leave, and reporting.",
    href: "/manager",
  },
  {
    title: "HR Service Desk",
    description: "Requests, reports, and audit activity.",
    href: "/hr/requests",
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--ca-app-bg)] text-[var(--ca-app-ink)]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5">
          <Link
            href="/"
            className="text-[0.75rem] font-semibold tracking-[0.14em] text-[var(--ca-app-ink)]"
          >
            CONSULTAMERICA
          </Link>
          <Link
            href="/"
            className="text-sm text-black/45 transition-colors hover:text-[var(--ca-blue)]"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-black/40">
            Employee Login
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[var(--ca-app-ink)] md:text-5xl">
            Enter Workforce
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-black/55">
            A different environment from the corporate site—built for recruiting,
            people operations, time, leave, and approvals.
          </p>

          <div className="mt-10 border border-black/10 bg-white p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
              Demo session
            </p>
            <p className="mt-3 text-sm leading-6 text-black/60">
              Authentication is not wired yet. Continue into the product with a
              demo identity to explore the operational UI.
            </p>
            <Link
              href="/workforce"
              className="mt-5 inline-flex items-center gap-2 bg-[var(--ca-app-sidebar-bg)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Continue as Nazia Ahmed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {portals.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className="group relative border border-black/10 bg-white p-6 transition-colors hover:border-[var(--ca-blue)]/40"
              >
                {"badge" in portal && portal.badge ? (
                  <span className="absolute right-4 top-4 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                    {portal.badge}
                  </span>
                ) : null}
                <h2 className="text-lg font-medium tracking-[-0.02em] text-[var(--ca-app-ink)] group-hover:text-[var(--ca-blue)]">
                  {portal.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/55">
                  {portal.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--ca-blue)]">
                  Enter
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
