import { redirect } from "next/navigation";

import PortalShell from "@/components/portal/portal-shell";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { requireEmployeeActor, SecurityError } from "@/lib/self-service/security";

export default async function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requireEmployeeActor());
  } catch (error) {
    if (error instanceof SecurityError) redirect("/login");
    throw error;
  }

  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="employee" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
