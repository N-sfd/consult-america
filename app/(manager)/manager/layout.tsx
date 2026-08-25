import PortalShell from "@/components/portal/portal-shell";
import { getManagerSession } from "@/lib/self-service/session";

export default function ManagerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getManagerSession();

  return (
    <PortalShell session={session} mode="manager">
      {children}
    </PortalShell>
  );
}
