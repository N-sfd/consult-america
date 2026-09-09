-- Hire → employee handoff.
-- Confirms onboarding_records as the single onboarding instance (exposed as
-- employee_onboarding). Hire date and employment start date stay distinct.
-- Identity, role, and portal access are separate states — never one boolean,
-- and never a fabricated auth profile.

-- ---------------------------------------------------------------------------
-- Employment start vs hire date, and provisioning states
-- ---------------------------------------------------------------------------

ALTER TABLE employee_profiles
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS identity_provisioning_status TEXT,
  ADD COLUMN IF NOT EXISTS portal_access_status TEXT;

UPDATE employee_profiles
   SET identity_provisioning_status = CASE
         WHEN user_id IS NOT NULL THEN 'linked'
         ELSE 'pending'
       END
 WHERE identity_provisioning_status IS NULL;

UPDATE employee_profiles
   SET portal_access_status = CASE
         WHEN user_id IS NOT NULL THEN 'ready'
         ELSE 'pending'
       END
 WHERE portal_access_status IS NULL;

ALTER TABLE employee_profiles
  ALTER COLUMN identity_provisioning_status SET DEFAULT 'pending',
  ALTER COLUMN portal_access_status SET DEFAULT 'pending';

ALTER TABLE employee_profiles
  DROP CONSTRAINT IF EXISTS employee_profiles_identity_provisioning_status_check;
ALTER TABLE employee_profiles
  ADD CONSTRAINT employee_profiles_identity_provisioning_status_check
  CHECK (identity_provisioning_status IN ('pending', 'linked'));

ALTER TABLE employee_profiles
  DROP CONSTRAINT IF EXISTS employee_profiles_portal_access_status_check;
ALTER TABLE employee_profiles
  ADD CONSTRAINT employee_profiles_portal_access_status_check
  CHECK (portal_access_status IN ('pending', 'ready'));

COMMENT ON COLUMN employee_profiles.hire_date IS
  'Date the hire transaction was recorded. Not the employment start date.';
COMMENT ON COLUMN employee_profiles.start_date IS
  'Employment start date carried from the accepted offer. Null when the offer has none.';
COMMENT ON COLUMN employee_profiles.identity_provisioning_status IS
  'pending until an existing profile is linked. Never invent an auth user.';
COMMENT ON COLUMN employee_profiles.portal_access_status IS
  'ready only after the employee is linked to an existing profile and EMPLOYEE is assigned.';

-- Assignment/onboarding start dates may be unknown until the offer supplies one.
ALTER TABLE job_assignments
  ALTER COLUMN start_date DROP NOT NULL;

ALTER TABLE onboarding_records
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE onboarding_records
  ALTER COLUMN start_date DROP NOT NULL;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
     WHERE nsp.nspname = 'public'
       AND rel.relname = 'onboarding_records'
       AND con.contype = 'c'
       AND pg_get_constraintdef(con.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE onboarding_records DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE onboarding_records
  ADD CONSTRAINT onboarding_records_status_check
  CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));

-- One onboarding instance per employee is already UNIQUE(employee_id).
-- One task type per that instance.
DELETE FROM onboarding_tasks a
 USING onboarding_tasks b
 WHERE a.onboarding_id = b.onboarding_id
   AND a.task_type = b.task_type
   AND a.ctid > b.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS idx_onboarding_tasks_onboarding_type
  ON onboarding_tasks (onboarding_id, task_type);

COMMENT ON TABLE onboarding_records IS
  'employee_onboarding — one active instance per employee. Candidate history is not converted away.';

-- ---------------------------------------------------------------------------
-- Views matching the handoff contract. security_invoker so RLS still applies.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW employee_onboarding
WITH (security_invoker = true) AS
SELECT
  id,
  employee_id,
  CASE status
    WHEN 'NOT_STARTED' THEN 'pending'
    WHEN 'IN_PROGRESS' THEN 'in_progress'
    WHEN 'COMPLETED' THEN 'completed'
    WHEN 'CANCELLED' THEN 'cancelled'
    ELSE lower(status)
  END AS status,
  started_at,
  completed_at,
  created_at,
  updated_at
FROM onboarding_records;

CREATE OR REPLACE VIEW employee_onboarding_tasks
WITH (security_invoker = true) AS
SELECT
  id,
  onboarding_id,
  employee_id,
  task_type,
  title,
  CASE status
    WHEN 'NOT_STARTED' THEN 'pending'
    WHEN 'IN_PROGRESS' THEN 'in_progress'
    WHEN 'COMPLETED' THEN 'completed'
    WHEN 'NOT_APPLICABLE' THEN 'waived'
    ELSE lower(status)
  END AS status,
  due_date,
  completed_at,
  created_at,
  updated_at
FROM onboarding_tasks;

REVOKE ALL ON employee_onboarding FROM PUBLIC;
REVOKE ALL ON employee_onboarding_tasks FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- Audit that does not repeat on idempotent retry
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION log_hire_audit_once(
  p_candidate_id TEXT,
  p_application_id TEXT,
  p_requisition_id TEXT,
  p_activity_type TEXT,
  p_summary TEXT,
  p_created_by TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_activity_type = 'ONBOARDING_TASK_COMPLETED' THEN
    IF EXISTS (
      SELECT 1
        FROM recruiting_activities
       WHERE candidate_id = p_candidate_id
         AND activity_type = p_activity_type
         AND summary = p_summary
    ) THEN
      RETURN;
    END IF;
  ELSIF EXISTS (
    SELECT 1
      FROM recruiting_activities
     WHERE candidate_id = p_candidate_id
       AND activity_type = p_activity_type
       AND (
         p_application_id IS NULL
         OR application_id = p_application_id
         OR application_id IS NULL
       )
  ) THEN
    RETURN;
  END IF;

  INSERT INTO recruiting_activities (
    id, candidate_id, application_id, requisition_id, activity_type, summary, created_by_user_id, created_at
  ) VALUES (
    'act-' || gen_random_uuid(),
    p_candidate_id,
    p_application_id,
    p_requisition_id,
    p_activity_type,
    p_summary,
    p_created_by,
    now()
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Manager comes from the requisition's hiring manager, if that user is an
-- employee. Browser-supplied manager ids are ignored.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION resolve_hire_manager(
  p_application_id TEXT,
  p_employee_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_user_id TEXT;
  v_manager_id TEXT;
BEGIN
  SELECT r.hiring_manager_user_id
    INTO v_user_id
    FROM applications a
    JOIN job_requisitions r ON r.id = a.requisition_id
   WHERE a.id = p_application_id;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT e.id
    INTO v_manager_id
    FROM employee_profiles e
   WHERE e.user_id = v_user_id
     AND e.id IS DISTINCT FROM p_employee_id
   ORDER BY e.created_at
   LIMIT 1;

  RETURN v_manager_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Default tasks from the existing Employee Portal checklist. Not invented
-- compliance items. Unique on (onboarding_id, task_type).
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION seed_default_onboarding_tasks(
  p_onboarding_id TEXT,
  p_employee_id TEXT
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO onboarding_tasks (
    id, onboarding_id, employee_id, task_type, title, description, status, created_at, updated_at
  )
  SELECT
    'otask-' || gen_random_uuid(),
    p_onboarding_id,
    p_employee_id,
    t.task_type,
    t.title,
    t.description,
    'NOT_STARTED',
    now(),
    now()
  FROM (
    VALUES
      ('PERSONAL_INFO', 'Complete Personal Information', 'Verify legal name, contact details, and emergency contacts.'),
      ('EMERGENCY_CONTACT', 'Add Emergency Contact', 'Provide an emergency contact name, relationship, and phone number.'),
      ('DOCUMENTS', 'Verify Documents', 'Collect required employment and identity documents.'),
      ('WORK_EMAIL', 'Create Work Email', 'Provision corporate email and directory listing.'),
      ('MANAGER', 'Assign Manager', 'Confirm reporting manager and team placement.'),
      ('ORG', 'Confirm Department & Position', 'Validate department, position, and location assignment.'),
      ('POLICIES', 'Review Policies', 'Acknowledge company policies and codes of conduct.'),
      ('EQUIPMENT', 'Equipment Setup', 'Provision laptop and required tools.'),
      ('ACCESS', 'System Access', 'Grant application and environment access.'),
      ('ORIENTATION', 'Orientation', 'Schedule orientation with HR and the hiring manager.')
  ) AS t(task_type, title, description)
  ON CONFLICT (onboarding_id, task_type) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION ensure_employee_onboarding(
  p_employee_id TEXT,
  p_start_date DATE,
  p_candidate_id TEXT,
  p_application_id TEXT,
  p_requisition_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_onboarding_id TEXT;
  v_inserted BOOLEAN := FALSE;
BEGIN
  SELECT id
    INTO v_onboarding_id
    FROM onboarding_records
   WHERE employee_id = p_employee_id
   LIMIT 1;

  IF v_onboarding_id IS NULL THEN
    v_onboarding_id := 'onb-' || gen_random_uuid();
    INSERT INTO onboarding_records (
      id, employee_id, start_date, status, started_at, created_at, updated_at
    ) VALUES (
      v_onboarding_id,
      p_employee_id,
      p_start_date,
      'NOT_STARTED',
      now(),
      now(),
      now()
    )
    ON CONFLICT (employee_id) DO NOTHING;

    IF NOT FOUND THEN
      SELECT id
        INTO v_onboarding_id
        FROM onboarding_records
       WHERE employee_id = p_employee_id
       LIMIT 1;
    ELSE
      v_inserted := TRUE;
    END IF;
  END IF;

  IF v_onboarding_id IS NULL THEN
    RAISE EXCEPTION 'Onboarding record could not be created for employee %', p_employee_id;
  END IF;

  PERFORM seed_default_onboarding_tasks(v_onboarding_id, p_employee_id);

  IF v_inserted THEN
    PERFORM log_hire_audit_once(
      p_candidate_id,
      p_application_id,
      p_requisition_id,
      'ONBOARDING_CREATED',
      'Onboarding record created for employee ' || p_employee_id,
      NULL
    );
  END IF;

  RETURN v_onboarding_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Link an existing profile only. Do not create a profile or auth user.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION provision_employee_access(p_employee_id TEXT, p_candidate_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id TEXT;
  v_application_id TEXT;
  v_requisition_id TEXT;
  v_already BOOLEAN;
BEGIN
  SELECT source_application_id, job_requisition_id
    INTO v_application_id, v_requisition_id
    FROM employee_profiles
   WHERE id = p_employee_id;

  SELECT profile_id
    INTO v_profile_id
    FROM candidate_profiles
   WHERE id = p_candidate_id;

  IF v_profile_id IS NULL THEN
    UPDATE employee_profiles
       SET identity_provisioning_status = 'pending',
           portal_access_status = 'pending',
           updated_at = now()
     WHERE id = p_employee_id
       AND user_id IS NULL;

    PERFORM log_hire_audit_once(
      p_candidate_id,
      v_application_id,
      v_requisition_id,
      'EMPLOYEE_ROLE_PENDING',
      'Employee record created; authenticated profile not linked yet',
      NULL
    );
    RETURN 'pending';
  END IF;

  UPDATE employee_profiles
     SET user_id = v_profile_id,
         identity_provisioning_status = 'linked',
         updated_at = now()
   WHERE id = p_employee_id
     AND user_id IS NULL;

  IF FOUND THEN
    PERFORM log_hire_audit_once(
      p_candidate_id,
      v_application_id,
      v_requisition_id,
      'PROFILE_LINKED',
      'Employee linked to existing profile ' || v_profile_id,
      v_profile_id
    );
  ELSE
    UPDATE employee_profiles
       SET identity_provisioning_status = 'linked',
           updated_at = now()
     WHERE id = p_employee_id
       AND user_id = v_profile_id
       AND identity_provisioning_status IS DISTINCT FROM 'linked';
  END IF;

  SELECT EXISTS (
    SELECT 1
      FROM user_roles
     WHERE user_id = v_profile_id
       AND role = 'EMPLOYEE'
  ) INTO v_already;

  IF NOT v_already THEN
    INSERT INTO user_roles (id, user_id, role)
    VALUES ('role-' || gen_random_uuid(), v_profile_id, 'EMPLOYEE');

    PERFORM log_hire_audit_once(
      p_candidate_id,
      v_application_id,
      v_requisition_id,
      'EMPLOYEE_ROLE_ASSIGNED',
      'EMPLOYEE role assigned from hire transaction',
      v_profile_id
    );
  END IF;

  UPDATE employee_profiles
     SET portal_access_status = 'ready',
         updated_at = now()
   WHERE id = p_employee_id
     AND user_id = v_profile_id
     AND portal_access_status IS DISTINCT FROM 'ready';

  IF FOUND THEN
    PERFORM log_hire_audit_once(
      p_candidate_id,
      v_application_id,
      v_requisition_id,
      'PORTAL_ACCESS_ENABLED',
      'Employee portal access enabled for profile ' || v_profile_id,
      v_profile_id
    );
  END IF;

  RETURN CASE WHEN v_already THEN 'already' ELSE 'assigned' END;
END;
$$;

-- ---------------------------------------------------------------------------
-- Onboarding completes only when required tasks are complete.
-- NOT_APPLICABLE tasks are waived and do not count.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION onboarding_required_tasks_complete(p_onboarding_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM onboarding_tasks
     WHERE onboarding_id = p_onboarding_id
       AND status IS DISTINCT FROM 'NOT_APPLICABLE'
  )
  AND NOT EXISTS (
    SELECT 1
      FROM onboarding_tasks
     WHERE onboarding_id = p_onboarding_id
       AND status IS DISTINCT FROM 'NOT_APPLICABLE'
       AND status IS DISTINCT FROM 'COMPLETED'
  );
$$;

CREATE OR REPLACE FUNCTION guard_onboarding_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'COMPLETED'
     AND OLD.status IS DISTINCT FROM 'COMPLETED'
     AND NOT onboarding_required_tasks_complete(NEW.id) THEN
    RAISE EXCEPTION 'Onboarding cannot be completed until required tasks are complete';
  END IF;

  IF NEW.status = 'COMPLETED' AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION sync_onboarding_from_tasks()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_id TEXT;
  v_candidate_id TEXT;
  v_application_id TEXT;
  v_requisition_id TEXT;
  v_updated INT;
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.status = 'COMPLETED'
     AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    SELECT e.candidate_id, e.source_application_id, e.job_requisition_id
      INTO v_candidate_id, v_application_id, v_requisition_id
      FROM employee_profiles e
     WHERE e.id = NEW.employee_id;

    PERFORM log_hire_audit_once(
      v_candidate_id,
      v_application_id,
      v_requisition_id,
      'ONBOARDING_TASK_COMPLETED',
      'Onboarding task completed: ' || NEW.id || ' ' || NEW.task_type,
      NULL
    );
  END IF;

  IF EXISTS (
    SELECT 1
      FROM onboarding_tasks
     WHERE onboarding_id = NEW.onboarding_id
       AND status IN ('IN_PROGRESS', 'COMPLETED')
  ) THEN
    UPDATE onboarding_records
       SET status = 'IN_PROGRESS',
           started_at = COALESCE(started_at, now()),
           updated_at = now()
     WHERE id = NEW.onboarding_id
       AND status = 'NOT_STARTED';
  END IF;

  IF onboarding_required_tasks_complete(NEW.onboarding_id) THEN
    UPDATE onboarding_records
       SET status = 'COMPLETED',
           completed_at = COALESCE(completed_at, now()),
           updated_at = now()
     WHERE id = NEW.onboarding_id
       AND status IS DISTINCT FROM 'COMPLETED'
       AND status IS DISTINCT FROM 'CANCELLED';

    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated = 1 THEN
      SELECT employee_id INTO v_employee_id
        FROM onboarding_records
       WHERE id = NEW.onboarding_id;

      SELECT e.candidate_id, e.source_application_id, e.job_requisition_id
        INTO v_candidate_id, v_application_id, v_requisition_id
        FROM employee_profiles e
       WHERE e.id = v_employee_id;

      PERFORM log_hire_audit_once(
        v_candidate_id,
        v_application_id,
        v_requisition_id,
        'ONBOARDING_COMPLETED',
        'Onboarding completed for employee ' || v_employee_id,
        NULL
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION stamp_onboarding_task_completed_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    NEW.completed_at := COALESCE(NEW.completed_at, now());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS onboarding_records_completion_guard ON onboarding_records;
CREATE TRIGGER onboarding_records_completion_guard
  BEFORE UPDATE OF status ON onboarding_records
  FOR EACH ROW
  EXECUTE FUNCTION guard_onboarding_completion();

DROP TRIGGER IF EXISTS onboarding_tasks_completed_at ON onboarding_tasks;
CREATE TRIGGER onboarding_tasks_completed_at
  BEFORE UPDATE OF status ON onboarding_tasks
  FOR EACH ROW
  EXECUTE FUNCTION stamp_onboarding_task_completed_at();

DROP TRIGGER IF EXISTS onboarding_tasks_sync_record ON onboarding_tasks;
CREATE TRIGGER onboarding_tasks_sync_record
  AFTER INSERT OR UPDATE OF status ON onboarding_tasks
  FOR EACH ROW
  EXECUTE FUNCTION sync_onboarding_from_tasks();

-- ---------------------------------------------------------------------------
-- Hire conversion: reuse employee + onboarding. Do not copy recruiting docs.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION convert_accepted_offer_to_employee(
  p_application_id TEXT,
  p_offer_id TEXT,
  p_candidate_id TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_personal_email TEXT,
  p_personal_phone TEXT,
  p_start_date DATE,
  p_legal_entity_id TEXT,
  p_business_unit_id TEXT,
  p_department_id TEXT,
  p_position_id TEXT,
  p_location_id TEXT,
  p_manager_employee_id TEXT,
  p_employment_type TEXT,
  p_workplace_type TEXT
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_id TEXT;
  v_employee_number TEXT;
  v_assignment_id TEXT;
  v_onboarding_id TEXT;
  v_offer_status TEXT;
  v_offer_application_id TEXT;
  v_offer_start DATE;
  v_application_status TEXT;
  v_candidate_id TEXT;
  v_requisition_id TEXT;
  v_role TEXT;
  v_manager_id TEXT;
  v_hire_date DATE := CURRENT_DATE;
BEGIN
  -- p_manager_employee_id and p_start_date are not authoritative.
  -- Manager is resolved from the requisition. Start date comes from the offer.
  PERFORM p_manager_employee_id;

  SELECT a.status, a.candidate_id, a.requisition_id
    INTO v_application_status, v_candidate_id, v_requisition_id
    FROM applications a
   WHERE a.id = p_application_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  IF p_candidate_id IS NOT NULL AND p_candidate_id IS DISTINCT FROM v_candidate_id THEN
    RAISE EXCEPTION 'Candidate does not match the application';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM candidate_profiles WHERE id = v_candidate_id) THEN
    RAISE EXCEPTION 'Candidate % not found', v_candidate_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM job_requisitions WHERE id = v_requisition_id) THEN
    RAISE EXCEPTION 'Job requisition % not found', v_requisition_id;
  END IF;

  SELECT start_date
    INTO v_offer_start
    FROM offers
   WHERE id = p_offer_id;

  IF v_offer_start IS NULL THEN
    v_offer_start := p_start_date;
  END IF;

  SELECT e.id, e.employee_number
    INTO v_employee_id, v_employee_number
    FROM employee_profiles e
   WHERE e.source_offer_id = p_offer_id
      OR e.source_application_id = p_application_id
   LIMIT 1;

  IF FOUND THEN
    UPDATE employee_profiles
       SET start_date = COALESCE(start_date, v_offer_start),
           updated_at = now()
     WHERE id = v_employee_id
       AND start_date IS NULL
       AND v_offer_start IS NOT NULL;

    v_onboarding_id := ensure_employee_onboarding(
      v_employee_id,
      v_offer_start,
      v_candidate_id,
      p_application_id,
      v_requisition_id
    );
    v_role := provision_employee_access(v_employee_id, v_candidate_id);

    SELECT a.id
      INTO v_assignment_id
      FROM job_assignments a
     WHERE a.employee_id = v_employee_id
       AND a.primary_assignment
       AND a.assignment_status = 'ACTIVE'
     ORDER BY a.created_at DESC
     LIMIT 1;

    RETURN jsonb_build_object(
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'assignmentId', v_assignment_id,
      'onboardingId', v_onboarding_id,
      'reused', true,
      'roleProvisioning', v_role
    );
  END IF;

  SELECT status, application_id, start_date
    INTO v_offer_status, v_offer_application_id, v_offer_start
    FROM offers
   WHERE id = p_offer_id
   FOR UPDATE;

  IF NOT FOUND OR v_offer_application_id IS DISTINCT FROM p_application_id THEN
    RAISE EXCEPTION 'Offer % not found for application %', p_offer_id, p_application_id;
  END IF;

  IF v_offer_start IS NULL THEN
    v_offer_start := p_start_date;
  END IF;

  IF v_offer_status <> 'ACCEPTED' THEN
    RAISE EXCEPTION 'Offer % is not ACCEPTED (status=%)', p_offer_id, v_offer_status;
  END IF;

  IF v_application_status NOT IN ('OFFER', 'HIRED') THEN
    RAISE EXCEPTION 'Application % is not eligible for hire (status=%)', p_application_id, v_application_status;
  END IF;

  v_employee_id := 'emp-' || gen_random_uuid();
  v_employee_number := next_employee_number();

  BEGIN
    INSERT INTO employee_profiles (
      id, candidate_id, employee_number, first_name, last_name, personal_email,
      phone, hire_date, original_hire_date, start_date, employment_status,
      source_application_id, source_offer_id, job_requisition_id,
      identity_provisioning_status, portal_access_status,
      created_at, updated_at
    ) VALUES (
      v_employee_id, v_candidate_id, v_employee_number, p_first_name, p_last_name, p_personal_email,
      p_personal_phone, v_hire_date, v_hire_date, v_offer_start, 'PRE_HIRE',
      p_application_id, p_offer_id, v_requisition_id,
      'pending', 'pending',
      now(), now()
    );
  EXCEPTION WHEN unique_violation THEN
    SELECT e.id, e.employee_number
      INTO v_employee_id, v_employee_number
      FROM employee_profiles e
     WHERE e.source_offer_id = p_offer_id
        OR e.source_application_id = p_application_id
     LIMIT 1;

    v_onboarding_id := ensure_employee_onboarding(
      v_employee_id,
      v_offer_start,
      v_candidate_id,
      p_application_id,
      v_requisition_id
    );
    v_role := provision_employee_access(v_employee_id, v_candidate_id);

    RETURN jsonb_build_object(
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'onboardingId', v_onboarding_id,
      'reused', true,
      'roleProvisioning', v_role
    );
  END;

  INSERT INTO employee_status_history (
    id, employee_id, from_status, to_status, effective_date, note, created_at
  ) VALUES (
    'esh-' || gen_random_uuid(),
    v_employee_id,
    NULL,
    'PRE_HIRE',
    v_hire_date,
    'Employee record created',
    now()
  );

  INSERT INTO hr_events (id, employee_id, event_type, effective_date, summary, created_at)
  VALUES (
    'hre-' || gen_random_uuid(),
    v_employee_id,
    'HIRED',
    v_hire_date,
    'Employee ' || v_employee_number || ' created',
    now()
  );

  v_manager_id := resolve_hire_manager(p_application_id, v_employee_id);
  v_assignment_id := 'asg-' || gen_random_uuid();

  INSERT INTO job_assignments (
    id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
    location_id, manager_employee_id, employment_type, workplace_type, start_date,
    assignment_status, primary_assignment, change_reason, created_at, updated_at
  ) VALUES (
    v_assignment_id, v_employee_id, p_legal_entity_id, p_business_unit_id, p_department_id, p_position_id,
    p_location_id, v_manager_id, p_employment_type, p_workplace_type, v_offer_start,
    'ACTIVE', TRUE, 'Hire from accepted offer', now(), now()
  );

  -- Recruiting documents stay on application_documents. Do not copy binaries.
  v_onboarding_id := ensure_employee_onboarding(
    v_employee_id,
    v_offer_start,
    v_candidate_id,
    p_application_id,
    v_requisition_id
  );

  IF v_application_status IS DISTINCT FROM 'HIRED' THEN
    PERFORM application_status_transition(
      p_application_id,
      'HIRED',
      NULL,
      'Converted to employee ' || v_employee_number,
      FALSE
    );
  END IF;

  v_role := provision_employee_access(v_employee_id, v_candidate_id);

  PERFORM log_hire_audit_once(
    v_candidate_id,
    p_application_id,
    v_requisition_id,
    'CANDIDATE_HIRED',
    'Candidate hired as employee ' || v_employee_number,
    NULL
  );

  RETURN jsonb_build_object(
    'employeeId', v_employee_id,
    'employeeNumber', v_employee_number,
    'assignmentId', v_assignment_id,
    'onboardingId', v_onboarding_id,
    'reused', false,
    'roleProvisioning', v_role
  );
END;
$$;

REVOKE ALL ON FUNCTION log_hire_audit_once(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION resolve_hire_manager(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION seed_default_onboarding_tasks(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION ensure_employee_onboarding(TEXT, DATE, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION provision_employee_access(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION onboarding_required_tasks_complete(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION convert_accepted_offer_to_employee(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION log_hire_audit_once(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION resolve_hire_manager(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION seed_default_onboarding_tasks(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION ensure_employee_onboarding(TEXT, DATE, TEXT, TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION provision_employee_access(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION convert_accepted_offer_to_employee(
      TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
    ) TO service_role;
    GRANT SELECT ON employee_onboarding TO service_role, authenticated;
    GRANT SELECT ON employee_onboarding_tasks TO service_role, authenticated;
  END IF;
END $$;
