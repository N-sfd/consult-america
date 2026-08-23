import type { Metadata } from "next";

import { Section, SectionEyebrow, SectionLead } from "@/components/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "About | Consult America",
};

const leads = [
  { name: "A. Rahman", role: "Managing Partner", initials: "AR" },
  { name: "M. Chen", role: "Oracle Practice", initials: "MC" },
  { name: "S. Patel", role: "AI & Data", initials: "SP" },
];

export default function AboutPage() {
  return (
    <>
      <Section tone="off-white">
        <SectionEyebrow>About</SectionEyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ca-ink">
          A delivery firm built around Oracle, data, and accountable programs.
        </h1>
        <SectionLead>
          Consult America exists to take complex enterprise work from plan to
          production. We keep teams small, senior, and close to the work.
        </SectionLead>
      </Section>
      <Section tone="white">
        <div className="grid gap-4 md:grid-cols-3">
          {leads.map((lead) => (
            <article
              key={lead.name}
              className="flex items-center gap-3 rounded-[var(--ca-radius-md)] border border-ca-border bg-ca-white p-5"
            >
              <Avatar>
                <AvatarFallback className="bg-ca-surface text-ca-ink">
                  {lead.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-ca-ink">{lead.name}</p>
                <p className="text-sm text-ca-muted">{lead.role}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
