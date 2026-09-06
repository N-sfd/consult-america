"use server";

import { revalidatePath } from "next/cache";

import { provisionCandidatePortalAccount } from "@/lib/candidate/provisioning";
import { recruitingRepository } from "@/lib/recruiting";
import { canTransitionOffer } from "@/lib/recruiting/status-machine";
import type {
  CandidateProfileDetail,
  CreateJobRequisitionInput,
  SubmitApplicationResult,
} from "@/lib/recruiting/repository";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type { ApplicationStatus, Interview, Offer } from "@/types/recruiting";

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
  /** Existing candidate document to attach (portal resume reuse). */
  resumeDocumentId?: string;
  coverLetter?: string;
  additionalInformation?: string;
};

/** Public "Apply" flow: creates (or matches) the candidate and files a real application. */
export async function submitJobApplication(
  input: SubmitJobApplicationInput,
  resumeFormData?: FormData | null,
): Promise<SubmitApplicationResult> {
  const additionalInformation = [
    input.location ? `Location: ${input.location}` : null,
    input.currentTitle ? `Current Title: ${input.currentTitle}` : null,
    input.yearsOfExperience
      ? `Years of Experience: ${input.yearsOfExperience}`
      : null,
    input.resumeFileName && !input.resumeDocumentId && !resumeFormData?.get("resume")
      ? `Resume: ${input.resumeFileName}`
      : null,
    input.additionalInformation,
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await recruitingRepository.submitApplication({
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

  await provisionCandidatePortalAccount({
    candidateId: result.candidateId,
    email: input.email,
    displayName: `${input.firstName} ${input.lastName}`,
  });

  const {
    linkExistingDocumentToApplication,
    persistResumeForApplication,
  } = await import("@/app/actions/candidate-document-actions");

  try {
    if (input.resumeDocumentId) {
      await linkExistingDocumentToApplication({
        candidateId: result.candidateId,
        applicationId: result.applicationId,
        documentId: input.resumeDocumentId,
      });
    } else {
      const resumeFile = resumeFormData?.get("resume");
      if (resumeFile instanceof File && resumeFile.size > 0) {
        const setAsPrimary = resumeFormData?.get("setAsPrimary") !== "0";
        const bytes = await resumeFile.arrayBuffer();
        await persistResumeForApplication({
          candidateId: result.candidateId,
          applicationId: result.applicationId,
          fileName: resumeFile.name,
          mimeType: resumeFile.type || "application/octet-stream",
          fileSize: resumeFile.size,
          bytes,
          setAsPrimary,
        });
      }
    }
  } catch (error) {
    console.error("Application resume persistence failed:", error);
  }

  return result;
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
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await recruitingRepository.updateApplicationStage(applicationId, status);
    revalidatePath(`/app/recruiting/jobs/${requisitionId}/pipeline`);
    revalidatePath(`/app/recruiting/jobs/${requisitionId}`);
    revalidatePath("/app/recruiting/candidates");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to move stage",
    };
  }
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

/** ATS pipeline "Create Offer" — draft offer; use sendOffer to extend to candidate. */
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

/** Approve (if needed) and send offer to the candidate (→ EXTENDED). */
export async function sendOffer(
  applicationId: string,
  requisitionId: string,
): Promise<OfferActionResult> {
  const offer = await recruitingRepository.getOfferByApplicationId(applicationId);
  if (!offer) return { ok: false, error: "Offer not found" };

  if (offer.status === "EXTENDED") {
    return { ok: true, offer };
  }

  if (!canTransitionOffer(offer.status, "EXTENDED")) {
    return {
      ok: false,
      error: `Offer cannot be sent from ${offer.status}`,
    };
  }

  const updated = await recruitingRepository.updateOfferStatus(
    offer.id,
    "EXTENDED",
  );
  revalidatePath(`/app/recruiting/jobs/${requisitionId}/pipeline`);
  revalidatePath("/candidate");
  revalidatePath(`/candidate/applications/${applicationId}`);
  return updated
    ? { ok: true, offer: updated }
    : { ok: false, error: "Offer not found" };
}

/** ATS pipeline "Accept Offer" — recruiter-assisted accept (candidate portal has its own action). */
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
  revalidatePath("/candidate");
  return updated
    ? { ok: true, offer: updated }
    : { ok: false, error: "Offer not found" };
}

/** Candidate accepts their own extended offer. */
export async function candidateAcceptOffer(
  applicationId: string,
): Promise<OfferActionResult> {
  const { requireCandidateActor, assertCandidateSelfAccess } = await import(
    "@/lib/candidate/security"
  );
  const actor = await requireCandidateActor();
  const application = await recruitingRepository.getApplicationById(applicationId);
  if (!application) return { ok: false, error: "Application not found" };
  assertCandidateSelfAccess(actor.session.candidateId, application.candidateId);

  const offer = await recruitingRepository.getOfferByApplicationId(applicationId);
  if (!offer) return { ok: false, error: "No offer available" };
  if (!canTransitionOffer(offer.status, "ACCEPTED")) {
    return { ok: false, error: `Offer cannot be accepted from ${offer.status}` };
  }

  const updated = await recruitingRepository.updateOfferStatus(offer.id, "ACCEPTED");
  revalidatePath(`/candidate/applications/${applicationId}`);
  revalidatePath("/candidate");
  revalidatePath(`/app/recruiting/jobs/${application.requisitionId}/pipeline`);
  return updated
    ? { ok: true, offer: updated }
    : { ok: false, error: "Unable to accept offer" };
}

/** Candidate declines their own extended offer. */
export async function candidateDeclineOffer(
  applicationId: string,
): Promise<OfferActionResult> {
  const { requireCandidateActor, assertCandidateSelfAccess } = await import(
    "@/lib/candidate/security"
  );
  const actor = await requireCandidateActor();
  const application = await recruitingRepository.getApplicationById(applicationId);
  if (!application) return { ok: false, error: "Application not found" };
  assertCandidateSelfAccess(actor.session.candidateId, application.candidateId);

  const offer = await recruitingRepository.getOfferByApplicationId(applicationId);
  if (!offer) return { ok: false, error: "No offer available" };
  if (!canTransitionOffer(offer.status, "DECLINED")) {
    return { ok: false, error: `Offer cannot be declined from ${offer.status}` };
  }

  const updated = await recruitingRepository.updateOfferStatus(offer.id, "DECLINED");
  revalidatePath(`/candidate/applications/${applicationId}`);
  revalidatePath("/candidate");
  revalidatePath(`/app/recruiting/jobs/${application.requisitionId}/pipeline`);
  return updated
    ? { ok: true, offer: updated }
    : { ok: false, error: "Unable to decline offer" };
}

export type ScheduleInterviewInput = {
  applicationId: string;
  requisitionId: string;
  interviewType: Interview["interviewType"];
  scheduledAt: string;
  durationMinutes: number;
  locationOrLink?: string;
};

export type ScheduleInterviewResult =
  | { ok: true; interviewId: string }
  | { ok: false; error: string };

/** Recruiter schedules an interview for an application. */
export async function scheduleInterview(
  input: ScheduleInterviewInput,
): Promise<ScheduleInterviewResult> {
  try {
    const { getSupabaseServiceClient, isSupabaseConfigured } = await import(
      "@/app/lib/supabase/server"
    );
    if (!isSupabaseConfigured()) {
      return { ok: false, error: "Interview scheduling requires Supabase." };
    }
    const client = getSupabaseServiceClient();
    if (!client) return { ok: false, error: "Supabase is not configured" };

    const application = await recruitingRepository.getApplicationById(
      input.applicationId,
    );
    if (!application) return { ok: false, error: "Application not found" };

    const now = new Date().toISOString();
    const interviewId = `int-${crypto.randomUUID()}`;

    const { error } = await client.from("interviews").insert({
      id: interviewId,
      application_id: input.applicationId,
      interview_type: input.interviewType,
      status: "SCHEDULED",
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes,
      location_or_link: input.locationOrLink ?? null,
      created_at: now,
      updated_at: now,
    });
    if (error) return { ok: false, error: error.message };

    await client.from("recruiting_activities").insert({
      id: `act-${crypto.randomUUID()}`,
      candidate_id: application.candidateId,
      application_id: input.applicationId,
      requisition_id: application.requisitionId,
      activity_type: "INTERVIEW_SCHEDULED",
      summary: `Interview scheduled (${input.interviewType})`,
      created_at: now,
    });

    // Advance to INTERVIEW when possible.
    try {
      await recruitingRepository.updateApplicationStage(
        input.applicationId,
        "INTERVIEW",
      );
    } catch {
      // Already past INTERVIEW or invalid — keep scheduled interview.
    }

    revalidatePath(`/app/recruiting/jobs/${input.requisitionId}/pipeline`);
    revalidatePath(`/app/recruiting/candidates/${application.candidateId}`);
    revalidatePath("/candidate/interviews");
    revalidatePath(`/candidate/applications/${input.applicationId}`);
    return { ok: true, interviewId };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to schedule interview",
    };
  }
}

export type UpdateInterviewStatusResult =
  | { ok: true }
  | { ok: false; error: string };

/** Recruiter/manager marks interview completed, cancelled, or no-show. */
export async function updateInterviewStatus(input: {
  interviewId: string;
  applicationId: string;
  requisitionId: string;
  status: Interview["status"];
}): Promise<UpdateInterviewStatusResult> {
  try {
    const { getSupabaseServiceClient, isSupabaseConfigured } = await import(
      "@/app/lib/supabase/server"
    );
    if (!isSupabaseConfigured()) {
      return { ok: false, error: "Interview updates require Supabase." };
    }
    const client = getSupabaseServiceClient();
    if (!client) return { ok: false, error: "Supabase is not configured" };

    const application = await recruitingRepository.getApplicationById(
      input.applicationId,
    );
    if (!application) return { ok: false, error: "Application not found" };

    const now = new Date().toISOString();
    const { error } = await client
      .from("interviews")
      .update({ status: input.status, updated_at: now })
      .eq("id", input.interviewId);
    if (error) return { ok: false, error: error.message };

    await client.from("recruiting_activities").insert({
      id: `act-${crypto.randomUUID()}`,
      candidate_id: application.candidateId,
      application_id: input.applicationId,
      requisition_id: application.requisitionId,
      activity_type: "INTERVIEW_STATUS_CHANGED",
      summary: `Interview marked ${input.status}`,
      created_at: now,
    });

    revalidatePath(`/app/recruiting/jobs/${input.requisitionId}/pipeline`);
    revalidatePath(`/app/recruiting/candidates/${application.candidateId}`);
    revalidatePath("/candidate/interviews");
    revalidatePath(`/candidate/applications/${input.applicationId}`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to update interview",
    };
  }
}

/** Submit internal interview feedback (never exposed to candidates). */
export async function submitInterviewFeedback(input: {
  interviewId: string;
  applicationId: string;
  candidateId: string;
  recommendation: "STRONG_YES" | "YES" | "NEUTRAL" | "NO" | "STRONG_NO";
  score?: number;
  notes?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { getSupabaseServiceClient, isSupabaseConfigured } = await import(
      "@/app/lib/supabase/server"
    );
    if (!isSupabaseConfigured()) {
      return { ok: false, error: "Feedback requires Supabase." };
    }
    const client = getSupabaseServiceClient();
    if (!client) return { ok: false, error: "Supabase is not configured" };

    const now = new Date().toISOString();
    const panelMemberId = `ipm-${crypto.randomUUID()}`;
    const feedbackId = `ifb-${crypto.randomUUID()}`;

    const { error: panelError } = await client
      .from("interview_panel_members")
      .insert({
        id: panelMemberId,
        interview_id: input.interviewId,
        user_id: "system-recruiter",
        role: "INTERVIEWER",
      });
    if (panelError) return { ok: false, error: panelError.message };

    const { error: feedbackError } = await client
      .from("interview_feedback")
      .insert({
        id: feedbackId,
        interview_id: input.interviewId,
        panel_member_id: panelMemberId,
        recommendation: input.recommendation,
        score: input.score ?? null,
        notes: input.notes ?? null,
        submitted_at: now,
      });
    if (feedbackError) return { ok: false, error: feedbackError.message };

    await client.from("recruiting_activities").insert({
      id: `act-${crypto.randomUUID()}`,
      candidate_id: input.candidateId,
      application_id: input.applicationId,
      activity_type: "INTERVIEW_FEEDBACK",
      summary: `Interview feedback submitted (${input.recommendation})`,
      created_at: now,
    });

    revalidatePath(`/app/recruiting/candidates/${input.candidateId}`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to submit feedback",
    };
  }
}

function computeExperienceYears(
  experience: CandidateProfileDetail["experience"],
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
