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
    <div className="bg-[#2B2420] text-[#F7F0E7] min-h-[calc(100vh-140px)] py-16 sm:py-24">
      <div className="mkt-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel tone="light">Contact</SectionLabel>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-[#F7F0E7] sm:text-5xl">
              Tell us what you&apos;re looking to build.
            </h1>
            <p className="text-lg leading-relaxed text-[#CFC4BA]">
              Share a brief overview of your program, timeline, or operating
              challenge. Practice leads review every inquiry directly.
            </p>

            <div className="space-y-4 pt-6 border-t border-[#6F6259]">
              <div className="flex items-start gap-3 text-sm text-[#CFC4BA]">
                <CheckCircle2 className="h-5 w-5 text-[#D8C5AA] shrink-0 mt-0.5" />
                <span>Confidential review by senior practice leaders within 1 business day</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#CFC4BA]">
                <CheckCircle2 className="h-5 w-5 text-[#D8C5AA] shrink-0 mt-0.5" />
                <span>Architecture and scoping working session without sales overhead</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#6F6259] space-y-3 text-sm text-[#CFC4BA]">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#D8C5AA]" />
                <span>inquiries@consultamerica.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#D8C5AA]" />
                <span>Washington, D.C. · New York · Chicago · Dallas · San Francisco</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#6F6259] bg-[#342B27] p-8 sm:p-10 shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
