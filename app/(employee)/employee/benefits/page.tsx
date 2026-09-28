import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import BenefitsWorkspace from "@/components/benefits/benefits-workspace";
import { getBenefitsElections, getBenefitsPlans } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Benefits | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function EmployeeBenefitsPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.benefits.read");

  const plans = getBenefitsPlans();
  const elections = getBenefitsElections(actor.session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Benefits"
        description="Review available plans and manage your current elections."
      />

      <BenefitsWorkspace plans={plans} elections={elections} />
    </div>
  );
}
