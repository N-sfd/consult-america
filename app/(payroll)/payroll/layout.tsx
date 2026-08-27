import PortalShell from "@/components/portal/portal-shell";
import { getPayrollSession } from "@/lib/self-service/session";

export default function PayrollLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getPayrollSession();

  return (
    <PortalShell session={session} mode="payroll">
      {children}
    </PortalShell>
  );
}
