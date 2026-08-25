import Link from "next/link";

import type { getEmployeeDashboard } from "@/lib/self-service";

type DashboardData = Awaited<ReturnType<typeof getEmployeeDashboard>>;

export default function EmployeeDashboard({ data }: { data: DashboardData }) {
  const profile = data.profile;
  const firstName = profile?.person.preferredName || profile?.person.firstName || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Good morning, {firstName}
        </h1>
        <p className="mt-2 text-black/55">
          {profile?.positionTitle}
          {profile?.departmentName ? ` · ${profile.departmentName}` : ""}
        </p>
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Quick Actions
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/employee/time", label: "Submit Timesheet" },
            { href: "/employee/leave", label: "Request Leave" },
            { href: "/employee/documents", label: "View Documents" },
            { href: "/employee/profile", label: "Update Profile" },
            { href: "/employee/requests", label: "Contact HR" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-lg border border-black/10 bg-white px-4 py-4 text-sm font-medium transition-colors hover:border-[var(--ca-blue)]/40 hover:text-[var(--ca-blue)]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Current Timesheet"
          value={`${data.timesheet?.totalHours ?? 0} / 80 Hours`}
          hint={data.timesheet?.status ?? "No timesheet"}
        />
        <MetricCard
          label="PTO Balance"
          value={`${data.ptoAvailable} Hours`}
          hint="Available"
        />
        <MetricCard
          label="Pending HR Requests"
          value={String(data.pendingHrRequests)}
          hint="Open or in progress"
        />
        <MetricCard
          label="Documents"
          value={String(data.documentCount)}
          hint="Available to you"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Upcoming
          </h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <span>Timesheet Due</span>
              <span className="text-black/50">Friday</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <span>Approved Leave</span>
              <span className="text-black/50">
                {data.upcomingLeave
                  ? `${data.upcomingLeave.startDate} – ${data.upcomingLeave.endDate}`
                  : "None scheduled"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Next Pay</span>
              <span className="text-black/50">Available in Phase 5</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Notifications
          </h2>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            {data.unreadNotifications}
          </p>
          <p className="mt-2 text-sm text-black/55">Unread items</p>
          <Link
            href="/employee/notifications"
            className="mt-6 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            View notifications
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-black/40">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{value}</p>
      <p className="mt-2 text-xs text-black/45">{hint}</p>
    </div>
  );
}
