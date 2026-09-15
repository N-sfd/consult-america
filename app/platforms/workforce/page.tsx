import { redirect } from "next/navigation";

/** Legacy marketing slug — Time & Leave lives under Employee in the suite model. */
export default function WorkforcePlatformRedirectPage() {
  redirect("/platforms/employee");
}
