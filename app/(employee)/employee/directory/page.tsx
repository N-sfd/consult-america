import type { Metadata } from "next";

import EmployeeDirectory from "@/components/directory/employee-directory";
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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Team Directory
        </h1>
        <p className="mt-2 text-black/55">
          Browse active coworkers by name, title, department, or location, or
          switch to the org chart to see reporting lines.
        </p>
      </div>

      <EmployeeDirectory entries={entries} />
    </div>
  );
}
