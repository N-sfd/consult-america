import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "Time & Leave System | ConsultAmerica Platforms",
  description: "Enterprise workforce time tracking, leave balances, and manager approval workflows.",
};

export default function WorkforcePlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Workforce Time &amp; Leave System
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              Weekly timesheet submissions, multi-level manager approvals, automated
              PTO balance accruals, and direct integration with enterprise payroll.
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
                      Time &amp; Leave UI
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    Workforce Engine
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Weekly Timesheet Cycle</span>
                      <span className="text-[#657766] font-bold">Approved by Manager</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">40.0 standard hours logged across client project codes.</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>PTO &amp; Sick Leave Accruals</span>
                      <span className="text-[#7D2639] font-bold">Up to Date</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Real-time balance calculation with carryover rule policies.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Accurate time and compliance.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    Eliminate billing and payroll errors by validating billable hours
                    and manager sign-offs before the payroll cut.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Client Project Code & Task Hour Logging",
                    "Multi-tier Manager Approvals & Audit Trails",
                    "Automated PTO, Vacation & Sick Leave Accruals",
                    "Overtime & Holiday Policy Enforcement",
                    "Direct Sync to Payroll Calculation Engine",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/employee/time" className="ca-button-primary inline-flex text-sm font-semibold">
                    Open Timesheet Portal
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
