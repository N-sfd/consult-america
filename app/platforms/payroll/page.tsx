import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CreditCard, DollarSign, ShieldCheck, FileCheck, Layers } from "lucide-react";

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
            <SectionLabel tone="blue">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[var(--mkt-navy)]">
              Enterprise Payroll Platform
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--mkt-slate)]">
              Automated payroll calculation, statutory and benefit deductions, direct
              deposit ACH generation, tax compliance reports, and Oracle GL journal integration.
            </p>
          </div>
        </section>

        <section className="mkt-section bg-[var(--mkt-white)]">
          <div className="mkt-shell">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="ca-app-window p-6 lg:col-span-7 bg-[var(--mkt-cloud)]">
                <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#d94b4b]" />
                      <span className="h-2 w-2 rounded-full bg-[#d99a1b]" />
                      <span className="h-2 w-2 rounded-full bg-[#16a36a]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                      Payroll Engine UI
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[var(--mkt-dim)] font-medium">
                    GL Synchronized
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-lg border border-[var(--mkt-border)] bg-white p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[var(--mkt-navy)]">
                      <span>Semi-Monthly Payroll Run</span>
                      <span className="text-[var(--mkt-success)]">Balanced &amp; Posted</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">Pre-calculated hours, pre-tax benefits &amp; tax withholdings.</p>
                  </div>
                  <div className="rounded-lg border border-[var(--mkt-border)] bg-white p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[var(--mkt-navy)]">
                      <span>Oracle Cloud GL Journal Export</span>
                      <span className="text-[var(--mkt-blue)]">Verified Audit</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">Direct entry into Oracle Financials chart of accounts.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--mkt-navy)]">
                    Accurate, compliant, and seamless.
                  </h3>
                  <p className="mt-2 text-sm text-[var(--mkt-slate)]">
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
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[var(--mkt-navy)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--mkt-blue)] shrink-0" />
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
