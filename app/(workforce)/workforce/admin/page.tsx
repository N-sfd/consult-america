import { redirect } from "next/navigation";

/** Short Admin path — canonical UI remains Workforce Administration. */
export default function WorkforceAdminRedirectPage() {
  redirect("/workforce/administration");
}
