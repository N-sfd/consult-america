import type { Metadata } from "next";
import { CheckCircle2, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import FeatureCard from "@/components/marketing/inner-page/feature-card";
import Reveal from "@/components/marketing/inner-page/reveal";

export const metadata: Metadata = {
  title: "Contact & Practice Inquiry | ConsultAmerica",
  description:
    "Start a conversation with ConsultAmerica leadership regarding Oracle transformation, AI & data, enterprise platforms, or application engineering.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        variant="default"
        layout="stacked"
        eyebrow="Contact"
        title="Tell us what you're looking to build."
        description="Share a brief overview of your program, timeline, or operating challenge. Practice leads review every inquiry directly."
      />

      <PageSection tone="soft" accent>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-5">
            <div className="grid gap-4">
              {[
                "Confidential review by senior practice leaders within 1 business day",
                "Architecture and scoping working session without sales overhead",
              ].map((item, index) => (
                <FeatureCard key={item} delay={index * 0.08} hover={false}>
                  <div className="flex items-start gap-3 text-sm text-[#5B6D6B]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#176A63]" />
                    <span>{item}</span>
                  </div>
                </FeatureCard>
              ))}
            </div>

            <Reveal delay={0.15}>
              <div className="space-y-3 rounded-2xl border border-[#C9DDD7] bg-white/80 p-6 text-sm text-[#5B6D6B] backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#B83A3A]" />
                  <span className="font-medium text-[#122D2E]">inquiries@consultamerica.com</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B83A3A]" />
                  <span>Washington, D.C. · New York · Chicago · Dallas · San Francisco</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-2xl border border-[#C9DDD7] bg-white p-8 shadow-[0_20px_56px_rgba(7,59,58,0.08)] sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </PageSection>
    </>
  );
}
