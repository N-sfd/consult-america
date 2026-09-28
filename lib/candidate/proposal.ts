/**
 * Tailored cover-letter / proposal draft — rule-based assistance.
 * Not an LLM product surface; never auto-submits applications.
 */

import type { JobMatchResult } from "@/lib/candidate/job-match";

export type ProposalDraftInput = {
  candidateFirstName: string;
  candidateLastName: string;
  professionalSummary?: string;
  skills: string[];
  jobTitle: string;
  jobSummary?: string;
  location?: string;
  match?: JobMatchResult | null;
};

export function generateProposalDraft(input: ProposalDraftInput): string {
  const fullName = `${input.candidateFirstName} ${input.candidateLastName}`.trim();
  const summary =
    input.professionalSummary?.trim() ||
    `${fullName} is exploring the ${input.jobTitle} opportunity at Consult America.`;
  const aligned = (input.match?.skillsFound ?? input.skills).slice(0, 5);
  const gaps = input.match?.skillsMissing?.slice(0, 3) ?? [];
  const locationLine = input.location ? ` (${input.location})` : "";

  const alignmentSentence =
    aligned.length > 0
      ? `My background aligns with this role through experience with ${aligned.join(", ")}.`
      : `I am eager to bring my consulting background to the ${input.jobTitle} team.`;

  const gapSentence =
    gaps.length > 0
      ? ` I am actively deepening ${gaps.join(", ")} and would welcome the chance to discuss how I can contribute while growing in those areas.`
      : "";

  const roleHook = input.jobSummary?.trim()
    ? `I was drawn to this opening${locationLine} because ${truncate(input.jobSummary, 160)}`
    : `I am writing to express interest in the ${input.jobTitle} role${locationLine} at Consult America.`;

  return [
    `Dear Consult America Hiring Team,`,
    ``,
    roleHook,
    ``,
    summary,
    ``,
    alignmentSentence + gapSentence,
    ``,
    `I would welcome a conversation about how I can support your clients and delivery teams. Thank you for your consideration.`,
    ``,
    `Sincerely,`,
    fullName,
  ].join("\n");
}

function truncate(value: string, max: number) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}
