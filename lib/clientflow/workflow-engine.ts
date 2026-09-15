import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { addBusinessDays } from "@/lib/clientflow/business-days";
import { renderTemplate } from "@/lib/clientflow/templates";
import {
  validateWorkflowConfig,
  type WorkflowConfig,
  type WorkflowCondition,
  type WorkflowStepDef,
  type WorkflowTriggerType,
} from "@/lib/clientflow/workflow-config";
import {
  memoryAppendActivity,
  memoryEnqueueWorkflowEmail,
  memoryGetWorkflowContextExtras,
  memoryListActiveWorkflowDefinitions,
  memoryRecordWorkflowEvent,
  memoryUpsertWorkflowRun,
  memoryClaimDueWorkflowSteps,
  memoryCompleteWorkflowStep,
  memoryFailWorkflowStep,
  memoryScheduleWorkflowStep,
  memoryFindWorkflowRunByIdempotency,
  type MemoryWorkflowContext,
} from "@/lib/clientflow/workflow-memory";
import type { ServiceEnrollmentStatus } from "@/lib/clientflow/types";

export type TriggerPayload = {
  type: WorkflowTriggerType;
  contactId: string;
  accountId: string;
  inquiryId?: string;
  enrollmentId?: string;
  context: {
    "service.key"?: string;
    "service.name"?: string;
    "enrollment.status"?: string;
    "inquiry.source_channel"?: string;
    contactName?: string;
    contactEmail?: string;
    companyName?: string;
    emailMessageId?: string;
  };
};

export type DispatchResult = {
  started: number;
  skippedDuplicate: number;
  failed: number;
  runIds: string[];
};

export type ProcessWorkflowResult = {
  processed: number;
  completed: number;
  failed: number;
  rescheduled: number;
};

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function evaluateCondition(
  condition: WorkflowCondition,
  context: TriggerPayload["context"],
): boolean {
  const left = context[condition.field] ?? "";
  return left === condition.value;
}

function triggerIdempotencyKey(defKey: string, payload: TriggerPayload): string {
  if (payload.type === "inquiry_created") {
    return `${payload.type}:${payload.inquiryId}:${defKey}`;
  }
  if (payload.type === "enrollment_status_changed") {
    return `${payload.type}:${payload.enrollmentId}:${payload.context["enrollment.status"]}:${defKey}`;
  }
  return `${payload.type}:${payload.context.emailMessageId}:${defKey}`;
}

async function loadActiveDefinitions(
  trigger: WorkflowTriggerType,
): Promise<Array<{ id: string; key: string; version: number; config: unknown }>> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return memoryListActiveWorkflowDefinitions(trigger);
  }
  const client = getSupabaseServiceClient()!;
  const { data, error } = await client
    .from("crm_workflow_definitions")
    .select("id, key, version, config, status")
    .eq("status", "active");
  if (error || !data) {
    console.error("[clientflow-workflow] load definitions failed", error?.code);
    return [];
  }
  return data
    .map((row) => ({
      id: row.id as string,
      key: row.key as string,
      version: Number(row.version ?? 1),
      config: row.config,
    }))
    .filter((row) => {
      const validated = validateWorkflowConfig(row.config);
      return validated.ok && validated.config.trigger === trigger;
    });
}

async function appendActivity(input: {
  accountId: string;
  contactId: string;
  inquiryId?: string;
  subject: string;
  body?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    memoryAppendActivity(input);
    return;
  }
  const client = getSupabaseServiceClient()!;
  await client.from("crm_activities").insert({
    id: id("act"),
    account_id: input.accountId,
    contact_id: input.contactId,
    inquiry_id: input.inquiryId ?? null,
    type: "SYSTEM",
    subject: input.subject,
    body: input.body ?? null,
    created_by_user_id:
      process.env.CLIENTFLOW_OWNER_USER_ID ?? "profile-clientflow-system",
    metadata: input.metadata ?? { event: "workflow_activity" },
  });
}

async function enqueueFollowUpEmail(input: {
  runId: string;
  stepId: string;
  templateKey: string;
  contactId: string;
  accountId: string;
  inquiryId?: string;
  context: TriggerPayload["context"];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const idempotencyKey = `wf:${input.runId}:${input.stepId}:${input.templateKey}`;
  const firstName = (input.context.contactName ?? "there").split(/\s+/)[0] ?? "there";
  const vars = {
    first_name: firstName,
    company_name: input.context.companyName ?? "",
    service_name: input.context["service.name"] ?? input.context["service.key"] ?? "",
    consultant_name:
      process.env.CLIENTFLOW_CONSULTANT_NAME?.trim() ||
      "a Consult America practice leader",
    booking_url: process.env.CLIENTFLOW_BOOKING_URL?.trim() || "",
  };

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return memoryEnqueueWorkflowEmail({
      ...input,
      idempotencyKey,
      toAddress: input.context.contactEmail ?? "",
      vars,
    });
  }

  const client = getSupabaseServiceClient()!;
  const { data: tpl, error: tplError } = await client
    .from("crm_email_templates")
    .select("*")
    .eq("key", input.templateKey)
    .eq("is_active", true)
    .maybeSingle();
  if (tplError || !tpl) {
    return { ok: false, error: `Template not found: ${input.templateKey}` };
  }
  if (!input.context.contactEmail) {
    return { ok: false, error: "Missing contact email for enqueue_email" };
  }

  const subject = renderTemplate(String(tpl.subject), vars);
  const bodyText = renderTemplate(String(tpl.body_text), vars);
  const bodyHtml = renderTemplate(String(tpl.body_html ?? ""), vars, { html: true });

  const { error } = await client.from("crm_email_messages").insert({
    id: id("cem"),
    contact_id: input.contactId,
    inquiry_id: input.inquiryId ?? null,
    account_id: input.accountId,
    template_id: tpl.id,
    template_key: tpl.key,
    template_version: Number(tpl.version ?? 1),
    purpose: "FOLLOW_UP",
    to_address: input.context.contactEmail,
    subject,
    body_text: bodyText,
    body_html: bodyHtml || null,
    status: "queued",
    attempt_count: 0,
    max_attempts: 5,
    idempotency_key: idempotencyKey,
  });

  if (error) {
    if (error.code === "23505") return { ok: true }; // duplicate = idempotent success
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

async function recordEvent(
  runId: string,
  eventKey: string,
  status: "ok" | "error" | "skipped",
  detail: Record<string, unknown>,
) {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    memoryRecordWorkflowEvent(runId, eventKey, status, detail);
    return;
  }
  const client = getSupabaseServiceClient()!;
  await client.from("crm_workflow_events").insert({
    id: id("wfe"),
    run_id: runId,
    event_key: eventKey,
    status,
    detail,
  });
}

async function scheduleStep(input: {
  runId: string;
  stepId: string;
  step: WorkflowStepDef;
  runAt: Date | null;
  context: TriggerPayload["context"];
}) {
  const idempotencyKey = `wfstep:${input.runId}:${input.stepId}`;
  const actionName =
    input.step.type === "action" ? input.step.action : input.step.type;
  const actionParams =
    input.step.type === "action"
      ? input.step
      : input.step.type === "delay"
        ? { businessDays: input.step.businessDays, next: input.step.next }
        : input.step;
  const next =
    input.step.type === "branch"
      ? null
      : input.step.next;

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    memoryScheduleWorkflowStep({
      runId: input.runId,
      stepId: input.stepId,
      stepType: input.step.type,
      runAt: input.runAt,
      actionName,
      actionParams: actionParams as Record<string, unknown>,
      nextStepId: next,
      idempotencyKey,
      status: input.runAt && input.runAt.getTime() > Date.now() ? "pending" : "ready",
    });
    return;
  }

  const client = getSupabaseServiceClient()!;
  const status = input.runAt && input.runAt.getTime() > Date.now() ? "pending" : "ready";
  const { error } = await client.from("crm_workflow_steps").insert({
    id: id("wfs"),
    run_id: input.runId,
    step_id: input.stepId,
    step_type: input.step.type,
    status,
    run_at: input.runAt ? input.runAt.toISOString() : new Date().toISOString(),
    action_name: actionName,
    action_params: actionParams,
    next_step_id: next,
    idempotency_key: idempotencyKey,
  });
  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
  void input.context;
}

async function updateRunStatus(
  runId: string,
  status: "running" | "waiting" | "completed" | "failed",
) {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    memoryUpsertWorkflowRun({ id: runId, status });
    return;
  }
  const client = getSupabaseServiceClient()!;
  await client
    .from("crm_workflow_runs")
    .update({
      status,
      completed_at:
        status === "completed" || status === "failed" ? new Date().toISOString() : null,
    })
    .eq("id", runId);
}

async function executeActionStep(input: {
  runId: string;
  stepId: string;
  step: Extract<WorkflowStepDef, { type: "action" }>;
  payload: TriggerPayload;
}): Promise<{ ok: true; next: string | null } | { ok: false; error: string }> {
  const { step, payload } = input;
  if (step.action === "enqueue_email") {
    const result = await enqueueFollowUpEmail({
      runId: input.runId,
      stepId: input.stepId,
      templateKey: step.templateKey,
      contactId: payload.contactId,
      accountId: payload.accountId,
      inquiryId: payload.inquiryId,
      context: payload.context,
    });
    if (!result.ok) return result;
    await recordEvent(input.runId, "action_enqueue_email", "ok", {
      templateKey: step.templateKey,
      stepId: input.stepId,
    });
    return { ok: true, next: step.next };
  }
  if (step.action === "write_activity") {
    await appendActivity({
      accountId: payload.accountId,
      contactId: payload.contactId,
      inquiryId: payload.inquiryId,
      subject: step.subject,
      body: step.body,
      metadata: {
        event: "workflow_write_activity",
        run_id: input.runId,
        step_id: input.stepId,
      },
    });
    await recordEvent(input.runId, "action_write_activity", "ok", {
      subject: step.subject,
      stepId: input.stepId,
    });
    return { ok: true, next: step.next };
  }
  if (step.action === "set_enrollment_status") {
    if (!payload.enrollmentId) {
      return { ok: false, error: "set_enrollment_status requires enrollmentId" };
    }
    const { setServiceEnrollmentStatus } = await import("@/lib/clientflow/enrollments");
    const result = await setServiceEnrollmentStatus({
      enrollmentId: payload.enrollmentId,
      status: step.status as ServiceEnrollmentStatus,
      skipWorkflowDispatch: true,
    });
    if (!result.ok) return result;
    await recordEvent(input.runId, "action_set_enrollment_status", "ok", {
      status: step.status,
      stepId: input.stepId,
    });
    return { ok: true, next: step.next };
  }
  return { ok: false, error: "Unknown action" };
}

async function advanceFromStep(input: {
  runId: string;
  config: WorkflowConfig;
  stepId: string;
  payload: TriggerPayload;
  now: Date;
}): Promise<void> {
  const step = input.config.steps[input.stepId];
  if (!step) {
    await updateRunStatus(input.runId, "failed");
    await recordEvent(input.runId, "missing_step", "error", { stepId: input.stepId });
    await appendActivity({
      accountId: input.payload.accountId,
      contactId: input.payload.contactId,
      inquiryId: input.payload.inquiryId,
      subject: "Workflow failed",
      body: `Missing step ${input.stepId}`,
      metadata: { event: "workflow_failed", run_id: input.runId },
    });
    return;
  }

  if (step.type === "branch") {
    const matched = evaluateCondition(step.condition, input.payload.context);
    const nextId = matched ? step.then : step.else;
    await recordEvent(input.runId, "branch", "ok", {
      stepId: input.stepId,
      field: step.condition.field,
      value: step.condition.value,
      matched,
      next: nextId,
    });
    await advanceFromStep({ ...input, stepId: nextId });
    return;
  }

  if (step.type === "delay") {
    const runAt = addBusinessDays(input.now, step.businessDays);
    await scheduleStep({
      runId: input.runId,
      stepId: input.stepId,
      step,
      runAt,
      context: input.payload.context,
    });
    await updateRunStatus(input.runId, "waiting");
    await recordEvent(input.runId, "delay_scheduled", "ok", {
      stepId: input.stepId,
      businessDays: step.businessDays,
      runAt: runAt.toISOString(),
      next: step.next,
    });
    return;
  }

  // Immediate actions execute inline (still recorded as steps for audit via events).
  // Delays are the durable scheduled unit claimed by the worker.
  if (step.type === "action") {
    const actionResult = await executeActionStep({
      runId: input.runId,
      stepId: input.stepId,
      step,
      payload: input.payload,
    });
    if (!actionResult.ok) {
      await updateRunStatus(input.runId, "failed");
      await recordEvent(input.runId, "action_failed", "error", {
        stepId: input.stepId,
        error: actionResult.error,
      });
      await appendActivity({
        accountId: input.payload.accountId,
        contactId: input.payload.contactId,
        inquiryId: input.payload.inquiryId,
        subject: "Workflow step failed",
        body: actionResult.error,
        metadata: { event: "workflow_failed", run_id: input.runId, step_id: input.stepId },
      });
      return;
    }
    await recordEvent(input.runId, "action_completed", "ok", { stepId: input.stepId });
    if (actionResult.next) {
      await advanceFromStep({
        ...input,
        stepId: actionResult.next,
      });
    } else {
      await updateRunStatus(input.runId, "completed");
      await recordEvent(input.runId, "run_completed", "ok", {});
    }
  }
}

/**
 * Dispatch a Phase 2B trigger. Idempotent per definition + entity key.
 * Never throws away the originating inquiry/enrollment on failure.
 */
export async function dispatchClientFlowTrigger(
  payload: TriggerPayload,
): Promise<DispatchResult> {
  const result: DispatchResult = {
    started: 0,
    skippedDuplicate: 0,
    failed: 0,
    runIds: [],
  };
  const definitions = await loadActiveDefinitions(payload.type);
  const now = new Date();

  for (const def of definitions) {
    const validated = validateWorkflowConfig(def.config);
    if (!validated.ok) {
      result.failed += 1;
      console.error("[clientflow-workflow] invalid config", def.key, validated.error);
      continue;
    }
    const config = validated.config;
    const idem = triggerIdempotencyKey(def.key, payload);

    if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
      const existing = memoryFindWorkflowRunByIdempotency(idem);
      if (existing) {
        result.skippedDuplicate += 1;
        continue;
      }
      const runId = id("wfr");
      memoryUpsertWorkflowRun({
        id: runId,
        definitionId: def.id,
        definitionKey: def.key,
        definitionVersion: def.version,
        configSnapshot: config,
        triggerType: payload.type,
        triggerIdempotencyKey: idem,
        contactId: payload.contactId,
        accountId: payload.accountId,
        inquiryId: payload.inquiryId,
        enrollmentId: payload.enrollmentId,
        context: payload.context,
        status: "running",
      });
      result.started += 1;
      result.runIds.push(runId);
      await recordEvent(runId, "trigger", "ok", {
        type: payload.type,
        definitionKey: def.key,
        definitionVersion: def.version,
      });
      try {
        await advanceFromStep({
          runId,
          config,
          stepId: config.entry,
          payload,
          now,
        });
      } catch (err) {
        result.failed += 1;
        await updateRunStatus(runId, "failed");
        await recordEvent(runId, "run_failed", "error", {
          error: err instanceof Error ? err.message : "unknown",
        });
        await appendActivity({
          accountId: payload.accountId,
          contactId: payload.contactId,
          inquiryId: payload.inquiryId,
          subject: "Workflow failed",
          body: err instanceof Error ? err.message : "Workflow failed",
          metadata: { event: "workflow_failed", run_id: runId },
        });
      }
      continue;
    }

    const client = getSupabaseServiceClient()!;
    const runId = id("wfr");
    const { error } = await client.from("crm_workflow_runs").insert({
      id: runId,
      definition_id: def.id,
      definition_key: def.key,
      definition_version: def.version,
      config_snapshot: config,
      trigger_type: payload.type,
      trigger_idempotency_key: idem,
      contact_id: payload.contactId,
      inquiry_id: payload.inquiryId ?? null,
      enrollment_id: payload.enrollmentId ?? null,
      context: {
        ...payload.context,
        accountId: payload.accountId,
      },
      status: "running",
    });
    if (error) {
      if (error.code === "23505") {
        result.skippedDuplicate += 1;
        continue;
      }
      result.failed += 1;
      console.error("[clientflow-workflow] create run failed", error.code);
      continue;
    }
    result.started += 1;
    result.runIds.push(runId);
    await recordEvent(runId, "trigger", "ok", {
      type: payload.type,
      definitionKey: def.key,
      definitionVersion: def.version,
    });
    try {
      await advanceFromStep({
        runId,
        config,
        stepId: config.entry,
        payload,
        now,
      });
    } catch (err) {
      result.failed += 1;
      await updateRunStatus(runId, "failed");
      await recordEvent(runId, "run_failed", "error", {
        error: err instanceof Error ? err.message : "unknown",
      });
      await appendActivity({
        accountId: payload.accountId,
        contactId: payload.contactId,
        inquiryId: payload.inquiryId,
        subject: "Workflow failed",
        body: err instanceof Error ? err.message : "Workflow failed",
        metadata: { event: "workflow_failed", run_id: runId },
      });
    }
  }

  return result;
}

async function loadRunPayload(runId: string): Promise<{
  config: WorkflowConfig;
  payload: TriggerPayload;
} | null> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return memoryGetWorkflowContextExtras(runId);
  }
  const client = getSupabaseServiceClient()!;
  const { data } = await client
    .from("crm_workflow_runs")
    .select("*")
    .eq("id", runId)
    .maybeSingle();
  if (!data?.config_snapshot) return null;
  const validated = validateWorkflowConfig(data.config_snapshot);
  if (!validated.ok) return null;
  const ctx = (data.context ?? {}) as TriggerPayload["context"];
  return {
    config: validated.config,
    payload: {
      type: data.trigger_type as WorkflowTriggerType,
      contactId: data.contact_id as string,
      accountId: (ctx as MemoryWorkflowContext).accountId
        ? String((ctx as MemoryWorkflowContext).accountId)
        : ((await client
            .from("crm_contacts")
            .select("account_id")
            .eq("id", data.contact_id)
            .maybeSingle()).data?.account_id as string) ?? "",
      inquiryId: (data.inquiry_id as string) ?? undefined,
      enrollmentId: (data.enrollment_id as string) ?? undefined,
      context: ctx,
    },
  };
}

async function processClaimedStep(step: {
  id: string;
  runId: string;
  stepId: string;
  stepType: string;
  actionName?: string;
  actionParams: Record<string, unknown>;
  nextStepId?: string | null;
}): Promise<"completed" | "failed" | "rescheduled"> {
  const loaded = await loadRunPayload(step.runId);
  if (!loaded) {
    await memoryFailWorkflowStep(step.id, "Run config missing");
    return "failed";
  }
  const { config, payload } = loaded;
  const def = config.steps[step.stepId];
  if (!def) {
    await recordEvent(step.runId, "step_missing", "error", { stepId: step.stepId });
    if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
      memoryFailWorkflowStep(step.id, "Step missing from snapshot");
    } else {
      await getSupabaseServiceClient()!
        .from("crm_workflow_steps")
        .update({
          status: "failed",
          last_error: "Step missing from snapshot",
          completed_at: new Date().toISOString(),
        })
        .eq("id", step.id);
    }
    await updateRunStatus(step.runId, "failed");
    await appendActivity({
      accountId: payload.accountId,
      contactId: payload.contactId,
      inquiryId: payload.inquiryId,
      subject: "Workflow failed",
      body: `Step ${step.stepId} missing from config snapshot`,
      metadata: { event: "workflow_failed", run_id: step.runId },
    });
    return "failed";
  }

  try {
    if (def.type === "delay") {
      // Due delay completed — continue to next
      await recordEvent(step.runId, "delay_completed", "ok", {
        stepId: step.stepId,
        next: def.next,
      });
      if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
        memoryCompleteWorkflowStep(step.id);
      } else {
        await getSupabaseServiceClient()!
          .from("crm_workflow_steps")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            claimed_at: null,
          })
          .eq("id", step.id);
      }
      if (def.next) {
        await advanceFromStep({
          runId: step.runId,
          config,
          stepId: def.next,
          payload,
          now: new Date(),
        });
      } else {
        await updateRunStatus(step.runId, "completed");
      }
      return "completed";
    }

    if (def.type === "action") {
      const actionResult = await executeActionStep({
        runId: step.runId,
        stepId: step.stepId,
        step: def,
        payload,
      });
      if (!actionResult.ok) {
        throw new Error(actionResult.error);
      }
      if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
        memoryCompleteWorkflowStep(step.id);
      } else {
        await getSupabaseServiceClient()!
          .from("crm_workflow_steps")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            claimed_at: null,
          })
          .eq("id", step.id);
      }
      if (actionResult.next) {
        await advanceFromStep({
          runId: step.runId,
          config,
          stepId: actionResult.next,
          payload,
          now: new Date(),
        });
      } else {
        await updateRunStatus(step.runId, "completed");
        await recordEvent(step.runId, "run_completed", "ok", {});
      }
      return "completed";
    }

    // branch should not be scheduled as a durable step in normal flow
    await advanceFromStep({
      runId: step.runId,
      config,
      stepId: step.stepId,
      payload,
      now: new Date(),
    });
    if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
      memoryCompleteWorkflowStep(step.id);
    }
    return "completed";
  } catch (err) {
    const message = err instanceof Error ? err.message : "step failed";
    await recordEvent(step.runId, "step_failed", "error", {
      stepId: step.stepId,
      error: message,
    });
    if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
      memoryFailWorkflowStep(step.id, message);
    } else {
      await getSupabaseServiceClient()!
        .from("crm_workflow_steps")
        .update({
          status: "failed",
          last_error: message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", step.id);
    }
    await updateRunStatus(step.runId, "failed");
    await appendActivity({
      accountId: payload.accountId,
      contactId: payload.contactId,
      inquiryId: payload.inquiryId,
      subject: "Workflow step failed",
      body: message,
      metadata: { event: "workflow_failed", run_id: step.runId, step_id: step.stepId },
    });
    return "failed";
  }
}

export async function processClientFlowWorkflowQueue(
  limit = 20,
): Promise<ProcessWorkflowResult> {
  const result: ProcessWorkflowResult = {
    processed: 0,
    completed: 0,
    failed: 0,
    rescheduled: 0,
  };

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    const claimed = memoryClaimDueWorkflowSteps(limit);
    for (const step of claimed) {
      result.processed += 1;
      const outcome = await processClaimedStep(step);
      if (outcome === "completed") result.completed += 1;
      else if (outcome === "failed") result.failed += 1;
      else result.rescheduled += 1;
    }
    return result;
  }

  const client = getSupabaseServiceClient()!;
  const { data: due } = await client
    .from("crm_workflow_steps")
    .select("id")
    .in("status", ["pending", "ready"])
    .lte("run_at", new Date().toISOString())
    .order("run_at", { ascending: true })
    .limit(limit);

  for (const row of due ?? []) {
    const { data: claimed } = await client.rpc("clientflow_claim_workflow_step", {
      p_id: row.id,
      p_worker_id: `wf-${crypto.randomUUID().slice(0, 8)}`,
    });
    if (!claimed) continue;
    const step = {
      id: claimed.id as string,
      runId: claimed.run_id as string,
      stepId: claimed.step_id as string,
      stepType: claimed.step_type as string,
      actionName: (claimed.action_name as string) ?? undefined,
      actionParams: (claimed.action_params as Record<string, unknown>) ?? {},
      nextStepId: (claimed.next_step_id as string) ?? null,
    };
    result.processed += 1;
    const outcome = await processClaimedStep(step);
    if (outcome === "completed") result.completed += 1;
    else if (outcome === "failed") result.failed += 1;
    else result.rescheduled += 1;
  }

  return result;
}
