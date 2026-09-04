import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ManagerAssessmentForm from "@/components/performance/manager-assessment-form";
import {
  assertTeamAccess,
  getEmployeeProfile,
  getGoals,
  getPerformanceReviews,
} from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";
import { goalStatusLabels } from "@/types/self-service";

interface TeamMemberPageProps {
  params: Promise<{ employeeId: string }>;
}

export const metadata: Metadata = {
  title: "Team Member | ConsultAmerica",
};

export default async function ManagerTeamMemberPage({
  params,
}: TeamMemberPageProps) {
  const { employeeId } = await params;
  const session = await getManagerSession();

  try {
    await assertTeamAccess(session.employeeId, employeeId);
  } catch {
    notFound();
  }

  const profile = await getEmployeeProfile(employeeId);
  if (!profile) notFound();

  const goals = getGoals(employeeId);
  const reviews = getPerformanceReviews(employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          {profile.person.firstName} {profile.person.lastName}
        </h1>
        <p className="mt-2 text-black/55">
          {profile.positionTitle} · Limited manager view (no salary / HR notes)
        </p>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Position", profile.positionTitle],
            ["Department", profile.departmentName],
            ["Location", profile.locationName],
            ["Work Arrangement", profile.workplaceTypeLabel],
            ["Status", profile.statusLabel],
            ["Work Email", profile.employee.workEmail],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-black/40">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Goals
        </h2>
        {goals.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No goals on file yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {goals.map((goal) => (
              <li key={goal.id} className="py-3">
                <p className="font-medium">{goal.title}</p>
                <p className="mt-1 text-black/55">
                  {goalStatusLabels[goal.status]} · {goal.progressPercent}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {reviews.map((review) => (
        <ManagerAssessmentForm key={review.id} review={review} />
      ))}
    </div>
  );
}
