import type { Metadata } from "next";
import Link from "next/link";

import { getDirectReports } from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "My Team | ConsultAmerica",
};

export default async function ManagerTeamPage() {
  const session = getManagerSession();
  const team = await getDirectReports(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">My Team</h1>
        <p className="mt-2 text-black/55">
          Driven by employment assignment manager relationships — not a separate
          team list.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {team.map((member) => (
            <li key={member.employee.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {member.person.firstName} {member.person.lastName}
                  </p>
                  <p className="mt-1 text-sm text-black/55">
                    {member.positionTitle}
                  </p>
                  <p className="mt-1 text-sm text-black/45">
                    {member.locationName}
                    {member.workplaceTypeLabel
                      ? ` · ${member.workplaceTypeLabel}`
                      : ""}{" "}
                    · {member.statusLabel}
                  </p>
                </div>
                <Link
                  href={`/manager/team/${member.employee.id}`}
                  className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
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
