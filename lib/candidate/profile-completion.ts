import type { CandidateProfile, Education, Experience } from "@/types/recruiting";

export type ProfileCompletionBreakdown = {
  identity: boolean;
  contact: boolean;
  resume: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  percent: number;
  completedCount: number;
  totalCount: number;
};

export function calculateProfileCompletion(input: {
  candidate: CandidateProfile;
  experience: Experience[];
  education: Education[];
  skills: Array<{ id: string }>;
  hasActiveResume: boolean;
}): ProfileCompletionBreakdown {
  const { candidate } = input;
  const identity = Boolean(candidate.firstName?.trim() && candidate.lastName?.trim());
  const contact = Boolean(
    candidate.email?.trim() &&
      (candidate.phone?.trim() || (candidate.city?.trim() && candidate.state?.trim())),
  );
  const resume = input.hasActiveResume;
  const summary = Boolean(candidate.professionalSummary?.trim());
  const experience = input.experience.length > 0;
  const education = input.education.length > 0;
  const skills = input.skills.length > 0;

  const checks = [identity, contact, resume, summary, experience, education, skills];
  const completedCount = checks.filter(Boolean).length;
  const totalCount = checks.length;

  return {
    identity,
    contact,
    resume,
    summary,
    experience,
    education,
    skills,
    completedCount,
    totalCount,
    percent: Math.round((completedCount / totalCount) * 100),
  };
}
