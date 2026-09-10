import type { Metadata } from "next";

import { requireHrActor } from "@/lib/self-service/security";
import { hrRepository } from "@/lib/hr";
import {
  seedDepartments,
  seedLocations,
  seedPositions,
} from "@/data/recruiting/seed";
import AddEmployeeForm from "@/components/workforce/add-employee-form";

export const metadata: Metadata = { title: "Add Employee" };

export default async function Page() {
  await requireHrActor();

  const employees = await hrRepository.listEmployees();
  const managers = employees
    .filter((e) => e.employmentStatus === "ACTIVE")
    .map((e) => ({
      id: e.id,
      name: e.preferredName || `${e.firstName} ${e.lastName}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AddEmployeeForm
      departments={seedDepartments.map((d) => ({
        id: d.id,
        name: d.name,
        businessUnitId: d.businessUnitId,
      }))}
      positions={seedPositions.map((p) => ({
        id: p.id,
        title: p.title,
        departmentId: p.departmentId,
      }))}
      locations={seedLocations.map((l) => ({ id: l.id, name: l.name }))}
      managers={managers}
    />
  );
}
