/**
 * Strict Phase 2B workflow config schema.
 * No eval, arbitrary JS/SQL, JSONPath, HTTP, loops, or user code.
 */

export const WORKFLOW_TRIGGERS = [
  "inquiry_created",
  "enrollment_status_changed",
  "email_sent",
  "email_failed",
] as const;

export type WorkflowTriggerType = (typeof WORKFLOW_TRIGGERS)[number];

export const CONDITION_FIELDS = [
  "service.key",
  "enrollment.status",
  "inquiry.source_channel",
] as const;

export type ConditionField = (typeof CONDITION_FIELDS)[number];

export const WORKFLOW_ACTIONS = [
  "enqueue_email",
  "set_enrollment_status",
  "write_activity",
] as const;

export type WorkflowActionName = (typeof WORKFLOW_ACTIONS)[number];

export type WorkflowCondition = {
  field: ConditionField;
  op: "eq";
  value: string;
};

export type WorkflowStepDef =
  | {
      type: "branch";
      condition: WorkflowCondition;
      then: string;
      else: string;
    }
  | {
      type: "delay";
      businessDays: number;
      next: string | null;
    }
  | {
      type: "action";
      action: "enqueue_email";
      templateKey: string;
      next: string | null;
    }
  | {
      type: "action";
      action: "set_enrollment_status";
      status: string;
      next: string | null;
    }
  | {
      type: "action";
      action: "write_activity";
      subject: string;
      body?: string;
      next: string | null;
    };

export type WorkflowConfig = {
  schemaVersion: 1;
  trigger: WorkflowTriggerType;
  entry: string;
  steps: Record<string, WorkflowStepDef>;
};

export type WorkflowConfigValidation =
  | { ok: true; config: WorkflowConfig }
  | { ok: false; error: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertAllowedKeys(obj: Record<string, unknown>, allowed: string[], label: string) {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) {
      throw new Error(`${label}: unknown key "${key}"`);
    }
  }
}

function parseCondition(raw: unknown): WorkflowCondition {
  if (!isPlainObject(raw)) throw new Error("condition must be an object");
  assertAllowedKeys(raw, ["field", "op", "value"], "condition");
  const field = raw.field;
  const op = raw.op;
  const value = raw.value;
  if (typeof field !== "string" || !(CONDITION_FIELDS as readonly string[]).includes(field)) {
    throw new Error(`condition.field must be one of ${CONDITION_FIELDS.join(", ")}`);
  }
  if (op !== "eq") throw new Error('condition.op must be "eq"');
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("condition.value must be a non-empty string");
  }
  return { field: field as ConditionField, op: "eq", value: value.trim() };
}

function parseStep(stepId: string, raw: unknown): WorkflowStepDef {
  if (!isPlainObject(raw)) throw new Error(`step "${stepId}" must be an object`);
  const type = raw.type;
  if (type === "branch") {
    assertAllowedKeys(raw, ["type", "condition", "then", "else"], `step "${stepId}"`);
    if (typeof raw.then !== "string" || typeof raw.else !== "string") {
      throw new Error(`step "${stepId}": branch then/else must be step ids`);
    }
    return {
      type: "branch",
      condition: parseCondition(raw.condition),
      then: raw.then,
      else: raw.else,
    };
  }
  if (type === "delay") {
    assertAllowedKeys(raw, ["type", "businessDays", "next"], `step "${stepId}"`);
    if (typeof raw.businessDays !== "number" || !Number.isInteger(raw.businessDays) || raw.businessDays < 0) {
      throw new Error(`step "${stepId}": businessDays must be a non-negative integer`);
    }
    if (raw.businessDays > 30) {
      throw new Error(`step "${stepId}": businessDays must be <= 30 in Phase 2B`);
    }
    if (raw.next !== null && typeof raw.next !== "string") {
      throw new Error(`step "${stepId}": next must be string or null`);
    }
    return {
      type: "delay",
      businessDays: raw.businessDays,
      next: raw.next as string | null,
    };
  }
  if (type === "action") {
    const action = raw.action;
    if (action === "enqueue_email") {
      assertAllowedKeys(raw, ["type", "action", "templateKey", "next"], `step "${stepId}"`);
      if (typeof raw.templateKey !== "string" || !raw.templateKey.trim()) {
        throw new Error(`step "${stepId}": templateKey required`);
      }
      if (raw.next !== null && typeof raw.next !== "string") {
        throw new Error(`step "${stepId}": next must be string or null`);
      }
      return {
        type: "action",
        action: "enqueue_email",
        templateKey: raw.templateKey.trim(),
        next: raw.next as string | null,
      };
    }
    if (action === "set_enrollment_status") {
      assertAllowedKeys(raw, ["type", "action", "status", "next"], `step "${stepId}"`);
      if (typeof raw.status !== "string" || !raw.status.trim()) {
        throw new Error(`step "${stepId}": status required`);
      }
      if (raw.next !== null && typeof raw.next !== "string") {
        throw new Error(`step "${stepId}": next must be string or null`);
      }
      return {
        type: "action",
        action: "set_enrollment_status",
        status: raw.status.trim(),
        next: raw.next as string | null,
      };
    }
    if (action === "write_activity") {
      assertAllowedKeys(raw, ["type", "action", "subject", "body", "next"], `step "${stepId}"`);
      if (typeof raw.subject !== "string" || !raw.subject.trim()) {
        throw new Error(`step "${stepId}": subject required`);
      }
      if (raw.body !== undefined && typeof raw.body !== "string") {
        throw new Error(`step "${stepId}": body must be string`);
      }
      if (raw.next !== null && typeof raw.next !== "string") {
        throw new Error(`step "${stepId}": next must be string or null`);
      }
      return {
        type: "action",
        action: "write_activity",
        subject: raw.subject.trim(),
        body: typeof raw.body === "string" ? raw.body : undefined,
        next: raw.next as string | null,
      };
    }
    throw new Error(
      `step "${stepId}": action must be one of ${WORKFLOW_ACTIONS.join(", ")}`,
    );
  }
  throw new Error(`step "${stepId}": type must be branch|delay|action`);
}

export function validateWorkflowConfig(input: unknown): WorkflowConfigValidation {
  try {
    if (!isPlainObject(input)) return { ok: false, error: "config must be an object" };
    assertAllowedKeys(input, ["schemaVersion", "trigger", "entry", "steps"], "config");

    if (input.schemaVersion !== 1) {
      return { ok: false, error: "schemaVersion must be 1" };
    }
    if (
      typeof input.trigger !== "string" ||
      !(WORKFLOW_TRIGGERS as readonly string[]).includes(input.trigger)
    ) {
      return { ok: false, error: `trigger must be one of ${WORKFLOW_TRIGGERS.join(", ")}` };
    }
    if (typeof input.entry !== "string" || !input.entry.trim()) {
      return { ok: false, error: "entry must be a step id" };
    }
    if (!isPlainObject(input.steps)) {
      return { ok: false, error: "steps must be an object map" };
    }

    const steps: Record<string, WorkflowStepDef> = {};
    for (const [stepId, raw] of Object.entries(input.steps)) {
      if (!/^[a-z][a-z0-9_]*$/i.test(stepId)) {
        return { ok: false, error: `invalid step id "${stepId}"` };
      }
      steps[stepId] = parseStep(stepId, raw);
    }

    if (!steps[input.entry]) {
      return { ok: false, error: `entry step "${input.entry}" not found` };
    }

    // Referential integrity for then/else/next — single-level only (no graph walk required for 2B)
    for (const [stepId, step] of Object.entries(steps)) {
      const refs: Array<string | null> = [];
      if (step.type === "branch") refs.push(step.then, step.else);
      if (step.type === "delay" || step.type === "action") refs.push(step.next);
      for (const ref of refs) {
        if (ref !== null && !steps[ref]) {
          return { ok: false, error: `step "${stepId}" references missing step "${ref}"` };
        }
      }
    }

    return {
      ok: true,
      config: {
        schemaVersion: 1,
        trigger: input.trigger as WorkflowTriggerType,
        entry: input.entry,
        steps,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "invalid config" };
  }
}
