"use client";

import PlatformShell from "@/components/platform/platform-shell";
import type { CrmSession } from "@/lib/crm/session";

interface CrmShellProps {
  session: CrmSession;
  children: React.ReactNode;
}

export default function CrmShell({ session, children }: CrmShellProps) {
  return (
    <PlatformShell
      workspace="crm"
      session={{
        displayName: session.displayName,
        email: session.email,
        roleLabel: "CRM",
      }}
      showSearch
      searchPlaceholder="Search accounts, opportunities…"
    >
      {children}
    </PlatformShell>
  );
}
