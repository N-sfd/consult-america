import type { Metadata } from "next";

import PortalPlaceholder from "@/components/portal/portal-placeholder";

export const metadata: Metadata = {
  title: "Team Time | ConsultAmerica",
};

export default function ManagerTimePage() {
  return (
    <PortalPlaceholder
      title="Team Time"
      description="Manager timesheet review queue will list submitted team timesheets with approve, reject, and return-for-correction actions."
      phaseNote="Phase 4E / 4H — coming next"
      backHref="/manager"
      backLabel="Back to manager home"
    />
  );
}
