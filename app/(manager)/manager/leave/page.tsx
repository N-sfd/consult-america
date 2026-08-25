import type { Metadata } from "next";

import PortalPlaceholder from "@/components/portal/portal-placeholder";

export const metadata: Metadata = {
  title: "Team Leave | ConsultAmerica",
};

export default function ManagerLeavePage() {
  return (
    <PortalPlaceholder
      title="Team Leave"
      description="Manager leave approvals will show pending requests with balances and approve/reject actions scoped to direct reports."
      phaseNote="Phase 4F / 4H — coming next"
      backHref="/manager"
      backLabel="Back to manager home"
    />
  );
}
