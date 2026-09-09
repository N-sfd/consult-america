-- Notifications, reporting, and audit correlation.
-- Additive on top of 022/023: no existing function body is rewritten. Event
-- and notification creation hangs off AFTER triggers on the tables 022/023
-- already write to, so submit/decide/create/resolve functions keep their
-- exact tested behavior and idempotency ("reused" branches skip the UPDATE,
-- so the trigger simply never fires a second time — no dedupe table needed).

-- ---------------------------------------------------------------------------
-- Correlation id — transaction-local, lazily established by whichever of
-- audit/event/notification writes first in a transaction, read by the rest.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION current_correlation_id() RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v TEXT;
BEGIN
  v := current_setting('consultamerica.correlation_id', true);
  IF v IS NULL OR v = '' THEN
    v := 'cor-' || gen_random_uuid()::text;
    PERFORM set_config('consultamerica.correlation_id', v, true);
  END IF;
  RETURN v;
END;
$$;

ALTER TABLE workforce_audit_events ADD COLUMN IF NOT EXISTS correlation_id TEXT;
ALTER TABLE recruiting_activities ADD COLUMN IF NOT EXISTS correlation_id TEXT;
ALTER TABLE hr_request_activity ADD COLUMN IF NOT EXISTS correlation_id TEXT;

CREATE OR REPLACE FUNCTION stamp_correlation_id() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.correlation_id IS NULL THEN
    NEW.correlation_id := current_correlation_id();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workforce_audit_events_correlation ON workforce_audit_events;
CREATE TRIGGER workforce_audit_events_correlation
  BEFORE INSERT ON workforce_audit_events
  FOR EACH ROW EXECUTE FUNCTION stamp_correlation_id();

DROP TRIGGER IF EXISTS recruiting_activities_correlation ON recruiting_activities;
CREATE TRIGGER recruiting_activities_correlation
  BEFORE INSERT ON recruiting_activities
  FOR EACH ROW EXECUTE FUNCTION stamp_correlation_id();

DROP TRIGGER IF EXISTS hr_request_activity_correlation ON hr_request_activity;
CREATE TRIGGER hr_request_activity_correlation
  BEFORE INSERT ON hr_request_activity
  FOR EACH ROW EXECUTE FUNCTION stamp_correlation_id();

-- ---------------------------------------------------------------------------
-- Domain events (durable outbox). In-app notification rows are cheap enough
-- to write in the same transaction (no network call); only the email leg is
-- deferred — plpgsql cannot make an HTTP/SMTP call, so notification_deliveries
-- rows with channel='email' are the actual outbox: a separate application
-- process reads 'pending' rows and calls the pluggable email sender, so a
-- slow/unavailable provider can never roll back the business transaction.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workforce_events (
  id                    TEXT PRIMARY KEY,
  event_type            TEXT NOT NULL CHECK (event_type IN (
    'TIMESHEET_SUBMITTED', 'TIMESHEET_APPROVED', 'TIMESHEET_REJECTED',
    'LEAVE_SUBMITTED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'LEAVE_CANCELLED',
    'HR_REQUEST_CREATED', 'HR_REQUEST_ASSIGNED', 'HR_REQUEST_COMMENTED', 'HR_REQUEST_RESOLVED',
    'ONBOARDING_TASK_ASSIGNED', 'ONBOARDING_COMPLETED',
    'OFFER_SENT', 'OFFER_ACCEPTED',
    'EMPLOYEE_HIRED',
    'PAYROLL_RUN_READY', 'PAYROLL_RUN_COMPLETED'
  )),
  entity_type           TEXT NOT NULL,
  entity_id             TEXT NOT NULL,
  -- No FK on actor/employee/recipient: like workforce_audit_events.
  -- actor_employee_id (023), this is an append-only log referencing
  -- entities that regression fixtures (and real terminations) may later
  -- delete — the log should survive that, not block it.
  actor_profile_id      TEXT,
  employee_id           TEXT,
  recipient_profile_id  TEXT,
  correlation_id        TEXT NOT NULL,
  payload               JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at          TIMESTAMPTZ
);

ALTER TABLE workforce_events DROP CONSTRAINT IF EXISTS workforce_events_actor_profile_id_fkey;
ALTER TABLE workforce_events DROP CONSTRAINT IF EXISTS workforce_events_employee_id_fkey;
ALTER TABLE workforce_events DROP CONSTRAINT IF EXISTS workforce_events_recipient_profile_id_fkey;

CREATE INDEX IF NOT EXISTS idx_workforce_events_entity ON workforce_events (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_workforce_events_status ON workforce_events (status);
CREATE INDEX IF NOT EXISTS idx_workforce_events_correlation ON workforce_events (correlation_id);

CREATE OR REPLACE FUNCTION emit_workforce_event(
  p_event_type TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_actor_profile_id TEXT,
  p_employee_id TEXT,
  p_recipient_profile_id TEXT DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'::jsonb
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT := 'wfe-' || gen_random_uuid();
BEGIN
  INSERT INTO workforce_events (
    id, event_type, entity_type, entity_id, actor_profile_id, employee_id,
    recipient_profile_id, correlation_id, payload, status, created_at
  ) VALUES (
    v_id, p_event_type, p_entity_type, p_entity_id, p_actor_profile_id, p_employee_id,
    p_recipient_profile_id, current_correlation_id(), p_payload, 'pending', now()
  );
  RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- In-app notifications. The table already exists (005_self_service.sql,
-- pre-dating profiles/events) shaped for the mock store: user_id (an
-- unconstrained, never-populated-for-real string), employee_id, type,
-- action_url. Nothing writes to it yet (the mock store is entirely
-- in-memory), so this is a live-schema extension, not a data migration:
-- add the real recipient/event/correlation columns, rename type ->
-- notification_type to match the spec, and loosen employee_id since a
-- recipient (e.g. a payroll admin) does not always have one.
-- ---------------------------------------------------------------------------

-- No FK on recipient_profile_id/event_id, for the same reason as
-- workforce_events above: regression fixtures (and real account/employee
-- lifecycle changes) delete profiles/events rows that older notifications
-- may reference, and a stale notification should be readable, not blocking.
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS recipient_profile_id TEXT,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  ADD COLUMN IF NOT EXISTS entity_type TEXT,
  ADD COLUMN IF NOT EXISTS entity_id TEXT,
  ADD COLUMN IF NOT EXISTS correlation_id TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_recipient_profile_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_event_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'notifications' AND column_name = 'type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'notifications' AND column_name = 'notification_type'
  ) THEN
    ALTER TABLE notifications RENAME COLUMN type TO notification_type;
  END IF;
END $$;

ALTER TABLE notifications ALTER COLUMN employee_id DROP NOT NULL;
ALTER TABLE notifications ALTER COLUMN user_id DROP NOT NULL;

UPDATE notifications n
   SET recipient_profile_id = e.user_id
  FROM employee_profiles e
 WHERE n.employee_id = e.id
   AND n.recipient_profile_id IS NULL
   AND e.user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications (recipient_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications (recipient_profile_id) WHERE read_at IS NULL;

CREATE OR REPLACE FUNCTION protect_notification_row() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.recipient_profile_id IS DISTINCT FROM OLD.recipient_profile_id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.employee_id IS DISTINCT FROM OLD.employee_id
     OR NEW.event_id IS DISTINCT FROM OLD.event_id
     OR NEW.notification_type IS DISTINCT FROM OLD.notification_type
     OR NEW.title IS DISTINCT FROM OLD.title
     OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.action_url IS DISTINCT FROM OLD.action_url
     OR NEW.entity_type IS DISTINCT FROM OLD.entity_type
     OR NEW.entity_id IS DISTINCT FROM OLD.entity_id
     OR NEW.correlation_id IS DISTINCT FROM OLD.correlation_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
     OR NEW.expires_at IS DISTINCT FROM OLD.expires_at
  THEN
    RAISE EXCEPTION 'notifications: only read_at may be changed by the recipient';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notifications_protect ON notifications;
CREATE TRIGGER notifications_protect
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION protect_notification_row();

-- ---------------------------------------------------------------------------
-- Delivery ledger — one row per channel attempt. in_app is written and
-- marked 'sent' synchronously (it's just a row); email starts 'pending' and
-- is only ever advanced by the application-layer sender, never by SQL.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_deliveries (
  id                    TEXT PRIMARY KEY,
  notification_id       TEXT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel               TEXT NOT NULL CHECK (channel IN ('in_app', 'email')),
  recipient             TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  provider_message_id   TEXT,
  attempt_count         INT NOT NULL DEFAULT 0,
  last_attempt_at       TIMESTAMPTZ,
  sent_at               TIMESTAMPTZ,
  failed_at             TIMESTAMPTZ,
  failure_reason        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_deliveries_pending
  ON notification_deliveries (channel, status, created_at)
  WHERE status IN ('pending', 'failed');

-- ---------------------------------------------------------------------------
-- Preferences. Critical types (none yet — reserved for future security/legal
-- notices) are listed here once and are never subject to the opt-out check,
-- so a future critical notice cannot be silenced by a stale preference row.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_critical_notification_type(p_notification_type TEXT) RETURNS BOOLEAN
LANGUAGE sql IMMUTABLE
AS $$
  SELECT p_notification_type = ANY (ARRAY[]::TEXT[]);
$$;

CREATE TABLE IF NOT EXISTS notification_preferences (
  profile_id            TEXT NOT NULL REFERENCES profiles(id),
  notification_type     TEXT NOT NULL,
  in_app_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, notification_type)
);

CREATE OR REPLACE FUNCTION notification_channel_enabled(
  p_profile_id TEXT,
  p_notification_type TEXT,
  p_channel TEXT
) RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT
    CASE
      WHEN is_critical_notification_type(p_notification_type) THEN TRUE
      WHEN p_channel = 'email' THEN COALESCE(
        (SELECT email_enabled FROM notification_preferences
          WHERE profile_id = p_profile_id AND notification_type = p_notification_type),
        TRUE
      )
      ELSE COALESCE(
        (SELECT in_app_enabled FROM notification_preferences
          WHERE profile_id = p_profile_id AND notification_type = p_notification_type),
        TRUE
      )
    END;
$$;

-- ---------------------------------------------------------------------------
-- create_notification — the one shared path every trigger below calls.
-- Recipient is always resolved server-side by the caller (never a browser
-- value); this function just fans a resolved recipient out to the two
-- delivery rows. NULL recipient (e.g. identity not linked yet) is a no-op.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION create_notification(
  p_recipient_profile_id TEXT,
  p_event_id TEXT,
  p_notification_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
  v_correlation TEXT := current_correlation_id();
  v_recipient_email TEXT;
BEGIN
  IF p_recipient_profile_id IS NULL THEN
    RETURN NULL;
  END IF;

  v_id := 'ntf-' || gen_random_uuid();
  INSERT INTO notifications (
    id, recipient_profile_id, event_id, notification_type, title, message,
    entity_type, entity_id, correlation_id, created_at
  ) VALUES (
    v_id, p_recipient_profile_id, p_event_id, p_notification_type, p_title, p_message,
    p_entity_type, p_entity_id, v_correlation, now()
  );

  IF notification_channel_enabled(p_recipient_profile_id, p_notification_type, 'in_app') THEN
    INSERT INTO notification_deliveries (
      id, notification_id, channel, recipient, status, sent_at, last_attempt_at, attempt_count, created_at
    ) VALUES (
      'ntd-' || gen_random_uuid(), v_id, 'in_app', p_recipient_profile_id, 'sent', now(), now(), 1, now()
    );
  END IF;

  IF notification_channel_enabled(p_recipient_profile_id, p_notification_type, 'email') THEN
    SELECT email INTO v_recipient_email FROM profiles WHERE id = p_recipient_profile_id;
    IF v_recipient_email IS NOT NULL THEN
      INSERT INTO notification_deliveries (
        id, notification_id, channel, recipient, status, attempt_count, created_at
      ) VALUES (
        'ntd-' || gen_random_uuid(), v_id, 'email', v_recipient_email, 'pending', 0, now()
      );
    END IF;
  END IF;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION role_recipient_profile_ids(p_roles TEXT[]) RETURNS SETOF TEXT
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ur.user_id FROM user_roles ur WHERE ur.role = ANY (p_roles);
$$;

CREATE OR REPLACE FUNCTION employee_display_name(p_employee_id TEXT) RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(NULLIF(btrim(preferred_name), ''), btrim(first_name || ' ' || last_name))
    FROM employee_profiles WHERE id = p_employee_id;
$$;

-- workforce_events.actor_profile_id is a profiles(id) FK; the business
-- functions record the *acting employee* (approved_by_employee_id etc.), so
-- every actor value must be translated through this before being stored.
CREATE OR REPLACE FUNCTION employee_user_id(p_employee_id TEXT) RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT user_id FROM employee_profiles WHERE id = p_employee_id;
$$;

-- ---------------------------------------------------------------------------
-- Timesheet notifications
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_timesheet_event() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_manager_id TEXT;
  v_manager_profile TEXT;
  v_employee_profile TEXT;
  v_period TEXT := to_char(NEW.period_start, 'Mon DD') || '–' || to_char(NEW.period_end, 'Mon DD');
BEGIN
  IF NEW.status = 'SUBMITTED' THEN
    v_manager_id := authoritative_manager_id(NEW.employee_id);
    SELECT user_id INTO v_manager_profile FROM employee_profiles WHERE id = v_manager_id;

    v_event_id := emit_workforce_event(
      'TIMESHEET_SUBMITTED', 'timesheet', NEW.id, NULL, NEW.employee_id, v_manager_profile,
      jsonb_build_object('periodStart', NEW.period_start, 'periodEnd', NEW.period_end)
    );
    PERFORM create_notification(
      v_manager_profile, v_event_id, 'TIMESHEET_SUBMITTED',
      'Timesheet submitted',
      employee_display_name(NEW.employee_id) || ' submitted a timesheet for ' || v_period || '.',
      'timesheet', NEW.id
    );
  ELSIF NEW.status IN ('APPROVED', 'REJECTED') THEN
    SELECT user_id INTO v_employee_profile FROM employee_profiles WHERE id = NEW.employee_id;
    v_event_id := emit_workforce_event(
      CASE WHEN NEW.status = 'APPROVED' THEN 'TIMESHEET_APPROVED' ELSE 'TIMESHEET_REJECTED' END,
      'timesheet', NEW.id,
      CASE WHEN NEW.status = 'APPROVED' THEN employee_user_id(NEW.approved_by_employee_id) ELSE employee_user_id(NEW.rejected_by_employee_id) END,
      NEW.employee_id, v_employee_profile,
      jsonb_build_object('periodStart', NEW.period_start, 'periodEnd', NEW.period_end)
    );
    PERFORM create_notification(
      v_employee_profile, v_event_id,
      CASE WHEN NEW.status = 'APPROVED' THEN 'TIMESHEET_APPROVED' ELSE 'TIMESHEET_REJECTED' END,
      CASE WHEN NEW.status = 'APPROVED' THEN 'Timesheet approved' ELSE 'Timesheet rejected' END,
      CASE WHEN NEW.status = 'APPROVED'
        THEN 'Your timesheet for ' || v_period || ' was approved.'
        ELSE 'Your timesheet for ' || v_period || ' was rejected.' ||
             CASE WHEN NEW.rejection_reason IS NOT NULL THEN ' ' || NEW.rejection_reason ELSE '' END
      END,
      'timesheet', NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS timesheets_notify ON timesheets;
CREATE TRIGGER timesheets_notify
  AFTER UPDATE OF status ON timesheets
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('SUBMITTED', 'APPROVED', 'REJECTED'))
  EXECUTE FUNCTION notify_timesheet_event();

-- ---------------------------------------------------------------------------
-- Leave notifications
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_leave_submitted() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_manager_id TEXT;
  v_manager_profile TEXT;
BEGIN
  IF NEW.status = 'PENDING' THEN
    v_manager_id := authoritative_manager_id(NEW.employee_id);
    SELECT user_id INTO v_manager_profile FROM employee_profiles WHERE id = v_manager_id;

    v_event_id := emit_workforce_event(
      'LEAVE_SUBMITTED', 'leave_request', NEW.id, NULL, NEW.employee_id, v_manager_profile,
      jsonb_build_object('startDate', NEW.start_date, 'endDate', NEW.end_date)
    );
    PERFORM create_notification(
      v_manager_profile, v_event_id, 'LEAVE_SUBMITTED',
      'Leave request submitted',
      employee_display_name(NEW.employee_id) || ' requested leave from ' ||
        to_char(NEW.start_date, 'Mon DD') || ' to ' || to_char(NEW.end_date, 'Mon DD') || '.',
      'leave_request', NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leave_requests_notify_submit ON leave_requests;
CREATE TRIGGER leave_requests_notify_submit
  AFTER INSERT ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION notify_leave_submitted();

CREATE OR REPLACE FUNCTION notify_leave_decided() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_employee_profile TEXT;
  v_manager_profile TEXT;
  v_manager_id TEXT;
  v_range TEXT := to_char(NEW.start_date, 'Mon DD') || '–' || to_char(NEW.end_date, 'Mon DD');
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status IN ('APPROVED', 'REJECTED') THEN
    SELECT user_id INTO v_employee_profile FROM employee_profiles WHERE id = NEW.employee_id;
    v_event_id := emit_workforce_event(
      CASE WHEN NEW.status = 'APPROVED' THEN 'LEAVE_APPROVED' ELSE 'LEAVE_REJECTED' END,
      'leave_request', NEW.id,
      CASE WHEN NEW.status = 'APPROVED' THEN employee_user_id(NEW.approved_by_employee_id) ELSE employee_user_id(NEW.rejected_by_employee_id) END,
      NEW.employee_id, v_employee_profile,
      jsonb_build_object('startDate', NEW.start_date, 'endDate', NEW.end_date)
    );
    PERFORM create_notification(
      v_employee_profile, v_event_id,
      CASE WHEN NEW.status = 'APPROVED' THEN 'LEAVE_APPROVED' ELSE 'LEAVE_REJECTED' END,
      CASE WHEN NEW.status = 'APPROVED' THEN 'Leave request approved' ELSE 'Leave request rejected' END,
      CASE WHEN NEW.status = 'APPROVED'
        THEN 'Your leave request for ' || v_range || ' was approved.'
        ELSE 'Your leave request for ' || v_range || ' was rejected.' ||
             CASE WHEN NEW.rejection_reason IS NOT NULL THEN ' ' || NEW.rejection_reason ELSE '' END
      END,
      'leave_request', NEW.id
    );
  ELSIF NEW.status = 'CANCELLED' THEN
    v_manager_id := authoritative_manager_id(NEW.employee_id);
    SELECT user_id INTO v_manager_profile FROM employee_profiles WHERE id = v_manager_id;
    v_event_id := emit_workforce_event(
      'LEAVE_CANCELLED', 'leave_request', NEW.id, NULL, NEW.employee_id, v_manager_profile,
      jsonb_build_object('startDate', NEW.start_date, 'endDate', NEW.end_date)
    );
    PERFORM create_notification(
      v_manager_profile, v_event_id, 'LEAVE_CANCELLED',
      'Leave request cancelled',
      employee_display_name(NEW.employee_id) || ' cancelled their leave request for ' || v_range || '.',
      'leave_request', NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leave_requests_notify_decision ON leave_requests;
CREATE TRIGGER leave_requests_notify_decision
  AFTER UPDATE OF status ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION notify_leave_decided();

-- ---------------------------------------------------------------------------
-- HR request notifications — created fans out to the whole HR queue;
-- assigned/resolved target one person each.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_hr_request_created() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_hr_profile TEXT;
BEGIN
  v_event_id := emit_workforce_event(
    'HR_REQUEST_CREATED', 'hr_request', NEW.id, NULL, NEW.employee_id, NULL,
    jsonb_build_object('requestNumber', NEW.request_number, 'category', NEW.category)
  );
  FOR v_hr_profile IN SELECT role_recipient_profile_ids(ARRAY['HR_ADMIN', 'HR_SPECIALIST']) LOOP
    PERFORM create_notification(
      v_hr_profile, v_event_id, 'HR_REQUEST_CREATED',
      'New HR request #' || NEW.request_number,
      NEW.subject,
      'hr_request', NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hr_requests_notify_created ON hr_requests;
CREATE TRIGGER hr_requests_notify_created
  AFTER INSERT ON hr_requests
  FOR EACH ROW EXECUTE FUNCTION notify_hr_request_created();

CREATE OR REPLACE FUNCTION notify_hr_request_updated() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_employee_profile TEXT;
BEGIN
  IF NEW.assigned_to_profile_id IS DISTINCT FROM OLD.assigned_to_profile_id
     AND NEW.assigned_to_profile_id IS NOT NULL THEN
    v_event_id := emit_workforce_event(
      'HR_REQUEST_ASSIGNED', 'hr_request', NEW.id, NULL, NEW.employee_id, NEW.assigned_to_profile_id,
      jsonb_build_object('requestNumber', NEW.request_number)
    );
    PERFORM create_notification(
      NEW.assigned_to_profile_id, v_event_id, 'HR_REQUEST_ASSIGNED',
      'HR request #' || NEW.request_number || ' assigned to you',
      NEW.subject,
      'hr_request', NEW.id
    );
  END IF;

  IF NEW.status = 'RESOLVED' AND OLD.status IS DISTINCT FROM 'RESOLVED' THEN
    SELECT user_id INTO v_employee_profile FROM employee_profiles WHERE id = NEW.employee_id;
    v_event_id := emit_workforce_event(
      'HR_REQUEST_RESOLVED', 'hr_request', NEW.id, NULL, NEW.employee_id, v_employee_profile,
      jsonb_build_object('requestNumber', NEW.request_number)
    );
    PERFORM create_notification(
      v_employee_profile, v_event_id, 'HR_REQUEST_RESOLVED',
      'HR request #' || NEW.request_number || ' resolved',
      COALESCE(NEW.resolution_notes, 'Your HR request has been resolved.'),
      'hr_request', NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hr_requests_notify_updated ON hr_requests;
CREATE TRIGGER hr_requests_notify_updated
  AFTER UPDATE ON hr_requests
  FOR EACH ROW EXECUTE FUNCTION notify_hr_request_updated();

-- ---------------------------------------------------------------------------
-- Onboarding completion
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_onboarding_completed() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_employee_profile TEXT;
  v_hr_profile TEXT;
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    SELECT user_id INTO v_employee_profile FROM employee_profiles WHERE id = NEW.employee_id;
    v_event_id := emit_workforce_event(
      'ONBOARDING_COMPLETED', 'onboarding_record', NEW.id, NULL, NEW.employee_id, v_employee_profile,
      '{}'::jsonb
    );
    PERFORM create_notification(
      v_employee_profile, v_event_id, 'ONBOARDING_COMPLETED',
      'Onboarding complete',
      'All onboarding tasks are complete. Welcome aboard!',
      'onboarding_record', NEW.id
    );
    FOR v_hr_profile IN SELECT role_recipient_profile_ids(ARRAY['HR_ADMIN', 'HR_SPECIALIST']) LOOP
      PERFORM create_notification(
        v_hr_profile, v_event_id, 'ONBOARDING_COMPLETED',
        'Onboarding complete',
        employee_display_name(NEW.employee_id) || ' completed onboarding.',
        'onboarding_record', NEW.id
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS onboarding_records_notify ON onboarding_records;
CREATE TRIGGER onboarding_records_notify
  AFTER UPDATE OF status ON onboarding_records
  FOR EACH ROW EXECUTE FUNCTION notify_onboarding_completed();

-- ---------------------------------------------------------------------------
-- Hire
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_employee_hired() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_hr_profile TEXT;
BEGIN
  IF NEW.employment_status = 'PRE_HIRE' THEN
    v_event_id := emit_workforce_event(
      'EMPLOYEE_HIRED', 'employee', NEW.id, NULL, NEW.id, NULL,
      jsonb_build_object('employeeNumber', NEW.employee_number)
    );
    FOR v_hr_profile IN SELECT role_recipient_profile_ids(ARRAY['HR_ADMIN', 'HR_SPECIALIST']) LOOP
      PERFORM create_notification(
        v_hr_profile, v_event_id, 'EMPLOYEE_HIRED',
        'New hire recorded',
        employee_display_name(NEW.id) || ' (' || NEW.employee_number || ') was hired.',
        'employee', NEW.id
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS employee_profiles_notify_hired ON employee_profiles;
CREATE TRIGGER employee_profiles_notify_hired
  AFTER INSERT ON employee_profiles
  FOR EACH ROW EXECUTE FUNCTION notify_employee_hired();

-- ---------------------------------------------------------------------------
-- Offers — sent when extended, accepted when the candidate accepts. Offers
-- are written by lib/recruiting via plain UPDATE, so this stays a table
-- trigger rather than a wrapped function.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION notify_offer_event() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_hiring_manager_profile TEXT;
  v_candidate_name TEXT;
BEGIN
  SELECT r.hiring_manager_user_id, (c.first_name || ' ' || c.last_name)
    INTO v_hiring_manager_profile, v_candidate_name
    FROM applications a
    JOIN job_requisitions r ON r.id = a.requisition_id
    JOIN candidate_profiles c ON c.id = a.candidate_id
   WHERE a.id = NEW.application_id;

  IF v_hiring_manager_profile IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'EXTENDED' THEN
    v_event_id := emit_workforce_event(
      'OFFER_SENT', 'offer', NEW.id, NULL, NULL, v_hiring_manager_profile,
      jsonb_build_object('offerNumber', NEW.offer_number)
    );
    PERFORM create_notification(
      v_hiring_manager_profile, v_event_id, 'OFFER_SENT',
      'Offer extended',
      'Offer ' || NEW.offer_number || ' was extended to ' || COALESCE(v_candidate_name, 'the candidate') || '.',
      'offer', NEW.id
    );
  ELSIF NEW.status = 'ACCEPTED' THEN
    v_event_id := emit_workforce_event(
      'OFFER_ACCEPTED', 'offer', NEW.id, NULL, NULL, v_hiring_manager_profile,
      jsonb_build_object('offerNumber', NEW.offer_number)
    );
    PERFORM create_notification(
      v_hiring_manager_profile, v_event_id, 'OFFER_ACCEPTED',
      'Offer accepted',
      COALESCE(v_candidate_name, 'The candidate') || ' accepted offer ' || NEW.offer_number || '.',
      'offer', NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS offers_notify ON offers;
CREATE TRIGGER offers_notify
  AFTER UPDATE OF status ON offers
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('EXTENDED', 'ACCEPTED'))
  EXECUTE FUNCTION notify_offer_event();

-- ---------------------------------------------------------------------------
-- Payroll — a "mark ready" step is added since 023 only reaches
-- draft/processing/completed/failed; nothing previously set 'ready'.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION mark_payroll_run_ready(
  p_actor_employee_id TEXT,
  p_payroll_run_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_status TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM employee_profiles e
      JOIN user_roles r ON r.user_id = e.user_id
     WHERE e.id = p_actor_employee_id AND r.role IN ('PAYROLL_ADMIN', 'SYSTEM_ADMIN')
  ) THEN
    RAISE EXCEPTION 'non-payroll user cannot ready payroll runs';
  END IF;

  SELECT status INTO v_status FROM payroll_runs WHERE id = p_payroll_run_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payroll run not found';
  END IF;
  IF v_status = 'ready' THEN
    RETURN jsonb_build_object('payrollRunId', p_payroll_run_id, 'reused', true);
  END IF;
  IF v_status NOT IN ('draft', 'processing') THEN
    RAISE EXCEPTION 'Payroll run cannot be marked ready from status %', v_status;
  END IF;

  UPDATE payroll_runs
     SET status = 'ready', started_at = COALESCE(started_at, now()), updated_at = now()
   WHERE id = p_payroll_run_id;

  PERFORM log_workforce_audit_once(
    'PAYROLL_RUN_READY', 'payroll_run', p_payroll_run_id, p_actor_employee_id, 'Payroll run marked ready for review'
  );

  RETURN jsonb_build_object('payrollRunId', p_payroll_run_id, 'reused', false);
END;
$$;

CREATE OR REPLACE FUNCTION notify_payroll_run_event() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_payroll_profile TEXT;
  v_period TEXT;
BEGIN
  SELECT to_char(period_start, 'Mon DD') || '–' || to_char(period_end, 'Mon DD')
    INTO v_period
    FROM pay_periods WHERE id = NEW.pay_period_id;

  IF NEW.status = 'ready' THEN
    FOR v_payroll_profile IN SELECT role_recipient_profile_ids(ARRAY['PAYROLL_ADMIN']) LOOP
      v_event_id := emit_workforce_event(
        'PAYROLL_RUN_READY', 'payroll_run', NEW.id, NULL, NULL, v_payroll_profile,
        jsonb_build_object('payPeriodId', NEW.pay_period_id)
      );
      PERFORM create_notification(
        v_payroll_profile, v_event_id, 'PAYROLL_RUN_READY',
        'Payroll run ready for review',
        'Pay period ' || COALESCE(v_period, '') || ' is ready for review.',
        'payroll_run', NEW.id
      );
    END LOOP;
  ELSIF NEW.status = 'completed' THEN
    FOR v_payroll_profile IN SELECT role_recipient_profile_ids(ARRAY['PAYROLL_ADMIN']) LOOP
      v_event_id := emit_workforce_event(
        'PAYROLL_RUN_COMPLETED', 'payroll_run', NEW.id, NULL, NULL, v_payroll_profile,
        jsonb_build_object('payPeriodId', NEW.pay_period_id)
      );
      PERFORM create_notification(
        v_payroll_profile, v_event_id, 'PAYROLL_RUN_COMPLETED',
        'Payroll run completed',
        'Pay period ' || COALESCE(v_period, '') || ' has been completed.',
        'payroll_run', NEW.id
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payroll_runs_notify ON payroll_runs;
CREATE TRIGGER payroll_runs_notify
  AFTER UPDATE OF status ON payroll_runs
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('ready', 'completed'))
  EXECUTE FUNCTION notify_payroll_run_event();

-- ---------------------------------------------------------------------------
-- RLS — notifications: recipient reads/updates (read_at only) their own rows,
-- never another user's, never the recipient column itself. Events and
-- deliveries are never client-writable or client-readable; preferences are
-- self-scoped.
-- ---------------------------------------------------------------------------

ALTER TABLE workforce_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workforce_events_admin ON workforce_events;
CREATE POLICY workforce_events_admin ON workforce_events
  FOR SELECT TO authenticated
  USING (is_hr_staff() OR is_payroll_admin() OR is_recruiting_staff());

-- Supersedes the 019 policies of the same table (which matched on the
-- legacy, never-populated-for-real user_id/employee_id pair).
DROP POLICY IF EXISTS notifications_self ON notifications;
DROP POLICY IF EXISTS notifications_self_select ON notifications;
DROP POLICY IF EXISTS notifications_self_update ON notifications;

CREATE POLICY notifications_self_select ON notifications
  FOR SELECT TO authenticated
  USING (recipient_profile_id = current_profile_id());

CREATE POLICY notifications_self_update ON notifications
  FOR UPDATE TO authenticated
  USING (recipient_profile_id = current_profile_id())
  WITH CHECK (recipient_profile_id = current_profile_id());

DROP POLICY IF EXISTS notification_preferences_self ON notification_preferences;
CREATE POLICY notification_preferences_self ON notification_preferences
  FOR ALL TO authenticated
  USING (profile_id = current_profile_id())
  WITH CHECK (profile_id = current_profile_id());

-- notification_deliveries: no authenticated/anon policy at all (default deny
-- for every command) — only service_role touches delivery rows.

REVOKE ALL ON FUNCTION emit_workforce_event(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_notification(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION mark_payroll_run_ready(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION role_recipient_profile_ids(TEXT[]) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION emit_workforce_event(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO service_role;
    GRANT EXECUTE ON FUNCTION create_notification(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION mark_payroll_run_ready(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION role_recipient_profile_ids(TEXT[]) TO service_role, authenticated;
    GRANT SELECT ON workforce_events TO service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON notification_deliveries TO service_role;
    GRANT SELECT, UPDATE ON notifications TO service_role, authenticated;
    GRANT INSERT ON notifications TO service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON notification_preferences TO service_role, authenticated;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Reporting views. Each embeds its own authorization gate in the WHERE
-- clause: an unauthorized caller's underlying rows filter to zero, so the
-- view returns an empty/zero aggregate rather than leaking real numbers —
-- the same shape "employee_onboarding"/"approvals" already use.
-- ---------------------------------------------------------------------------

-- lib/workforce/operations.ts (and the rest of self-service) reads through
-- the service-role client with no user JWT at all — the actor check already
-- happened in TS (getHrSession()/requireHrActor() etc.) before the query
-- runs, matching every other read in this app. Under that connection
-- auth.uid() is NULL, so a gate of just is_hr_staff() etc. would wrongly
-- empty out these views for the exact callers meant to use them. A real
-- authenticated-but-wrong-role session always has a non-null auth.uid(), so
-- treating "no session at all" as pre-authorized only ever affects the
-- service-role path and the anon role (which has no GRANT on these views to
-- begin with) — never a logged-in user with the wrong role.
CREATE OR REPLACE FUNCTION no_session_context() RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT auth.uid() IS NULL;
$$;

CREATE OR REPLACE VIEW workforce_headcount_summary
WITH (security_invoker = true) AS
SELECT
  count(*) AS total_employees,
  count(*) FILTER (WHERE employment_status = 'ACTIVE') AS active_employees,
  count(*) FILTER (WHERE employment_status = 'ON_LEAVE') AS on_leave_employees,
  count(*) FILTER (WHERE employment_status = 'PRE_HIRE') AS pre_hire_employees,
  count(*) FILTER (WHERE employment_status = 'TERMINATED') AS terminated_employees
FROM employee_profiles
WHERE no_session_context() OR is_recruiting_staff() OR is_payroll_admin();

CREATE OR REPLACE VIEW time_submission_summary
WITH (security_invoker = true) AS
SELECT status, count(*) AS timesheet_count, COALESCE(sum(total_hours), 0) AS total_hours
FROM timesheets
WHERE no_session_context() OR is_hr_staff() OR is_payroll_admin()
GROUP BY status;

CREATE OR REPLACE VIEW leave_request_summary
WITH (security_invoker = true) AS
SELECT lt.code AS leave_type, lr.status, count(*) AS request_count, COALESCE(sum(lr.hours), 0) AS total_hours
FROM leave_requests lr
JOIN leave_types lt ON lt.id = lr.leave_type_id
WHERE no_session_context() OR is_hr_staff()
GROUP BY lt.code, lr.status;

CREATE OR REPLACE VIEW hr_request_summary
WITH (security_invoker = true) AS
SELECT category, status, count(*) AS request_count
FROM hr_requests
WHERE no_session_context() OR is_hr_staff()
GROUP BY category, status;

CREATE OR REPLACE VIEW onboarding_summary
WITH (security_invoker = true) AS
SELECT status, count(*) AS onboarding_count
FROM onboarding_records
WHERE no_session_context() OR is_hr_staff()
GROUP BY status;

CREATE OR REPLACE VIEW recruiting_pipeline_summary
WITH (security_invoker = true) AS
SELECT status, count(*) AS application_count
FROM applications
WHERE no_session_context() OR is_recruiting_staff()
GROUP BY status;

CREATE OR REPLACE VIEW payroll_run_summary
WITH (security_invoker = true) AS
SELECT
  pr.id AS payroll_run_id,
  pr.status,
  pp.period_start,
  pp.period_end,
  pp.pay_date,
  count(pre.employee_id) AS employee_count,
  COALESCE(sum(pre.regular_hours), 0) AS total_regular_hours,
  COALESCE(sum(pre.overtime_hours), 0) AS total_overtime_hours,
  COALESCE(sum(pre.gross_amount), 0) AS total_gross_amount
FROM payroll_runs pr
JOIN pay_periods pp ON pp.id = pr.pay_period_id
LEFT JOIN payroll_run_employees pre ON pre.payroll_run_id = pr.id
WHERE no_session_context() OR is_payroll_admin()
GROUP BY pr.id, pr.status, pp.period_start, pp.period_end, pp.pay_date;

-- Manager team report: always scoped to the CALLING manager's own direct
-- reports via current_employee_id() — a manager id is never accepted as an
-- argument, so one manager can never query another's team.
CREATE OR REPLACE FUNCTION manager_team_report() RETURNS TABLE (
  team_headcount BIGINT,
  pending_timesheets BIGINT,
  pending_leave BIGINT,
  approved_leave_ytd BIGINT,
  onboarding_in_progress BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH team AS (
    SELECT employee_id FROM job_assignments
     WHERE manager_employee_id = current_employee_id()
       AND assignment_status = 'ACTIVE'
       AND primary_assignment
  )
  SELECT
    (SELECT count(*) FROM team),
    (SELECT count(*) FROM timesheets WHERE employee_id IN (SELECT employee_id FROM team) AND status = 'SUBMITTED'),
    (SELECT count(*) FROM leave_requests WHERE employee_id IN (SELECT employee_id FROM team) AND status = 'PENDING'),
    (SELECT count(*) FROM leave_requests WHERE employee_id IN (SELECT employee_id FROM team) AND status = 'APPROVED' AND start_date >= date_trunc('year', CURRENT_DATE)),
    (SELECT count(*) FROM onboarding_records WHERE employee_id IN (SELECT employee_id FROM team) AND status = 'IN_PROGRESS');
$$;

REVOKE ALL ON FUNCTION manager_team_report() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION manager_team_report() TO authenticated, service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT SELECT ON workforce_headcount_summary TO authenticated, service_role;
    GRANT SELECT ON time_submission_summary TO authenticated, service_role;
    GRANT SELECT ON leave_request_summary TO authenticated, service_role;
    GRANT SELECT ON hr_request_summary TO authenticated, service_role;
    GRANT SELECT ON onboarding_summary TO authenticated, service_role;
    GRANT SELECT ON recruiting_pipeline_summary TO authenticated, service_role;
    GRANT SELECT ON payroll_run_summary TO authenticated, service_role;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Pre-existing bug fix (013_rls.sql): employee_profiles_manager's USING
-- clause queried employee_profiles from within a policy defined ON
-- employee_profiles, which self-triggers RLS evaluation again on every
-- candidate row — "infinite recursion detected in policy for relation
-- employee_profiles". It went unnoticed because every prior read path used
-- the service-role client (bypasses RLS) instead of an authenticated
-- session. workforce_headcount_summary is security_invoker and is the first
-- thing to actually SELECT employee_profiles as authenticated, which
-- surfaced it. current_employee_id() is SECURITY DEFINER, so its internal
-- lookup runs as the (superuser) function owner and does not re-enter RLS.
-- ---------------------------------------------------------------------------

-- current_employee_id() alone isn't enough: the policy's own subquery
-- against job_assignments is evaluated as the calling (non-bypassing) role,
-- and job_assignments_self (013_rls.sql) queries employee_profiles right
-- back — a second, cross-table recursion cycle. Wrapping the whole
-- membership check in one SECURITY DEFINER function keeps every lookup
-- inside the bypass boundary.
CREATE OR REPLACE FUNCTION is_direct_report_of_caller(p_employee_id TEXT) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM job_assignments
     WHERE employee_id = p_employee_id
       AND manager_employee_id = current_employee_id()
       AND assignment_status = 'ACTIVE'
  );
$$;

REVOKE ALL ON FUNCTION is_direct_report_of_caller(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_direct_report_of_caller(TEXT) TO authenticated, service_role;

DROP POLICY IF EXISTS employee_profiles_manager ON employee_profiles;
CREATE POLICY employee_profiles_manager ON employee_profiles
  FOR SELECT
  TO authenticated
  USING (is_direct_report_of_caller(id));
