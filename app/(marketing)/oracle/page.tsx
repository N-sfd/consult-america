import type { Metadata } from "next";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import OraclePageSections from "@/components/marketing/oracle-page-sections";

export const metadata: Metadata = {
  title: "Oracle | Consult America",
  description:
    "Oracle Cloud programs that reach go-live and stay healthy — Fusion, EPM, integrations, and analytics.",
};

export default function OraclePage() {
  return (
    <>
      <OraclePageSections />
      <RelatedInsights category="oracle" />
      <ContactCTA headline="Ready to modernize your Oracle estate?" />
    </>
  );
}
