import type { Metadata } from "next";

import WorkforceShell from "@/components/workforce/workforce-shell";

export const metadata: Metadata = {
  title: {
    default: "Workforce | ConsultAmerica",
    template: "%s | ConsultAmerica Workforce",
  },
};

export default function WorkforceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkforceShell>{children}</WorkforceShell>;
}
