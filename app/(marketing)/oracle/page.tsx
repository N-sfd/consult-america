import type { Metadata } from "next";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import OracleFeature from "@/components/marketing/oracle-feature";

export const metadata: Metadata = {
  title: "Oracle | Consult America",
  description:
    "Oracle Cloud programs that reach go-live and stay healthy — Fusion, EPM, integrations, and analytics.",
};

export default function OraclePage() {
  return (
    <>
      <OracleFeature headingLevel="h1" linkToDetail={false} />
      <RelatedInsights category="oracle" />
      <ContactCTA headline="Ready to modernize your Oracle estate?" />
    </>
  );
}
