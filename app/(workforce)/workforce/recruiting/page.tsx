import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Recruiting" };

export default function WorkforceRecruitingRedirectPage() {
  redirect("/app/recruiting");
}
