import { redirect } from "next/navigation";

/** Former blended workforce home. ATS lives at recruiting operations. */
export default function WorkforceAppDashboardRedirect() {
  redirect("/app/recruiting");
}
