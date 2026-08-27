import { describe, expect, it } from "vitest";

import { recruitingRepository } from "@/lib/recruiting";
import {
  APPLICATION_PIPELINE,
  APPLICATION_TERMINAL_STATUSES,
} from "@/types/recruiting";

/**
 * No Supabase env vars are set in the test environment, so
 * `recruitingRepository` resolves to the memory-backed repository. These
 * assertions exercise the graceful-degradation contract: dashboard reads
 * must resolve to empty/zero results, never throw, when unconfigured.
 */
describe("recruiting dashboard reads (unconfigured Supabase)", () => {
  it("returns zero candidates", async () => {
    await expect(recruitingRepository.countCandidates()).resolves.toBe(0);
  });

  it("returns zero open requisitions", async () => {
    await expect(recruitingRepository.countOpenRequisitions()).resolves.toBe(
      0,
    );
  });

  it("returns a fully zeroed pipeline breakdown covering every status", async () => {
    const counts = await recruitingRepository.getApplicationPipelineCounts();

    for (const status of [
      ...APPLICATION_PIPELINE,
      ...APPLICATION_TERMINAL_STATUSES,
    ]) {
      expect(counts[status]).toBe(0);
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

  it("returns no candidate summaries", async () => {
    await expect(recruitingRepository.listCandidateSummaries()).resolves.toEqual(
      [],
    );
  });

  it("returns undefined for a candidate profile lookup", async () => {
    await expect(
      recruitingRepository.getCandidateProfile("cand-seed-001"),
    ).resolves.toBeUndefined();
  });
});
