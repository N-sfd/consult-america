import type { Metadata } from "next";

import {
  seedDepartments,
  seedLocations,
  seedPositions,
} from "@/data/recruiting/seed";
import JobForm from "@/components/workforce-app/recruiting/job-form";

export const metadata: Metadata = {
  title: "New Job",
};

export default function NewJobPage() {
  const departments = seedDepartments.map((d) => ({ id: d.id, name: d.name }));
  const locations = seedLocations.map((l) => ({ id: l.id, name: l.name }));
  const positions = seedPositions.map((p) => ({
    id: p.id,
    title: p.title,
    departmentId: p.departmentId,
  }));

  return (
    <JobForm
      departments={departments}
      locations={locations}
      positions={positions}
    />
  );
}
