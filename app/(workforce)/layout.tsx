import type { Metadata } from "next";

import WorkforceShell from "@/components/workforce/workforce-shell";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = {
  // Do not set a nested title.template — root already uses "%s | Consult America".
  title: "Workforce",
};

export default async function WorkforceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getWorkforceSession();

  return <WorkforceShell userName={session.displayName}>{children}</WorkforceShell>;
}
