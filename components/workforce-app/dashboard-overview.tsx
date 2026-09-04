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

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ca-platform-kpi-label">Workforce</p>
            <h1 className="mt-2 text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
              Good morning, {userFirstName}
            </h1>
            <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
              Recruiting, people and workforce operations.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Public careers board
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {!isSupabaseConnected && <SupabaseConnectBanner />}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="ca-platform-card ca-platform-kpi">
            <p className="ca-platform-kpi-label">{stat.label}</p>
            <p className="ca-platform-kpi-value">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="ca-platform-card p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="ca-platform-kpi-label">Hiring pipeline</h2>
          <Link
            href="/app/recruiting/candidates"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            View candidates
          </Link>
        </div>

        {isSupabaseConnected ? (
          <div className="ca-platform-pipeline mt-5">
            {pipeline.map((row) => (
              <div
                key={row.status}
                className={`ca-platform-pipeline-stage ${row.count > 0 ? "is-active" : ""}`}
              >
                <p className="ca-platform-pipeline-count">{row.count}</p>
                <p className="ca-platform-pipeline-label">{row.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--ca-platform-muted)]">
            Connect Supabase to load live hiring pipeline counts. Demo mode keeps
            recruiting routes available without inventing metrics.
          </p>
        )}
      </section>

      <section className="ca-platform-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--ca-platform-border)] px-5 py-4">
          <h2 className="ca-platform-kpi-label">Open roles</h2>
          <Link
            href="/app/recruiting/jobs"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            Manage jobs
          </Link>
        </div>
        <ul>
          {openJobs.slice(0, 5).map((job) => (
            <li key={job.slug}>
              <Link
                href={`/jobs/${job.slug}`}
                className="flex items-center justify-between gap-4 border-b border-[var(--ca-platform-border)] px-5 py-4 transition-colors last:border-0 hover:bg-[var(--ca-platform-sage-light)]"
              >
                <div>
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
                    {job.location} · {job.workplaceType}
                  </p>
                </div>
                <span className="rounded bg-[rgba(23,106,99,0.1)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--ca-platform-mid)]">
                  Open
                </span>
              </Link>
            </li>
          ))}
          {openJobs.length === 0 && (
            <li className="px-5 py-8 text-sm text-[var(--ca-platform-muted)]">
              No open roles right now.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
