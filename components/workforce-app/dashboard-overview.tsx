import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SupabaseConnectBanner from "@/components/workforce-app/supabase-connect-banner";
import type { Job } from "@/lib/jobs";
import type { ApplicationStatus } from "@/types/recruiting";

export type PipelineRow = {
  status: ApplicationStatus;
  label: string;
  count: number;
};

export type DashboardOverviewProps = {
  userFirstName: string;
  isSupabaseConnected: boolean;
  employeeCount: number;
  openJobsCount: number;
  candidateCount: number;
  pendingApprovalsCount: number;
  pipeline: PipelineRow[];
  openJobs: Job[];
};

export default function DashboardOverview({
  userFirstName,
  isSupabaseConnected,
  employeeCount,
  openJobsCount,
  candidateCount,
  pendingApprovalsCount,
  pipeline,
  openJobs,
}: DashboardOverviewProps) {
  const stats = [
    { label: "Employees", value: String(employeeCount) },
    { label: "Open Jobs", value: String(openJobsCount) },
    {
      label: "Active Candidates",
      value: isSupabaseConnected ? String(candidateCount) : "—",
    },
    { label: "Pending Approvals", value: String(pendingApprovalsCount) },
  ];

  const maxPipelineCount = Math.max(1, ...pipeline.map((row) => row.count));

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

      {!isSupabaseConnected && <SupabaseConnectBanner />}

      <section className="mt-8">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="border border-black/8 bg-white p-5 lg:col-span-12 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/40">
              Hiring pipeline
            </p>
            <Link
              href="/app/recruiting/candidates"
              className="text-sm text-[var(--ca-blue)] hover:underline"
            >
              View candidates
            </Link>
          </div>

          {isSupabaseConnected ? (
            <ul className="mt-6 space-y-4">
              {pipeline.map((row) => (
                <li
                  key={row.status}
                  className="grid grid-cols-[140px_1fr_40px] items-center gap-3"
                >
                  <span className="text-sm text-black/60">{row.label}</span>
                  <div className="h-2.5 overflow-hidden rounded-sm bg-black/[0.06]">
                    <div
                      className="h-full rounded-sm bg-[var(--ca-blue)]"
                      style={{
                        width: `${Math.round((row.count / maxPipelineCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-sm font-medium tabular-nums">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-black/45">
              Not connected — see the banner above.
            </p>
          )}
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
          {openJobs.slice(0, 5).map((job) => (
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
