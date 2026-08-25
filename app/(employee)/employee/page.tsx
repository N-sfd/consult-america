import type { Metadata } from "next";

import EmployeeDashboard from "@/components/employee/employee-dashboard";
import { getEmployeeDashboard } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Employee Home | ConsultAmerica",
};

export default async function EmployeeHomePage() {
  const session = getEmployeeSession();
  const data = await getEmployeeDashboard(session.employeeId);

  return <EmployeeDashboard data={data} />;
}
