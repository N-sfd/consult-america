import type { Metadata } from "next";

import { recruitingRepository } from "@/lib/recruiting";
import ApplicationsTable from "@/components/workforce-app/recruiting/applications-table";

export const metadata: Metadata = { title: "Applications" };

export default async function Page() {
  const applications = await recruitingRepository.listApplicationsQueue();

  return <ApplicationsTable applications={applications} />;
}
