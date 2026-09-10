"use server";

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { getWorkforceSession } from "@/lib/workforce/session";
import { recruitingRepository } from "@/lib/recruiting";
import { analyzeJobMatch, type JobMatchResult } from "@/lib/recruiting/candidate-match";
import { extractJobDescriptionText } from "@/lib/recruiting/jd-extraction";
import { writeAuditEvent } from "@/lib/audit/audit-log";
import type { ApplicationStatus } from "@/types/recruiting";

export type CandidateMatchResultRow = {
  candidateId: string;
  candidateName: string;
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
  resumeDocumentId?: string;
  resumeFileName?: string;
  result: JobMatchResult;
};

export type RunCandidateMatchInput =
  | { mode: "existing"; requisitionId: string }
  | { mode: "text"; jobTitle?: string; jobDescription: string };

export type RunCandidateMatchResult =
  | { ok: true; jobTitle: string; runId: string; candidates: CandidateMatchResultRow[] }
  | { ok: false; error: string };

/**
 * Resolves which candidates the current recruiting actor may see for an
 * ad-hoc (pasted/uploaded) JD: recruiters/HR/system admins see everyone;
 * hiring managers are scoped to candidates who applied to a requisition
 * where they are the assigned hiring manager.
 */
async function authorizedCandidateIdsForTextMode(): Promise<string[] | "ALL"> {
  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser) return "ALL"; // demo / unauthenticated-Supabase mode

  const isBroadStaff =
    platformUser.roles.includes("RECRUITER") ||
    platformUser.roles.includes("HR_ADMIN") ||
    platformUser.roles.includes("HR_SPECIALIST") ||
    platformUser.roles.includes("SYSTEM_ADMIN");
  if (isBroadStaff) return "ALL";

  if (!platformUser.roles.includes("HIRING_MANAGER")) return [];

  const client = getSupabaseServiceClient();
  if (!client) return "ALL";

  const { data: requisitions } = await client
    .from("job_requisitions")
    .select("id")
    .eq("hiring_manager_user_id", platformUser.userId);
  const requisitionIds = (requisitions ?? []).map((r) => r.id as string);
  if (requisitionIds.length === 0) return [];

  const { data: applications } = await client
    .from("applications")
    .select("candidate_id")
    .in("requisition_id", requisitionIds);

  return [...new Set((applications ?? []).map((a) => a.candidate_id as string))];
}

function buildCandidateCorpusText(profile: Awaited<ReturnType<typeof recruitingRepository.getCandidateProfile>>) {
  if (!profile) return "";
  return [
    profile.candidate.professionalSummary ?? "",
    ...profile.experience.map((item) => `${item.title} ${item.company} ${item.description ?? ""}`),
    ...profile.education.map(
      (item) => `${item.institution} ${item.degree ?? ""} ${item.fieldOfStudy ?? ""}`,
    ),
    ...profile.skills.map((item) => item.skill),
  ].join("\n");
}

export async function runCandidateMatch(
  input: RunCandidateMatchInput,
): Promise<RunCandidateMatchResult> {
  try {
    const session = await getWorkforceSession(); // gates to ADMIN/RECRUITER/HR/HIRING_MANAGER

    let jobTitle: string;
    let jobDescription: string;
    let requisitionId: string | undefined;
    let candidateIds: string[];

    if (input.mode === "existing") {
      const requisition = await recruitingRepository.getRequisitionById(input.requisitionId);
      if (!requisition) return { ok: false, error: "Job not found." };

      requisitionId = requisition.id;
      jobTitle = requisition.title;
      jobDescription = [
        requisition.description,
        ...requisition.responsibilities,
        ...requisition.qualifications,
        ...requisition.preferredQualifications,
      ].join("\n");

      const applications = await recruitingRepository.listApplicationsByRequisition(requisition.id);
      candidateIds = [...new Set(applications.map((a) => a.candidateId))];
    } else {
      if (!input.jobDescription.trim()) {
        return { ok: false, error: "Enter or upload a job description to analyze." };
      }
      jobTitle = input.jobTitle?.trim() || "Untitled Role";
      jobDescription = input.jobDescription;

      const authorized = await authorizedCandidateIdsForTextMode();
      if (authorized === "ALL") {
        const summaries = await recruitingRepository.listCandidateSummaries();
        candidateIds = summaries.map((s) => s.candidateId);
      } else {
        candidateIds = authorized;
      }
    }

    if (candidateIds.length === 0) {
      return { ok: true, jobTitle, runId: `run-${crypto.randomUUID()}`, candidates: [] };
    }

    const runId = `run-${crypto.randomUUID()}`;
    const client = isSupabaseConfigured() ? getSupabaseServiceClient() : null;

    const rows = await Promise.all(
      candidateIds.map(async (candidateId): Promise<CandidateMatchResultRow | null> => {
        const profile = await recruitingRepository.getCandidateProfile(candidateId);
        if (!profile) return null;

        const resumeDoc = profile.documents.find(
          (d) => d.documentType === "RESUME" && d.isPrimaryResume,
        ) ?? profile.documents.find((d) => d.documentType === "RESUME");

        const latestApplication = profile.applications
          .slice()
          .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0];

        const result = analyzeJobMatch({
          resumeText: buildCandidateCorpusText(profile),
          candidateSkills: profile.skills.map((s) => s.skill),
          jobTitle,
          jobDescription,
        });

        if (client) {
          await client.from("jd_analysis").insert({
            id: `jda-${crypto.randomUUID()}`,
            job_id: null,
            candidate_id: candidateId,
            resume_document_id: resumeDoc?.id ?? null,
            analysis_json: { ...result, runId, requisitionId, jobTitle },
            match_score: result.overallMatch,
            matched_skills: result.skillsFound,
            missing_skills: result.skillsMissing,
            recommendations: result.suggestions,
            created_at: new Date().toISOString(),
          });
        }

        return {
          candidateId,
          candidateName: `${profile.candidate.firstName} ${profile.candidate.lastName}`,
          applicationId: latestApplication?.applicationId,
          applicationStatus: latestApplication?.status,
          resumeDocumentId: resumeDoc?.id,
          resumeFileName: resumeDoc?.fileName,
          result,
        };
      }),
    );

    const candidates = rows.filter((row): row is CandidateMatchResultRow => row !== null);

    await writeAuditEvent({
      eventType: "CANDIDATE_MATCH_RUN",
      actorEmployeeId: session.employeeId,
      actorRole: session.roles.includes("ADMIN") ? "ADMIN" : session.roles[0] ?? "RECRUITER",
      resourceType: "job_requisition",
      resourceId: requisitionId,
      summary: `Ran Candidate Match for "${jobTitle}" against ${candidates.length} candidate(s)`,
      metadata: { runId, jobTitle, requisitionId, candidateCount: candidates.length },
      correlationId: runId,
    });

    return { ok: true, jobTitle, runId, candidates };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to run Candidate Match.",
    };
  }
}

export type ExtractJobDescriptionActionResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function extractJobDescriptionAction(
  formData: FormData,
): Promise<ExtractJobDescriptionActionResult> {
  await getWorkforceSession();

  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "No file selected." };

  const bytes = await file.arrayBuffer();
  const result = await extractJobDescriptionText({
    fileName: file.name,
    mimeType: file.type,
    bytes,
  });

  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, text: result.text };
}
