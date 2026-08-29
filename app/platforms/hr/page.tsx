import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FolderGit2, ShieldCheck, Database, Layers, UserCheck } from "lucide-react";

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
            <SectionLabel tone="blue">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[var(--mkt-navy)]">
              Core HR &amp; Compliance Portal
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--mkt-slate)]">
              A secure, single source of truth for employee records, digital
              onboarding verification, compliance document vault, and organization hierarchy.
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
                      HR Workspace
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[var(--mkt-dim)] font-medium">
                    Verified Ledger
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="rounded-lg border border-[var(--mkt-border)] bg-white p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[var(--mkt-navy)]">
                      <span>Digital Onboarding Workflow</span>
                      <span className="text-[var(--mkt-success)]">Automated</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">I-9, W-4, direct deposit, and policy sign-offs.</p>
                  </div>
                  <div className="rounded-lg border border-[var(--mkt-border)] bg-white p-3 text-xs">
                    <div className="flex justify-between font-semibold text-[var(--mkt-navy)]">
                      <span>Document Vault &amp; Audit Logs</span>
                      <span className="text-[var(--mkt-blue)]">SOC2 Type II</span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">Role-based encrypted storage with tamper-evident logs.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--mkt-navy)]">
                    Audit-ready workforce administration.
                  </h3>
                  <p className="mt-2 text-sm text-[var(--mkt-slate)]">
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
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[var(--mkt-navy)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--mkt-blue)] shrink-0" />
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
