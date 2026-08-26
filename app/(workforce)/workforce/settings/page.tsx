import type { Metadata } from "next";

import WorkforcePlaceholderPage from "@/components/workforce/workforce-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <WorkforcePlaceholderPage
      section="Settings"
      title="Settings"
      description="Workspace preferences, notifications, and access controls."
    />
  );
}
