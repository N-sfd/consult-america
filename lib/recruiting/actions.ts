"use server";

import { revalidatePath } from "next/cache";

import { recruitingRepository } from "@/lib/recruiting";
import type {
  CandidateProfile,
  CreateJobRequisitionInput,
  SubmitApplicationResult,
} from "@/lib/recruiting/repository";
import type { ApplicationStatus } from "@/types/recruiting";

/** ATS "Create Job" form submission (Save Draft or Publish Job). */
export async function createJob(
  input: CreateJobRequisitionInput,
): Promise<{ requisitionId: string; postingSlug?: string }> {
  return recruitingRepository.createJobRequisition(input);
}

export type SubmitJobApplicationInput = {
  requisitionId: string;
  postingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: "yes" | "no" | "maybe";
  coverLetter?: string;
  additionalInformation?: string;
};

/** Public "Apply" flow: creates (or matches) the candidate and files a real application. */
export async function submitJobApplication(
  input: SubmitJobApplicationInput,
): Promise<SubmitApplicationResult> {
  const additionalInformation = [
    input.location ? `Location: ${input.location}` : null,
    input.additionalInformation,
  ]
    .filter(Boolean)
    .join("\n\n");

  return recruitingRepository.submitApplication({
    requisitionId: input.requisitionId,
    postingId: input.postingId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    linkedinUrl: input.linkedinUrl,
    portfolioUrl: input.portfolioUrl,
    workAuthorization: input.workAuthorization,
    willingToRelocate: input.willingToRelocate === "yes",
    coverLetter: input.coverLetter,
    additionalInformation: additionalInformation || undefined,
    source: "Careers Site",
  });
}

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

/** ATS pipeline "Move to Stage" action. */
export async function moveApplicationStage(
  applicationId: string,
  status: ApplicationStatus,
  requisitionId: string,
): Promise<void> {
  await recruitingRepository.updateApplicationStage(applicationId, status);
  revalidatePath(`/app/recruiting/jobs/${requisitionId}/pipeline`);
  revalidatePath(`/app/recruiting/jobs/${requisitionId}`);
  revalidatePath("/app/recruiting/candidates");
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
