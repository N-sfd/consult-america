import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "Core HR Portal | ConsultAmerica Platforms",
  description: "Enterprise Core HR platform for verified employee records, digital onboarding, and compliance.",
};

export default function HRPlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Core HR &amp; Compliance Portal
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              A secure, single source of truth for employee records, digital
              onboarding verification, compliance document vault, and organization hierarchy.
            </p>
          </div>
        </section>

        <section className="mkt-section bg-[#FFFAF2]">
          <div className="mkt-shell">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="ca-app-window p-6 lg:col-span-7 border border-[#D7CCBD] bg-[#FFFDF8]">
                <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#B93838]" />
                      <span className="h-2 w-2 rounded-full bg-[#C77A16]" />
                      <span className="h-2 w-2 rounded-full bg-[#657766]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                      HR Workspace
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    Verified Ledger
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Digital Onboarding Workflow</span>
                      <span className="text-[#657766] font-bold">Automated</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">I-9, W-4, direct deposit, and policy sign-offs.</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Document Vault &amp; Audit Logs</span>
                      <span className="text-[#7D2639] font-bold">SOC2 Type II</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Role-based encrypted storage with tamper-evident logs.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Audit-ready workforce administration.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    Connects directly to Employee Self-Service and Enterprise Payroll
                    to ensure zero data duplication.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Unified Employee Profile & Org Hierarchy",
                    "Paperless Onboarding Task Checklists",
                    "Encrypted Document Management & Signatures",
                    "Compliance Verification & Certification Tracking",
                    "Seamless Integration with Time & Payroll Engines",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex gap-3">
                  <Link href="/employee" className="ca-button-primary inline-flex text-sm font-semibold">
                    Access Portal
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="ca-link text-sm font-semibold">
                    Talk to HR Solutions →
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
