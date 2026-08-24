import type { Metadata } from "next";

import { Section, SectionEyebrow, SectionLead } from "@/components/section";

export const metadata: Metadata = {
  title: "About | ConsultAmerica",
};

const leads = [
  { name: "A. Rahman", role: "Managing Partner" },
  { name: "M. Chen", role: "Oracle Practice" },
  { name: "S. Patel", role: "AI & Data" },
];

export default function AboutPage() {
  return (
    <>
      <Section tone="navy">
        <SectionEyebrow onDark>About</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">
          A delivery firm built around Oracle, data, and accountable programs.
        </h1>
        <SectionLead onDark>
          ConsultAmerica exists to take complex enterprise work from plan to
          production. We keep teams small, senior, and close to the work.
        </SectionLead>
      </Section>
      <Section tone="navy" className="!pt-0">
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {leads.map((lead) => (
            <article key={lead.name} className="bg-black p-8">
              <p className="text-2xl">{lead.name}</p>
              <p className="mt-2 text-sm text-white/50">{lead.role}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
