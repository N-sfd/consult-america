import Link from "next/link";

import type { getManagerDashboard } from "@/lib/self-service";

type DashboardData = Awaited<ReturnType<typeof getManagerDashboard>>;

export default function ManagerDashboard({ data }: { data: DashboardData }) {
  const attention =
    data.pendingApprovals + data.pendingTimesheets + data.pendingLeave;

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1]">
          <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
            Manager Home
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
            {attention > 0
              ? `${attention} item${attention === 1 ? "" : "s"} need your attention.`
              : "Your team is clear — no pending approvals right now."}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="My Team" value={String(data.teamCount)} />
        <Metric
          label="Pending Approvals"
          value={String(data.pendingApprovals)}
          emphasize={data.pendingApprovals > 0}
        />
        <Metric
          label="Pending Timesheets"
          value={String(data.pendingTimesheets)}
          emphasize={data.pendingTimesheets > 0}
        />
        <Metric
          label="Pending Leave"
          value={String(data.pendingLeave)}
          emphasize={data.pendingLeave > 0}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="ca-platform-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="ca-platform-kpi-label">My Team</h2>
            <Link
              href="/manager/team"
              className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)]">
            {data.team.map((member) => (
              <li key={member.employee.id} className="flex items-start gap-3 py-3.5">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--ca-platform-mid)]" />
                <div>
                  <p className="font-medium">
                    {member.person.firstName} {member.person.lastName}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--ca-platform-muted)]">
                    {member.positionTitle}
                    {member.locationName ? ` · ${member.locationName}` : ""}
                  </p>
                </div>
              </li>
            ))}
            {data.team.length === 0 && (
              <li className="py-4 text-sm text-[var(--ca-platform-muted)]">No direct reports.</li>
            )}
          </ul>
        </div>

        <div className="ca-platform-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="ca-platform-kpi-label">Approvals</h2>
            <Link
              href="/manager/approvals"
              className="text-sm font-semibold text-[var(--ca-platform-red)] hover:underline"
            >
              Inbox
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)]">
            {data.approvals.map((item) => (
              <li key={item.id} className="py-3.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--ca-platform-red)]">
                  {item.requestType}
                </p>
                <p className="mt-1 text-sm font-medium">{item.summary}</p>
              </li>
            ))}
            {data.approvals.length === 0 && (
              <li className="py-4 text-sm text-[var(--ca-platform-muted)]">No pending approvals.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="ca-platform-card p-6">
        <h2 className="ca-platform-kpi-label">Upcoming team deadlines</h2>
        {data.approvals.length > 0 ? (
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)]">
            {data.approvals.slice(0, 5).map((item) => (
              <li key={`deadline-${item.id}`} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    item.requestType === "LEAVE" || item.requestType === "TIMESHEET"
                      ? "bg-[var(--ca-platform-red)]"
                      : "bg-[var(--ca-platform-mid)]"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{item.summary}</p>
                  <p className="mt-0.5 text-xs text-[var(--ca-platform-muted)]">
                    {item.requestType} · awaiting your approval
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">
            No team deadlines require action right now.
          </p>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="ca-platform-card ca-platform-kpi">
      <p className="ca-platform-kpi-label">{label}</p>
      <p
        className="ca-platform-kpi-value"
        style={emphasize ? { color: "var(--ca-platform-red)" } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
