import type { Metadata } from "next";

import WorkforceAppShell from "@/components/workforce-app/workforce-app-shell";
import { getPendingApprovals } from "@/lib/self-service";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = {
  title: {
    default: "Workforce App | ConsultAmerica",
    template: "%s | Workforce App",
  },
};

export default function WorkforceAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getWorkforceSession();
  const unreadCount = getNotificationUnreadCount(session.employeeId);
  const pendingApprovalsCount = getPendingApprovals(session.employeeId).length;

  return (
    <WorkforceAppShell
      session={session}
      unreadCount={unreadCount}
      pendingApprovalsCount={pendingApprovalsCount}
    >
      {children}
    </WorkforceAppShell>
  );
}
