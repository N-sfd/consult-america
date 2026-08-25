import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  assertTeamAccess,
  getEmployeeProfile,
} from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";

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
  const session = getManagerSession();

  try {
    await assertTeamAccess(session.employeeId, employeeId);
  } catch {
    notFound();
  }

  const profile = await getEmployeeProfile(employeeId);
  if (!profile) notFound();

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
    </div>
  );
}
