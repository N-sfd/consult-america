"use server";

import { revalidatePath } from "next/cache";

import { recruitingRepository } from "@/lib/recruiting";
import { canTransitionOffer } from "@/lib/recruiting/status-machine";
import type {
  CandidateProfile,
  CreateJobRequisitionInput,
  SubmitApplicationResult,
} from "@/lib/recruiting/repository";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type { ApplicationStatus, Offer } from "@/types/recruiting";

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
  currentTitle?: string;
  yearsOfExperience?: string;
  workAuthorization?: string;
  willingToRelocate?: "yes" | "no" | "maybe";
  resumeFileName?: string;
  coverLetter?: string;
  additionalInformation?: string;
};

/** Public "Apply" flow: creates (or matches) the candidate and files a real application. */
export async function submitJobApplication(
  input: SubmitJobApplicationInput,
): Promise<SubmitApplicationResult> {
  const additionalInformation = [
    input.location ? `Location: ${input.location}` : null,
    input.currentTitle ? `Current Title: ${input.currentTitle}` : null,
    input.yearsOfExperience
      ? `Years of Experience: ${input.yearsOfExperience}`
      : null,
    input.resumeFileName ? `Resume: ${input.resumeFileName}` : null,
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

export type ExtendOfferInput = {
  applicationId: string;
  requisitionId: string;
  baseSalary?: number;
  hourlyRate?: number;
  startDate: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
};

export type OfferActionResult =
  | { ok: true; offer: Offer }
  | { ok: false; error: string };

/** ATS pipeline "Extend Offer" action — creates a real Offer row (status EXTENDED). */
export async function extendOffer(
  input: ExtendOfferInput,
): Promise<OfferActionResult> {
  if (!input.baseSalary && !input.hourlyRate) {
    return { ok: false, error: "Enter a base salary or hourly rate" };
  }

  const offer = await recruitingRepository.createOffer({
    applicationId: input.applicationId,
    baseSalary: input.baseSalary,
    hourlyRate: input.hourlyRate,
    startDate: input.startDate,
    employmentType: input.employmentType,
    workplaceType: input.workplaceType,
  });

  revalidatePath(`/app/recruiting/jobs/${input.requisitionId}/pipeline`);
  return { ok: true, offer };
}

/** ATS pipeline "Accept Offer" action — simulates the candidate accepting (no candidate portal yet). */
export async function acceptOffer(
  applicationId: string,
  requisitionId: string,
): Promise<OfferActionResult> {
  const offer = await recruitingRepository.getOfferByApplicationId(applicationId);
  if (!offer) return { ok: false, error: "Offer not found" };

  if (!canTransitionOffer(offer.status, "ACCEPTED")) {
    return { ok: false, error: `Offer cannot move from ${offer.status} to ACCEPTED` };
  }

  const updated = await recruitingRepository.updateOfferStatus(offer.id, "ACCEPTED");
  revalidatePath(`/app/recruiting/jobs/${requisitionId}/pipeline`);
  return updated
    ? { ok: true, offer: updated }
    : { ok: false, error: "Offer not found" };
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
