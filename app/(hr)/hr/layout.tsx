import { redirect } from "next/navigation";

import PortalShell from "@/components/portal/portal-shell";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { requireHrActor, SecurityError } from "@/lib/self-service/security";

export default async function HrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requireHrActor());
  } catch (error) {
    if (error instanceof SecurityError) redirect("/login");
    throw error;
  }

  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="hr" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
