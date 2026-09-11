import type { Metadata } from "next";
import Link from "next/link";

import { loadAtsDashboard } from "@/lib/ats/ops";
import { getWorkforceSession } from "@/lib/workforce/session";
import {
  applicationStatusLabels,
  candidateInterviewStatusLabels,
  offerStatusLabels,
} from "@/types/recruiting";

export const metadata: Metadata = { title: "Recruiting" };
export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AtsHomePage() {
  await getWorkforceSession();
  const data = await loadAtsDashboard();

  const cards = [
    { label: "Open Requisitions", value: data.metrics.openRequisitions, href: "/app/recruiting/jobs" },
    {
      label: "Active Applications",
      value: data.metrics.activeApplications,
      href: "/app/recruiting/applications",
    },
    {
      label: "Interviews Scheduled",
      value: data.metrics.interviewsScheduled,
      href: "/app/recruiting/interviews",
    },
    {
      label: "Offers Pending",
      value: data.metrics.offersPending,
      href: "/app/recruiting/offers",
    },
    {
      label: `Hires · ${data.metrics.periodLabel}`,
      value: data.metrics.hiresThisPeriod,
      href: "/app/recruiting/applications",
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">ATS</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Recruiting Operations
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
          Live requisitions, applications, interviews, and offers — no demo conversion rates.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-black/10 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[var(--ca-platform-deep)]/30"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-black/40">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{card.value}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-semibold">Application Pipeline</h2>
          <Link
            href="/app/recruiting/applications"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Open queue
          </Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {data.pipeline.map((stage) => (
            <div key={stage.key} className="rounded-md border border-black/10 px-3 py-3">
              <p className="text-xl font-semibold">{stage.count}</p>
              <p className="mt-1 text-xs text-black/50">{stage.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Upcoming Interviews</h2>
            <Link
              href="/app/recruiting/interviews"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              All interviews
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {data.upcomingInterviews.map((row) => (
              <li key={row.id} className="px-5 py-3 text-sm">
                <p className="font-medium">{row.candidateName}</p>
                <p className="mt-1 text-xs text-black/50">
                  {row.jobTitle} · {row.interviewType.replaceAll("_", " ")} ·{" "}
                  {formatDate(row.scheduledAt)}
                </p>
              </li>
            ))}
            {data.upcomingInterviews.length === 0 && (
              <li className="px-5 py-8 text-sm text-black/45">
                No data available for this period.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Recent Applications</h2>
            <Link
              href="/app/recruiting/applications"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {data.recentApplications.map((row) => (
              <li key={row.applicationId} className="px-5 py-3 text-sm">
                <Link
                  href={`/app/recruiting/applications/${row.applicationId}`}
                  className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                >
                  {row.candidateName}
                </Link>
                <p className="mt-1 text-xs text-black/50">
                  {row.jobTitle} · {row.candidateStage} · {formatDay(row.appliedAt)}
                </p>
              </li>
            ))}
            {data.recentApplications.length === 0 && (
              <li className="px-5 py-8 text-sm text-black/45">
                No data available for this period.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Offers Requiring Action</h2>
            <Link
              href="/app/recruiting/offers"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              All offers
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {data.offersRequiringAction.map((row) => (
              <li key={row.id} className="px-5 py-3 text-sm">
                <p className="font-medium">{row.candidateName}</p>
                <p className="mt-1 text-xs text-black/50">
                  {row.jobTitle} · {offerStatusLabels[row.status]} ·{" "}
                  {formatDay(row.offerDate)}
                </p>
              </li>
            ))}
            {data.offersRequiringAction.length === 0 && (
              <li className="px-5 py-8 text-sm text-black/45">
                No data available for this period.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Recent Candidate Match Runs</h2>
            <Link
              href="/app/recruiting/job-match"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Run analysis
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {data.recentMatchRuns.map((row) => (
              <li key={row.id} className="px-5 py-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/app/recruiting/candidates/${row.candidateId}`}
                    className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                  >
                    {row.candidateName}
                  </Link>
                  <span className="text-sm font-semibold text-black/70">
                    {Math.round(row.score)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-black/50">
                  {row.jobTitle} · {formatDate(row.createdAt)}
                </p>
              </li>
            ))}
            {data.recentMatchRuns.length === 0 && (
              <li className="px-5 py-8 text-sm text-black/45">
                No candidate match runs yet.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white">
          <div className="border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-lg font-semibold">Recent Hires</h2>
          </div>
          <ul className="divide-y divide-black/5">
            {data.recentHires.map((row) => (
              <li key={row.applicationId} className="px-5 py-3 text-sm">
                <Link
                  href={`/app/recruiting/candidates/${row.candidateId}`}
                  className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                >
                  {row.candidateName}
                </Link>
                <p className="mt-1 text-xs text-black/50">
                  {row.jobTitle} · {applicationStatusLabels[row.status]}
                </p>
              </li>
            ))}
            {data.recentHires.length === 0 && (
              <li className="px-5 py-8 text-sm text-black/45">
                No data available for this period.
              </li>
            )}
          </ul>
        </section>
      </div>

      <p className="text-xs text-black/40">
        Interview statuses use {Object.values(candidateInterviewStatusLabels).join(", ")}.
      </p>
    </div>
  );
}
