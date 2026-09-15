-- ClientFlow Phase 2A — Service enrollments (foundation only).
-- No workflow builder, analytics, AI, or service-specific template branching.

CREATE TABLE IF NOT EXISTS crm_service_enrollments (
  id                  TEXT PRIMARY KEY,
  contact_id          TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  account_id          TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  service_id          TEXT NOT NULL REFERENCES crm_services(id) ON DELETE RESTRICT,
  source_inquiry_id   TEXT REFERENCES crm_inquiries(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'Interested'
                        CHECK (status IN (
                          'Interested', 'Qualified', 'Discovery',
                          'Proposal', 'Active', 'Completed'
                        )),
  owner_user_id       TEXT NOT NULL DEFAULT 'profile-clientflow-system',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One open enrollment per contact+service (Completed is terminal; a later inquiry may open a new one).
CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_service_enrollments_open
  ON crm_service_enrollments (contact_id, service_id)
  WHERE status <> 'Completed';

CREATE INDEX IF NOT EXISTS idx_crm_service_enrollments_contact
  ON crm_service_enrollments (contact_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_crm_service_enrollments_service
  ON crm_service_enrollments (service_id, status);

ALTER TABLE crm_service_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_service_enrollments_sales ON crm_service_enrollments;
CREATE POLICY crm_service_enrollments_sales ON crm_service_enrollments
  FOR ALL
  USING (is_sales_staff())
  WITH CHECK (is_sales_staff());

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_service_enrollments TO service_role;

-- Advance/set enrollment lifecycle; always append activity (never overwrite history).
CREATE OR REPLACE FUNCTION clientflow_set_enrollment_status(
  p_enrollment_id TEXT,
  p_new_status TEXT,
  p_actor_user_id TEXT DEFAULT 'profile-clientflow-system'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row crm_service_enrollments;
  v_service_name TEXT;
  v_from_status TEXT;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  IF p_new_status IS NULL OR p_new_status NOT IN (
    'Interested', 'Qualified', 'Discovery', 'Proposal', 'Active', 'Completed'
  ) THEN
    RAISE EXCEPTION 'invalid_enrollment_status';
  END IF;

  SELECT * INTO v_row
    FROM crm_service_enrollments
   WHERE id = p_enrollment_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'enrollment_not_found';
  END IF;

  IF v_row.status = p_new_status THEN
    RETURN jsonb_build_object(
      'ok', true,
      'enrollmentId', v_row.id,
      'status', v_row.status,
      'unchanged', true
    );
  END IF;

  v_from_status := v_row.status;

  UPDATE crm_service_enrollments
     SET status = p_new_status,
         updated_at = v_now
   WHERE id = v_row.id
   RETURNING * INTO v_row;

  SELECT name INTO v_service_name FROM crm_services WHERE id = v_row.service_id;

  INSERT INTO crm_activities (
    id, account_id, contact_id, inquiry_id, type, subject, body,
    created_by_user_id, created_at, metadata
  ) VALUES (
    'act-' || gen_random_uuid()::text,
    v_row.account_id,
    v_row.contact_id,
    v_row.source_inquiry_id,
    'SYSTEM',
    COALESCE(v_service_name, 'Service') || ' enrollment → ' || p_new_status,
    'Status changed from ' || v_from_status || ' to ' || p_new_status,
    COALESCE(NULLIF(btrim(p_actor_user_id), ''), 'profile-clientflow-system'),
    v_now,
    jsonb_build_object(
      'event', 'enrollment_status_changed',
      'enrollment_id', v_row.id,
      'service_id', v_row.service_id,
      'from_status', v_from_status,
      'to_status', p_new_status
    )
  );

  RETURN jsonb_build_object(
    'ok', true,
    'enrollmentId', v_row.id,
    'status', v_row.status,
    'unchanged', false
  );
END;
$$;

REVOKE ALL ON FUNCTION clientflow_set_enrollment_status(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION clientflow_set_enrollment_status(TEXT, TEXT, TEXT) TO service_role;

-- Extend Talk to Expert submit: create/update open enrollment (default Interested).
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
  v_enrollment_id TEXT;
  v_enrollment_created BOOLEAN := FALSE;
  v_template_ack RECORD;
  v_template_int RECORD;
  v_first_name TEXT;
  v_subject TEXT;
  v_body TEXT;
  v_html TEXT;
  v_excerpt TEXT;
  v_crm_url TEXT;
  v_now TIMESTAMPTZ := NOW();
  v_existing_contact TEXT;
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

  -- Enrollment: reuse open (non-Completed) for same contact+service; else create Interested.
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
    )
    ON CONFLICT (idempotency_key) DO NOTHING;

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
    'enrollmentCreated', v_enrollment_created
  );
END;
$$;
