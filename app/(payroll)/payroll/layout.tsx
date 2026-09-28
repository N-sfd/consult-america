import PortalShell from "@/components/portal/portal-shell";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { redirectToAuthorizedLanding } from "@/lib/auth/roles";
import { requirePayrollActor, SecurityError } from "@/lib/self-service/security";

export default async function PayrollLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requirePayrollActor());
  } catch (error) {
    if (error instanceof SecurityError) {
      const platformUser = await getAuthenticatedPlatformUser();
      redirectToAuthorizedLanding(platformUser?.roles ?? []);
    }
    throw error;
  }

  return (
    <PortalShell session={session} mode="payroll">
      {children}
    </PortalShell>
  );
}
