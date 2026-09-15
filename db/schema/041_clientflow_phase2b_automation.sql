-- ClientFlow Phase 2B — Automation engine (no builder, no scripting runtime).
-- Delays are absolute timestamps (Mon–Fri business days). Runs snapshot config version.

-- ---------------------------------------------------------------------------
-- Follow-up email purpose + templates
-- ---------------------------------------------------------------------------

ALTER TABLE crm_email_templates DROP CONSTRAINT IF EXISTS crm_email_templates_purpose_check;
ALTER TABLE crm_email_templates
  ADD CONSTRAINT crm_email_templates_purpose_check CHECK (
    purpose IS NULL OR purpose IN ('CLIENT_ACK', 'INTERNAL_NOTIFY', 'FOLLOW_UP')
  );

ALTER TABLE crm_email_messages DROP CONSTRAINT IF EXISTS crm_email_messages_purpose_check;
ALTER TABLE crm_email_messages
  ADD CONSTRAINT crm_email_messages_purpose_check CHECK (
    purpose IN ('CLIENT_ACK', 'INTERNAL_NOTIFY', 'FOLLOW_UP')
  );

INSERT INTO crm_email_templates (
  id, key, name, subject, body_text, body_html, is_active, service_id, purpose, version
) VALUES
(
  'etpl-follow-up-oracle',
  'follow_up_oracle',
  'Oracle Transformation — Follow-up',
  'Following up on your Oracle Transformation inquiry, {{first_name}}',
  E'Hi {{first_name}},\n\nChecking in on your interest in {{service_name}} for {{company_name}}.\n\n{{consultant_name}} is available to continue the conversation.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Checking in on your interest in <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} is available to continue the conversation.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-oracle', 'FOLLOW_UP', 1
),
(
  'etpl-follow-up-general',
  'follow_up_general',
  'General — Follow-up',
  'Following up on your Consult America inquiry, {{first_name}}',
  E'Hi {{first_name}},\n\nChecking in on your interest in {{service_name}} for {{company_name}}.\n\n{{consultant_name}} is available to continue the conversation.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Checking in on your interest in <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} is available to continue the conversation.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-general', 'FOLLOW_UP', 1
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  purpose = EXCLUDED.purpose,
  service_id = EXCLUDED.service_id,
  version = EXCLUDED.version,
  is_active = TRUE,
  updated_at = NOW();

-- ---------------------------------------------------------------------------
-- Workflow definition versioning + run snapshots
-- ---------------------------------------------------------------------------

ALTER TABLE crm_workflow_definitions
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

ALTER TABLE crm_workflow_runs
  ALTER COLUMN inquiry_id DROP NOT NULL;

ALTER TABLE crm_workflow_runs
  ADD COLUMN IF NOT EXISTS enrollment_id TEXT REFERENCES crm_service_enrollments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS definition_key TEXT,
  ADD COLUMN IF NOT EXISTS definition_version INT,
  ADD COLUMN IF NOT EXISTS config_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS trigger_type TEXT,
  ADD COLUMN IF NOT EXISTS trigger_idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS context JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE crm_workflow_runs DROP CONSTRAINT IF EXISTS crm_workflow_runs_status_check;
ALTER TABLE crm_workflow_runs
  ADD CONSTRAINT crm_workflow_runs_status_check CHECK (
    status IN ('running', 'waiting', 'completed', 'failed')
  );

CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_workflow_runs_trigger_idempotency
  ON crm_workflow_runs (trigger_idempotency_key)
  WHERE trigger_idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_crm_workflow_runs_status
  ON crm_workflow_runs (status, started_at);

-- Durable scheduled / executable steps
CREATE TABLE IF NOT EXISTS crm_workflow_steps (
  id                TEXT PRIMARY KEY,
  run_id            TEXT NOT NULL REFERENCES crm_workflow_runs(id) ON DELETE CASCADE,
  step_id           TEXT NOT NULL,
  step_type         TEXT NOT NULL CHECK (step_type IN ('delay', 'action', 'branch')),
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'ready', 'claimed', 'completed', 'failed', 'skipped')
  ),
  run_at            TIMESTAMPTZ,
  claimed_at        TIMESTAMPTZ,
  claimed_by        TEXT,
  attempt_count     INT NOT NULL DEFAULT 0,
  max_attempts      INT NOT NULL DEFAULT 5,
  action_name       TEXT,
  action_params     JSONB NOT NULL DEFAULT '{}'::jsonb,
  next_step_id      TEXT,
  idempotency_key   TEXT NOT NULL,
  last_error        TEXT,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_workflow_steps_idempotency_key_unique UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_crm_workflow_steps_due
  ON crm_workflow_steps (status, run_at)
  WHERE status IN ('pending', 'ready') AND run_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_crm_workflow_steps_run
  ON crm_workflow_steps (run_id, created_at);

ALTER TABLE crm_workflow_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS crm_workflow_steps_sales ON crm_workflow_steps;
CREATE POLICY crm_workflow_steps_sales ON crm_workflow_steps
  FOR ALL USING (is_sales_staff()) WITH CHECK (is_sales_staff());
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_workflow_steps TO service_role;

-- Atomic claim for due workflow steps
CREATE OR REPLACE FUNCTION clientflow_claim_workflow_step(
  p_id TEXT,
  p_worker_id TEXT DEFAULT NULL
) RETURNS crm_workflow_steps
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row crm_workflow_steps;
  v_worker TEXT := COALESCE(NULLIF(btrim(p_worker_id), ''), 'wf-worker-' || gen_random_uuid()::text);
BEGIN
  UPDATE crm_workflow_steps AS s
     SET status = 'claimed',
         claimed_at = NOW(),
         claimed_by = v_worker,
         attempt_count = s.attempt_count + 1,
         updated_at = NOW()
   WHERE s.id = (
           SELECT e.id
             FROM crm_workflow_steps e
            WHERE e.id = p_id
              AND e.status IN ('pending', 'ready')
              AND e.attempt_count < e.max_attempts
              AND (e.run_at IS NULL OR e.run_at <= NOW())
              AND (
                e.claimed_at IS NULL
                OR e.status IN ('pending', 'ready')
                OR e.claimed_at < NOW() - INTERVAL '5 minutes'
              )
            FOR UPDATE SKIP LOCKED
            LIMIT 1
         )
  RETURNING s.* INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION clientflow_claim_workflow_step(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION clientflow_claim_workflow_step(TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION clientflow_claim_workflow_step(TEXT, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- Seeded automations (versioned persisted config — not TS-only)
-- Business days = Monday–Friday only; run_at stored as absolute timestamp at schedule time.
-- ---------------------------------------------------------------------------

INSERT INTO crm_workflow_definitions (id, key, name, status, version, config) VALUES
(
  'wfd-inquiry-follow-up',
  'inquiry_follow_up',
  'Inquiry follow-up (Oracle vs General)',
  'active',
  1,
  '{
    "schemaVersion": 1,
    "trigger": "inquiry_created",
    "entry": "branch_service",
    "steps": {
      "branch_service": {
        "type": "branch",
        "condition": { "field": "service.key", "op": "eq", "value": "oracle" },
        "then": "delay_oracle",
        "else": "delay_general"
      },
      "delay_oracle": {
        "type": "delay",
        "businessDays": 2,
        "next": "email_oracle"
      },
      "email_oracle": {
        "type": "action",
        "action": "enqueue_email",
        "templateKey": "follow_up_oracle",
        "next": "activity_oracle"
      },
      "activity_oracle": {
        "type": "action",
        "action": "write_activity",
        "subject": "Oracle follow-up automation completed",
        "body": "Follow-up email enqueued for Oracle Transformation",
        "next": null
      },
      "delay_general": {
        "type": "delay",
        "businessDays": 2,
        "next": "email_general"
      },
      "email_general": {
        "type": "action",
        "action": "enqueue_email",
        "templateKey": "follow_up_general",
        "next": "activity_general"
      },
      "activity_general": {
        "type": "action",
        "action": "write_activity",
        "subject": "General follow-up automation completed",
        "body": "Follow-up email enqueued for non-Oracle inquiry",
        "next": null
      }
    }
  }'::jsonb
),
(
  'wfd-enrollment-qualified',
  'enrollment_qualified_notice',
  'Enrollment qualified notice',
  'active',
  1,
  '{
    "schemaVersion": 1,
    "trigger": "enrollment_status_changed",
    "entry": "branch_qualified",
    "steps": {
      "branch_qualified": {
        "type": "branch",
        "condition": { "field": "enrollment.status", "op": "eq", "value": "Qualified" },
        "then": "activity_qualified",
        "else": "skip_not_qualified"
      },
      "activity_qualified": {
        "type": "action",
        "action": "write_activity",
        "subject": "Enrollment reached Qualified",
        "body": "Automation recorded enrollment qualification",
        "next": null
      },
      "skip_not_qualified": {
        "type": "action",
        "action": "write_activity",
        "subject": "Enrollment automation skipped",
        "body": "Status change was not Qualified",
        "next": null
      }
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  version = EXCLUDED.version,
  config = EXCLUDED.config,
  updated_at = NOW();
