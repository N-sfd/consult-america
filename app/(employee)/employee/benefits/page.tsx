import type { Metadata } from "next";

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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Benefits
        </h1>
        <p className="mt-2 text-black/55">
          Review available plans and manage your current elections.
        </p>
      </div>

      <BenefitsWorkspace plans={plans} elections={elections} />
    </div>
  );
}
