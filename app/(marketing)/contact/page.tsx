import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Section, SectionEyebrow, SectionLead } from "@/components/section";

export const metadata: Metadata = {
  title: "Contact | Consult America",
};

export default function ContactPage() {
  return (
    <Section tone="off-white">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionEyebrow>Contact</SectionEyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ca-ink">
            Tell us about the work.
          </h1>
          <SectionLead>
            Share a short brief. We will follow up if there is a fit.
          </SectionLead>
        </div>
        <div className="rounded-[var(--ca-radius-md)] border border-ca-border bg-ca-white p-6">
          <h2 className="font-medium text-ca-ink">Start a conversation</h2>
          <p className="mt-1 text-sm text-ca-muted">
            We typically respond within two business days.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
