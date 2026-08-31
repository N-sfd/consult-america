import type { Metadata } from "next";
import { CheckCircle2, Mail, MapPin } from "lucide-react";

import SectionLabel from "@/components/marketing/SectionLabel";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact & Practice Inquiry | ConsultAmerica",
  description:
    "Start a conversation with ConsultAmerica leadership regarding Oracle transformation, AI & data, enterprise platforms, or application engineering.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F7F8FA] text-[#101828] min-h-[calc(100vh-140px)] py-16 sm:py-24">
      <div className="mkt-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel tone="burgundy">Contact</SectionLabel>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-5xl">
              Tell us what you&apos;re looking to build.
            </h1>
            <p className="text-lg leading-relaxed text-[#475467]">
              Share a brief overview of your program, timeline, or operating
              challenge. Practice leads review every inquiry directly.
            </p>

            <div className="space-y-4 pt-6 border-t border-[#E2E7EC]">
              <div className="flex items-start gap-3 text-sm text-[#475467]">
                <CheckCircle2 className="h-5 w-5 text-[#5F7D75] shrink-0 mt-0.5" />
                <span>Confidential review by senior practice leaders within 1 business day</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#475467]">
                <CheckCircle2 className="h-5 w-5 text-[#5F7D75] shrink-0 mt-0.5" />
                <span>Architecture and scoping working session without sales overhead</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E7EC] space-y-3 text-sm text-[#475467]">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#B63838]" />
                <span className="font-medium text-[#101828]">inquiries@consultamerica.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#B63838]" />
                <span>Washington, D.C. · New York · Chicago · Dallas · San Francisco</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-8 sm:p-10 shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
