import PortalShell from "@/components/portal/portal-shell";
import { getHrSession } from "@/lib/self-service/session";

export default function HrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getHrSession();

  return (
    <PortalShell session={session} mode="hr">
      {children}
    </PortalShell>
  );
}
