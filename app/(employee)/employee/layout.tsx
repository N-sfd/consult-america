import PortalShell from "@/components/portal/portal-shell";
import { getEmployeeSession } from "@/lib/self-service/session";

export default function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getEmployeeSession();

  return (
    <PortalShell session={session} mode="employee">
      {children}
    </PortalShell>
  );
}
