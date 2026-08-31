import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "ATS & Talent Platform | ConsultAmerica Platforms",
  description: "Enterprise ATS and recruiting intelligence platform from requisition to candidate offer and hire.",
};

export default function ATSPlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              ATS &amp; Talent Intelligence Platform
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              From job requisition creation to candidate screening, interview loops,
              scorecard evaluation, offer letter approvals, and automated employee onboarding.
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
                      ATS Candidate Pipeline
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    Hiring Suite
                  </span>
                </div>

                {/* Pipeline Stages */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-2.5 text-xs font-bold text-[#695F57]">
                  <span className="text-[#261F1B]">Requisitions</span>
                  <span>→</span>
                  <span className="text-[#7D2639]">Screening</span>
                  <span>→</span>
                  <span className="text-[#7D2639]">Interview</span>
                  <span>→</span>
                  <span className="text-[#657766]">Offer</span>
                  <span>→</span>
                  <span className="text-[#261F1B]">Hire</span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Senior Oracle Solution Architect</span>
                      <span className="text-[#7D2639] font-bold">14 Active</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Technical panel reviews scheduled.</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Enterprise Data Engineer (AI Core)</span>
                      <span className="text-[#657766] font-bold">Offer Approved</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Ready for digital signature &amp; onboarding export.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Direct integration into Core HR.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    When a candidate accepts an offer, their profile automatically
                    converts to an employee record with pre-populated onboarding checklists.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Requisition Approval Matrix & Budget Checks",
                    "Public Careers Board Synchronized in Real-Time",
                    "Structured Interview Scorecards & Rubrics",
                    "E-Signature Offer Generation",
                    "Automated Employee Conversion & Onboarding Export",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex gap-3">
                  <Link href="/jobs" className="ca-button-primary inline-flex text-sm font-semibold">
                    View Live Job Board
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="ca-link text-sm font-semibold">
                    Schedule Demo →
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
