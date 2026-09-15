-- ClientFlow Phase 2A final increment — service-specific email templates.
-- Templates describe communication only (no delays/conditions/branching).
-- Selection happens in submit; delivery remains the Phase 1 durable outbox.

-- ---------------------------------------------------------------------------
-- Schema extensions
-- ---------------------------------------------------------------------------

ALTER TABLE crm_email_templates
  ADD COLUMN IF NOT EXISTS service_id TEXT REFERENCES crm_services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

UPDATE crm_email_templates
   SET purpose = 'CLIENT_ACK',
       service_id = 'svc-general',
       version = COALESCE(version, 1),
       key = 'client_ack_general',
       name = 'General — Client acknowledgment',
       updated_at = NOW()
 WHERE id = 'etpl-client-ack';

UPDATE crm_email_templates
   SET purpose = 'INTERNAL_NOTIFY',
       service_id = NULL,
       version = COALESCE(version, 1),
       updated_at = NOW()
 WHERE id = 'etpl-internal-notify';

ALTER TABLE crm_email_templates
  DROP CONSTRAINT IF EXISTS crm_email_templates_purpose_check;
ALTER TABLE crm_email_templates
  ADD CONSTRAINT crm_email_templates_purpose_check CHECK (
    purpose IS NULL OR purpose IN ('CLIENT_ACK', 'INTERNAL_NOTIFY')
  );

-- At most one active CLIENT_ACK template per service (by key uniqueness we also use versioning).
CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_email_templates_active_client_ack_service
  ON crm_email_templates (service_id)
  WHERE purpose = 'CLIENT_ACK' AND is_active AND service_id IS NOT NULL;

ALTER TABLE crm_email_messages
  ADD COLUMN IF NOT EXISTS template_version INT;

COMMENT ON COLUMN crm_email_messages.template_version IS
  'Template version captured at enqueue time; historical rows are never rewritten when templates change.';

COMMENT ON TABLE crm_email_templates IS
  'Communication content only. Do not store delays, conditions, branching, or enrollment transitions here.';

-- ---------------------------------------------------------------------------
-- Safe render (sanitize values; strip leftover placeholders)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION clientflow_sanitize_template_value(p_value TEXT, p_max INT DEFAULT 500)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT left(
    btrim(
      regexp_replace(
        regexp_replace(COALESCE(p_value, ''), E'[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]', '', 'g'),
        '[<>]',
        '',
        'g'
      )
    ),
    GREATEST(COALESCE(p_max, 500), 1)
  );
$$;

CREATE OR REPLACE FUNCTION clientflow_render_template(p_template TEXT, p_vars JSONB)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_out TEXT := COALESCE(p_template, '');
  v_key TEXT;
  v_val TEXT;
BEGIN
  IF p_vars IS NOT NULL THEN
    FOR v_key, v_val IN SELECT key, value #>> '{}' FROM jsonb_each(p_vars)
    LOOP
      v_out := replace(
        v_out,
        '{{' || v_key || '}}',
        clientflow_sanitize_template_value(v_val, 500)
      );
    END LOOP;
  END IF;
  -- Never leak raw placeholders to clients
  v_out := regexp_replace(v_out, '\{\{[a-zA-Z_]+\}\}', '', 'g');
  RETURN v_out;
END;
$$;

CREATE OR REPLACE FUNCTION clientflow_select_client_ack_template(p_service_id TEXT)
RETURNS crm_email_templates
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_row crm_email_templates;
  v_general_id TEXT;
BEGIN
  SELECT * INTO v_row
    FROM crm_email_templates
   WHERE purpose = 'CLIENT_ACK'
     AND is_active
     AND service_id = p_service_id
   ORDER BY version DESC
   LIMIT 1;

  IF FOUND THEN
    RETURN v_row;
  END IF;

  SELECT id INTO v_general_id FROM crm_services WHERE key = 'general' LIMIT 1;

  SELECT * INTO v_row
    FROM crm_email_templates
   WHERE purpose = 'CLIENT_ACK'
     AND is_active
     AND service_id = v_general_id
   ORDER BY version DESC
   LIMIT 1;

  IF FOUND THEN
    RETURN v_row;
  END IF;

  SELECT * INTO v_row
    FROM crm_email_templates
   WHERE is_active
     AND (purpose = 'CLIENT_ACK' OR key IN ('client_ack_general', 'talk_to_expert_client_ack'))
   ORDER BY version DESC
   LIMIT 1;

  RETURN v_row;
END;
$$;

-- ---------------------------------------------------------------------------
-- Seed service-specific client acknowledgments
-- ---------------------------------------------------------------------------

INSERT INTO crm_email_templates (
  id, key, name, subject, body_text, body_html, is_active, service_id, purpose, version
) VALUES
(
  'etpl-client-ack-oracle',
  'client_ack_oracle',
  'Oracle Transformation — Client acknowledgment',
  'Thanks for reaching out about Oracle Transformation, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our Oracle practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our Oracle practice will follow up shortly.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-oracle', 'CLIENT_ACK', 1
),
(
  'etpl-client-ack-ai-data',
  'client_ack_ai_data',
  'AI & Data — Client acknowledgment',
  'Thanks for reaching out about AI & Data, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our AI & Data practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our AI & Data practice will follow up shortly.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-ai-data', 'CLIENT_ACK', 1
),
(
  'etpl-client-ack-app-eng',
  'client_ack_application_engineering',
  'Application Engineering — Client acknowledgment',
  'Thanks for reaching out about Application Engineering, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our engineering practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our engineering practice will follow up shortly.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-app-eng', 'CLIENT_ACK', 1
),
(
  'etpl-client-ack-crm-cx',
  'client_ack_crm_cx',
  'CRM & Customer Experience — Client acknowledgment',
  'Thanks for reaching out about CRM & CX, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our CRM practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our CRM practice will follow up shortly.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-crm-cx', 'CLIENT_ACK', 1
),
(
  'etpl-client-ack-managed',
  'client_ack_managed_services',
  'Managed Services — Client acknowledgment',
  'Thanks for reaching out about Managed Services, {{first_name}}',
  E'Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our Managed Services team will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America',
  '<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our Managed Services team will follow up shortly.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
  TRUE, 'svc-managed', 'CLIENT_ACK', 1
)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  service_id = EXCLUDED.service_id,
  purpose = EXCLUDED.purpose,
  version = EXCLUDED.version,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Enrich General template with shared variables (keep version 1 content upgraded in place only if still v1 seed).
UPDATE crm_email_templates
   SET subject = 'Thanks for contacting Consult America, {{first_name}}',
       body_text = E'Hi {{first_name}},\n\nThank you for reaching out to Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} will follow up within one business day.\n\nBook time: {{booking_url}}\n\n— Consult America',
       body_html = '<p>Hi {{first_name}},</p><p>Thank you for reaching out to Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} will follow up within one business day.</p><p><a href="{{booking_url}}">Book time</a></p><p>— Consult America</p>',
       purpose = 'CLIENT_ACK',
       service_id = 'svc-general',
       updated_at = NOW()
 WHERE id = 'etpl-client-ack';

-- ---------------------------------------------------------------------------
-- Submit RPC: service-aware client template + unchanged internal notify path
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS clientflow_submit_talk_to_expert(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT
);

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
  p_crm_base_url TEXT DEFAULT 'https://consultamerica-nu.vercel.app',
  p_consultant_name TEXT DEFAULT NULL,
  p_booking_url TEXT DEFAULT NULL
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
  v_enrollment_id TEXT;
  v_enrollment_created BOOLEAN := FALSE;
  v_template_ack crm_email_templates;
  v_template_int RECORD;
  v_first_name TEXT;
  v_subject TEXT;
  v_body TEXT;
  v_html TEXT;
  v_excerpt TEXT;
  v_crm_url TEXT;
  v_now TIMESTAMPTZ := NOW();
  v_existing_contact TEXT;
  v_vars JSONB;
  v_consultant TEXT;
  v_booking TEXT;
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
  v_consultant := COALESCE(NULLIF(btrim(p_consultant_name), ''), 'a Consult America practice leader');
  v_booking := COALESCE(NULLIF(btrim(p_booking_url), ''), '');

  SELECT id, name INTO v_service_id, v_service_name
    FROM crm_services
   WHERE key = COALESCE(NULLIF(btrim(p_service_key), ''), 'general')
     AND is_active
   LIMIT 1;

  IF v_service_id IS NULL THEN
    SELECT id, name INTO v_service_id, v_service_name
      FROM crm_services WHERE key = 'general' LIMIT 1;
  END IF;

  INSERT INTO crm_accounts (
    id, name, name_normalized, industry, tier, status, owner_user_id, created_at, updated_at
  ) VALUES (
    'acct-' || gen_random_uuid()::text, btrim(p_company), v_company_norm, '—', 'MID_MARKET', 'PROSPECT',
    p_owner_user_id, v_now, v_now
  )
  ON CONFLICT (name_normalized) DO UPDATE
    SET updated_at = v_now
  RETURNING id INTO v_account_id;

  SELECT id INTO v_existing_contact
    FROM crm_contacts
   WHERE email_normalized = v_email_norm
   LIMIT 1;

  IF v_existing_contact IS NULL THEN
    BEGIN
      v_contact_id := 'cont-' || gen_random_uuid()::text;
      INSERT INTO crm_contacts (
        id, account_id, name, email, email_normalized, is_primary,
        consent_at, last_inquiry_at, source_channel, created_at, updated_at
      ) VALUES (
        v_contact_id, v_account_id, btrim(p_name), btrim(p_email), v_email_norm, TRUE,
        CASE WHEN p_consent_given THEN v_now ELSE NULL END,
        v_now, p_source_channel, v_now, v_now
      );
      v_contact_created := TRUE;
    EXCEPTION
      WHEN unique_violation THEN
        SELECT id INTO v_contact_id
          FROM crm_contacts
         WHERE email_normalized = v_email_norm
         LIMIT 1;
        v_contact_created := FALSE;
        UPDATE crm_contacts SET
          name = btrim(p_name),
          email = btrim(p_email),
          account_id = v_account_id,
          last_inquiry_at = v_now,
          consent_at = CASE WHEN p_consent_given THEN COALESCE(consent_at, v_now) ELSE consent_at END,
          source_channel = COALESCE(p_source_channel, source_channel),
          updated_at = v_now
        WHERE id = v_contact_id;
    END;
  ELSE
    v_contact_id := v_existing_contact;
    v_contact_created := FALSE;
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

  SELECT id INTO v_enrollment_id
    FROM crm_service_enrollments
   WHERE contact_id = v_contact_id
     AND service_id = v_service_id
     AND status <> 'Completed'
   LIMIT 1
   FOR UPDATE;

  IF v_enrollment_id IS NULL THEN
    BEGIN
      v_enrollment_id := 'enr-' || gen_random_uuid()::text;
      INSERT INTO crm_service_enrollments (
        id, contact_id, account_id, service_id, source_inquiry_id,
        status, owner_user_id, created_at, updated_at
      ) VALUES (
        v_enrollment_id, v_contact_id, v_account_id, v_service_id, v_inquiry_id,
        'Interested', COALESCE(NULLIF(btrim(p_owner_user_id), ''), 'profile-clientflow-system'),
        v_now, v_now
      );
      v_enrollment_created := TRUE;
    EXCEPTION
      WHEN unique_violation THEN
        SELECT id INTO v_enrollment_id
          FROM crm_service_enrollments
         WHERE contact_id = v_contact_id
           AND service_id = v_service_id
           AND status <> 'Completed'
         LIMIT 1;
        v_enrollment_created := FALSE;
        UPDATE crm_service_enrollments SET
          account_id = v_account_id,
          source_inquiry_id = v_inquiry_id,
          owner_user_id = COALESCE(NULLIF(btrim(p_owner_user_id), ''), owner_user_id),
          updated_at = v_now
        WHERE id = v_enrollment_id;
    END;
  ELSE
    UPDATE crm_service_enrollments SET
      account_id = v_account_id,
      source_inquiry_id = v_inquiry_id,
      owner_user_id = COALESCE(NULLIF(btrim(p_owner_user_id), ''), owner_user_id),
      updated_at = v_now
    WHERE id = v_enrollment_id;
    v_enrollment_created := FALSE;
  END IF;

  INSERT INTO crm_activities (
    id, account_id, contact_id, inquiry_id, type, subject, body,
    created_by_user_id, created_at, metadata
  ) VALUES (
    'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
    'SYSTEM',
    CASE
      WHEN v_enrollment_created THEN v_service_name || ' enrollment created (Interested)'
      ELSE v_service_name || ' enrollment updated'
    END,
    CASE
      WHEN v_enrollment_created THEN 'Service enrollment opened from Talk to Expert'
      ELSE 'Existing open enrollment linked to new inquiry'
    END,
    p_owner_user_id, v_now + interval '1.5 milliseconds',
    jsonb_build_object(
      'event', CASE WHEN v_enrollment_created THEN 'enrollment_created' ELSE 'enrollment_updated' END,
      'enrollment_id', v_enrollment_id,
      'service_id', v_service_id,
      'status', 'Interested'
    )
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
    ('wfe-' || gen_random_uuid()::text, v_run_id, 'enrollment_upserted', 'ok',
      jsonb_build_object('enrollment_id', v_enrollment_id, 'created', v_enrollment_created), v_now),
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

  v_vars := jsonb_build_object(
    'first_name', v_first_name,
    'company_name', btrim(p_company),
    'service_name', COALESCE(v_service_name, 'General Consulting'),
    'consultant_name', v_consultant,
    'booking_url', v_booking
  );

  v_template_ack := clientflow_select_client_ack_template(v_service_id);
  SELECT * INTO v_template_int FROM crm_email_templates
   WHERE purpose = 'INTERNAL_NOTIFY' AND is_active
   ORDER BY version DESC LIMIT 1;

  IF v_template_ack.id IS NOT NULL THEN
    v_subject := clientflow_render_template(v_template_ack.subject, v_vars);
    v_body := clientflow_render_template(v_template_ack.body_text, v_vars);
    v_html := clientflow_render_template(COALESCE(v_template_ack.body_html, ''), v_vars);

    INSERT INTO crm_email_messages (
      id, contact_id, inquiry_id, account_id, template_id, template_key, template_version, purpose,
      to_address, subject, body_text, body_html, status, attempt_count, max_attempts,
      idempotency_key, created_at, updated_at
    ) VALUES (
      'cem-' || gen_random_uuid()::text, v_contact_id, v_inquiry_id, v_account_id,
      v_template_ack.id, v_template_ack.key, v_template_ack.version, 'CLIENT_ACK',
      btrim(p_email), v_subject, v_body, NULLIF(v_html, ''), 'queued', 0, 5,
      'client_ack:' || v_inquiry_id, v_now, v_now
    )
    ON CONFLICT (idempotency_key) DO NOTHING;

    INSERT INTO crm_activities (
      id, account_id, contact_id, inquiry_id, type, subject, body,
      created_by_user_id, created_at, metadata
    ) VALUES (
      'act-' || gen_random_uuid()::text, v_account_id, v_contact_id, v_inquiry_id,
      'EMAIL', 'Welcome email queued',
      'Client acknowledgment queued via ' || v_template_ack.key || ' v' || v_template_ack.version::text,
      p_owner_user_id, v_now + interval '2 milliseconds',
      jsonb_build_object(
        'event', 'client_ack_queued',
        'idempotency_key', 'client_ack:' || v_inquiry_id,
        'template_id', v_template_ack.id,
        'template_key', v_template_ack.key,
        'template_version', v_template_ack.version
      )
    );
  END IF;

  IF p_internal_notify_to IS NOT NULL AND btrim(p_internal_notify_to) <> '' AND v_template_int.id IS NOT NULL THEN
    v_crm_url := rtrim(p_crm_base_url, '/') || '/crm/contacts/' || v_contact_id;
    v_subject := clientflow_render_template(
      v_template_int.subject,
      jsonb_build_object('company_name', btrim(p_company), 'service_name', v_service_name)
    );
    v_body := clientflow_render_template(
      v_template_int.body_text,
      jsonb_build_object(
        'contact_name', btrim(p_name),
        'contact_email', btrim(p_email),
        'company_name', btrim(p_company),
        'service_name', v_service_name,
        'source_page', COALESCE(p_source_page, '—'),
        'message_excerpt', COALESCE(v_excerpt, '—'),
        'crm_url', v_crm_url
      )
    );
    v_html := clientflow_render_template(
      COALESCE(v_template_int.body_html, ''),
      jsonb_build_object(
        'contact_name', btrim(p_name),
        'contact_email', btrim(p_email),
        'company_name', btrim(p_company),
        'service_name', v_service_name,
        'source_page', COALESCE(p_source_page, '—'),
        'message_excerpt', COALESCE(v_excerpt, '—'),
        'crm_url', v_crm_url
      )
    );

    INSERT INTO crm_email_messages (
      id, contact_id, inquiry_id, account_id, template_id, template_key, template_version, purpose,
      to_address, subject, body_text, body_html, status, attempt_count, max_attempts,
      idempotency_key, created_at, updated_at
    ) VALUES (
      'cem-' || gen_random_uuid()::text, v_contact_id, v_inquiry_id, v_account_id,
      v_template_int.id, v_template_int.key, COALESCE(v_template_int.version, 1), 'INTERNAL_NOTIFY',
      btrim(p_internal_notify_to), v_subject, v_body, NULLIF(v_html, ''), 'queued', 0, 5,
      'internal_notify:' || v_inquiry_id, v_now, v_now
    )
    ON CONFLICT (idempotency_key) DO NOTHING;

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
    'serviceName', v_service_name,
    'enrollmentId', v_enrollment_id,
    'enrollmentCreated', v_enrollment_created,
    'clientTemplateId', v_template_ack.id,
    'clientTemplateKey', v_template_ack.key,
    'clientTemplateVersion', v_template_ack.version
  );
END;
$$;

REVOKE ALL ON FUNCTION clientflow_submit_talk_to_expert(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION clientflow_submit_talk_to_expert(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated, service_role;
