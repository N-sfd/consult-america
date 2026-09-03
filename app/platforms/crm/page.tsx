import type { Metadata } from "next";

import CrmWorkspacePage from "@/components/marketing/crm-workspace-page";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "CRM Workspace",
  description:
    "Consult America CRM Workspace — customer intelligence and opportunity management for enterprise revenue teams.",
};

export default function CRMPlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <CrmWorkspacePage />
      </main>
      <SiteFooter />
    </>
  );
}
