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

export async function runJobMatchAction(input: {
  documentId?: string;
  jobRequisitionId?: string;
  jobDescription?: string;
}): Promise<CandidateActionResult & { result?: ReturnType<typeof analyzeJobMatch> }> {
  try {
    const { session } = await requireCandidateActor();
    const client = getSupabaseServiceClient();
    if (!client) throw new Error("Supabase is not configured");

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

    const resumeDoc = profile.documents.find((doc) => doc.id === documentId);
    if (!resumeDoc) throw new Error("Select a resume version for Job Match");

    let jobDescription = input.jobDescription?.trim() ?? "";
    let jobTitle: string | undefined;
    let jobRequisitionId = input.jobRequisitionId || null;

    if (jobRequisitionId) {
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
      resumeDoc.fileName,
    ].join("\n");

    const result = analyzeJobMatch({
      resumeText,
      candidateSkills: profile.skills.map((item) => item.skill),
      jobTitle,
      jobDescription,
    });

    const analysisId = `jma-${crypto.randomUUID()}`;
    const { error } = await client.from("job_match_analyses").insert({
      id: analysisId,
      candidate_id: session.candidateId,
      document_id: documentId,
      job_requisition_id: jobRequisitionId,
      job_description_snapshot: jobDescription.slice(0, 20000),
      result_json: result,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/candidate/job-match");
    return {
      ok: true,
      message: "Job Match complete. This score is for your guidance only.",
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
