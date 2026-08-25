import type { Metadata } from "next";

import ManagerDashboard from "@/components/manager/manager-dashboard";
import { getManagerDashboard } from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Manager Home | ConsultAmerica",
};

export default async function ManagerHomePage() {
  const session = getManagerSession();
  const data = await getManagerDashboard(session.employeeId);

  return <ManagerDashboard data={data} />;
}
