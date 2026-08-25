import PortalShell from "@/components/portal/portal-shell";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export default function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getEmployeeSession();
  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="employee" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
