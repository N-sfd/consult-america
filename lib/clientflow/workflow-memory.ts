import { renderTemplate, selectClientAckTemplate } from "@/lib/clientflow/templates";
import {
  validateWorkflowConfig,
  type WorkflowConfig,
  type WorkflowTriggerType,
} from "@/lib/clientflow/workflow-config";
import type { ClientFlowEmailMessage } from "@/lib/clientflow/types";

type DefRow = {
  id: string;
  key: string;
  version: number;
  status: "active" | "inactive";
  config: unknown;
};

type RunRow = {
  id: string;
  definitionId: string;
  definitionKey: string;
  definitionVersion: number;
  configSnapshot: WorkflowConfig;
  triggerType: WorkflowTriggerType;
  triggerIdempotencyKey: string;
  contactId: string;
  accountId: string;
  inquiryId?: string;
  enrollmentId?: string;
  context: Record<string, string | undefined>;
  status: "running" | "waiting" | "completed" | "failed";
};

type StepRow = {
  id: string;
  runId: string;
  stepId: string;
  stepType: string;
  status: "pending" | "ready" | "claimed" | "completed" | "failed" | "skipped";
  runAt: string | null;
  actionName?: string;
  actionParams: Record<string, unknown>;
  nextStepId?: string | null;
  idempotencyKey: string;
  attemptCount: number;
  maxAttempts: number;
  lastError?: string;
};

type EventRow = {
  id: string;
  runId: string;
  eventKey: string;
  status: "ok" | "error" | "skipped";
  detail: Record<string, unknown>;
  createdAt: string;
};

export type MemoryWorkflowContext = {
  accountId?: string;
} & Record<string, string | undefined>;

const definitions: DefRow[] = [];
const runs: RunRow[] = [];
const steps: StepRow[] = [];
const events: EventRow[] = [];
const emails: ClientFlowEmailMessage[] = [];
const activities: Array<{
  id: string;
  accountId: string;
  contactId: string;
  inquiryId?: string;
  subject: string;
  body?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}> = [];

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

const DEFAULT_FOLLOW_UP_CONFIGS: DefRow[] = [
  {
    id: "wfd-inquiry-follow-up",
    key: "inquiry_follow_up",
    version: 1,
    status: "active",
    config: {
      schemaVersion: 1,
      trigger: "inquiry_created",
      entry: "branch_service",
      steps: {
        branch_service: {
          type: "branch",
          condition: { field: "service.key", op: "eq", value: "oracle" },
          then: "delay_oracle",
          else: "delay_general",
        },
        delay_oracle: { type: "delay", businessDays: 2, next: "email_oracle" },
        email_oracle: {
          type: "action",
          action: "enqueue_email",
          templateKey: "follow_up_oracle",
          next: "activity_oracle",
        },
        activity_oracle: {
          type: "action",
          action: "write_activity",
          subject: "Oracle follow-up automation completed",
          body: "Follow-up email enqueued for Oracle Transformation",
          next: null,
        },
        delay_general: { type: "delay", businessDays: 2, next: "email_general" },
        email_general: {
          type: "action",
          action: "enqueue_email",
          templateKey: "follow_up_general",
          next: "activity_general",
        },
        activity_general: {
          type: "action",
          action: "write_activity",
          subject: "General follow-up automation completed",
          body: "Follow-up email enqueued for non-Oracle inquiry",
          next: null,
        },
      },
    },
  },
  {
    id: "wfd-enrollment-qualified",
    key: "enrollment_qualified_notice",
    version: 1,
    status: "active",
    config: {
      schemaVersion: 1,
      trigger: "enrollment_status_changed",
      entry: "branch_qualified",
      steps: {
        branch_qualified: {
          type: "branch",
          condition: { field: "enrollment.status", op: "eq", value: "Qualified" },
          then: "activity_qualified",
          else: "skip_not_qualified",
        },
        activity_qualified: {
          type: "action",
          action: "write_activity",
          subject: "Enrollment reached Qualified",
          body: "Automation recorded enrollment qualification",
          next: null,
        },
        skip_not_qualified: {
          type: "action",
          action: "write_activity",
          subject: "Enrollment automation skipped",
          body: "Status change was not Qualified",
          next: null,
        },
      },
    },
  },
];

export function resetClientFlowWorkflowMemoryForTests() {
  definitions.splice(0, definitions.length, ...DEFAULT_FOLLOW_UP_CONFIGS.map((d) => ({ ...d })));
  runs.splice(0, runs.length);
  steps.splice(0, steps.length);
  events.splice(0, events.length);
  emails.splice(0, emails.length);
  activities.splice(0, activities.length);
}

// Ensure defaults on module load for memory path
resetClientFlowWorkflowMemoryForTests();

export function memoryListActiveWorkflowDefinitions(trigger: WorkflowTriggerType) {
  return definitions
    .filter((d) => d.status === "active")
    .filter((d) => {
      const v = validateWorkflowConfig(d.config);
      return v.ok && v.config.trigger === trigger;
    })
    .map((d) => ({ id: d.id, key: d.key, version: d.version, config: d.config }));
}

export function memoryFindWorkflowRunByIdempotency(key: string) {
  return runs.find((r) => r.triggerIdempotencyKey === key);
}

export function memoryUpsertWorkflowRun(
  patch: Partial<RunRow> & { id: string },
) {
  const existing = runs.find((r) => r.id === patch.id);
  if (existing) {
    Object.assign(existing, patch);
    return existing;
  }
  const row = patch as RunRow;
  runs.push(row);
  return row;
}

export function memoryRecordWorkflowEvent(
  runId: string,
  eventKey: string,
  status: "ok" | "error" | "skipped",
  detail: Record<string, unknown>,
) {
  events.push({
    id: id("wfe"),
    runId,
    eventKey,
    status,
    detail,
    createdAt: nowIso(),
  });
}

export function memoryScheduleWorkflowStep(input: {
  runId: string;
  stepId: string;
  stepType: string;
  runAt: Date | null;
  actionName?: string;
  actionParams: Record<string, unknown>;
  nextStepId?: string | null;
  idempotencyKey: string;
  status: "pending" | "ready";
}) {
  if (steps.some((s) => s.idempotencyKey === input.idempotencyKey)) return;
  steps.push({
    id: id("wfs"),
    runId: input.runId,
    stepId: input.stepId,
    stepType: input.stepType,
    status: input.status,
    runAt: input.runAt ? input.runAt.toISOString() : nowIso(),
    actionName: input.actionName,
    actionParams: input.actionParams,
    nextStepId: input.nextStepId,
    idempotencyKey: input.idempotencyKey,
    attemptCount: 0,
    maxAttempts: 5,
  });
}

export function memoryClaimDueWorkflowSteps(limit: number) {
  const now = Date.now();
  const due = steps
    .filter(
      (s) =>
        (s.status === "pending" || s.status === "ready") &&
        s.attemptCount < s.maxAttempts &&
        (!s.runAt || new Date(s.runAt).getTime() <= now),
    )
    .sort((a, b) => (a.runAt ?? "").localeCompare(b.runAt ?? ""))
    .slice(0, limit);

  const claimed = [];
  for (const step of due) {
    step.status = "claimed";
    step.attemptCount += 1;
    claimed.push({
      id: step.id,
      runId: step.runId,
      stepId: step.stepId,
      stepType: step.stepType,
      actionName: step.actionName,
      actionParams: step.actionParams,
      nextStepId: step.nextStepId,
    });
  }
  return claimed;
}

export function memoryCompleteWorkflowStep(stepRowId: string) {
  const step = steps.find((s) => s.id === stepRowId);
  if (step) step.status = "completed";
}

export function memoryFailWorkflowStep(stepRowId: string, error: string) {
  const step = steps.find((s) => s.id === stepRowId);
  if (step) {
    step.status = "failed";
    step.lastError = error;
  }
}

export function memoryAppendActivity(input: {
  accountId: string;
  contactId: string;
  inquiryId?: string;
  subject: string;
  body?: string;
  metadata?: Record<string, unknown>;
}) {
  activities.push({
    id: id("act"),
    ...input,
    createdAt: nowIso(),
  });
}

const FOLLOW_UP_BODIES: Record<string, { subject: string; body: string }> = {
  follow_up_oracle: {
    subject: "Following up on your Oracle Transformation inquiry, {{first_name}}",
    body: "Hi {{first_name}},\n\nChecking in on your interest in {{service_name}} for {{company_name}}.\n\n{{consultant_name}} is available to continue the conversation.\n\nBook time: {{booking_url}}\n\n— Consult America",
  },
  follow_up_general: {
    subject: "Following up on your Consult America inquiry, {{first_name}}",
    body: "Hi {{first_name}},\n\nChecking in on your interest in {{service_name}} for {{company_name}}.\n\n{{consultant_name}} is available to continue the conversation.\n\nBook time: {{booking_url}}\n\n— Consult America",
  },
};

export function memoryEnqueueWorkflowEmail(input: {
  runId: string;
  stepId: string;
  templateKey: string;
  contactId: string;
  accountId: string;
  inquiryId?: string;
  idempotencyKey: string;
  toAddress: string;
  vars: Record<string, string>;
}): { ok: true } | { ok: false; error: string } {
  if (emails.some((e) => e.idempotencyKey === input.idempotencyKey)) {
    return { ok: true };
  }
  if (!input.toAddress) return { ok: false, error: "Missing contact email" };
  const tpl =
    FOLLOW_UP_BODIES[input.templateKey] ??
    ({
      subject: selectClientAckTemplate("general").subject,
      body: selectClientAckTemplate("general").bodyText,
    } as const);
  const subject = renderTemplate(tpl.subject, input.vars);
  const bodyText = renderTemplate(tpl.body, input.vars);
  emails.push({
    id: id("cem"),
    contactId: input.contactId,
    inquiryId: input.inquiryId,
    accountId: input.accountId,
    templateKey: input.templateKey,
    templateVersion: 1,
    purpose: "FOLLOW_UP",
    toAddress: input.toAddress,
    subject,
    bodyText,
    status: "queued",
    attemptCount: 0,
    maxAttempts: 5,
    idempotencyKey: input.idempotencyKey,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  return { ok: true };
}

export function memoryGetWorkflowContextExtras(runId: string): {
  config: WorkflowConfig;
  payload: {
    type: WorkflowTriggerType;
    contactId: string;
    accountId: string;
    inquiryId?: string;
    enrollmentId?: string;
    context: Record<string, string | undefined>;
  };
} | null {
  const run = runs.find((r) => r.id === runId);
  if (!run) return null;
  return {
    config: run.configSnapshot,
    payload: {
      type: run.triggerType,
      contactId: run.contactId,
      accountId: run.accountId,
      inquiryId: run.inquiryId,
      enrollmentId: run.enrollmentId,
      context: run.context,
    },
  };
}

export function memoryListWorkflowRuns() {
  return [...runs];
}

export function memoryListWorkflowSteps(runId?: string) {
  return runId ? steps.filter((s) => s.runId === runId) : [...steps];
}

export function memoryListWorkflowEvents(runId?: string) {
  return runId ? events.filter((e) => e.runId === runId) : [...events];
}

export function memoryListWorkflowEmails() {
  return [...emails];
}

export function memoryListWorkflowActivities(contactId?: string) {
  return contactId
    ? activities.filter((a) => a.contactId === contactId)
    : [...activities];
}

/** Test helper: force a pending delay step to be due now. */
export function memoryForceWorkflowStepDue(runId: string, stepId: string) {
  const step = steps.find((s) => s.runId === runId && s.stepId === stepId);
  if (step) {
    step.runAt = new Date(Date.now() - 1000).toISOString();
    step.status = "ready";
  }
}

export function memorySetDefinitionConfigForTests(
  key: string,
  config: unknown,
  version = 1,
) {
  const def = definitions.find((d) => d.key === key);
  if (def) {
    def.config = config;
    def.version = version;
  }
}
