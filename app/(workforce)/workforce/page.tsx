import { redirect } from "next/navigation";

/** People operations land in HR, not the ATS recruiting desk. */
export default function WorkforceHomeRedirect() {
  redirect("/hr");
}
