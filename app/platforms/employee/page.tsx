import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "Employee Self-Service | Consult America Platforms",
  description: "Employee self-service portal for onboarding, documents, requests, and profile updates.",
};

export default function EmployeePlatformPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Employee Self-Service Portal
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              Empower employees with self-service profile management, digital document
              review, service requests, and pay statement access.
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
                      Employee Portal UI
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-[#695F57] font-semibold">
                    Self-Service
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3">
                    <p className="font-semibold text-[#261F1B]">Onboarding Status</p>
                    <p className="mt-1 text-[0.68rem] text-[#657766] font-bold">100% Completed</p>
                  </div>
                  <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-3">
                    <p className="font-semibold text-[#261F1B]">Latest Pay Statement</p>
                    <p className="mt-1 text-[0.68rem] text-[#7D2639] font-bold">Available for Download</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#261F1B]">
                    Fast, intuitive employee workflows.
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    Eliminates manual HR tickets for routine updates and provides
                    transparency on leave, pay, and documents.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Personal & Emergency Contact Updates",
                    "Direct Deposit & Tax Form Management",
                    "Digital Signature & Onboarding Verification",
                    "Service Request Submission & Tracking",
                    "Mobile-Responsive Employee Access",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm font-medium text-[#261F1B]">
                      <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/login" className="ca-button-primary inline-flex text-sm font-semibold">
                    Log in to Employee Portal
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
