-- Workforce operations foundation.
-- Extends existing timesheets, time_entries, leave_requests, approval_requests,
-- and hr_requests. Does not create a second employee master or a payroll engine.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_payroll_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_user_has_role('PAYROLL_ADMIN')
      OR current_user_has_role('SYSTEM_ADMIN');
$$;

CREATE OR REPLACE FUNCTION authoritative_manager_id(p_employee_id TEXT)
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT a.manager_employee_id
    FROM job_assignments a
   WHERE a.employee_id = p_employee_id
     AND a.assignment_status = 'ACTIVE'
     AND a.primary_assignment
     AND a.manager_employee_id IS NOT NULL
   ORDER BY a.created_at DESC
   LIMIT 1;
$$;

CREATE TABLE IF NOT EXISTS workforce_audit_events (
  id                 TEXT PRIMARY KEY,
  event_type         TEXT NOT NULL,
  entity_type        TEXT NOT NULL,
  entity_id          TEXT NOT NULL,
  actor_employee_id  TEXT,
  summary            TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION log_workforce_audit_once(
  p_event_type TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_actor_employee_id TEXT,
  p_summary TEXT
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM workforce_audit_events
     WHERE event_type = p_event_type
       AND entity_type = p_entity_type
       AND entity_id = p_entity_id
  ) THEN
    RETURN;
  END IF;

  INSERT INTO workforce_audit_events (
    id, event_type, entity_type, entity_id, actor_employee_id, summary, created_at
  ) VALUES (
    'wae-' || gen_random_uuid(),
    p_event_type,
    p_entity_type,
    p_entity_id,
    p_actor_employee_id,
    p_summary,
    now()
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Time
-- ---------------------------------------------------------------------------

ALTER TABLE timesheets
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

DELETE FROM timesheets a
 USING timesheets b
 WHERE a.employee_id = b.employee_id
   AND a.period_start = b.period_start
   AND a.period_end = b.period_end
   AND a.ctid > b.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS idx_timesheets_employee_period
  ON timesheets (employee_id, period_start, period_end);

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS entry_type TEXT,
  ADD COLUMN IF NOT EXISTS project_or_cost_center TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE time_entries
   SET entry_type = CASE time_type
         WHEN 'REGULAR' THEN 'regular'
         WHEN 'OVERTIME' THEN 'overtime'
         WHEN 'HOLIDAY' THEN 'holiday'
         ELSE 'other'
       END
 WHERE entry_type IS NULL;

UPDATE time_entries
   SET notes = comments
 WHERE notes IS NULL AND comments IS NOT NULL;

UPDATE time_entries
   SET status = 'draft'
 WHERE status IS NULL;

ALTER TABLE time_entries
  ALTER COLUMN status SET DEFAULT 'draft';

ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_status_check;
ALTER TABLE time_entries
  ADD CONSTRAINT time_entries_status_check
  CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'));

ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_entry_type_check;
ALTER TABLE time_entries
  ADD CONSTRAINT time_entries_entry_type_check
  CHECK (entry_type IN ('regular', 'overtime', 'pto', 'holiday', 'other'));

CREATE OR REPLACE FUNCTION protect_submitted_time_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.employee_id IS DISTINCT FROM OLD.employee_id THEN
    RAISE EXCEPTION 'time entry employee cannot be changed';
  END IF;

  IF OLD.status IN ('submitted', 'approved')
     AND current_setting('consultamerica.workforce_write', true) IS DISTINCT FROM '1'
     AND (
       NEW.hours IS DISTINCT FROM OLD.hours
       OR NEW.work_date IS DISTINCT FROM OLD.work_date
       OR NEW.entry_type IS DISTINCT FROM OLD.entry_type
       OR NEW.notes IS DISTINCT FROM OLD.notes
       OR NEW.status IS DISTINCT FROM OLD.status
     ) THEN
    RAISE EXCEPTION 'submitted time entries cannot be rewritten';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS time_entries_protect ON time_entries;
CREATE TRIGGER time_entries_protect
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION protect_submitted_time_entry();

CREATE OR REPLACE FUNCTION ensure_timesheet(
  p_employee_id TEXT,
  p_period_start DATE,
  p_period_end DATE
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
BEGIN
  IF p_period_end < p_period_start THEN
    RAISE EXCEPTION 'timesheet period is invalid';
  END IF;

  SELECT id INTO v_id
    FROM timesheets
   WHERE employee_id = p_employee_id
     AND period_start = p_period_start
     AND period_end = p_period_end
   LIMIT 1;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  v_id := 'ts-' || gen_random_uuid();
  INSERT INTO timesheets (
    id, employee_id, period_start, period_end, status, total_hours, created_at, updated_at
  ) VALUES (
    v_id, p_employee_id, p_period_start, p_period_end, 'DRAFT', 0, now(), now()
  )
  ON CONFLICT (employee_id, period_start, period_end) DO NOTHING;

  SELECT id INTO v_id
    FROM timesheets
   WHERE employee_id = p_employee_id
     AND period_start = p_period_start
     AND period_end = p_period_end;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION save_time_entry_draft(
  p_employee_id TEXT,
  p_timesheet_id TEXT,
  p_work_date DATE,
  p_hours NUMERIC,
  p_entry_type TEXT,
  p_notes TEXT DEFAULT NULL,
  p_project_or_cost_center TEXT DEFAULT NULL
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_sheet RECORD;
  v_id TEXT;
  v_type TEXT := lower(COALESCE(p_entry_type, 'regular'));
  v_legacy TEXT;
BEGIN
  SELECT * INTO v_sheet FROM timesheets WHERE id = p_timesheet_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Timesheet not found';
  END IF;
  IF v_sheet.employee_id IS DISTINCT FROM p_employee_id THEN
    RAISE EXCEPTION 'Forbidden: cannot edit another employee timesheet';
  END IF;
  IF v_sheet.status NOT IN ('DRAFT', 'REOPENED', 'REJECTED') THEN
    RAISE EXCEPTION 'Only draft timesheets can be edited';
  END IF;
  IF p_work_date < v_sheet.period_start OR p_work_date > v_sheet.period_end THEN
    RAISE EXCEPTION 'Work date is outside the timesheet period';
  END IF;
  IF p_hours < 0 OR p_hours > 24 THEN
    RAISE EXCEPTION 'Hours must be between 0 and 24';
  END IF;
  IF v_type NOT IN ('regular', 'overtime', 'pto', 'holiday', 'other') THEN
    RAISE EXCEPTION 'Unsupported time entry type';
  END IF;

  v_legacy := CASE v_type
    WHEN 'regular' THEN 'REGULAR'
    WHEN 'overtime' THEN 'OVERTIME'
    WHEN 'holiday' THEN 'HOLIDAY'
    ELSE 'ADMIN'
  END;

  SELECT id INTO v_id
    FROM time_entries
   WHERE timesheet_id = p_timesheet_id
     AND work_date = p_work_date
     AND entry_type = v_type
   LIMIT 1;

  IF v_id IS NULL THEN
    v_id := 'te-' || gen_random_uuid();
    INSERT INTO time_entries (
      id, timesheet_id, employee_id, work_date, hours, time_type, comments,
      entry_type, notes, project_or_cost_center, status, created_at, updated_at
    ) VALUES (
      v_id, p_timesheet_id, p_employee_id, p_work_date, p_hours, v_legacy, p_notes,
      v_type, p_notes, p_project_or_cost_center, 'draft', now(), now()
    );
  ELSE
    UPDATE time_entries
       SET hours = p_hours,
           notes = p_notes,
           comments = p_notes,
           project_or_cost_center = p_project_or_cost_center,
           status = 'draft',
           updated_at = now()
     WHERE id = v_id
       AND employee_id = p_employee_id
       AND status IN ('draft', 'rejected');
  END IF;

  UPDATE timesheets
     SET total_hours = (
           SELECT COALESCE(SUM(hours), 0) FROM time_entries WHERE timesheet_id = p_timesheet_id
         ),
         updated_at = now()
   WHERE id = p_timesheet_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION submit_employee_timesheet(
  p_employee_id TEXT,
  p_timesheet_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_sheet RECORD;
  v_manager TEXT;
  v_approval_id TEXT;
BEGIN
  SELECT * INTO v_sheet FROM timesheets WHERE id = p_timesheet_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Timesheet not found';
  END IF;
  IF v_sheet.employee_id IS DISTINCT FROM p_employee_id THEN
    RAISE EXCEPTION 'Forbidden: cannot submit another employee timesheet';
  END IF;

  IF v_sheet.status IN ('SUBMITTED', 'APPROVED') THEN
    RETURN jsonb_build_object('timesheetId', p_timesheet_id, 'reused', true);
  END IF;

  IF v_sheet.status NOT IN ('DRAFT', 'REOPENED', 'REJECTED') THEN
    RAISE EXCEPTION 'Timesheet cannot be submitted from status %', v_sheet.status;
  END IF;

  v_manager := authoritative_manager_id(p_employee_id);
  IF v_manager IS NOT NULL AND v_manager = p_employee_id THEN
    v_manager := NULL;
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '1', true);

  UPDATE timesheets
     SET status = 'SUBMITTED',
         submitted_at = COALESCE(submitted_at, now()),
         updated_at = now()
   WHERE id = p_timesheet_id;

  UPDATE time_entries
     SET status = 'submitted',
         submitted_at = COALESCE(submitted_at, now()),
         updated_at = now()
   WHERE timesheet_id = p_timesheet_id
     AND status IN ('draft', 'rejected');

  PERFORM set_config('consultamerica.workforce_write', '0', true);

  IF v_manager IS NOT NULL THEN
    SELECT id INTO v_approval_id
      FROM approval_requests
     WHERE request_type = 'TIMESHEET'
       AND request_id = p_timesheet_id
       AND status = 'PENDING'
     LIMIT 1;

    IF v_approval_id IS NULL THEN
      v_approval_id := 'apr-' || gen_random_uuid();
      INSERT INTO approval_requests (
        id, request_type, request_id, requester_employee_id, approver_employee_id,
        status, summary, submitted_at
      ) VALUES (
        v_approval_id, 'TIMESHEET', p_timesheet_id, p_employee_id, v_manager,
        'PENDING', 'Timesheet submitted', now()
      );
    END IF;
  END IF;

  PERFORM log_workforce_audit_once(
    'TIMESHEET_SUBMITTED',
    'timesheet',
    p_timesheet_id,
    p_employee_id,
    'Timesheet submitted'
  );

  RETURN jsonb_build_object(
    'timesheetId', p_timesheet_id,
    'reused', false,
    'approvalId', v_approval_id,
    'approverEmployeeId', v_manager
  );
END;
$$;

CREATE OR REPLACE FUNCTION decide_timesheet(
  p_actor_employee_id TEXT,
  p_timesheet_id TEXT,
  p_decision TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_sheet RECORD;
  v_manager TEXT;
BEGIN
  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Unsupported timesheet decision';
  END IF;

  SELECT * INTO v_sheet FROM timesheets WHERE id = p_timesheet_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Timesheet not found';
  END IF;
  IF v_sheet.status = 'APPROVED' AND p_decision = 'approved' THEN
    RETURN jsonb_build_object('timesheetId', p_timesheet_id, 'reused', true);
  END IF;
  IF v_sheet.status IS DISTINCT FROM 'SUBMITTED' THEN
    RAISE EXCEPTION 'Only submitted timesheets can be decided';
  END IF;
  IF p_actor_employee_id = v_sheet.employee_id THEN
    RAISE EXCEPTION 'employee cannot approve own timesheet';
  END IF;

  v_manager := authoritative_manager_id(v_sheet.employee_id);
  IF v_manager IS NULL OR v_manager IS DISTINCT FROM p_actor_employee_id THEN
    RAISE EXCEPTION 'manager cannot approve outside reporting scope';
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '1', true);

  IF p_decision = 'approved' THEN
    UPDATE timesheets
       SET status = 'APPROVED',
           approved_at = now(),
           approved_by_employee_id = p_actor_employee_id,
           updated_at = now()
     WHERE id = p_timesheet_id;

    UPDATE time_entries
       SET status = 'approved',
           approved_at = now(),
           approved_by_employee_id = p_actor_employee_id,
           updated_at = now()
     WHERE timesheet_id = p_timesheet_id;

    UPDATE approval_requests
       SET status = 'APPROVED',
           acted_at = now()
     WHERE request_type = 'TIMESHEET'
       AND request_id = p_timesheet_id
       AND status = 'PENDING';

    PERFORM log_workforce_audit_once(
      'TIMESHEET_APPROVED', 'timesheet', p_timesheet_id, p_actor_employee_id, 'Timesheet approved'
    );
  ELSE
    UPDATE timesheets
       SET status = 'REJECTED',
           rejected_at = now(),
           rejected_by_employee_id = p_actor_employee_id,
           rejection_reason = p_reason,
           updated_at = now()
     WHERE id = p_timesheet_id;

    UPDATE time_entries
       SET status = 'rejected',
           rejected_at = now(),
           rejected_by_employee_id = p_actor_employee_id,
           rejection_reason = p_reason,
           updated_at = now()
     WHERE timesheet_id = p_timesheet_id;

    UPDATE approval_requests
       SET status = 'REJECTED',
           acted_at = now()
     WHERE request_type = 'TIMESHEET'
       AND request_id = p_timesheet_id
       AND status = 'PENDING';

    PERFORM log_workforce_audit_once(
      'TIMESHEET_REJECTED', 'timesheet', p_timesheet_id, p_actor_employee_id, 'Timesheet rejected'
    );
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '0', true);

  RETURN jsonb_build_object('timesheetId', p_timesheet_id, 'reused', false);
END;
$$;

-- ---------------------------------------------------------------------------
-- Leave
-- ---------------------------------------------------------------------------

ALTER TABLE leave_requests
  ADD COLUMN IF NOT EXISTS leave_type TEXT,
  ADD COLUMN IF NOT EXISTS hours_requested NUMERIC,
  ADD COLUMN IF NOT EXISTS reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

UPDATE leave_requests
   SET hours_requested = hours
 WHERE hours_requested IS NULL;

UPDATE leave_requests
   SET reason = comments
 WHERE reason IS NULL AND comments IS NOT NULL;

INSERT INTO leave_types (id, code, name, paid, requires_approval, status)
VALUES
  ('lt-vacation', 'vacation', 'Vacation', TRUE, TRUE, 'ACTIVE'),
  ('lt-sick', 'sick', 'Sick', TRUE, TRUE, 'ACTIVE'),
  ('lt-personal', 'personal', 'Personal', TRUE, TRUE, 'ACTIVE'),
  ('lt-bereavement', 'bereavement', 'Bereavement', TRUE, TRUE, 'ACTIVE'),
  ('lt-jury-duty', 'jury_duty', 'Jury Duty', TRUE, TRUE, 'ACTIVE'),
  ('lt-other', 'other', 'Other', TRUE, TRUE, 'ACTIVE')
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION protect_leave_request()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.employee_id IS DISTINCT FROM OLD.employee_id THEN
    RAISE EXCEPTION 'leave request employee cannot be changed';
  END IF;

  IF OLD.status = 'APPROVED'
     AND current_setting('consultamerica.workforce_write', true) IS DISTINCT FROM '1'
     AND (
       NEW.start_date IS DISTINCT FROM OLD.start_date
       OR NEW.end_date IS DISTINCT FROM OLD.end_date
       OR NEW.approved_by_employee_id IS DISTINCT FROM OLD.approved_by_employee_id
     ) THEN
    RAISE EXCEPTION 'approved leave history cannot be rewritten';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leave_requests_protect ON leave_requests;
CREATE TRIGGER leave_requests_protect
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION protect_leave_request();

CREATE OR REPLACE FUNCTION submit_leave_request(
  p_employee_id TEXT,
  p_leave_type TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_hours NUMERIC,
  p_reason TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_type_id TEXT;
  v_id TEXT;
  v_manager TEXT;
  v_approval_id TEXT;
BEGIN
  IF p_end_date < p_start_date THEN
    RAISE EXCEPTION 'leave end date must be on or after the start date';
  END IF;

  SELECT id INTO v_type_id
    FROM leave_types
   WHERE code = lower(p_leave_type)
     AND status = 'ACTIVE';
  IF v_type_id IS NULL THEN
    RAISE EXCEPTION 'Unsupported leave type';
  END IF;

  v_manager := authoritative_manager_id(p_employee_id);
  IF v_manager = p_employee_id THEN
    v_manager := NULL;
  END IF;

  v_id := 'lr-' || gen_random_uuid();
  INSERT INTO leave_requests (
    id, employee_id, leave_type_id, leave_type, start_date, end_date, hours,
    hours_requested, status, comments, reason, submitted_at, created_at, updated_at
  ) VALUES (
    v_id, p_employee_id, v_type_id, lower(p_leave_type), p_start_date, p_end_date, p_hours,
    p_hours, 'PENDING', p_reason, p_reason, now(), now(), now()
  );

  IF v_manager IS NOT NULL THEN
    v_approval_id := 'apr-' || gen_random_uuid();
    INSERT INTO approval_requests (
      id, request_type, request_id, requester_employee_id, approver_employee_id,
      status, summary, submitted_at
    ) VALUES (
      v_approval_id, 'LEAVE', v_id, p_employee_id, v_manager,
      'PENDING', 'Leave request submitted', now()
    );
  END IF;

  PERFORM log_workforce_audit_once(
    'LEAVE_SUBMITTED', 'leave_request', v_id, p_employee_id, 'Leave submitted'
  );

  RETURN jsonb_build_object('leaveRequestId', v_id, 'approvalId', v_approval_id);
END;
$$;

CREATE OR REPLACE FUNCTION decide_leave_request(
  p_actor_employee_id TEXT,
  p_leave_request_id TEXT,
  p_decision TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_req RECORD;
  v_manager TEXT;
BEGIN
  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Unsupported leave decision';
  END IF;

  SELECT * INTO v_req FROM leave_requests WHERE id = p_leave_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Leave request not found';
  END IF;
  IF v_req.status = 'APPROVED' AND p_decision = 'approved' THEN
    RETURN jsonb_build_object('leaveRequestId', p_leave_request_id, 'reused', true);
  END IF;
  IF v_req.status IS DISTINCT FROM 'PENDING' THEN
    RAISE EXCEPTION 'Only submitted leave can be decided';
  END IF;
  IF p_actor_employee_id = v_req.employee_id THEN
    RAISE EXCEPTION 'employee cannot approve own leave';
  END IF;

  v_manager := authoritative_manager_id(v_req.employee_id);
  IF v_manager IS NULL OR v_manager IS DISTINCT FROM p_actor_employee_id THEN
    RAISE EXCEPTION 'manager cannot approve outside reporting scope';
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '1', true);

  IF p_decision = 'approved' THEN
    UPDATE leave_requests
       SET status = 'APPROVED',
           approved_at = now(),
           approved_by_employee_id = p_actor_employee_id,
           updated_at = now()
     WHERE id = p_leave_request_id;

    UPDATE approval_requests
       SET status = 'APPROVED', acted_at = now()
     WHERE request_type = 'LEAVE' AND request_id = p_leave_request_id AND status = 'PENDING';

    PERFORM log_workforce_audit_once(
      'LEAVE_APPROVED', 'leave_request', p_leave_request_id, p_actor_employee_id, 'Leave approved'
    );
  ELSE
    UPDATE leave_requests
       SET status = 'REJECTED',
           rejected_at = now(),
           rejected_by_employee_id = p_actor_employee_id,
           rejection_reason = p_reason,
           updated_at = now()
     WHERE id = p_leave_request_id;

    UPDATE approval_requests
       SET status = 'REJECTED', acted_at = now()
     WHERE request_type = 'LEAVE' AND request_id = p_leave_request_id AND status = 'PENDING';

    PERFORM log_workforce_audit_once(
      'LEAVE_REJECTED', 'leave_request', p_leave_request_id, p_actor_employee_id, 'Leave rejected'
    );
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '0', true);
  RETURN jsonb_build_object('leaveRequestId', p_leave_request_id, 'reused', false);
END;
$$;

CREATE OR REPLACE FUNCTION cancel_leave_request(
  p_employee_id TEXT,
  p_leave_request_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_req RECORD;
BEGIN
  SELECT * INTO v_req FROM leave_requests WHERE id = p_leave_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Leave request not found';
  END IF;
  IF v_req.employee_id IS DISTINCT FROM p_employee_id THEN
    RAISE EXCEPTION 'Forbidden: cannot cancel another employee leave request';
  END IF;
  IF v_req.status = 'CANCELLED' THEN
    RETURN jsonb_build_object('leaveRequestId', p_leave_request_id, 'reused', true);
  END IF;
  IF v_req.status NOT IN ('DRAFT', 'PENDING') THEN
    RAISE EXCEPTION 'Only draft or submitted leave can be cancelled';
  END IF;

  PERFORM set_config('consultamerica.workforce_write', '1', true);
  UPDATE leave_requests
     SET status = 'CANCELLED', updated_at = now()
   WHERE id = p_leave_request_id;

  UPDATE approval_requests
     SET status = 'CANCELLED', acted_at = now()
   WHERE request_type = 'LEAVE' AND request_id = p_leave_request_id AND status = 'PENDING';

  PERFORM set_config('consultamerica.workforce_write', '0', true);

  PERFORM log_workforce_audit_once(
    'LEAVE_CANCELLED', 'leave_request', p_leave_request_id, p_employee_id, 'Leave cancelled'
  );

  RETURN jsonb_build_object('leaveRequestId', p_leave_request_id, 'reused', false);
END;
$$;

-- ---------------------------------------------------------------------------
-- Approvals view over the existing shared approval_requests table
-- ---------------------------------------------------------------------------

ALTER TABLE approval_requests
  ADD COLUMN IF NOT EXISTS decision_by_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS comments TEXT;

CREATE OR REPLACE VIEW approvals
WITH (security_invoker = true) AS
SELECT
  id,
  lower(request_type) AS approval_type,
  request_id AS entity_id,
  requester_employee_id,
  approver_employee_id AS assigned_approver_employee_id,
  lower(status) AS status,
  acted_at AS decision_at,
  decision_by_employee_id,
  comments,
  submitted_at AS created_at,
  COALESCE(acted_at, submitted_at) AS updated_at
FROM approval_requests;

-- ---------------------------------------------------------------------------
-- HR requests
-- ---------------------------------------------------------------------------

ALTER TABLE hr_requests
  ADD COLUMN IF NOT EXISTS assigned_to_profile_id TEXT,
  ADD COLUMN IF NOT EXISTS resolution_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE hr_requests DROP CONSTRAINT IF EXISTS hr_requests_priority_check;
ALTER TABLE hr_requests
  ADD CONSTRAINT hr_requests_priority_check
  CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'));

CREATE TABLE IF NOT EXISTS hr_request_activity (
  id                 TEXT PRIMARY KEY,
  hr_request_id      TEXT NOT NULL REFERENCES hr_requests(id) ON DELETE CASCADE,
  actor_profile_id   TEXT,
  activity_type      TEXT NOT NULL CHECK (
    activity_type IN (
      'created', 'assigned', 'status_changed', 'comment_added', 'resolved', 'reopened'
    )
  ),
  message            TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION next_hr_request_number() RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_year TEXT := to_char(CURRENT_DATE, 'YYYY');
  v_next INT;
BEGIN
  SELECT COALESCE(MAX(
           CASE
             WHEN split_part(request_number, '-', 3) ~ '^[0-9]+$'
               THEN split_part(request_number, '-', 3)::INT
             ELSE 0
           END
         ), 0) + 1
    INTO v_next
    FROM hr_requests
   WHERE request_number LIKE 'HR-' || v_year || '-%';

  RETURN 'HR-' || v_year || '-' || lpad(v_next::TEXT, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION create_hr_request(
  p_employee_id TEXT,
  p_category TEXT,
  p_subject TEXT,
  p_description TEXT,
  p_priority TEXT DEFAULT 'normal',
  p_actor_profile_id TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
  v_number TEXT;
  v_category TEXT := upper(p_category);
  v_priority TEXT := upper(COALESCE(p_priority, 'normal'));
BEGIN
  IF btrim(p_subject) = '' OR btrim(p_description) = '' THEN
    RAISE EXCEPTION 'HR request subject and description are required';
  END IF;
  IF v_category NOT IN (
    'BENEFITS', 'PAYROLL', 'EMPLOYMENT_VERIFICATION', 'PROFILE_UPDATE',
    'LEAVE', 'POLICY', 'OTHER',
    'BENEFITS_QUESTION', 'PAYROLL_QUESTION', 'PERSONAL_INFORMATION_CHANGE',
    'DOCUMENT_REQUEST', 'GENERAL_HR_QUESTION'
  ) THEN
    RAISE EXCEPTION 'Unsupported HR request category';
  END IF;
  IF v_priority NOT IN ('LOW', 'NORMAL', 'HIGH', 'URGENT') THEN
    RAISE EXCEPTION 'Unsupported HR request priority';
  END IF;

  v_id := 'hrr-' || gen_random_uuid();
  v_number := next_hr_request_number();

  INSERT INTO hr_requests (
    id, employee_id, request_number, category, subject, description, priority,
    status, created_at, updated_at
  ) VALUES (
    v_id, p_employee_id, v_number, v_category, btrim(p_subject), btrim(p_description),
    v_priority, 'OPEN', now(), now()
  );

  INSERT INTO hr_request_activity (
    id, hr_request_id, actor_profile_id, activity_type, message, created_at
  ) VALUES (
    'hra-' || gen_random_uuid(), v_id, p_actor_profile_id, 'created', btrim(p_description), now()
  );

  PERFORM log_workforce_audit_once(
    'HR_REQUEST_CREATED', 'hr_request', v_id, p_employee_id, 'HR request created'
  );

  RETURN jsonb_build_object('hrRequestId', v_id, 'requestNumber', v_number);
END;
$$;

CREATE OR REPLACE FUNCTION actor_is_hr(p_actor_employee_id TEXT) RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM employee_profiles e
      JOIN user_roles r ON r.user_id = e.user_id
     WHERE e.id = p_actor_employee_id
       AND r.role IN ('HR_ADMIN', 'HR_SPECIALIST', 'SYSTEM_ADMIN')
  );
$$;

CREATE OR REPLACE FUNCTION assign_hr_request(
  p_actor_employee_id TEXT,
  p_hr_request_id TEXT,
  p_assignee_profile_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT actor_is_hr(p_actor_employee_id) THEN
    RAISE EXCEPTION 'unauthorized HR user cannot assign requests';
  END IF;

  UPDATE hr_requests
     SET assigned_to_profile_id = p_assignee_profile_id,
         status = 'IN_PROGRESS',
         updated_at = now()
   WHERE id = p_hr_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'HR request not found';
  END IF;

  INSERT INTO hr_request_activity (
    id, hr_request_id, actor_profile_id, activity_type, message, created_at
  )
  SELECT
    'hra-' || gen_random_uuid(),
    p_hr_request_id,
    e.user_id,
    'assigned',
    'Assigned',
    now()
  FROM employee_profiles e
  WHERE e.id = p_actor_employee_id;

  PERFORM log_workforce_audit_once(
    'HR_REQUEST_ASSIGNED', 'hr_request', p_hr_request_id, p_actor_employee_id, 'HR request assigned'
  );

  RETURN jsonb_build_object('hrRequestId', p_hr_request_id);
END;
$$;

CREATE OR REPLACE FUNCTION resolve_hr_request(
  p_actor_employee_id TEXT,
  p_hr_request_id TEXT,
  p_notes TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_status TEXT;
BEGIN
  IF NOT actor_is_hr(p_actor_employee_id) THEN
    RAISE EXCEPTION 'unauthorized HR user cannot resolve requests';
  END IF;

  SELECT status INTO v_status FROM hr_requests WHERE id = p_hr_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'HR request not found';
  END IF;
  IF v_status = 'RESOLVED' THEN
    RETURN jsonb_build_object('hrRequestId', p_hr_request_id, 'reused', true);
  END IF;

  UPDATE hr_requests
     SET status = 'RESOLVED',
         resolution_notes = p_notes,
         resolved_at = now(),
         updated_at = now()
   WHERE id = p_hr_request_id;

  INSERT INTO hr_request_activity (
    id, hr_request_id, actor_profile_id, activity_type, message, created_at
  )
  SELECT
    'hra-' || gen_random_uuid(),
    p_hr_request_id,
    e.user_id,
    'resolved',
    p_notes,
    now()
  FROM employee_profiles e
  WHERE e.id = p_actor_employee_id;

  PERFORM log_workforce_audit_once(
    'HR_REQUEST_RESOLVED', 'hr_request', p_hr_request_id, p_actor_employee_id, 'HR request resolved'
  );

  RETURN jsonb_build_object('hrRequestId', p_hr_request_id, 'reused', false);
END;
$$;

-- ---------------------------------------------------------------------------
-- Payroll foundation — no tax engine, no inferred paid status
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payroll_profiles (
  id              TEXT PRIMARY KEY,
  employee_id     TEXT NOT NULL REFERENCES employee_profiles(id),
  pay_type        TEXT NOT NULL CHECK (pay_type IN ('salary', 'hourly')),
  pay_frequency   TEXT NOT NULL CHECK (
    pay_frequency IN ('weekly', 'biweekly', 'semimonthly', 'monthly')
  ),
  base_rate       NUMERIC,
  salary_amount   NUMERIC,
  currency        TEXT NOT NULL DEFAULT 'USD',
  effective_date  DATE NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payroll_profiles_active_employee
  ON payroll_profiles (employee_id)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS pay_periods (
  id            TEXT PRIMARY KEY,
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  pay_date      DATE NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('open', 'processing', 'closed', 'paid')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_pay_period_dates CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS payroll_runs (
  id                     TEXT PRIMARY KEY,
  pay_period_id          TEXT NOT NULL REFERENCES pay_periods(id),
  status                 TEXT NOT NULL CHECK (
    status IN ('draft', 'processing', 'ready', 'completed', 'failed')
  ),
  started_at             TIMESTAMPTZ,
  completed_at           TIMESTAMPTZ,
  created_by_profile_id  TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payroll_run_employees (
  id                   TEXT PRIMARY KEY,
  payroll_run_id       TEXT NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id          TEXT NOT NULL REFERENCES employee_profiles(id),
  payroll_profile_id   TEXT REFERENCES payroll_profiles(id),
  regular_hours        NUMERIC,
  overtime_hours       NUMERIC,
  gross_amount         NUMERIC,
  status               TEXT NOT NULL DEFAULT 'draft',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (payroll_run_id, employee_id)
);

CREATE OR REPLACE FUNCTION save_payroll_profile(
  p_actor_employee_id TEXT,
  p_employee_id TEXT,
  p_pay_type TEXT,
  p_pay_frequency TEXT,
  p_base_rate NUMERIC,
  p_salary_amount NUMERIC,
  p_currency TEXT,
  p_effective_date DATE
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
  v_actor_profile TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM employee_profiles e
      JOIN user_roles r ON r.user_id = e.user_id
     WHERE e.id = p_actor_employee_id
       AND r.role IN ('PAYROLL_ADMIN', 'SYSTEM_ADMIN')
  ) THEN
    RAISE EXCEPTION 'non-payroll user cannot change compensation';
  END IF;

  UPDATE payroll_profiles
     SET status = 'inactive',
         updated_at = now()
   WHERE employee_id = p_employee_id
     AND status = 'active'
     AND effective_date < p_effective_date;

  v_id := 'ppr-' || gen_random_uuid();
  INSERT INTO payroll_profiles (
    id, employee_id, pay_type, pay_frequency, base_rate, salary_amount,
    currency, effective_date, status, created_at, updated_at
  ) VALUES (
    v_id, p_employee_id, lower(p_pay_type), lower(p_pay_frequency),
    p_base_rate, p_salary_amount, COALESCE(p_currency, 'USD'),
    p_effective_date, 'active', now(), now()
  );

  SELECT user_id INTO v_actor_profile FROM employee_profiles WHERE id = p_actor_employee_id;

  PERFORM log_workforce_audit_once(
    'PAYROLL_PROFILE_CHANGED',
    'payroll_profile',
    v_id,
    p_actor_employee_id,
    'Payroll profile version created'
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_payroll_run(
  p_actor_employee_id TEXT,
  p_pay_period_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
  v_actor_profile TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM employee_profiles e
      JOIN user_roles r ON r.user_id = e.user_id
     WHERE e.id = p_actor_employee_id
       AND r.role IN ('PAYROLL_ADMIN', 'SYSTEM_ADMIN')
  ) THEN
    RAISE EXCEPTION 'non-payroll user cannot create payroll runs';
  END IF;

  SELECT id INTO v_id
    FROM payroll_runs
   WHERE pay_period_id = p_pay_period_id
     AND status IN ('draft', 'processing', 'ready')
   LIMIT 1;
  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  SELECT user_id INTO v_actor_profile FROM employee_profiles WHERE id = p_actor_employee_id;
  v_id := 'prun-' || gen_random_uuid();

  INSERT INTO payroll_runs (
    id, pay_period_id, status, created_by_profile_id, created_at, updated_at
  ) VALUES (
    v_id, p_pay_period_id, 'draft', v_actor_profile, now(), now()
  );

  PERFORM log_workforce_audit_once(
    'PAYROLL_RUN_CREATED', 'payroll_run', v_id, p_actor_employee_id, 'Payroll run created'
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION complete_payroll_run(
  p_actor_employee_id TEXT,
  p_payroll_run_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_status TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM employee_profiles e
      JOIN user_roles r ON r.user_id = e.user_id
     WHERE e.id = p_actor_employee_id
       AND r.role IN ('PAYROLL_ADMIN', 'SYSTEM_ADMIN')
  ) THEN
    RAISE EXCEPTION 'non-payroll user cannot complete payroll runs';
  END IF;

  SELECT status INTO v_status FROM payroll_runs WHERE id = p_payroll_run_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payroll run not found';
  END IF;
  IF v_status = 'completed' THEN
    RETURN jsonb_build_object('payrollRunId', p_payroll_run_id, 'reused', true);
  END IF;

  UPDATE payroll_runs
     SET status = 'completed',
         completed_at = now(),
         started_at = COALESCE(started_at, now()),
         updated_at = now()
   WHERE id = p_payroll_run_id;

  PERFORM log_workforce_audit_once(
    'PAYROLL_RUN_COMPLETED', 'payroll_run', p_payroll_run_id, p_actor_employee_id, 'Payroll run completed'
  );

  RETURN jsonb_build_object('payrollRunId', p_payroll_run_id, 'reused', false);
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE workforce_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_request_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pay_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_run_employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS time_entries_self ON time_entries;
CREATE POLICY time_entries_self ON time_entries
  FOR SELECT
  TO authenticated
  USING (employee_id = current_employee_id());

DROP POLICY IF EXISTS time_entries_self_insert ON time_entries;
CREATE POLICY time_entries_self_insert ON time_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id = current_employee_id()
    AND status = 'draft'
  );

DROP POLICY IF EXISTS time_entries_self_update ON time_entries;
CREATE POLICY time_entries_self_update ON time_entries
  FOR UPDATE
  TO authenticated
  USING (employee_id = current_employee_id() AND status IN ('draft', 'rejected'))
  WITH CHECK (employee_id = current_employee_id() AND status IN ('draft', 'rejected'));

DROP POLICY IF EXISTS compensation_payroll ON compensation_records;
CREATE POLICY compensation_payroll ON compensation_records
  FOR ALL
  TO authenticated
  USING (is_payroll_admin())
  WITH CHECK (is_payroll_admin());

DROP POLICY IF EXISTS workforce_audit_hr ON workforce_audit_events;
CREATE POLICY workforce_audit_hr ON workforce_audit_events
  FOR SELECT
  TO authenticated
  USING (is_hr_staff() OR is_payroll_admin());

DROP POLICY IF EXISTS hr_request_activity_self ON hr_request_activity;
CREATE POLICY hr_request_activity_self ON hr_request_activity
  FOR SELECT
  TO authenticated
  USING (
    hr_request_id IN (SELECT id FROM hr_requests WHERE employee_id = current_employee_id())
    OR is_hr_staff()
  );

DROP POLICY IF EXISTS payroll_profiles_self ON payroll_profiles;
CREATE POLICY payroll_profiles_self ON payroll_profiles
  FOR SELECT
  TO authenticated
  USING (employee_id = current_employee_id());

DROP POLICY IF EXISTS payroll_profiles_admin ON payroll_profiles;
CREATE POLICY payroll_profiles_admin ON payroll_profiles
  FOR ALL
  TO authenticated
  USING (is_payroll_admin())
  WITH CHECK (is_payroll_admin());

DROP POLICY IF EXISTS pay_periods_admin ON pay_periods;
CREATE POLICY pay_periods_admin ON pay_periods
  FOR ALL
  TO authenticated
  USING (is_payroll_admin())
  WITH CHECK (is_payroll_admin());

DROP POLICY IF EXISTS payroll_runs_admin ON payroll_runs;
CREATE POLICY payroll_runs_admin ON payroll_runs
  FOR ALL
  TO authenticated
  USING (is_payroll_admin())
  WITH CHECK (is_payroll_admin());

DROP POLICY IF EXISTS payroll_run_employees_self ON payroll_run_employees;
CREATE POLICY payroll_run_employees_self ON payroll_run_employees
  FOR SELECT
  TO authenticated
  USING (employee_id = current_employee_id());

DROP POLICY IF EXISTS payroll_run_employees_admin ON payroll_run_employees;
CREATE POLICY payroll_run_employees_admin ON payroll_run_employees
  FOR ALL
  TO authenticated
  USING (is_payroll_admin())
  WITH CHECK (is_payroll_admin());

REVOKE ALL ON FUNCTION is_payroll_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_payroll_admin() TO anon, authenticated;

REVOKE ALL ON approvals FROM PUBLIC;
GRANT SELECT ON approvals TO authenticated;

REVOKE ALL ON FUNCTION log_workforce_audit_once(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION ensure_timesheet(TEXT, DATE, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION save_time_entry_draft(TEXT, TEXT, DATE, NUMERIC, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION submit_employee_timesheet(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION decide_timesheet(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION submit_leave_request(TEXT, TEXT, DATE, DATE, NUMERIC, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION decide_leave_request(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION cancel_leave_request(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_hr_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION assign_hr_request(TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION resolve_hr_request(TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION save_payroll_profile(TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_payroll_run(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION complete_payroll_run(TEXT, TEXT) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION ensure_timesheet(TEXT, DATE, DATE) TO service_role;
    GRANT EXECUTE ON FUNCTION save_time_entry_draft(TEXT, TEXT, DATE, NUMERIC, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION submit_employee_timesheet(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION decide_timesheet(TEXT, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION submit_leave_request(TEXT, TEXT, DATE, DATE, NUMERIC, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION decide_leave_request(TEXT, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION cancel_leave_request(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION create_hr_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION assign_hr_request(TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION resolve_hr_request(TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION save_payroll_profile(TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, DATE) TO service_role;
    GRANT EXECUTE ON FUNCTION create_payroll_run(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION complete_payroll_run(TEXT, TEXT) TO service_role;
    GRANT SELECT ON approvals TO service_role;
  END IF;
END $$;
