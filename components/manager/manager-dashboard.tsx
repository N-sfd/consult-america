import Link from "next/link";

import type { getManagerDashboard } from "@/lib/self-service";

type DashboardData = Awaited<ReturnType<typeof getManagerDashboard>>;

export default function ManagerDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Manager Home</h1>
        <p className="mt-2 text-black/55">
          Team oversight, approvals, and time/leave reviews.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="My Team" value={String(data.teamCount)} />
        <Metric label="Pending Approvals" value={String(data.pendingApprovals)} />
        <Metric label="Pending Timesheets" value={String(data.pendingTimesheets)} />
        <Metric label="Pending Leave" value={String(data.pendingLeave)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              My Team
            </h2>
            <Link
              href="/manager/team"
              className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-black/5">
            {data.team.map((member) => (
              <li key={member.employee.id} className="py-4">
                <p className="font-medium">
                  {member.person.firstName} {member.person.lastName}
                </p>
                <p className="mt-1 text-sm text-black/55">
                  {member.positionTitle}
                  {member.locationName ? ` · ${member.locationName}` : ""}
                </p>
              </li>
            ))}
            {data.team.length === 0 && (
              <li className="py-4 text-sm text-black/50">No direct reports.</li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Approvals
            </h2>
            <Link
              href="/manager/approvals"
              className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
            >
              Inbox
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-black/5">
            {data.approvals.map((item) => (
              <li key={item.id} className="py-4">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                  {item.requestType}
                </p>
                <p className="mt-1 text-sm font-medium">{item.summary}</p>
              </li>
            ))}
            {data.approvals.length === 0 && (
              <li className="py-4 text-sm text-black/50">No pending approvals.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-black/40">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
    </div>
  );
}
