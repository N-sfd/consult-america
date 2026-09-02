import type { Metadata } from "next";
import { CheckCircle2, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import Reveal from "@/components/marketing/inner-page/reveal";

export const metadata: Metadata = {
  title: "Contact & Practice Inquiry | Consult America",
  description:
    "Start a conversation with Consult America leadership regarding Oracle transformation, AI & data, enterprise platforms, or application engineering.",
};

export default function ContactPage() {
  return (
    <section className="ca-contact-emerald relative min-h-[calc(100vh-140px)] py-16 sm:py-20 lg:py-24">
      <div className="mkt-shell relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
                Contact
              </p>
              <h1 className="mkt-inner-hero-heading mt-5 !text-white !max-w-xl">
                Tell us what you&apos;re looking to build.
              </h1>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-white/72">
                Share a brief overview of your program, timeline, or operating challenge.
                Practice leads review every inquiry directly.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 space-y-4">
              {[
                "Confidential review by senior practice leaders within 1 business day",
                "Architecture and scoping working session without sales overhead",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/75">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9BC4B8]" />
                  <span>{item}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.15} className="mt-8 space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#9BC4B8]" />
                <span className="font-medium text-white">inquiries@consultamerica.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9BC4B8]" />
                <span>Washington, D.C. · New York · Chicago · Dallas · San Francisco</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
