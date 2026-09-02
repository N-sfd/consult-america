import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "CRM Workspace | Consult America Platforms",
  description: "Enterprise CRM platform with Customer 360, opportunity pipeline management, and account intelligence.",
};

export default function CRMPlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        {/* Product Hero */}
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Consult America CRM Workspace
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              A unified customer intelligence and opportunity management workspace
              engineered for enterprise revenue teams, multi-stakeholder deals, and
              account lifecycle governance.
            </p>
          </div>
        </section>

        {/* Workspace Visual & Capabilities */}
        <section className="mkt-section bg-[#FFFAF2]">
          <div className="mkt-shell">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              {/* Workspace App Frame */}
              <div className="ca-app-window p-6 lg:col-span-7 border border-[#D7CCBD] bg-[#FFFDF8]">
                <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#B93838]" />
                      <span className="h-2 w-2 rounded-full bg-[#C77A16]" />
                      <span className="h-2 w-2 rounded-full bg-[#657766]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                      CRM Workspace UI
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    Production Environment
                  </span>
                </div>

                <div className="mt-4 flex gap-1.5 border-b border-[#D7CCBD] pb-3 text-xs font-semibold">
                  <span className="rounded-md bg-[#7D2639] text-white px-2.5 py-1">Accounts</span>
                  <span className="px-2 py-1 text-[#695F57]">Opportunities</span>
                  <span className="px-2 py-1 text-[#695F57]">Pipeline</span>
                  <span className="px-2 py-1 text-[#695F57]">Analytics</span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Enterprise Cloud Transformation</span>
                      <span className="text-[#7D2639] font-bold">Proposal Stage</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Multi-entity Fusion cutover &amp; integration.</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Public Sector AI Intake</span>
                      <span className="text-[#657766] font-bold">Negotiation</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Data Agent document extraction &amp; governance.</p>
                  </div>
                </div>
              </div>

              {/* Capabilities Bullet Points */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Built for complex enterprise accounts.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    Designed to eliminate fragmented spreadsheets and disjointed sales
                    processes with full audit trails and Oracle ERP interoperability.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Customer 360 Account History & Org Charts",
                    "Opportunity Pipeline Stage Management",
                    "Executive Review & SOW Tracking",
                    "Direct Integration with Oracle ERP & GL",
                    "Role-Based Access & Data Governance",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/contact" className="ca-button-primary inline-flex text-sm font-semibold">
                    Request CRM Demo
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
