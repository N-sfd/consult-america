import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Interviews" };

export default function WorkforceInterviewsRedirectPage() {
  redirect("/app/recruiting/interviews");
}
