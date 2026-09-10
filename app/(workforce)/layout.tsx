import type { Metadata } from "next";
import { redirect } from "next/navigation";

import WorkforceShell from "@/components/workforce/workforce-shell";
import { requireHrActor, SecurityError } from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: {
    default: "Workforce | ConsultAmerica",
    template: "%s | ConsultAmerica Workforce",
  },
};

export default async function WorkforceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    ({ session } = await requireHrActor());
  } catch (error) {
    // Same pattern as app/(hr)/hr/layout.tsx and friends — without this,
    // the People pages' own requireHrActor() calls throw uncaught (no
    // layout here previously guarded them), which Next surfaces as a raw
    // 500 instead of a clean redirect.
    if (error instanceof SecurityError) redirect("/login");
    throw error;
  }

  return <WorkforceShell userName={session.displayName}>{children}</WorkforceShell>;
}
