import PortalShell from "@/components/portal/portal-shell";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { getManagerSession } from "@/lib/self-service/session";

export default function ManagerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getManagerSession();
  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="manager" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
