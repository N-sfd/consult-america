"use server";

import { recruitingRepository } from "@/lib/recruiting";
import type { CandidateProfile } from "@/lib/recruiting/repository";

export type CandidateDrawerData = {
  candidateId: string;
  experienceYears: number | null;
  skills: string[];
};

/**
 * Powers the candidates-list quick drawer: just enough derived detail
 * (years of experience, skills) to avoid a full navigation, fetched lazily
 * on row click rather than joined into the list query.
 */
export async function getCandidateDrawerData(
  candidateId: string,
): Promise<CandidateDrawerData | null> {
  const profile = await recruitingRepository.getCandidateProfile(candidateId);
  if (!profile) return null;

  return {
    candidateId,
    experienceYears: computeExperienceYears(profile.experience),
    skills: profile.skills.map((skill) => skill.skill),
  };
}

function computeExperienceYears(
  experience: CandidateProfile["experience"],
): number | null {
  if (experience.length === 0) return null;

  const now = Date.now();
  const totalMonths = experience.reduce((sum, job) => {
    const start = new Date(job.startDate).getTime();
    const end =
      job.isCurrent || !job.endDate ? now : new Date(job.endDate).getTime();
    const months = Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 30));
    return sum + months;
  }, 0);

  return Math.round(totalMonths / 12);
}
