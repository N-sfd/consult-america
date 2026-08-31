import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "Enterprise Payroll | ConsultAmerica Platforms",
  description: "Enterprise payroll platform for automated pay runs, deductions, tax reporting, and GL export.",
};

export default function PayrollPlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Enterprise Payroll Platform
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              Automated payroll calculation, statutory and benefit deductions, direct
              deposit ACH generation, tax compliance reports, and Oracle GL journal integration.
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
                      Payroll Engine UI
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    GL Synchronized
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Semi-Monthly Payroll Run</span>
                      <span className="text-[#657766] font-bold">Balanced &amp; Posted</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Pre-calculated hours, pre-tax benefits &amp; tax withholdings.</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[#261F1B]">
                      <span>Oracle Cloud GL Journal Export</span>
                      <span className="text-[#7D2639] font-bold">Verified Audit</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">Direct entry into Oracle Financials chart of accounts.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Accurate, compliant, and seamless.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    Directly consumes verified timesheets from workforce management
                    and outputs ledger entries to Oracle Financials with zero manual reconciliation.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Gross-to-Net Automated Pay Calculation",
                    "Custom Statutory & Benefit Deductions",
                    "Direct Deposit ACH & Paystub Generation",
                    "Quarterly & Annual Tax Form Compliance",
                    "Oracle General Ledger Journal Entry Sync",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/payroll" className="ca-button-primary inline-flex text-sm font-semibold">
                    Open Payroll Dashboard
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
