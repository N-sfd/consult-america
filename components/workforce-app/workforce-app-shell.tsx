"use client";

import PlatformShell from "@/components/platform/platform-shell";
import type { WorkforceSession } from "@/lib/workforce/session";

export default function WorkforceAppShell({
  session,
  unreadCount,
  pendingApprovalsCount,
  children,
}: {
  session: WorkforceSession;
  unreadCount: number;
  pendingApprovalsCount: number;
  children: React.ReactNode;
}) {
  return (
    <PlatformShell
      workspace="workforce"
      session={{
        displayName: session.displayName,
        email: session.workEmail,
        initials: session.initials,
        roleLabel: "Workforce Admin",
      }}
      showSearch
      searchPlaceholder="Search people, jobs, candidates…"
      notificationsHref="/hr/notifications"
      unreadCount={unreadCount}
      pendingApprovalsCount={pendingApprovalsCount}
      approvalsHref="/manager/approvals"
      logoHref="/app/dashboard"
    >
      {children}
    </PlatformShell>
  );
}
