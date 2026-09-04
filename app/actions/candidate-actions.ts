"use server";

import { revalidatePath } from "next/cache";

import { requireCandidateActor, toCandidateActionErrorMessage } from "@/lib/candidate/security";
import { recruitingRepository } from "@/lib/recruiting";

export type CandidateActionResult = {
  ok: boolean;
  message: string;
};

export async function updateCandidateContactInfoAction(input: {
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  willingToRelocate?: boolean;
}): Promise<CandidateActionResult> {
  try {
    const { session } = await requireCandidateActor();

    await recruitingRepository.updateCandidateContactInfo(session.candidateId, input);

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate");
    return { ok: true, message: "Profile updated." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to update profile."),
    };
  }
}
