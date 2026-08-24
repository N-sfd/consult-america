import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Section, SectionEyebrow, SectionLead } from "@/components/section";

export const metadata: Metadata = {
  title: "Contact | ConsultAmerica",
};

export default function ContactPage() {
  return (
    <Section tone="navy">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionEyebrow onDark>Contact</SectionEyebrow>
          <h1 className="ca-h1 mt-6">Tell us about the work.</h1>
          <SectionLead onDark>
            Share a short brief. We will follow up if there is a fit.
          </SectionLead>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
