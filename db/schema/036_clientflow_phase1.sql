-- ClientFlow Phase 1 — Talk to Expert vertical slice inside CRM.
--
-- Entity map (reuse first — do NOT create a parallel CRM):
--   companies              → reuse crm_accounts (+ normalized_name)
--   contacts               → extend crm_contacts (email_normalized UNIQUE)
--   users                  → reuse profiles (+ sales roles via is_sales_staff)
--   activities             → extend crm_activities (SYSTEM timeline type)
--   opportunities          → unchanged (sales pipeline continues)
--   inquiries              → NEW crm_inquiries
--   services               → NEW crm_services (catalog seed)
--   email_templates        → NEW crm_email_templates (seed welcome + internal)
--   email_messages         → NEW crm_email_messages (outbox; delivery states)
--   workflow_definitions   → NEW (seed talk_to_expert only; NO builder UI)
--   workflow_runs/events   → NEW (run log for the fixed Phase 1 path)
--   service_enrollments    → DEFERRED to Phase 2 (not created here)
--
-- Outbox pattern: inquiry + queued email rows commit together.
-- Provider send happens only in application workers after commit.

-- ---------------------------------------------------------------------------
-- Accounts: normalize company name for find-or-create
-- ---------------------------------------------------------------------------

ALTER TABLE crm_accounts
  ADD COLUMN IF NOT EXISTS name_normalized TEXT;

UPDATE crm_accounts
   SET name_normalized = lower(btrim(name))
 WHERE name_normalized IS NULL;

ALTER TABLE crm_accounts
  ALTER COLUMN name_normalized SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_accounts_name_normalized
  ON crm_accounts (name_normalized);

CREATE OR REPLACE FUNCTION crm_accounts_set_name_normalized() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.name_normalized := lower(btrim(NEW.name));
  NEW.updated_at := COALESCE(NEW.updated_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_accounts_name_normalized ON crm_accounts;
CREATE TRIGGER crm_accounts_name_normalized
  BEFORE INSERT OR UPDATE OF name ON crm_accounts
  FOR EACH ROW EXECUTE FUNCTION crm_accounts_set_name_normalized();

-- ---------------------------------------------------------------------------
-- Contacts: canonical email normalization + DB-enforced dedupe
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION normalize_email(p_email TEXT) RETURNS TEXT
LANGUAGE sql IMMUTABLE STRICT
AS $$
  SELECT lower(btrim(p_email));
$$;

ALTER TABLE crm_contacts
  ADD COLUMN IF NOT EXISTS email_normalized TEXT,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_inquiry_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS source_channel TEXT;

UPDATE crm_contacts
   SET email_normalized = normalize_email(email)
 WHERE email_normalized IS NULL;

-- Collapse accidental duplicate emails before unique index (keep oldest).
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT email_normalized, (array_agg(id ORDER BY created_at ASC))[1] AS keep_id
      FROM crm_contacts
     GROUP BY email_normalized
    HAVING COUNT(*) > 1
  LOOP
    UPDATE crm_activities
       SET contact_id = r.keep_id
     WHERE contact_id IN (
       SELECT id FROM crm_contacts
        WHERE email_normalized = r.email_normalized AND id <> r.keep_id
     );
    DELETE FROM crm_contacts
     WHERE email_normalized = r.email_normalized AND id <> r.keep_id;
  END LOOP;
END $$;

ALTER TABLE crm_contacts
  ALTER COLUMN email_normalized SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_contacts_email_normalized
  ON crm_contacts (email_normalized);

CREATE OR REPLACE FUNCTION crm_contacts_set_email_normalized() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.email_normalized := normalize_email(NEW.email);
  NEW.email := btrim(NEW.email);
  NEW.updated_at := COALESCE(NEW.updated_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_contacts_email_normalized ON crm_contacts;
CREATE TRIGGER crm_contacts_email_normalized
  BEFORE INSERT OR UPDATE OF email ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION crm_contacts_set_email_normalized();

-- ---------------------------------------------------------------------------
-- Activities: allow SYSTEM timeline events from ClientFlow
-- ---------------------------------------------------------------------------

ALTER TABLE crm_activities DROP CONSTRAINT IF EXISTS crm_activities_type_check;
ALTER TABLE crm_activities
  ADD CONSTRAINT crm_activities_type_check CHECK (
    type IN ('NOTE', 'CALL', 'MEETING', 'EMAIL', 'TASK', 'SYSTEM')
  );

ALTER TABLE crm_activities
  ADD COLUMN IF NOT EXISTS inquiry_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- Services catalog (Phase 1 determination; enrollments wait for Phase 2)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS crm_services (
  id          TEXT PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 100,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO crm_services (id, key, name, sort_order) VALUES
  ('svc-general', 'general', 'General Consulting', 10),
  ('svc-oracle', 'oracle', 'Oracle Transformation', 20),
  ('svc-ai-data', 'ai_data', 'AI & Data', 30),
  ('svc-app-eng', 'application_engineering', 'Application Engineering', 40),
  ('svc-crm-cx', 'crm_cx', 'CRM & Customer Experience', 50),
  ('svc-managed', 'managed_services', 'Managed Services', 60)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Inquiries (every Talk to Expert submission)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS crm_inquiries (
  id                TEXT PRIMARY KEY,
  contact_id        TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  account_id        TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  service_id        TEXT REFERENCES crm_services(id) ON DELETE SET NULL,
  company_name      TEXT NOT NULL,
  message           TEXT,
  source_page       TEXT,
  source_channel    TEXT NOT NULL DEFAULT 'talk_to_expert',
  campaign          TEXT,
  utm               JSONB NOT NULL DEFAULT '{}'::jsonb,
  consent_given     BOOLEAN NOT NULL DEFAULT FALSE,
  status            TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'OPEN', 'QUALIFIED', 'CLOSED', 'SPAM')
  ),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_inquiries_contact_id ON crm_inquiries (contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_inquiries_account_id ON crm_inquiries (account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_inquiries_status ON crm_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_crm_inquiries_service_id ON crm_inquiries (service_id);

ALTER TABLE crm_activities
  DROP CONSTRAINT IF EXISTS crm_activities_inquiry_id_fkey;
ALTER TABLE crm_activities
  ADD CONSTRAINT crm_activities_inquiry_id_fkey
  FOREIGN KEY (inquiry_id) REFERENCES crm_inquiries(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Email templates + durable outbox (ClientFlow, separate from workforce notifications)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS crm_email_templates (
  id            TEXT PRIMARY KEY,
  key           TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  subject       TEXT NOT NULL,
  body_text     TEXT NOT NULL,
  body_html     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO crm_email_templates (id, key, name, subject, body_text, body_html) VALUES
(
  'etpl-client-ack',
  'talk_to_expert_client_ack',
  'Talk to Expert — Client acknowledgment',
  'Thanks for contacting Consult America, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for reaching out to Consult America about {{service_name}}. A practice leader will follow up within one business day.\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for reaching out to Consult America about <strong>{{service_name}}</strong>. A practice leader will follow up within one business day.</p><p>— Consult America</p>'
),
(
  'etpl-internal-notify',
  'talk_to_expert_internal_notify',
  'Talk to Expert — Internal notification',
  'New Talk to Expert inquiry — {{company_name}} / {{service_name}}',
  E'New inquiry from {{contact_name}} ({{contact_email}}) at {{company_name}}.\nService: {{service_name}}\nSource: {{source_page}}\n\nMessage:\n{{message_excerpt}}\n\nOpen in CRM: {{crm_url}}',
  '<p>New inquiry from <strong>{{contact_name}}</strong> ({{contact_email}}) at <strong>{{company_name}}</strong>.</p><p>Service: {{service_name}}<br/>Source: {{source_page}}</p><p>Message:</p><pre>{{message_excerpt}}</pre><p><a href="{{crm_url}}">Open in CRM</a></p>'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS crm_email_messages (
  id                    TEXT PRIMARY KEY,
  contact_id            TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  inquiry_id            TEXT REFERENCES crm_inquiries(id) ON DELETE SET NULL,
  account_id            TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  template_id           TEXT REFERENCES crm_email_templates(id) ON DELETE SET NULL,
  template_key          TEXT NOT NULL,
  purpose               TEXT NOT NULL CHECK (
    purpose IN ('CLIENT_ACK', 'INTERNAL_NOTIFY')
  ),
  to_address            TEXT NOT NULL,
  subject               TEXT NOT NULL,
  -- Store rendered content for audit; do not log secrets. Message excerpt only.
  body_text             TEXT NOT NULL,
  body_html             TEXT,
  status                TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'retrying', 'sent', 'failed')
  ),
  attempt_count         INT NOT NULL DEFAULT 0,
  max_attempts          INT NOT NULL DEFAULT 5,
  last_error            TEXT,
  last_attempt_at       TIMESTAMPTZ,
  sent_at               TIMESTAMPTZ,
  failed_at             TIMESTAMPTZ,
  provider_message_id   TEXT,
  idempotency_key       TEXT NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_email_messages_idempotency_key_unique UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_crm_email_messages_status
  ON crm_email_messages (status, created_at)
  WHERE status IN ('queued', 'retrying', 'failed');

CREATE INDEX IF NOT EXISTS idx_crm_email_messages_contact
  ON crm_email_messages (contact_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crm_email_messages_inquiry
  ON crm_email_messages (inquiry_id);

-- ---------------------------------------------------------------------------
-- Fixed workflow records (no visual builder)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS crm_workflow_definitions (
  id            TEXT PRIMARY KEY,
  key           TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  config        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO crm_workflow_definitions (id, key, name, config) VALUES
(
  'wfd-talk-to-expert',
  'talk_to_expert',
  'Talk to Expert → ClientFlow',
  '{"steps":["validate","upsert_contact","create_inquiry","queue_client_ack","queue_internal_notify"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS crm_workflow_runs (
  id                TEXT PRIMARY KEY,
  definition_id     TEXT NOT NULL REFERENCES crm_workflow_definitions(id),
  inquiry_id        TEXT NOT NULL REFERENCES crm_inquiries(id) ON DELETE CASCADE,
  contact_id        TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'running' CHECK (
    status IN ('running', 'completed', 'failed')
  ),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_workflow_runs_inquiry ON crm_workflow_runs (inquiry_id);
CREATE INDEX IF NOT EXISTS idx_crm_workflow_runs_contact ON crm_workflow_runs (contact_id);

CREATE TABLE IF NOT EXISTS crm_workflow_events (
  id            TEXT PRIMARY KEY,
  run_id        TEXT NOT NULL REFERENCES crm_workflow_runs(id) ON DELETE CASCADE,
  event_key     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'skipped')),
  detail        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_workflow_events_run ON crm_workflow_events (run_id, created_at);

-- ---------------------------------------------------------------------------
-- Atomic Talk to Expert submit (service_role / SECURITY DEFINER)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION clientflow_submit_talk_to_expert(
  p_name TEXT,
  p_email TEXT,
  p_company TEXT,
  p_message TEXT,
  p_source_page TEXT DEFAULT NULL,
  p_source_channel TEXT DEFAULT 'talk_to_expert',
  p_service_key TEXT DEFAULT 'general',
  p_campaign TEXT DEFAULT NULL,
  p_utm JSONB DEFAULT '{}'::jsonb,
  p_consent_given BOOLEAN DEFAULT FALSE,
  p_owner_user_id TEXT DEFAULT 'profile-clientflow-system',
  p_internal_notify_to TEXT DEFAULT NULL,
  p_crm_base_url TEXT DEFAULT 'https://consultamerica-nu.vercel.app'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_norm TEXT;
  v_company_norm TEXT;
  v_account_id TEXT;
  v_contact_id TEXT;
  v_contact_created BOOLEAN := FALSE;
  v_inquiry_id TEXT;
  v_service_id TEXT;
  v_service_name TEXT;
  v_run_id TEXT;
  v_template_ack RECORD;
  v_template_int RECORD;
  v_first_name TEXT;
  v_subject TEXT;
  v_body TEXT;
  v_html TEXT;
  v_excerpt TEXT;
  v_crm_url TEXT;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  IF p_consent_given IS NOT TRUE THEN
    RAISE EXCEPTION 'consent_required';
  END IF;

  v_email_norm := normalize_email(p_email);
  IF v_email_norm IS NULL OR position('@' IN v_email_norm) = 0 THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF btrim(COALESCE(p_name, '')) = '' OR btrim(COALESCE(p_company, '')) = '' THEN
    RAISE EXCEPTION 'required_fields';
  END IF;

  v_company_norm := lower(btrim(p_company));
  v_first_name := split_part(btrim(p_name), ' ', 1);
  v_excerpt := left(COALESCE(btrim(p_message), ''), 500);

  SELECT id, name INTO v_service_id, v_service_name
    FROM crm_services
   WHERE key = COALESCE(NULLIF(btrim(p_service_key), ''), 'general')
     AND is_active
   LIMIT 1;

  IF v_service_id IS NULL THEN
    SELECT id, name INTO v_service_id, v_service_name
      FROM crm_services WHERE key = 'general' LIMIT 1;
  END IF;

  SELECT id INTO v_account_id
    FROM crm_accounts
   WHERE name_normalized = v_company_norm
   LIMIT 1;

  IF v_account_id IS NULL THEN
    v_account_id := 'acct-' || gen_random_uuid()::text;
    INSERT INTO crm_accounts (
      id, name, name_normalized, industry, tier, status, owner_user_id, created_at, updated_at
    ) VALUES (
      v_account_id, btrim(p_company), v_company_norm, '—', 'MID_MARKET', 'PROSPECT',
      p_owner_user_id, v_now, v_now
    );
  END IF;

  SELECT id INTO v_contact_id
    FROM crm_contacts
   WHERE email_normalized = v_email_norm
   LIMIT 1;

  IF v_contact_id IS NULL THEN
    v_contact_id := 'cont-' || gen_random_uuid()::text;
    v_contact_created := TRUE;
    INSERT INTO crm_contacts (
      id, account_id, name, email, email_normalized, is_primary,
      consent_at, last_inquiry_at, source_channel, created_at, updated_at
    ) VALUES (
      v_contact_id, v_account_id, btrim(p_name), btrim(p_email), v_email_norm, TRUE,
      CASE WHEN p_consent_given THEN v_now ELSE NULL END,
      v_now, p_source_channel, v_now, v_now
    );
  ELSE
    UPDATE crm_contacts SET
      name = btrim(p_name),
      email = btrim(p_email),
      account_id = v_account_id,
      last_inquiry_at = v_now,
      consent_at = CASE WHEN p_consent_given THEN COALESCE(consent_at, v_now) ELSE consent_at END,
      source_channel = COALESCE(p_source_channel, source_channel),
      updated_at = v_now
    WHERE id = v_contact_id;
  END IF;

  v_inquiry_id := 'inq-' || gen_random_uuid()::text;
  INSERT INTO crm_inquiries (
    id, contact_id, account_id, service_id, company_name, message,
    source_page, source_channel, campaign, utm, consent_given, status, created_at, updated_at
  ) VALUES (
    v_inquiry_id, v_contact_id, v_account_id, v_service_id, btrim(p_company),
    NULLIF(btrim(COALESCE(p_message, '')), ''),
    NULLIF(btrim(COALESCE(p_source_page, '')), ''),
    COALESCE(NULLIF(btrim(p_source_channel), ''), 'talk_to_expert'),
    NULLIF(btrim(COALESCE(p_campaign, '')), ''),
    COALESCE(p_utm, '{}'::jsonb),
    p_consent_given, 'NEW', v_now, v_now
  );

  v_run_id := 'wfr-' || gen_random_uuid()::text;
  INSERT INTO crm_workflow_runs (
    id, definition_id, inquiry_id, contact_id, status, started_at, completed_at, created_at
  ) VALUES (
    v_run_id, 'wfd-talk-to-expert', v_inquiry_id, v_contact_id, 'completed', v_now, v_now, v_now
  );

  INSERT INTO crm_workflow_events (id, run_id, event_key, status, detail, created_at) VALUES
    ('wfe-' || gen_random_uuid()::text, v_run_id, 'talk_to_expert_submitted', 'ok',
      jsonb_build_object('inquiry_id', v_inquiry_id), v_now),
    ('wfe-' || gen_random_uuid()::text, v_run_id, 'contact_upserted', 'ok',
      jsonb_build_object('contact_id', v_contact_id, 'created', v_contact_created), v_now),
    ('wfe-' || gen_random_uuid()::text, v_run_id, 'inquiry_created', 'ok',
      jsonb_build_object('inquiry_id', v_inquiry_id, 'service_id', v_service_id), v_now),
    ('wfe-' || gen_random_uuid()::text, v_run_id, 'emails_queued', 'ok',
      jsonb_build_object('client_ack', true, 'internal_notify', p_internal_notify_to IS NOT NULL), v_now);

  INSERT INTO crm_activities (
    id, account_id, contact_id, inquiry_id, type, subject, body,
    created_by_user_id, created_at, metadata
  ) VALUES
  (
    'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
    'SYSTEM', 'Talk to Expert submitted',
    left(COALESCE(p_message, ''), 280),
    p_owner_user_id, v_now,
    jsonb_build_object('event', 'talk_to_expert_submitted', 'service', v_service_name)
  ),
  (
    'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
    'SYSTEM', v_service_name || ' selected',
    NULL, p_owner_user_id, v_now + interval '1 millisecond',
    jsonb_build_object('event', 'service_selected', 'service_id', v_service_id)
  );

  SELECT * INTO v_template_ack FROM crm_email_templates WHERE key = 'talk_to_expert_client_ack' AND is_active LIMIT 1;
  SELECT * INTO v_template_int FROM crm_email_templates WHERE key = 'talk_to_expert_internal_notify' AND is_active LIMIT 1;

  IF v_template_ack.id IS NOT NULL THEN
    v_subject := replace(replace(v_template_ack.subject, '{{first_name}}', v_first_name), '{{service_name}}', v_service_name);
    v_body := replace(replace(replace(v_template_ack.body_text, '{{first_name}}', v_first_name), '{{service_name}}', v_service_name), '{{company_name}}', btrim(p_company));
    v_html := replace(replace(replace(COALESCE(v_template_ack.body_html, ''), '{{first_name}}', v_first_name), '{{service_name}}', v_service_name), '{{company_name}}', btrim(p_company));

    INSERT INTO crm_email_messages (
      id, contact_id, inquiry_id, account_id, template_id, template_key, purpose,
      to_address, subject, body_text, body_html, status, attempt_count, max_attempts,
      idempotency_key, created_at, updated_at
    ) VALUES (
      'cem-' || gen_random_uuid()::text, v_contact_id, v_inquiry_id, v_account_id,
      v_template_ack.id, v_template_ack.key, 'CLIENT_ACK',
      btrim(p_email), v_subject, v_body, NULLIF(v_html, ''), 'queued', 0, 5,
      'client_ack:' || v_inquiry_id, v_now, v_now
    );

    INSERT INTO crm_activities (
      id, account_id, contact_id, inquiry_id, type, subject, body,
      created_by_user_id, created_at, metadata
    ) VALUES (
      'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
      'EMAIL', 'Welcome email queued',
      'Client acknowledgment queued for delivery',
      p_owner_user_id, v_now + interval '2 milliseconds',
      jsonb_build_object('event', 'client_ack_queued', 'idempotency_key', 'client_ack:' || v_inquiry_id)
    );
  END IF;

  IF p_internal_notify_to IS NOT NULL AND btrim(p_internal_notify_to) <> '' AND v_template_int.id IS NOT NULL THEN
    v_crm_url := rtrim(p_crm_base_url, '/') || '/crm/contacts/' || v_contact_id;
    v_subject := replace(replace(v_template_int.subject, '{{company_name}}', btrim(p_company)), '{{service_name}}', v_service_name);
    v_body := v_template_int.body_text;
    v_body := replace(v_body, '{{contact_name}}', btrim(p_name));
    v_body := replace(v_body, '{{contact_email}}', btrim(p_email));
    v_body := replace(v_body, '{{company_name}}', btrim(p_company));
    v_body := replace(v_body, '{{service_name}}', v_service_name);
    v_body := replace(v_body, '{{source_page}}', COALESCE(p_source_page, '—'));
    v_body := replace(v_body, '{{message_excerpt}}', COALESCE(v_excerpt, '—'));
    v_body := replace(v_body, '{{crm_url}}', v_crm_url);
    v_html := COALESCE(v_template_int.body_html, '');
    v_html := replace(v_html, '{{contact_name}}', btrim(p_name));
    v_html := replace(v_html, '{{contact_email}}', btrim(p_email));
    v_html := replace(v_html, '{{company_name}}', btrim(p_company));
    v_html := replace(v_html, '{{service_name}}', v_service_name);
    v_html := replace(v_html, '{{source_page}}', COALESCE(p_source_page, '—'));
    v_html := replace(v_html, '{{message_excerpt}}', COALESCE(v_excerpt, '—'));
    v_html := replace(v_html, '{{crm_url}}', v_crm_url);

    INSERT INTO crm_email_messages (
      id, contact_id, inquiry_id, account_id, template_id, template_key, purpose,
      to_address, subject, body_text, body_html, status, attempt_count, max_attempts,
      idempotency_key, created_at, updated_at
    ) VALUES (
      'cem-' || gen_random_uuid()::text, v_contact_id, v_inquiry_id, v_account_id,
      v_template_int.id, v_template_int.key, 'INTERNAL_NOTIFY',
      btrim(p_internal_notify_to), v_subject, v_body, NULLIF(v_html, ''), 'queued', 0, 5,
      'internal_notify:' || v_inquiry_id, v_now, v_now
    );

    INSERT INTO crm_activities (
      id, account_id, contact_id, inquiry_id, type, subject, body,
      created_by_user_id, created_at, metadata
    ) VALUES (
      'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
      'EMAIL', 'Internal team notification queued',
      'Sales/practice notification queued',
      p_owner_user_id, v_now + interval '3 milliseconds',
      jsonb_build_object('event', 'internal_notify_queued', 'idempotency_key', 'internal_notify:' || v_inquiry_id)
    );
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'contactId', v_contact_id,
    'accountId', v_account_id,
    'inquiryId', v_inquiry_id,
    'workflowRunId', v_run_id,
    'contactCreated', v_contact_created,
    'serviceId', v_service_id,
    'serviceName', v_service_name
  );
END;
$$;

REVOKE ALL ON FUNCTION clientflow_submit_talk_to_expert(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION clientflow_submit_talk_to_expert(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT
) TO service_role;

-- Claim one queued/retrying/failed message for send (SKIP LOCKED prevents duplicate workers).
CREATE OR REPLACE FUNCTION clientflow_claim_email_message(p_id TEXT)
RETURNS crm_email_messages
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row crm_email_messages;
BEGIN
  UPDATE crm_email_messages AS m
     SET status = 'retrying',
         last_attempt_at = NOW(),
         updated_at = NOW()
   WHERE m.id = (
           SELECT e.id
             FROM crm_email_messages e
            WHERE e.id = p_id
              AND e.status IN ('queued', 'retrying', 'failed')
              AND e.attempt_count < e.max_attempts
              AND e.provider_message_id IS NULL
            FOR UPDATE SKIP LOCKED
            LIMIT 1
         )
  RETURNING m.* INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION clientflow_claim_email_message(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION clientflow_claim_email_message(TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- RLS — same sales staff gate as existing CRM tables
-- ---------------------------------------------------------------------------

ALTER TABLE crm_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_workflow_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_services_sales ON crm_services;
CREATE POLICY crm_services_sales ON crm_services
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_inquiries_sales ON crm_inquiries;
CREATE POLICY crm_inquiries_sales ON crm_inquiries
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_email_templates_sales ON crm_email_templates;
CREATE POLICY crm_email_templates_sales ON crm_email_templates
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_email_messages_sales ON crm_email_messages;
CREATE POLICY crm_email_messages_sales ON crm_email_messages
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_workflow_definitions_sales ON crm_workflow_definitions;
CREATE POLICY crm_workflow_definitions_sales ON crm_workflow_definitions
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_workflow_runs_sales ON crm_workflow_runs;
CREATE POLICY crm_workflow_runs_sales ON crm_workflow_runs
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

DROP POLICY IF EXISTS crm_workflow_events_sales ON crm_workflow_events;
CREATE POLICY crm_workflow_events_sales ON crm_workflow_events
  FOR ALL TO authenticated
  USING (is_sales_staff()) WITH CHECK (is_sales_staff());

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_services TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_inquiries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_email_templates TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_email_messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_workflow_definitions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_workflow_runs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_workflow_events TO service_role;
