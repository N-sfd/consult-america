import { describe, expect, it } from "vitest";

import { recruitingRepository } from "@/lib/recruiting";
import { seedRequisitions } from "@/data/recruiting/seed";
import {
  APPLICATION_PIPELINE,
  APPLICATION_TERMINAL_STATUSES,
} from "@/types/recruiting";

/**
 * No Supabase env vars are set in the test environment, so
 * `recruitingRepository` resolves to the memory-backed repository. Unlike
 * the old always-empty stub, the memory backend is now a fully functional
 * in-memory ATS (seeded requisitions/postings, real writes for
 * applications/jobs) so the requisition -> publish -> apply -> pipeline
 * loop can be exercised locally without a Supabase project. It also seeds
 * one demo candidate + application (`cand-demo-001` / `app-demo-001`,
 * status RECRUITER_SCREEN) so the Candidate Portal has a demo account to
 * sign in as without requiring a fresh application submission first.
 */
describe("recruiting reads (memory-backed, no Supabase configured)", () => {
  it("counts the seeded demo candidate", async () => {
    await expect(recruitingRepository.countCandidates()).resolves.toBe(1);
  });

  it("counts the seeded published requisitions as open", async () => {
    const publishedSeedCount = seedRequisitions.filter((r) =>
      ["APPROVED", "PUBLISHED"].includes(r.status),
    ).length;

    await expect(
      recruitingRepository.countOpenRequisitions(),
    ).resolves.toBe(publishedSeedCount);
  });

  it("reflects the seeded demo application in the pipeline breakdown", async () => {
    const counts = await recruitingRepository.getApplicationPipelineCounts();

    for (const status of [
      ...APPLICATION_PIPELINE,
      ...APPLICATION_TERMINAL_STATUSES,
    ]) {
      expect(counts[status]).toBe(status === "RECRUITER_SCREEN" ? 1 : 0);
    }
  });

  it("returns no upcoming interviews or recent hires", async () => {
    await expect(
      recruitingRepository.listUpcomingInterviews(5),
    ).resolves.toEqual([]);
    await expect(recruitingRepository.listRecentHires(5)).resolves.toEqual(
      [],
    );
  });

  it("returns undefined for an unknown candidate profile lookup", async () => {
    await expect(
      recruitingRepository.getCandidateProfile("cand-does-not-exist"),
    ).resolves.toBeUndefined();
  });
});

describe("recruiting end-to-end loop (memory-backed)", () => {
  it("takes a candidate from application through a stage move", async () => {
    const requisition = seedRequisitions[0];
    const publishedPostings = await recruitingRepository.listPublishedPostings();
    const posting = publishedPostings.find(
      (p) => p.requisitionId === requisition.id,
    );
    expect(posting).toBeDefined();

    const { candidateId, applicationId } =
      await recruitingRepository.submitApplication({
        requisitionId: requisition.id,
        postingId: posting!.id,
        firstName: "Test",
        lastName: "Candidate",
        email: `test.candidate.${Date.now()}@example.com`,
        source: "unit-test",
      });

    const summaries = await recruitingRepository.listCandidateSummaries();
    const summary = summaries.find((c) => c.candidateId === candidateId);
    expect(summary).toBeDefined();
    expect(summary?.stage).toBe("APPLIED");
    expect(summary?.requisitionId).toBe(requisition.id);

    await recruitingRepository.updateApplicationStage(
      applicationId,
      "INTERVIEW",
    );

    const updatedSummaries = await recruitingRepository.listCandidateSummaries();
    const updatedSummary = updatedSummaries.find(
      (c) => c.candidateId === candidateId,
    );
    expect(updatedSummary?.stage).toBe("INTERVIEW");

    const profile = await recruitingRepository.getCandidateProfile(candidateId);
    expect(profile?.applications).toHaveLength(1);
    expect(profile?.applications[0].status).toBe("INTERVIEW");
    expect(
      profile?.activities.some((a) => a.activityType === "STAGE_CHANGED"),
    ).toBe(true);
  });
});
