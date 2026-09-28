import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import GoalsWorkspace from "@/components/performance/goals-workspace";
import { getGoals } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Goals | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function EmployeeGoalsPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.goals.read");

  const goals = getGoals(actor.session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Goals"
        description="Track the goals you&apos;re working toward this cycle."
      />

      <GoalsWorkspace goals={goals} />
    </div>
  );
}
