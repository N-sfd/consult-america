"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PortalSession } from "@/lib/self-service/session";
import { cn } from "@/lib/utils";

const employeeLinks = [
  { href: "/employee", label: "Home", exact: true },
  { href: "/employee/profile", label: "My Profile" },
  { href: "/employee/documents", label: "My Documents" },
  { href: "/employee/time", label: "Time" },
  { href: "/employee/leave", label: "Leave" },
  { href: "/employee/requests", label: "HR Requests" },
  { href: "/employee/notifications", label: "Notifications" },
];

const managerLinks = [
  { href: "/manager", label: "Home", exact: true },
  { href: "/manager/team", label: "My Team" },
  { href: "/manager/approvals", label: "Approvals" },
  { href: "/manager/time", label: "Team Time" },
  { href: "/manager/leave", label: "Team Leave" },
  { href: "/manager/notifications", label: "Notifications" },
];

const hrLinks = [
  { href: "/hr/requests", label: "HR Requests", exact: false },
  { href: "/hr/notifications", label: "Notifications" },
  { href: "/hr/audit", label: "Audit Log" },
];

interface PortalShellProps {
  session: PortalSession;
  mode: "employee" | "manager" | "hr";
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
  const links =
    mode === "employee"
      ? employeeLinks
      : mode === "manager"
        ? managerLinks
        : hrLinks;

  const portalLabel =
    mode === "employee"
      ? "Employee"
      : mode === "manager"
        ? "Manager"
        : "HR";

  const notificationsHref =
    mode === "employee"
      ? "/employee/notifications"
      : mode === "manager"
        ? "/manager/notifications"
        : "/hr/notifications";

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0B1220]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-black/10 bg-[#071A2F] text-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="px-5 py-6">
            <Link href="/" className="text-xs font-semibold tracking-[0.14em]">
              CONSULTAMERICA
            </Link>
            <p className="mt-4 text-sm text-white/55">{portalLabel} Portal</p>
            <p className="mt-1 text-sm font-medium">{session.displayName}</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
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
                    "flex items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span>{link.label}</span>
                  {isNotifications && unreadCount > 0 && (
                    <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {mode === "employee" && (
              <span className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/30">
                Pay · Coming soon
              </span>
            )}
          </nav>

          <div className="mt-auto hidden border-t border-white/10 px-5 py-4 text-xs text-white/40 lg:block">
            <div className="space-y-1">
              {mode !== "employee" && (
                <Link href="/employee" className="block hover:text-white">
                  Switch to Employee demo
                </Link>
              )}
              {mode !== "manager" && (
                <Link href="/manager" className="block hover:text-white">
                  Switch to Manager demo
                </Link>
              )}
              {mode !== "hr" && (
                <Link href="/hr/requests" className="block hover:text-white">
                  Switch to HR demo
                </Link>
              )}
            </div>
            <p className="mt-2">Demo session · auth later</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-black/10 bg-white px-5 py-4 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                  {mode === "employee"
                    ? "Employee Self-Service"
                    : mode === "manager"
                      ? "Manager Self-Service"
                      : "HR Service Desk"}
                </p>
                <p className="mt-1 text-sm text-black/55">{session.workEmail}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={notificationsHref}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1220] hover:text-[var(--ca-blue)]"
                >
                  Alerts
                  {unreadCount > 0 && (
                    <span className="rounded-md bg-[var(--ca-blue)] px-1.5 py-0.5 text-[0.7rem] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/"
                  className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
                >
                  Public site
                </Link>
              </div>
            </div>
          </header>

          <main className="px-5 py-8 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
