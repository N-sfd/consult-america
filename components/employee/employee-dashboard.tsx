import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/shared";
import type { getEmployeeDashboard } from "@/lib/self-service";

type DashboardData = Awaited<ReturnType<typeof getEmployeeDashboard>>;

function formatPeriodEnd(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EmployeeDashboard({ data }: { data: DashboardData }) {
  const profile = data.profile;
  const firstName =
    profile?.person.preferredName || profile?.person.firstName || "there";
  const onboardingDone = data.onboarding.percentComplete === 100;
  const timesheetDueLabel = data.timesheet?.periodEnd
    ? formatPeriodEnd(data.timesheet.periodEnd)
    : null;

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1] space-y-5">
          <PageHeader
            className="border-b-0 pb-0"
            title={`Good morning, ${firstName}`}
            description={
              [profile?.positionTitle, profile?.departmentName]
                .filter(Boolean)
                .join(" · ") || undefined
            }
          />

          <div className="flex flex-wrap gap-2">
            {[
              { href: "/employee/onboarding", label: "Complete Onboarding" },
              { href: "/employee/documents", label: "View Documents" },
              { href: "/employee/profile", label: "Update Profile" },
              { href: "/employee/requests", label: "Contact HR" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium text-[var(--ca-platform-ink)] transition-colors hover:border-[var(--ca-platform-mid)] hover:text-[var(--ca-platform-deep)]"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Onboarding"
          href="/employee/onboarding"
          actionLabel={onboardingDone ? undefined : "Continue"}
        >
          {onboardingDone ? (
            <p className="text-sm font-medium text-[var(--ca-platform-mid)]">
              Onboarding complete
            </p>
          ) : (
            <>
              <p className="ca-platform-kpi-value">{data.onboarding.percentComplete}%</p>
              <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
                {data.onboarding.completedCount} of {data.onboarding.totalCount} tasks
              </p>
              <div className="ca-platform-progress mt-3">
                <span style={{ width: `${data.onboarding.percentComplete}%` }} />
              </div>
            </>
          )}
        </StatusCard>

        <StatusCard label="Documents" href="/employee/documents" actionLabel="Review">
          <p className="ca-platform-kpi-value">{data.documentsRequiringAction}</p>
          <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
            {data.documentsRequiringAction === 1
              ? "document requires action"
              : "documents require action"}
          </p>
        </StatusCard>

        <StatusCard label="My Profile" href="/employee/profile" actionLabel="Review Profile">
          <p className="ca-platform-kpi-value">{data.profileCompleteness}%</p>
          <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">Profile completeness</p>
          <div className="ca-platform-progress mt-3">
            <span style={{ width: `${data.profileCompleteness}%` }} />
          </div>
        </StatusCard>
      </section>

      {data.attentionItems.length > 0 && (
        <section className="ca-platform-card p-6">
          <h2 className="ca-platform-kpi-label">Things requiring your attention</h2>
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)]">
            {data.attentionItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--ca-platform-muted)]">{item.detail}</p>
                </div>
                <Link
                  href={item.actionHref}
                  className="shrink-0 text-sm font-semibold text-[var(--ca-platform-red)] hover:underline"
                >
                  {item.actionLabel} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="ca-platform-card p-5">
          <h2 className="ca-platform-kpi-label">Upcoming</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {timesheetDueLabel ? (
              <li className="flex justify-between gap-4 border-b border-[var(--ca-platform-border)] pb-3">
                <span>Timesheet period ends</span>
                <span className="text-[var(--ca-platform-muted)]">{timesheetDueLabel}</span>
              </li>
            ) : null}
            <li className="flex justify-between gap-4">
              <span>Approved Leave</span>
              <span className="text-[var(--ca-platform-muted)]">
                {data.upcomingLeave
                  ? `${data.upcomingLeave.startDate} – ${data.upcomingLeave.endDate}`
                  : "None scheduled"}
              </span>
            </li>
          </ul>
        </div>

        <div className="ca-platform-card p-5">
          <h2 className="ca-platform-kpi-label">Notifications</h2>
          <p className="ca-platform-kpi-value mt-2">{data.unreadNotifications}</p>
          <Link
            href="/employee/notifications"
            className="mt-2 inline-flex text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
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
    <div className="ca-platform-card ca-platform-kpi">
      <p className="ca-platform-kpi-label">{label}</p>
      <div className="mt-3">{children}</div>
      {actionLabel ? (
        <Link
          href={href}
          className="mt-4 inline-flex text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
