"use client";

import EmployeeBottomNav from "@/components/portal/employee-bottom-nav";
import PlatformShell from "@/components/platform/platform-shell";
import type { PortalSession } from "@/lib/self-service/session";

type PortalMode = "employee" | "manager" | "hr" | "payroll";

interface PortalShellProps {
  session: PortalSession;
  mode: PortalMode;
  unreadCount?: number;
  children: React.ReactNode;
}

const ROLE_LABEL: Record<PortalMode, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR",
  payroll: "Payroll",
};

export default function PortalShell({
  session,
  mode,
  unreadCount = 0,
  children,
}: PortalShellProps) {
  const notificationsHref =
    mode === "employee"
      ? "/employee/notifications"
      : mode === "manager"
        ? "/manager/notifications"
        : mode === "hr"
          ? "/hr/notifications"
          : null;

  return (
    <PlatformShell
      workspace={mode}
      session={{
        displayName: session.displayName,
        email: session.workEmail,
        roleLabel: ROLE_LABEL[mode],
      }}
      showSearch={mode !== "employee"}
      unreadCount={unreadCount}
      notificationsHref={notificationsHref}
      hideSidebarOnMobile={mode === "employee"}
      bottomNav={mode === "employee" ? <EmployeeBottomNav unreadCount={unreadCount} /> : undefined}
    >
      {children}
    </PlatformShell>
  );
}
