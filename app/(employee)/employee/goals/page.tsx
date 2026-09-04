import type { Metadata } from "next";

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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Goals</h1>
        <p className="mt-2 text-black/55">
          Track the goals you&apos;re working toward this cycle.
        </p>
      </div>

      <GoalsWorkspace goals={goals} />
    </div>
  );
}
