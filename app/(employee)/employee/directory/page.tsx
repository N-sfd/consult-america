import type { Metadata } from "next";

import EmployeeDirectory from "@/components/directory/employee-directory";
import { PageHeader } from "@/components/shared";
import { getDirectoryEntries } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "Team Directory | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function EmployeeDirectoryPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.directory.read");

  const entries = await getDirectoryEntries();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Directory"
        description="Browse active coworkers by name, title, department, or location, or switch to the org chart to see reporting lines."
      />

      <EmployeeDirectory entries={entries} />
    </div>
  );
}
