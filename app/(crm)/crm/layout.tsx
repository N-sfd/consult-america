import CrmShell from "@/components/crm/crm-shell";
import { getCrmSession } from "@/lib/crm/session";

export default async function CrmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getCrmSession();

  return <CrmShell session={session}>{children}</CrmShell>;
}
