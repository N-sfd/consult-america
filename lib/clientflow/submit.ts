import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  memorySubmitTalkToExpert,
} from "@/lib/clientflow/memory-store";
import { isValidEmail, normalizeEmail } from "@/lib/clientflow/normalize-email";
import type { TalkToExpertInput, TalkToExpertResult } from "@/lib/clientflow/types";
import { dispatchClientFlowTrigger } from "@/lib/clientflow/workflow-engine";

const SERVICE_KEYS = new Set([
  "general",
  "oracle",
  "ai_data",
  "application_engineering",
  "crm_cx",
  "managed_services",
]);

function inferServiceKey(sourcePage?: string, explicit?: string): string {
  if (explicit && SERVICE_KEYS.has(explicit)) return explicit;
  const path = (sourcePage ?? "").toLowerCase();
  if (path.includes("oracle")) return "oracle";
  if (path.includes("ai") || path.includes("data")) return "ai_data";
  if (path.includes("application") || path.includes("engineering")) {
    return "application_engineering";
  }
  if (path.includes("crm") || path.includes("customer")) return "crm_cx";
  if (path.includes("managed")) return "managed_services";
  return "general";
}

function validateInput(input: TalkToExpertInput): TalkToExpertResult | null {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const company = input.company?.trim() ?? "";

  if (!input.consentGiven) {
    return { ok: false, error: "Please confirm consent to be contacted.", code: "consent_required" };
  }
  if (!name || !email || !company) {
    return {
      ok: false,
      error: "Please fill in your name, email, and company.",
      code: "required_fields",
    };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address.", code: "invalid_email" };
  }
  if (name.length > 200 || company.length > 200) {
    return { ok: false, error: "Name or company is too long.", code: "invalid_length" };
  }
  if ((input.message?.length ?? 0) > 5000) {
    return { ok: false, error: "Message is too long.", code: "invalid_length" };
  }
  return null;
}

async function emitInquiryCreated(
  payload: TalkToExpertInput,
  result: Extract<TalkToExpertResult, { ok: true }>,
) {
  try {
    await dispatchClientFlowTrigger({
      type: "inquiry_created",
      contactId: result.contactId,
      accountId: result.accountId,
      inquiryId: result.inquiryId,
      enrollmentId: result.enrollmentId,
      context: {
        "service.key": payload.serviceKey,
        "service.name": result.serviceName,
        "inquiry.source_channel": payload.sourceChannel,
        contactName: payload.name,
        contactEmail: payload.email,
        companyName: payload.company,
      },
    });
  } catch (err) {
    // Never roll back the inquiry if automation dispatch fails.
    console.error(
      "[clientflow] inquiry_created dispatch failed",
      err instanceof Error ? err.message : err,
    );
  }
}

/**
 * Production Talk to Expert path:
 * validate → DB transaction (RPC) creates contact/inquiry/activity/queued emails
 * → returns. Provider send is never inside this call.
 * Phase 2B automation is dispatched after commit (idempotent).
 */
export async function submitTalkToExpert(
  input: TalkToExpertInput,
): Promise<TalkToExpertResult> {
  const invalid = validateInput(input);
  if (invalid) return invalid;

  const payload: TalkToExpertInput = {
    ...input,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    company: input.company.trim(),
    message: input.message?.trim() || undefined,
    sourcePage: input.sourcePage?.trim() || undefined,
    sourceChannel: input.sourceChannel?.trim() || "talk_to_expert",
    serviceKey: inferServiceKey(input.sourcePage, input.serviceKey),
    campaign: input.campaign?.trim() || undefined,
    utm: input.utm,
    consentGiven: true,
  };

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    const memoryResult = memorySubmitTalkToExpert(payload);
    if (memoryResult.ok) await emitInquiryCreated(payload, memoryResult);
    return memoryResult;
  }

  const client = getSupabaseServiceClient()!;
  const { data, error } = await client.rpc("clientflow_submit_talk_to_expert", {
    p_name: payload.name,
    p_email: payload.email,
    p_company: payload.company,
    p_message: payload.message ?? "",
    p_source_page: payload.sourcePage ?? null,
    p_source_channel: payload.sourceChannel,
    p_service_key: payload.serviceKey,
    p_campaign: payload.campaign ?? null,
    p_utm: payload.utm ?? {},
    p_consent_given: true,
    p_owner_user_id: process.env.CLIENTFLOW_OWNER_USER_ID ?? "profile-clientflow-system",
    p_internal_notify_to: process.env.CLIENTFLOW_INTERNAL_NOTIFY_TO ?? null,
    p_crm_base_url:
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.CLIENTFLOW_CRM_BASE_URL ??
      "https://consultamerica-nu.vercel.app",
    p_consultant_name: process.env.CLIENTFLOW_CONSULTANT_NAME ?? null,
    p_booking_url: process.env.CLIENTFLOW_BOOKING_URL ?? null,
  });

  if (error) {
    const msg = error.message || "Unable to save inquiry.";
    if (msg.includes("consent_required")) {
      return { ok: false, error: "Please confirm consent to be contacted.", code: "consent_required" };
    }
    if (msg.includes("invalid_email")) {
      return { ok: false, error: "Please enter a valid email address.", code: "invalid_email" };
    }
    if (msg.includes("required_fields")) {
      return {
        ok: false,
        error: "Please fill in your name, email, and company.",
        code: "required_fields",
      };
    }
    console.error("[clientflow] submit RPC failed", error.code);
    return { ok: false, error: "Unable to save your inquiry. Please try again.", code: "persist_failed" };
  }

  const row = data as Record<string, unknown>;
  const result = {
    ok: true as const,
    contactId: String(row.contactId),
    accountId: String(row.accountId),
    inquiryId: String(row.inquiryId),
    workflowRunId: String(row.workflowRunId),
    contactCreated: Boolean(row.contactCreated),
    serviceId: row.serviceId ? String(row.serviceId) : undefined,
    serviceName: row.serviceName ? String(row.serviceName) : undefined,
    enrollmentId: row.enrollmentId ? String(row.enrollmentId) : undefined,
    enrollmentCreated: row.enrollmentCreated !== undefined
      ? Boolean(row.enrollmentCreated)
      : undefined,
    clientTemplateId: row.clientTemplateId ? String(row.clientTemplateId) : undefined,
    clientTemplateKey: row.clientTemplateKey ? String(row.clientTemplateKey) : undefined,
    clientTemplateVersion:
      row.clientTemplateVersion !== undefined && row.clientTemplateVersion !== null
        ? Number(row.clientTemplateVersion)
        : undefined,
  };

  await emitInquiryCreated(payload, result);
  return result;
}
