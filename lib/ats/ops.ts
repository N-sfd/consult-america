/**
 * ATS operations reads — real persisted recruiting data only.
 * No demo conversion rates or fabricated KPIs.
 */
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { candidateStageFor } from "@/lib/recruiting/candidate-stage";
import { recruitingRepository } from "@/lib/recruiting";
import type { ApplicationStatus, InterviewStatus, OfferStatus } from "@/types/recruiting";

export type AtsDashboardMetrics = {
  openRequisitions: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersPending: number;
  hiresThisPeriod: number;
  periodLabel: string;
};

export type AtsPipelineStage = {
  key: string;
  label: string;
  count: number;
};

export type AtsInterviewRow = {
  id: string;
  candidateId?: string;
  candidateName: string;
  jobTitle: string;
  applicationId?: string;
  interviewType: string;
  scheduledAt: string;
  status: InterviewStatus;
  interviewers: string[];
};

export type AtsOfferRow = {
  id: string;
  candidateId?: string;
  candidateName: string;
  jobTitle: string;
  applicationId?: string;
  offerDate?: string;
  proposedStartDate?: string;
  status: OfferStatus;
  expiresAt?: string;
};

export type AtsRecentApplication = {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  status: ApplicationStatus;
  candidateStage: string;
  appliedAt: string;
};

export type AtsRecentMatchRun = {
  id: string;
  candidateId: string;
  candidateName: string;
  requisitionId?: string;
  jobTitle: string;
  score: number;
  createdAt: string;
};

function startOfMonthIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

export async function loadAtsDashboard() {
  const applications = await recruitingRepository.listApplicationsQueue();
  const jobs = await recruitingRepository.listJobSummaries();
  const client = getSupabaseServiceClient();

  const openStatuses = new Set(["APPROVED", "PUBLISHED", "PENDING_APPROVAL", "ON_HOLD"]);
  const openRequisitions = jobs.filter((j) => openStatuses.has(j.status)).length;

  const terminal = new Set(["HIRED", "REJECTED", "WITHDRAWN", "CLOSED"]);
  const activeApplications = applications.filter((a) => !terminal.has(a.status)).length;

  const periodStart = startOfMonthIso();
  const hiresThisPeriod = applications.filter(
    (a) =>
      a.status === "HIRED" &&
      (a.lastActivityAt || a.appliedAt).slice(0, 10) >= periodStart,
  ).length;

  let interviewsScheduled = 0;
  let offersPending = 0;
  let upcomingInterviews: AtsInterviewRow[] = [];
  let offersRequiringAction: AtsOfferRow[] = [];
  let recentHires: AtsRecentApplication[] = [];
  let recentMatchRuns: AtsRecentMatchRun[] = [];

  if (client) {
    const [{ data: interviewRows }, { data: offerRows }, { data: matchRows }] = await Promise.all([
      client
        .from("interviews")
        .select(
          "id, application_id, interview_type, scheduled_at, status, interviewer_user_ids",
        )
        .order("scheduled_at", { ascending: true })
        .limit(200),
      client
        .from("offers")
        .select(
          "id, application_id, status, created_at, proposed_start_date, expires_at, extended_at",
        )
        .order("created_at", { ascending: false })
        .limit(200),
      client
        .from("jd_analysis")
        .select("id, candidate_id, job_id, match_score, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    interviewsScheduled = (interviewRows ?? []).filter(
      (row) => (row.status as string) === "SCHEDULED",
    ).length;
    offersPending = (offerRows ?? []).filter((row) =>
      ["DRAFT", "PENDING_APPROVAL", "EXTENDED"].includes(row.status as string),
    ).length;

    const appById = new Map(applications.map((a) => [a.applicationId, a]));
    const candidateNameById = new Map(applications.map((a) => [a.candidateId, a.candidateName]));
    const jobTitleByRequisitionId = new Map(jobs.map((j) => [j.requisitionId, j.title]));

    recentMatchRuns = (matchRows ?? [])
      .filter((row) => row.match_score !== null)
      .map((row) => {
        const requisitionId = (row.job_id as string) || undefined;
        return {
          id: row.id as string,
          candidateId: row.candidate_id as string,
          candidateName: candidateNameById.get(row.candidate_id as string) ?? "Candidate",
          requisitionId,
          jobTitle: (requisitionId && jobTitleByRequisitionId.get(requisitionId)) || "Ad-hoc job description",
          score: Number(row.match_score ?? 0),
          createdAt: row.created_at as string,
        };
      });

    upcomingInterviews = (interviewRows ?? [])
      .filter((row) => (row.status as string) === "SCHEDULED")
      .slice(0, 8)
      .map((row) => {
        const app = appById.get(row.application_id as string);
        return {
          id: row.id as string,
          candidateId: app?.candidateId,
          candidateName: app?.candidateName ?? "Candidate",
          jobTitle: app?.jobTitle ?? "—",
          applicationId: row.application_id as string | undefined,
          interviewType: (row.interview_type as string) || "INTERVIEW",
          scheduledAt: row.scheduled_at as string,
          status: row.status as InterviewStatus,
          interviewers: Array.isArray(row.interviewer_user_ids)
            ? (row.interviewer_user_ids as string[])
            : [],
        };
      });

    offersRequiringAction = (offerRows ?? [])
      .filter((row) =>
        ["DRAFT", "PENDING_APPROVAL", "EXTENDED"].includes(row.status as string),
      )
      .slice(0, 8)
      .map((row) => {
        const app = appById.get(row.application_id as string);
        return {
          id: row.id as string,
          candidateId: app?.candidateId,
          candidateName: app?.candidateName ?? "Candidate",
          jobTitle: app?.jobTitle ?? "—",
          applicationId: row.application_id as string | undefined,
          offerDate: (row.extended_at as string) || (row.created_at as string),
          proposedStartDate: (row.proposed_start_date as string) || undefined,
          status: row.status as OfferStatus,
          expiresAt: (row.expires_at as string) || undefined,
        };
      });
  }

  recentHires = applications
    .filter((a) => a.status === "HIRED")
    .sort((a, b) => (b.lastActivityAt || b.appliedAt).localeCompare(a.lastActivityAt || a.appliedAt))
    .slice(0, 8)
    .map((a) => ({
      applicationId: a.applicationId,
      applicationNumber: a.applicationNumber,
      candidateId: a.candidateId,
      candidateName: a.candidateName,
      jobTitle: a.jobTitle,
      status: a.status,
      candidateStage: candidateStageFor(a.status),
      appliedAt: a.appliedAt,
    }));

  const pipelineMap = new Map<string, number>();
  for (const app of applications) {
    const stage = candidateStageFor(app.status);
    pipelineMap.set(stage, (pipelineMap.get(stage) ?? 0) + 1);
  }
  const pipeline: AtsPipelineStage[] = [
    "Application Received",
    "Under Review",
    "Interview",
    "Offer",
    "Decision",
  ].map((label) => ({
    key: label,
    label,
    count: pipelineMap.get(label) ?? 0,
  }));

  const recentApplications: AtsRecentApplication[] = [...applications]
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, 8)
    .map((a) => ({
      applicationId: a.applicationId,
      applicationNumber: a.applicationNumber,
      candidateId: a.candidateId,
      candidateName: a.candidateName,
      jobTitle: a.jobTitle,
      status: a.status,
      candidateStage: candidateStageFor(a.status),
      appliedAt: a.appliedAt,
    }));

  const metrics: AtsDashboardMetrics = {
    openRequisitions,
    activeApplications,
    interviewsScheduled,
    offersPending,
    hiresThisPeriod,
    periodLabel: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
  };

  return {
    metrics,
    pipeline,
    upcomingInterviews,
    recentApplications,
    offersRequiringAction,
    recentHires,
    recentMatchRuns,
  };
}

export async function listAtsInterviews(): Promise<AtsInterviewRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const applications = await recruitingRepository.listApplicationsQueue();
  const appById = new Map(applications.map((a) => [a.applicationId, a]));

  const { data } = await client
    .from("interviews")
    .select("id, application_id, interview_type, scheduled_at, status, interviewer_user_ids")
    .order("scheduled_at", { ascending: false })
    .limit(300);

  return (data ?? []).map((row) => {
    const app = appById.get(row.application_id as string);
    return {
      id: row.id as string,
      candidateId: app?.candidateId,
      candidateName: app?.candidateName ?? "Candidate",
      jobTitle: app?.jobTitle ?? "—",
      applicationId: row.application_id as string | undefined,
      interviewType: (row.interview_type as string) || "INTERVIEW",
      scheduledAt: row.scheduled_at as string,
      status: row.status as InterviewStatus,
      interviewers: Array.isArray(row.interviewer_user_ids)
        ? (row.interviewer_user_ids as string[])
        : [],
    };
  });
}

export async function listAtsOffers(): Promise<AtsOfferRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const applications = await recruitingRepository.listApplicationsQueue();
  const appById = new Map(applications.map((a) => [a.applicationId, a]));

  const { data } = await client
    .from("offers")
    .select(
      "id, application_id, status, created_at, proposed_start_date, expires_at, extended_at",
    )
    .order("created_at", { ascending: false })
    .limit(300);

  return (data ?? []).map((row) => {
    const app = appById.get(row.application_id as string);
    return {
      id: row.id as string,
      candidateId: app?.candidateId,
      candidateName: app?.candidateName ?? "Candidate",
      jobTitle: app?.jobTitle ?? "—",
      applicationId: row.application_id as string | undefined,
      offerDate: (row.extended_at as string) || (row.created_at as string),
      proposedStartDate: (row.proposed_start_date as string) || undefined,
      status: row.status as OfferStatus,
      expiresAt: (row.expires_at as string) || undefined,
    };
  });
}
