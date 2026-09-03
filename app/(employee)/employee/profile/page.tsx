import type { Metadata } from "next";

import ProfileView from "@/components/employee/profile-view";
import { getEmployeeProfile } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "My Profile | ConsultAmerica",
};

export default async function EmployeeProfilePage() {
  const session = await getEmployeeSession();
  const profile = await getEmployeeProfile(session.employeeId);

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return <ProfileView profile={profile} />;
}
