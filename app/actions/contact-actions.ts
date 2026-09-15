"use server";

import { revalidatePath } from "next/cache";

import { submitTalkToExpert } from "@/lib/clientflow/submit";
import { processClientFlowEmailQueue, retryClientFlowEmail } from "@/lib/clientflow/process-emails";
import { setServiceEnrollmentStatus } from "@/lib/clientflow/enrollments";
import type { ServiceEnrollmentStatus } from "@/lib/clientflow/types";
import { getCrmSession } from "@/lib/crm/session";

export type ContactActionResult = {
  ok: boolean;
  message: string;
  inquiryId?: string;
  contactId?: string;
};

export async function submitContactAction(input: {
  name: string;
  email: string;
  company: string;
  message: string;
  source?: string;
  sourcePage?: string;
  serviceKey?: string;
  campaign?: string;
  utm?: Record<string, string>;
  consentGiven?: boolean;
}): Promise<ContactActionResult> {
  const result = await submitTalkToExpert({
    name: input.name,
    email: input.email,
    company: input.company,
    message: input.message,
    sourceChannel: input.source || "talk_to_expert",
    sourcePage: input.sourcePage,
    serviceKey: input.serviceKey,
    campaign: input.campaign,
    utm: input.utm,
    consentGiven: Boolean(input.consentGiven),
  });

  if (!result.ok) {
    return { ok: false, message: result.error };
  }

  // Fire-and-forget queue drain after commit. Failures never undo the inquiry.
  void processClientFlowEmailQueue(10).catch((err) => {
    console.error("[clientflow] post-submit queue drain failed", err instanceof Error ? err.message : err);
  });

  return {
    ok: true,
    message: "Thank you. Your submission has been received.",
    inquiryId: result.inquiryId,
    contactId: result.contactId,
  };
}

export async function retryClientFlowEmailAction(messageId: string): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    await getCrmSession();
    const result = await retryClientFlowEmail(messageId);
    revalidatePath("/crm");
    revalidatePath("/crm/emails");
    if (!result.ok) return { ok: false, message: result.error };
    return { ok: true, message: "Retry completed." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to retry email.",
    };
  }
}

export async function processClientFlowEmailQueueAction(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    await getCrmSession();
    const result = await processClientFlowEmailQueue(50);
    revalidatePath("/crm/emails");
    return {
      ok: true,
      message: `Processed ${result.processed}: ${result.sent} sent, ${result.failed} failed, ${result.skipped} skipped.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to process queue.",
    };
  }
}

export async function setServiceEnrollmentStatusAction(
  enrollmentId: string,
  status: ServiceEnrollmentStatus,
): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await getCrmSession();
    const result = await setServiceEnrollmentStatus({
      enrollmentId,
      status,
      actorUserId: session.userId,
    });
    revalidatePath("/crm");
    if (!result.ok) return { ok: false, message: result.error };
    return { ok: true, message: `Enrollment moved to ${result.status}.` };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to update enrollment.",
    };
  }
}
