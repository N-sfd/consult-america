import PortalShell from "@/components/portal/portal-shell";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { redirectToAuthorizedLanding } from "@/lib/auth/roles";
import { getNotificationUnreadCount } from "@/lib/self-service/notification-service";
import { requireManagerActor, SecurityError } from "@/lib/self-service/security";

export default async function ManagerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requireManagerActor());
  } catch (error) {
    if (error instanceof SecurityError) {
      // Authenticated but not a manager — send them to their own workspace,
      // not to a bare /login they don't need (they're already signed in).
      const platformUser = await getAuthenticatedPlatformUser();
      redirectToAuthorizedLanding(platformUser?.roles ?? []);
    }
    throw error;
  }

  const unreadCount = await getNotificationUnreadCount(session.employeeId);

  return (
    <PortalShell session={session} mode="manager" unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
