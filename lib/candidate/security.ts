import { getCandidateSession, type CandidateSession } from "@/lib/candidate/session";

export class CandidateSecurityError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "CandidateSecurityError";
  }
}

export type CandidateActor = { session: CandidateSession };

export async function requireCandidateActor(): Promise<CandidateActor> {
  return { session: await getCandidateSession() };
}

/** Never trust a resource id alone — every candidate-scoped read/write must confirm ownership. */
export function assertCandidateSelfAccess(
  actorCandidateId: string,
  resourceCandidateId: string,
) {
  if (actorCandidateId !== resourceCandidateId) {
    throw new CandidateSecurityError(
      "Forbidden: candidates may only access their own records",
    );
  }
}

export function toCandidateActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof CandidateSecurityError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
