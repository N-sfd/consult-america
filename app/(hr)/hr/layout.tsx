import PortalShell from "@/components/portal/portal-shell";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { redirectToAuthorizedLanding } from "@/lib/auth/roles";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { requireHrActor, SecurityError } from "@/lib/self-service/security";

export default async function HrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requireHrActor());
  } catch (error) {
    if (error instanceof SecurityError) {
      const platformUser = await getAuthenticatedPlatformUser();
      redirectToAuthorizedLanding(platformUser?.roles ?? []);
    }
    throw error;
  }

  const unreadCount = await getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="hr" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
