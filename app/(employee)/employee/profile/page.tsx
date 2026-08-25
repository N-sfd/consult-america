import type { Metadata } from "next";

import { getEmployeeProfile } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "My Profile | ConsultAmerica",
};

export default async function EmployeeProfilePage() {
  const session = getEmployeeSession();
  const profile = await getEmployeeProfile(session.employeeId);

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  const readOnly = [
    ["Employee ID", profile.employee.employeeNumber],
    ["Status", profile.statusLabel],
    ["Hire Date", profile.employee.hireDate],
    ["Position", profile.positionTitle ?? "—"],
    ["Department", profile.departmentName ?? "—"],
    ["Manager", profile.managerName ?? "—"],
    ["Location", profile.locationName ?? "—"],
    ["Employment Type", profile.employmentTypeLabel ?? "—"],
    ["Work Arrangement", profile.workplaceTypeLabel ?? "—"],
    ["Work Email", profile.employee.workEmail ?? "—"],
  ];

  const editable = [
    ["Preferred Name", profile.person.preferredName ?? profile.person.firstName],
    ["Personal Email", profile.person.personalEmail ?? "—"],
    ["Phone", profile.person.personalPhone ?? "—"],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">My Profile</h1>
        <p className="mt-2 text-black/55">
          Employment details are read-only. Limited personal fields can be updated
          in later Phase 4 steps.
        </p>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Employment
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {readOnly.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-black/40">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Personal · Limited Edit Later
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {editable.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-black/40">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
