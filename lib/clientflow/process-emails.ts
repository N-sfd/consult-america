import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  assertClientFlowEmailConfig,
  sendClientFlowEmail,
  type ClientFlowSendResult,
} from "@/lib/clientflow/email-provider";
import {
  memoryClaimEmail,
  memoryGetEmail,
  memoryListFailedOrRetrying,
  memoryUpdateEmail,
} from "@/lib/clientflow/memory-store";
import type { ClientFlowEmailMessage } from "@/lib/clientflow/types";

export type ProcessClientFlowEmailsResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
  simulated: number;
};

const WORKER_ID = `cfw-${process.pid}-${crypto.randomUUID().slice(0, 8)}`;

async function emitEmailLifecycleTrigger(
  type: "email_sent" | "email_failed",
  row: ClientFlowEmailMessage,
) {
  try {
    const { dispatchClientFlowTrigger } = await import("@/lib/clientflow/workflow-engine");
    await dispatchClientFlowTrigger({
      type,
      contactId: row.contactId,
      accountId: row.accountId,
      inquiryId: row.inquiryId,
      context: {
        emailMessageId: row.id,
        contactEmail: row.toAddress,
      },
    });
  } catch (err) {
    console.error(
      "[clientflow] email lifecycle dispatch failed",
      err instanceof Error ? err.message : err,
    );
  }
}

function mapEmailRow(row: Record<string, unknown>): ClientFlowEmailMessage {
  return {
    id: row.id as string,
    contactId: row.contact_id as string,
    inquiryId: (row.inquiry_id as string) ?? undefined,
    accountId: row.account_id as string,
    templateKey: row.template_key as string,
    purpose: row.purpose as ClientFlowEmailMessage["purpose"],
    toAddress: row.to_address as string,
    subject: row.subject as string,
    bodyText: row.body_text as string,
    status: row.status as ClientFlowEmailMessage["status"],
    attemptCount: Number(row.attempt_count ?? 0),
    maxAttempts: Number(row.max_attempts ?? 5),
    lastError: (row.last_error as string) ?? undefined,
    lastAttemptAt: (row.last_attempt_at as string) ?? undefined,
    sentAt: (row.sent_at as string) ?? undefined,
    failedAt: (row.failed_at as string) ?? undefined,
    providerMessageId: (row.provider_message_id as string) ?? undefined,
    provider: (row.provider as ClientFlowEmailMessage["provider"]) ?? undefined,
    idempotencyKey: row.idempotency_key as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function backoffIso(attemptCount: number): string {
  const minutes = Math.min(60, 2 ** Math.max(0, attemptCount - 1));
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

async function appendDeliveryActivity(input: {
  accountId: string;
  contactId: string;
  inquiryId?: string;
  subject: string;
  body: string;
  event: string;
}) {
  const client = getSupabaseServiceClient();
  if (!client) return;
  await client.from("crm_activities").insert({
    id: `act-${crypto.randomUUID()}`,
    account_id: input.accountId,
    contact_id: input.contactId,
    inquiry_id: input.inquiryId ?? null,
    type: "EMAIL",
    subject: input.subject,
    body: input.body,
    created_by_user_id: process.env.CLIENTFLOW_OWNER_USER_ID ?? "profile-clientflow-system",
    created_at: new Date().toISOString(),
    metadata: { event: input.event },
  });
}

function deliveryStatusFromOutcome(
  outcome: ClientFlowSendResult,
): "sent" | "simulated" | "failed" {
  if (!outcome.ok) return "failed";
  if (outcome.simulated || outcome.provider === "console") return "simulated";
  return "sent";
}

async function processOneMemory(
  id: string,
): Promise<"sent" | "failed" | "skipped" | "simulated"> {
  const claimed = memoryClaimEmail(id);
  if (!claimed) return "skipped";
  if (claimed.providerMessageId) return "skipped";

  const outcome = await sendClientFlowEmail({
    to: claimed.toAddress,
    subject: claimed.subject,
    text: claimed.bodyText,
  });

  const attemptCount = claimed.attemptCount + 1;
  if (outcome.ok) {
    const status = deliveryStatusFromOutcome(outcome);
    memoryUpdateEmail(id, {
      status,
      attemptCount,
      sentAt: status === "sent" ? new Date().toISOString() : undefined,
      providerMessageId: outcome.providerMessageId,
      provider: outcome.provider,
      lastError: undefined,
    });
    return status;
  }

  const exhausted = attemptCount >= claimed.maxAttempts;
  memoryUpdateEmail(id, {
    status: exhausted ? "failed" : "retrying",
    attemptCount,
    lastError: outcome.error,
    failedAt: exhausted ? new Date().toISOString() : undefined,
    provider: outcome.provider,
  });
  return "failed";
}

async function processOneSupabase(
  id: string,
): Promise<"sent" | "failed" | "skipped" | "simulated"> {
  const client = getSupabaseServiceClient();
  if (!client) return "skipped";

  const { data: claimedRaw, error: claimError } = await client.rpc(
    "clientflow_claim_email_message",
    { p_id: id, p_worker_id: WORKER_ID },
  );
  if (claimError || !claimedRaw) {
    // Fallback to single-arg overload if 037 not applied yet
    const fallback = await client.rpc("clientflow_claim_email_message", { p_id: id });
    if (fallback.error || !fallback.data) return "skipped";
    return finalizeSupabaseSend(id, mapEmailRow(fallback.data as Record<string, unknown>));
  }

  return finalizeSupabaseSend(id, mapEmailRow(claimedRaw as Record<string, unknown>));
}

async function finalizeSupabaseSend(
  id: string,
  claimed: ClientFlowEmailMessage,
): Promise<"sent" | "failed" | "skipped" | "simulated"> {
  const client = getSupabaseServiceClient();
  if (!client) return "skipped";
  if (claimed.providerMessageId) return "skipped";

  const outcome = await sendClientFlowEmail({
    to: claimed.toAddress,
    subject: claimed.subject,
    text: claimed.bodyText,
  });

  const attemptCount = claimed.attemptCount + 1;
  const now = new Date().toISOString();

  if (outcome.ok) {
    const status = deliveryStatusFromOutcome(outcome);
    // Only one worker can win: require provider_message_id still null.
    const { data: updated, error } = await client
      .from("crm_email_messages")
      .update({
        status,
        attempt_count: attemptCount,
        sent_at: status === "sent" ? now : null,
        provider_message_id: outcome.providerMessageId ?? null,
        provider: outcome.provider,
        last_error: null,
        claimed_at: null,
        claimed_by: null,
        next_attempt_at: null,
        updated_at: now,
      })
      .eq("id", id)
      .is("provider_message_id", null)
      .select("id")
      .maybeSingle();

    if (error || !updated) {
      // Another worker already recorded delivery — do not resend.
      return "skipped";
    }

    await appendDeliveryActivity({
      accountId: claimed.accountId,
      contactId: claimed.contactId,
      inquiryId: claimed.inquiryId,
      subject:
        status === "simulated"
          ? "Email simulated (dev — not delivered)"
          : claimed.purpose === "CLIENT_ACK"
            ? "Welcome email sent"
            : claimed.purpose === "FOLLOW_UP"
              ? "Follow-up email sent"
              : "Internal team notified",
      body:
        status === "simulated"
          ? "Console provider — not a real Gmail delivery."
          : `Delivery recorded via ${outcome.provider}`,
      event:
        status === "simulated"
          ? "email_simulated"
          : claimed.purpose === "CLIENT_ACK"
            ? "client_ack_sent"
            : claimed.purpose === "FOLLOW_UP"
              ? "follow_up_sent"
              : "internal_notify_sent",
    });
    if (status === "sent") {
      await emitEmailLifecycleTrigger("email_sent", claimed);
    }
    return status;
  }

  const exhausted = attemptCount >= claimed.maxAttempts;
  await client
    .from("crm_email_messages")
    .update({
      status: exhausted ? "failed" : "retrying",
      attempt_count: attemptCount,
      last_error: outcome.error,
      failed_at: exhausted ? now : null,
      provider: outcome.provider,
      claimed_at: null,
      claimed_by: null,
      next_attempt_at: exhausted ? null : backoffIso(attemptCount),
      updated_at: now,
    })
    .eq("id", id);

  if (exhausted) {
    await appendDeliveryActivity({
      accountId: claimed.accountId,
      contactId: claimed.contactId,
      inquiryId: claimed.inquiryId,
      subject: "Email delivery failed",
      body: "Retries exhausted — inquiry remains saved.",
      event: "email_failed",
    });
    await emitEmailLifecycleTrigger("email_failed", claimed);
  }

  return "failed";
}

export async function processClientFlowEmailQueue(
  limit = 25,
): Promise<ProcessClientFlowEmailsResult> {
  const result: ProcessClientFlowEmailsResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    simulated: 0,
  };

  const config = assertClientFlowEmailConfig();
  if (!config.ok) {
    // Still process rows so they surface as failed with a clear config error
    console.error("[clientflow]", config.error);
  }

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    const pending = memoryListFailedOrRetrying()
      .filter((e) => e.status === "queued" || e.status === "retrying" || e.status === "failed")
      .filter((e) => e.attemptCount < e.maxAttempts && !e.providerMessageId)
      .slice(0, limit);

    for (const row of pending) {
      result.processed += 1;
      const outcome = await processOneMemory(row.id);
      if (outcome === "sent") result.sent += 1;
      else if (outcome === "simulated") result.simulated += 1;
      else if (outcome === "failed") result.failed += 1;
      else result.skipped += 1;
    }
    return result;
  }

  const client = getSupabaseServiceClient()!;
  const { data, error } = await client
    .from("crm_email_messages")
    .select("id")
    .in("status", ["queued", "retrying", "failed"])
    .is("provider_message_id", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data) return result;

  for (const row of data) {
    result.processed += 1;
    const outcome = await processOneSupabase(row.id as string);
    if (outcome === "sent") result.sent += 1;
    else if (outcome === "simulated") result.simulated += 1;
    else if (outcome === "failed") result.failed += 1;
    else result.skipped += 1;
  }

  return result;
}

export async function retryClientFlowEmail(
  messageId: string,
): Promise<{ ok: true; status?: string } | { ok: false; error: string }> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    const row = memoryGetEmail(messageId);
    if (!row) return { ok: false, error: "Email message not found" };
    if (row.providerMessageId || row.status === "sent") {
      return { ok: false, error: "Message already sent" };
    }
    if (row.attemptCount >= row.maxAttempts) {
      memoryUpdateEmail(messageId, {
        maxAttempts: row.attemptCount + 1,
        status: "queued",
        lastError: undefined,
      });
    } else {
      memoryUpdateEmail(messageId, { status: "queued", lastError: undefined });
    }
    const outcome = await processOneMemory(messageId);
    return outcome === "sent" || outcome === "simulated"
      ? { ok: true, status: outcome }
      : { ok: false, error: memoryGetEmail(messageId)?.lastError ?? "Send failed" };
  }

  const client = getSupabaseServiceClient()!;
  const { data: existing, error } = await client
    .from("crm_email_messages")
    .select("*")
    .eq("id", messageId)
    .maybeSingle();

  if (error || !existing) return { ok: false, error: "Email message not found" };
  const row = mapEmailRow(existing);
  if (row.providerMessageId || row.status === "sent") {
    return { ok: false, error: "Message already sent — duplicate send blocked" };
  }

  const patch: Record<string, unknown> = {
    status: "queued",
    last_error: null,
    claimed_at: null,
    claimed_by: null,
    next_attempt_at: null,
    updated_at: new Date().toISOString(),
  };
  if (row.attemptCount >= row.maxAttempts) {
    patch.max_attempts = row.attemptCount + 1;
  }

  await client.from("crm_email_messages").update(patch).eq("id", messageId);
  const outcome = await processOneSupabase(messageId);
  if (outcome === "sent" || outcome === "simulated") {
    return { ok: true, status: outcome };
  }

  const { data: after } = await client
    .from("crm_email_messages")
    .select("last_error")
    .eq("id", messageId)
    .maybeSingle();
  return {
    ok: false,
    error: (after?.last_error as string) || "Send failed",
  };
}

export async function listClientFlowEmailOps(): Promise<ClientFlowEmailMessage[]> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return memoryListFailedOrRetrying().sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  const client = getSupabaseServiceClient()!;
  const { data, error } = await client
    .from("crm_email_messages")
    .select("*")
    .in("status", ["queued", "retrying", "failed", "simulated"])
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return data.map((row) => mapEmailRow(row as Record<string, unknown>));
}
