"use server";

import { revalidatePath } from "next/cache";

import {
  requireCandidateActor,
  toCandidateActionErrorMessage,
} from "@/lib/candidate/security";
import { analyzeJobMatch } from "@/lib/candidate/job-match";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { recruitingRepository } from "@/lib/recruiting";

export type CandidateActionResult = {
  ok: boolean;
  message: string;
  analysisId?: string;
};

export async function updateCandidateContactInfoAction(input: {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  phone?: string;
  city?: string;
  state?: string;
  professionalSummary?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: boolean;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();

    await recruitingRepository.updateCandidateContactInfo(session.candidateId, input);

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Profile updated." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to update profile."),
    };
  }
}

export async function saveCandidateExperienceAction(input: {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const company = input.company.trim();
    const title = input.title.trim();
    if (!company || !title || !input.startDate) {
      throw new Error("Company, title, and start date are required");
    }

    const { error } = await client.from("experiences").insert({
      id: `exp-${crypto.randomUUID()}`,
      candidate_id: session.candidateId,
      company,
      title,
      location: input.location?.trim() || null,
      start_date: input.startDate,
      end_date: input.isCurrent ? null : input.endDate || null,
      is_current: Boolean(input.isCurrent),
      description: input.description?.trim() || null,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Experience added." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to save experience."),
    };
  }
}

export async function updateCandidateExperienceAction(input: {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const company = input.company.trim();
    const title = input.title.trim();
    if (!company || !title || !input.startDate) {
      throw new Error("Company, title, and start date are required");
    }

    const { data, error } = await client
      .from("experiences")
      .update({
        company,
        title,
        location: input.location?.trim() || null,
        start_date: input.startDate,
        end_date: input.isCurrent ? null : input.endDate || null,
        is_current: Boolean(input.isCurrent),
        description: input.description?.trim() || null,
      })
      .eq("id", input.id)
      .eq("candidate_id", session.candidateId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error("Experience not found");
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Experience updated." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to update experience."),
    };
  }
}

export async function deleteCandidateExperienceAction(
  id: string,
): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const { data, error } = await client
      .from("experiences")
      .delete()
      .eq("id", id)
      .eq("candidate_id", session.candidateId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error("Experience not found");
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Experience removed." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to remove experience."),
    };
  }
}

export async function saveCandidateEducationAction(input: {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const institution = input.institution.trim();
    if (!institution) throw new Error("School is required");

    const { error } = await client.from("education").insert({
      id: `edu-${crypto.randomUUID()}`,
      candidate_id: session.candidateId,
      institution,
      degree: input.degree?.trim() || null,
      field_of_study: input.fieldOfStudy?.trim() || null,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Education added." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to save education."),
    };
  }
}

export async function updateCandidateEducationAction(input: {
  id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const institution = input.institution.trim();
    if (!institution) throw new Error("School is required");

    const { data, error } = await client
      .from("education")
      .update({
        institution,
        degree: input.degree?.trim() || null,
        field_of_study: input.fieldOfStudy?.trim() || null,
        start_date: input.startDate || null,
        end_date: input.endDate || null,
      })
      .eq("id", input.id)
      .eq("candidate_id", session.candidateId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error("Education not found");
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Education updated." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to update education."),
    };
  }
}

export async function deleteCandidateEducationAction(
  id: string,
): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const { data, error } = await client
      .from("education")
      .delete()
      .eq("id", id)
      .eq("candidate_id", session.candidateId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error("Education not found");
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Education removed." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to remove education."),
    };
  }
}

export async function saveCandidateSkillsAction(input: {
  skillsCsv: string;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const names = input.skillsCsv
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) throw new Error("Enter at least one skill");

    for (const name of names) {
      const { data: existing } = await client
        .from("skills")
        .select("id")
        .ilike("name", name)
        .maybeSingle();

      let skillId = existing?.id as string | undefined;
      if (!skillId) {
        skillId = `skill-${crypto.randomUUID()}`;
        const { error } = await client.from("skills").insert({
          id: skillId,
          name,
        });
        if (error && !error.message.toLowerCase().includes("duplicate")) {
          throw new Error(error.message);
        }
        if (error) {
          const { data: again } = await client
            .from("skills")
            .select("id")
            .ilike("name", name)
            .maybeSingle();
          skillId = again?.id as string;
        }
      }

      if (!skillId) continue;

      await client.from("candidate_skills").upsert(
        {
          id: `csk-${crypto.randomUUID()}`,
          candidate_id: session.candidateId,
          skill_id: skillId,
        },
        { onConflict: "candidate_id,skill_id", ignoreDuplicates: true },
      );
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Skills saved." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to save skills."),
    };
  }
}

export async function deleteCandidateSkillAction(
  candidateSkillId: string,
): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

    const { data, error } = await client
      .from("candidate_skills")
      .delete()
      .eq("id", candidateSkillId)
      .eq("candidate_id", session.candidateId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error("Skill not found");
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    revalidatePath(`/app/recruiting/candidates/${session.candidateId}`);
    return { ok: true, message: "Skill removed." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to remove skill."),
    };
  }
}

export async function runJobMatchAction(input: {
  documentId?: string;
  jobRequisitionId?: string;
  jobDescription?: string;
}): Promise<CandidateActionResult & { result?: ReturnType<typeof analyzeJobMatch> }> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();

    const profile = await recruitingRepository.getCandidateProfile(session.candidateId);
    if (!profile) throw new Error("Candidate profile not found");

    let documentId = input.documentId;
    if (!documentId) {
      const primary = profile.documents.find(
        (doc) =>
          doc.documentType === "RESUME" &&
          (doc.isPrimaryResume || doc.status === "ACTIVE" || !doc.status),
      );
      documentId = primary?.id;
    }

    const resumeDoc = documentId
      ? profile.documents.find((doc) => doc.id === documentId)
      : undefined;

    let jobDescription = input.jobDescription?.trim() ?? "";
    let jobTitle: string | undefined;
    const jobRequisitionId = input.jobRequisitionId || null;

    if (jobRequisitionId) {
      if (client) {
        const { data: req } = await client
          .from("job_requisitions")
          .select("id, title, description, responsibilities, qualifications")
          .eq("id", jobRequisitionId)
          .maybeSingle();
        if (!req) throw new Error("Job not found");
        jobTitle = req.title as string;
        jobDescription = [
          req.title,
          req.description,
          Array.isArray(req.responsibilities) ? req.responsibilities.join("\n") : "",
          Array.isArray(req.qualifications) ? req.qualifications.join("\n") : "",
        ]
          .filter(Boolean)
          .join("\n");
      } else {
        const req = await recruitingRepository.getRequisitionById(jobRequisitionId);
        if (!req) throw new Error("Job not found");
        jobTitle = req.title;
        jobDescription = [
          req.title,
          req.description,
          req.responsibilities.join("\n"),
          req.qualifications.join("\n"),
        ]
          .filter(Boolean)
          .join("\n");
      }
    }

    if (!jobDescription) {
      throw new Error("Select a published job or paste a job description");
    }

    const resumeText = [
      profile.candidate.professionalSummary ?? "",
      ...profile.experience.map(
        (item) => `${item.title} ${item.company} ${item.description ?? ""}`,
      ),
      ...profile.education.map(
        (item) => `${item.institution} ${item.degree ?? ""} ${item.fieldOfStudy ?? ""}`,
      ),
      ...profile.skills.map((item) => item.skill),
      resumeDoc?.fileName ?? "",
    ].join("\n");

    if (!resumeText.trim()) {
      throw new Error("Add personal information or upload a resume before running Job Match");
    }

    const result = analyzeJobMatch({
      resumeText,
      candidateSkills: profile.skills.map((item) => item.skill),
      jobTitle,
      jobDescription,
    });

    const analysisId = `jma-${crypto.randomUUID()}`;

    if (client) {
      const { error } = await client.from("job_match_analyses").insert({
        id: analysisId,
        candidate_id: session.candidateId,
        document_id: documentId ?? null,
        job_requisition_id: jobRequisitionId,
        job_description_snapshot: jobDescription.slice(0, 20000),
        result_json: result,
      });
      if (error) throw new Error(error.message);
    } else {
      const { saveJobMatchAnalysis } = await import("@/lib/candidate/job-analyzer-store");
      saveJobMatchAnalysis({
        id: analysisId,
        candidateId: session.candidateId,
        documentId: documentId ?? undefined,
        jobRequisitionId: jobRequisitionId ?? undefined,
        jobTitle,
        jobDescriptionSnapshot: jobDescription.slice(0, 20000),
        result,
      });
    }

    revalidatePath("/candidate/job-match");
    revalidatePath("/candidate/jobs");
    if (jobRequisitionId) {
      revalidatePath(`/candidate/jobs`);
    }
    return {
      ok: true,
      message: "Analysis saved. This score is for your guidance only.",
      analysisId,
      result,
    };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to run Job Match."),
    };
  }
}

export async function toggleSavedJobAction(input: {
  jobRequisitionId: string;
}): Promise<CandidateActionResult & { saved?: boolean }> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    const jobRequisitionId = input.jobRequisitionId;

    if (client) {
      const { data: existing } = await client
        .from("candidate_saved_jobs")
        .select("id")
        .eq("candidate_id", session.candidateId)
        .eq("job_requisition_id", jobRequisitionId)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await client
          .from("candidate_saved_jobs")
          .delete()
          .eq("id", existing.id);
        if (error) throw new Error(error.message);
        revalidatePath("/candidate/jobs");
        revalidatePath("/candidate/saved-jobs");
        revalidatePath("/candidate/job-match");
        return { ok: true, message: "Removed from saved jobs.", saved: false };
      }

      const { error } = await client.from("candidate_saved_jobs").insert({
        id: `save-${crypto.randomUUID()}`,
        candidate_id: session.candidateId,
        job_requisition_id: jobRequisitionId,
      });
      if (error) throw new Error(error.message);
      revalidatePath("/candidate/jobs");
      revalidatePath("/candidate/saved-jobs");
      revalidatePath("/candidate/job-match");
      return { ok: true, message: "Job saved.", saved: true };
    }

    const { toggleSavedJob } = await import("@/lib/candidate/job-analyzer-store");
    const { saved } = toggleSavedJob(session.candidateId, jobRequisitionId);
    revalidatePath("/candidate/jobs");
    revalidatePath("/candidate/saved-jobs");
    revalidatePath("/candidate/job-match");
    return {
      ok: true,
      message: saved ? "Job saved." : "Removed from saved jobs.",
      saved,
    };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to update saved jobs."),
    };
  }
}

export async function generateProposalDraftAction(input: {
  jobRequisitionId?: string;
  jobTitle?: string;
  jobSummary?: string;
  location?: string;
  matchScore?: number;
  skillsFound?: string[];
  skillsMissing?: string[];
}): Promise<
  CandidateActionResult & { draftId?: string; body?: string; jobTitle?: string }
> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    const profile = await recruitingRepository.getCandidateProfile(session.candidateId);
    if (!profile) throw new Error("Candidate profile not found");

    let jobTitle = input.jobTitle?.trim() ?? "";
    let jobSummary = input.jobSummary?.trim() ?? "";
    let location = input.location?.trim() ?? "";
    const jobRequisitionId = input.jobRequisitionId || undefined;

    if (jobRequisitionId) {
      const posting = (await recruitingRepository.listPublishedPostings()).find(
        (job) => job.requisitionId === jobRequisitionId,
      );
      const req = await recruitingRepository.getRequisitionById(jobRequisitionId);
      jobTitle = jobTitle || posting?.title || req?.title || "Open role";
      jobSummary = jobSummary || posting?.summary || req?.description || "";
      location = location || posting?.locationName || "";
    }

    if (!jobTitle) throw new Error("Select a job before generating a proposal");

    const { generateProposalDraft } = await import("@/lib/candidate/proposal");
    const { analyzeJobMatch } = await import("@/lib/candidate/job-match");

    const resumeText = [
      profile.candidate.professionalSummary ?? "",
      ...profile.experience.map(
        (item) => `${item.title} ${item.company} ${item.description ?? ""}`,
      ),
      ...profile.skills.map((item) => item.skill),
    ].join("\n");

    const match =
      input.skillsFound || input.skillsMissing
        ? {
            overallMatch: input.matchScore ?? 50,
            skillsFound: input.skillsFound ?? [],
            skillsMissing: input.skillsMissing ?? [],
            experienceAlignment: "",
            keywordsToConsider: input.skillsMissing ?? [],
            suggestions: [],
          }
        : analyzeJobMatch({
            resumeText,
            candidateSkills: profile.skills.map((item) => item.skill),
            jobTitle,
            jobDescription: [jobTitle, jobSummary].join("\n"),
          });

    const body = generateProposalDraft({
      candidateFirstName: profile.candidate.firstName,
      candidateLastName: profile.candidate.lastName,
      professionalSummary: profile.candidate.professionalSummary,
      skills: profile.skills.map((item) => item.skill),
      jobTitle,
      jobSummary,
      location,
      match,
    });

    const draftId = `prop-${crypto.randomUUID()}`;

    if (client) {
      const { error } = await client.from("candidate_proposal_drafts").insert({
        id: draftId,
        candidate_id: session.candidateId,
        job_requisition_id: jobRequisitionId ?? null,
        job_title: jobTitle,
        body,
        match_score: match.overallMatch,
      });
      if (error) throw new Error(error.message);
    } else {
      const { saveProposalDraft } = await import("@/lib/candidate/job-analyzer-store");
      saveProposalDraft({
        id: draftId,
        candidateId: session.candidateId,
        jobRequisitionId,
        jobTitle,
        body,
        matchScore: match.overallMatch,
      });
    }

    if (jobRequisitionId) {
      // Auto-save the role when a proposal is generated.
      if (client) {
        const { data: existing } = await client
          .from("candidate_saved_jobs")
          .select("id")
          .eq("candidate_id", session.candidateId)
          .eq("job_requisition_id", jobRequisitionId)
          .maybeSingle();
        if (!existing) {
          await client.from("candidate_saved_jobs").insert({
            id: `save-${crypto.randomUUID()}`,
            candidate_id: session.candidateId,
            job_requisition_id: jobRequisitionId,
          });
        }
      } else {
        const { isJobSaved, toggleSavedJob } = await import(
          "@/lib/candidate/job-analyzer-store"
        );
        if (!isJobSaved(session.candidateId, jobRequisitionId)) {
          toggleSavedJob(session.candidateId, jobRequisitionId);
        }
      }
    }

    revalidatePath("/candidate/job-match");
    revalidatePath("/candidate/saved-jobs");
    revalidatePath("/candidate/jobs");
    return {
      ok: true,
      message: "Proposal draft created and job saved automatically.",
      draftId,
      body,
      jobTitle,
    };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to generate proposal."),
    };
  }
}
