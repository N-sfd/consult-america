import type { Metadata } from "next";
import { Suspense } from "react";

import JobsTable from "@/components/workforce-app/recruiting/jobs-table";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "Jobs",
};

// Always reflect live data for the current request rather than a
// build-time snapshot - this is an authenticated app page, not marketing.
export const dynamic = "force-dynamic";

export default async function RecruitingJobsPage() {
  const jobs = await recruitingRepository.listJobSummaries();

  const kpis = {
    open: jobs.filter((j) => j.status === "PUBLISHED" || j.status === "APPROVED")
      .length,
    published: jobs.filter((j) => j.status === "PUBLISHED").length,
    draft: jobs.filter((j) => j.status === "DRAFT").length,
    onHold: jobs.filter((j) => j.status === "ON_HOLD").length,
  };

  return (
    <Suspense>
      <JobsTable jobs={jobs} kpis={kpis} />
    </Suspense>
  );
}
