import Link from "next/link";

import type { getEmployeeDashboard } from "@/lib/self-service";

type DashboardData = Awaited<ReturnType<typeof getEmployeeDashboard>>;

export default function EmployeeDashboard({ data }: { data: DashboardData }) {
  const profile = data.profile;
  const firstName =
    profile?.person.preferredName || profile?.person.firstName || "there";
  const onboardingDone = data.onboarding.percentComplete === 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          Good morning, {firstName}
        </h1>
        <p className="mt-1.5 text-sm text-black/55">
          {profile?.positionTitle}
          {profile?.departmentName ? ` · ${profile.departmentName}` : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/employee/onboarding", label: "Complete Onboarding" },
          { href: "/employee/documents", label: "View Documents" },
          { href: "/employee/profile", label: "Update Profile" },
          { href: "/employee/requests", label: "Contact HR" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-lg border border-black/10 bg-white px-4 py-3.5 text-sm font-medium transition-colors hover:border-[var(--ca-blue)]/40 hover:text-[var(--ca-blue)]"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Onboarding"
          href="/employee/onboarding"
          actionLabel={onboardingDone ? undefined : "Continue"}
        >
          {onboardingDone ? (
            <p className="text-sm font-medium text-[var(--ca-green,#16865b)]">
              ✓ Onboarding complete
            </p>
          ) : (
            <>
              <p className="text-2xl font-semibold tracking-[-0.03em]">
                {data.onboarding.percentComplete}%
              </p>
              <p className="mt-1 text-xs text-black/45">
                {data.onboarding.completedCount} of{" "}
                {data.onboarding.totalCount} tasks
              </p>
            </>
          )}
        </StatusCard>

        <StatusCard
          label="Documents"
          href="/employee/documents"
          actionLabel="Review"
        >
          <p className="text-2xl font-semibold tracking-[-0.03em]">
            {data.documentsRequiringAction}
          </p>
          <p className="mt-1 text-xs text-black/45">
            {data.documentsRequiringAction === 1
              ? "document requires action"
              : "documents require action"}
          </p>
        </StatusCard>

        <StatusCard
          label="My Profile"
          href="/employee/profile"
          actionLabel="Review Profile"
        >
          <p className="text-2xl font-semibold tracking-[-0.03em]">
            {data.profileCompleteness}%
          </p>
          <p className="mt-1 text-xs text-black/45">Profile completeness</p>
        </StatusCard>
      </section>

      {data.attentionItems.length > 0 && (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Things requiring your attention
          </h2>
          <ul className="mt-4 divide-y divide-black/5">
            {data.attentionItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-black/45">{item.detail}</p>
                </div>
                <Link
                  href={item.actionHref}
                  className="shrink-0 text-sm font-medium text-[var(--ca-blue)] hover:underline"
                >
                  {item.actionLabel} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Upcoming
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex justify-between gap-4 border-b border-black/5 pb-3">
              <span>Timesheet Due</span>
              <span className="text-black/50">Friday</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Approved Leave</span>
              <span className="text-black/50">
                {data.upcomingLeave
                  ? `${data.upcomingLeave.startDate} – ${data.upcomingLeave.endDate}`
                  : "None scheduled"}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Notifications
          </h2>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {data.unreadNotifications}
          </p>
          <Link
            href="/employee/notifications"
            className="mt-2 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            View notifications
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  label,
  href,
  actionLabel,
  children,
}: {
  label: string;
  href: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>
      <div className="mt-3">{children}</div>
      {actionLabel && (
        <Link
          href={href}
          className="mt-4 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
