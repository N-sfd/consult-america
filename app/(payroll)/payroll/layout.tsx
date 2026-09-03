import { redirect } from "next/navigation";

import PortalShell from "@/components/portal/portal-shell";
import { requirePayrollActor, SecurityError } from "@/lib/self-service/security";

export default async function PayrollLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    ({ session } = await requirePayrollActor());
  } catch (error) {
    if (error instanceof SecurityError) redirect("/login");
    throw error;
  }

  return (
    <PortalShell session={session} mode="payroll">
      {children}
    </PortalShell>
  );
}
