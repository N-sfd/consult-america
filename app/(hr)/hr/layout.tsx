import PortalShell from "@/components/portal/portal-shell";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { getHrSession } from "@/lib/self-service/session";

export default function HrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getHrSession();
  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="hr" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
