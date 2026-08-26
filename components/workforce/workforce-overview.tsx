import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getOpenJobs } from "@/lib/jobs";

const pipeline = [
  { stage: "Applied", count: 84, width: "100%" },
  { stage: "Screening", count: 32, width: "38%" },
  { stage: "Interview", count: 18, width: "22%" },
  { stage: "Offer", count: 4, width: "8%" },
];

const activity = [
  {
    title: "Interview scheduled",
    detail: "AI Engineer · Maya Chen · Tomorrow 10:00",
    time: "12m",
  },
  {
    title: "Offer accepted",
    detail: "Oracle SCM Consultant · Jordan Blake",
    time: "1h",
  },
  {
    title: "New application",
    detail: "Senior Oracle Financials · 3 candidates",
    time: "2h",
  },
  {
    title: "Leave approved",
    detail: "Jennifer Lee · PTO · Mar 12–14",
    time: "3h",
  },
];

export default async function WorkforceOverview({
  userFirstName = "Nazia",
}: {
  userFirstName?: string;
}) {
  const jobs = await getOpenJobs();
  const openJobs = jobs.length;

  const stats = [
    { label: "People", value: "124" },
    { label: "Jobs", value: String(openJobs) },
    { label: "Candidates", value: "47" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
            Overview
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-[var(--ca-app-ink)] md:text-3xl">
            Good morning, {userFirstName}
          </h1>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ca-blue)] hover:underline"
        >
          Public careers board
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <section className="mt-8">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-black/8 bg-white px-5 py-5"
            >
              <p className="text-3xl font-medium tracking-[-0.04em] text-[var(--ca-app-ink)] md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-black/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <section className="border border-black/8 bg-white p-5 lg:col-span-7 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
              Hiring pipeline
            </p>
            <Link
              href="/workforce/candidates"
              className="text-sm text-[var(--ca-blue)] hover:underline"
            >
              View candidates
            </Link>
          </div>

          <ul className="mt-6 space-y-4">
            {pipeline.map((row) => (
              <li key={row.stage} className="grid grid-cols-[100px_1fr_40px] items-center gap-3">
                <span className="text-sm text-black/60">{row.stage}</span>
                <div className="h-2.5 overflow-hidden rounded-sm bg-black/[0.06]">
                  <div
                    className="h-full rounded-sm bg-[var(--ca-blue)]"
                    style={{ width: row.width }}
                  />
                </div>
                <span className="text-right text-sm font-medium tabular-nums">
                  {row.count}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-black/8 bg-white p-5 lg:col-span-5 lg:p-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
            Recent activity
          </p>
          <ul className="mt-5 space-y-4">
            {activity.map((item) => (
              <li
                key={item.title + item.time}
                className="border-b border-black/6 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--ca-app-ink)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-black/50">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-black/35">
                    {item.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 border border-black/8 bg-white">
        <div className="flex items-center justify-between border-b border-black/8 px-5 py-4 lg:px-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
            Open roles
          </p>
          <Link
            href="/workforce/jobs"
            className="text-sm text-[var(--ca-blue)] hover:underline"
          >
            Manage jobs
          </Link>
        </div>
        <ul>
          {jobs.slice(0, 5).map((job) => (
            <li key={job.slug}>
              <Link
                href={`/jobs/${job.slug}`}
                className="flex items-center justify-between gap-4 border-b border-black/6 px-5 py-4 transition-colors last:border-0 hover:bg-[var(--ca-app-bg)] lg:px-6"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--ca-app-ink)]">
                    {job.title}
                  </p>
                  <p className="mt-1 text-xs text-black/45">
                    {job.location} · {job.workplaceType}
                  </p>
                </div>
                <span className="rounded bg-[var(--ca-blue)]/10 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-[var(--ca-blue)]">
                  Open
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
