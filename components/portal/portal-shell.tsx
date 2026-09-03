"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/actions/auth";
import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import EmployeeBottomNav from "@/components/portal/employee-bottom-nav";
import DemoModeBanner from "@/components/shared/demo-mode-banner";
import type { PortalSession } from "@/lib/self-service/session";
import { cn } from "@/lib/utils";

const employeeLinks = [
  { href: "/employee", label: "Home", exact: true },
  { href: "/employee/profile", label: "My Profile" },
  { href: "/employee/documents", label: "My Documents" },
  { href: "/employee/onboarding", label: "Onboarding" },
  { href: "/employee/time", label: "Time" },
  { href: "/employee/leave", label: "Leave" },
  { href: "/employee/pay", label: "Pay" },
  { href: "/employee/requests", label: "HR Requests" },
  { href: "/employee/notifications", label: "Notifications" },
];

const managerLinks = [
  { href: "/manager", label: "Home", exact: true },
  { href: "/manager/team", label: "My Team" },
  { href: "/manager/approvals", label: "Approvals" },
  { href: "/manager/time", label: "Team Time" },
  { href: "/manager/leave", label: "Team Leave" },
  { href: "/manager/reports", label: "Team Reports" },
  { href: "/manager/notifications", label: "Notifications" },
];

const hrLinks = [
  { href: "/hr/requests", label: "HR Requests", exact: false },
  { href: "/hr/reports", label: "Reports" },
  { href: "/hr/audit", label: "Audit Log" },
  { href: "/hr/notifications", label: "Notifications" },
];

const payrollLinks = [
  { href: "/payroll", label: "Overview", exact: true },
  { href: "/payroll/runs", label: "Payroll Runs" },
  { href: "/payroll/pay-periods", label: "Pay Periods" },
  { href: "/payroll/employee-pay", label: "Employee Pay" },
  { href: "/payroll/earnings", label: "Earnings" },
  { href: "/payroll/deductions", label: "Deductions" },
  { href: "/payroll/reports", label: "Reports" },
  { href: "/payroll/settings", label: "Settings" },
];

type PortalMode = "employee" | "manager" | "hr" | "payroll";

const LINKS_BY_MODE: Record<PortalMode, typeof employeeLinks> = {
  employee: employeeLinks,
  manager: managerLinks,
  hr: hrLinks,
  payroll: payrollLinks,
};

const LABEL_BY_MODE: Record<PortalMode, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR",
  payroll: "Payroll",
};

const HEADER_EYEBROW_BY_MODE: Record<PortalMode, string> = {
  employee: "Employee Self-Service",
  manager: "Manager Self-Service",
  hr: "HR Service Desk",
  payroll: "Payroll Administration",
};

interface PortalShellProps {
  session: PortalSession;
  mode: PortalMode;
  unreadCount?: number;
  children: React.ReactNode;
}

export default function PortalShell({
  session,
  mode,
  unreadCount = 0,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const links = LINKS_BY_MODE[mode];
  const portalLabel = LABEL_BY_MODE[mode];

  const notificationsHref =
    mode === "employee"
      ? "/employee/notifications"
      : mode === "manager"
        ? "/manager/notifications"
        : mode === "hr"
          ? "/hr/notifications"
          : null;

  return (
    <div className="experience-app ca-app-canvas min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={cn(
            "ca-app-sidebar border-b border-[var(--ca-app-border)] text-[var(--ca-app-ink)] lg:shrink-0 lg:border-b-0 lg:border-r lg:w-[var(--ca-app-sidebar)]",
            mode === "employee" && "hidden lg:block",
          )}
        >
          <div className="px-4 py-5">
            <ConsultAmericaLogo href="/" variant="light" size="compact" showTagline={false} />
            <p className="mt-3 text-xs text-[var(--ca-app-muted)]">
              {portalLabel} Portal
            </p>
            <p className="mt-0.5 text-sm font-medium">{session.displayName}</p>
          </div>

          <nav className="flex gap-0.5 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              const isNotifications = link.href.includes("/notifications");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between gap-2 whitespace-nowrap rounded px-3 py-1.5 text-[0.875rem] transition-colors",
                    active
                      ? "bg-[var(--ca-app-selected)] font-medium text-[var(--ca-blue)]"
                      : "text-[var(--ca-app-muted)] hover:bg-[var(--ca-app-bg)] hover:text-[var(--ca-app-ink)]",
                  )}
                >
                  <span>{link.label}</span>
                  {isNotifications && unreadCount > 0 && (
                    <span className="rounded bg-[var(--ca-blue)] px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden border-t border-[var(--ca-app-border)] px-4 py-3 text-[0.7rem] text-[var(--ca-app-muted)] lg:block">
            <div className="space-y-1">
              {mode !== "employee" && (
                <Link
                  href="/employee"
                  className="block hover:text-[var(--ca-blue)]"
                >
                  Switch to Employee demo
                </Link>
              )}
              {mode !== "manager" && (
                <Link
                  href="/manager"
                  className="block hover:text-[var(--ca-blue)]"
                >
                  Switch to Manager demo
                </Link>
              )}
              {mode !== "hr" && (
                <Link
                  href="/hr/requests"
                  className="block hover:text-[var(--ca-blue)]"
                >
                  Switch to HR demo
                </Link>
              )}
              {mode !== "payroll" && (
                <Link
                  href="/payroll"
                  className="block hover:text-[var(--ca-blue)]"
                >
                  Switch to Payroll demo
                </Link>
              )}
            </div>
            <form action={logout} className="mt-2">
              <button
                type="submit"
                className="block text-left hover:text-[var(--ca-blue)]"
              >
                Sign out
              </button>
            </form>
          </div>
          <DemoModeBanner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-black/10 bg-white px-4 py-3 lg:px-6">
            <div className="mx-auto flex max-w-[var(--ca-app-max)] items-center justify-between gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
                  {HEADER_EYEBROW_BY_MODE[mode]}
                </p>
                <p className="mt-0.5 text-sm text-black/55">{session.workEmail}</p>
              </div>
              <div className="flex items-center gap-4">
                {notificationsHref && (
                  <Link
                    href={notificationsHref}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ca-app-ink)] hover:text-[var(--ca-blue)]"
                  >
                    Alerts
                    {unreadCount > 0 && (
                      <span className="rounded bg-[var(--ca-blue)] px-1.5 py-0.5 text-[0.7rem] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  href="/"
                  className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
                >
                  Public site
                </Link>
              </div>
            </div>
          </header>

          <main
            className={cn(
              "mx-auto w-full max-w-[var(--ca-app-max)] flex-1 px-4 py-6 lg:px-6 lg:py-8",
              mode === "employee" && "pb-20 lg:pb-8",
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {mode === "employee" && (
        <EmployeeBottomNav unreadCount={unreadCount} />
      )}
    </div>
  );
}
