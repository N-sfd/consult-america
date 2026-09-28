import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import Link from "next/link";

import { getDirectReports } from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "My Team | ConsultAmerica",
};

export default async function ManagerTeamPage() {
  const session = await getManagerSession();
  const team = await getDirectReports(session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Team"
        description="Driven by employment assignment manager relationships — not a separate team list."
      />

      <div className="overflow-hidden rounded-lg border border-[var(--ca-platform-border)] bg-white">
        <ul className="divide-y divide-black/5">
          {team.map((member) => (
            <li key={member.employee.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {member.person.firstName} {member.person.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                    {member.positionTitle}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                    {member.locationName}
                    {member.workplaceTypeLabel
                      ? ` · ${member.workplaceTypeLabel}`
                      : ""}{" "}
                    · {member.statusLabel}
                  </p>
                </div>
                <Link
                  href={`/manager/team/${member.employee.id}`}
                  className="text-sm font-medium text-[var(--ca-platform-mid)] hover:underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
