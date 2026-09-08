-- Hiring lifecycle integrity.
-- Status changes must go through application_status_transition.
-- Terminal statuses cannot move backward without an audited privileged correction.
-- Hire is serialized on the application row and unique on offer/application.

-- ---------------------------------------------------------------------------
-- Offer acceptance timestamps and employee requisition lineage
-- ---------------------------------------------------------------------------

ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_by_user_id TEXT;

ALTER TABLE employee_profiles
  ADD COLUMN IF NOT EXISTS job_requisition_id TEXT;

DO $$
BEGIN
  ALTER TABLE employee_profiles
    ADD CONSTRAINT fk_employee_profiles_requisition
    FOREIGN KEY (job_requisition_id) REFERENCES job_requisitions(id);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

COMMENT ON COLUMN employee_profiles.source_application_id IS
  'hired_application_id — application that produced this employee';
COMMENT ON COLUMN employee_profiles.source_offer_id IS
  'Accepted offer that produced this employee. Immutable after hire.';
COMMENT ON COLUMN employee_profiles.job_requisition_id IS
  'Job requisition copied from the hired application.';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM employee_profiles
     WHERE source_application_id IS NOT NULL
     GROUP BY source_application_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate employees already exist for one hired application';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_profiles_source_application
  ON employee_profiles (source_application_id)
  WHERE source_application_id IS NOT NULL;

-- source_offer_id uniqueness already exists from 007 (table rename preserved it).
CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_profiles_source_offer
  ON employee_profiles (source_offer_id)
  WHERE source_offer_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Application status transition (only supported write path)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION application_status_transition(
  p_application_id TEXT,
  p_to_status TEXT,
  p_actor_user_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL,
  p_privileged BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_from TEXT;
  v_candidate_id TEXT;
  v_requisition_id TEXT;
  v_history_id TEXT;
  v_allowed BOOLEAN;
BEGIN
  SELECT status, candidate_id, requisition_id
    INTO v_from, v_candidate_id, v_requisition_id
    FROM applications
   WHERE id = p_application_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  IF v_from = p_to_status THEN
    RETURN jsonb_build_object(
      'fromStatus', v_from,
      'toStatus', p_to_status,
      'historyId', 'hist-idempotent-' || p_application_id || '-' || p_to_status,
      'reused', true
    );
  END IF;

  IF COALESCE(p_privileged, FALSE) THEN
    IF p_actor_user_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM user_roles
       WHERE user_id = p_actor_user_id
         AND role IN ('SYSTEM_ADMIN', 'HR_ADMIN')
    ) THEN
      RAISE EXCEPTION 'Privileged application status correction requires HR_ADMIN or SYSTEM_ADMIN';
    END IF;
  ELSE
    v_allowed := CASE v_from
      WHEN 'APPLIED' THEN p_to_status IN ('REVIEW', 'RECRUITER_SCREEN', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'REVIEW' THEN p_to_status IN ('RECRUITER_SCREEN', 'HIRING_MANAGER_REVIEW', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'RECRUITER_SCREEN' THEN p_to_status IN ('HIRING_MANAGER_REVIEW', 'INTERVIEW', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'HIRING_MANAGER_REVIEW' THEN p_to_status IN ('INTERVIEW', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'INTERVIEW' THEN p_to_status IN ('FINAL_INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'FINAL_INTERVIEW' THEN p_to_status IN ('OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      WHEN 'OFFER' THEN p_to_status IN ('HIRED', 'REJECTED', 'WITHDRAWN', 'CLOSED')
      ELSE FALSE
    END;

    IF NOT v_allowed THEN
      RAISE EXCEPTION 'Invalid application transition: % → %', v_from, p_to_status;
    END IF;
  END IF;

  PERFORM set_config('consultamerica.status_transition', '1', true);

  UPDATE applications
     SET status = p_to_status,
         updated_at = now()
   WHERE id = p_application_id;

  PERFORM set_config('consultamerica.status_transition', '0', true);

  v_history_id := 'hist-' || gen_random_uuid();
  INSERT INTO application_status_history (
    id, application_id, from_status, to_status, changed_by_user_id, note, created_at
  ) VALUES (
    v_history_id, p_application_id, v_from, p_to_status, p_actor_user_id, p_note, now()
  );

  INSERT INTO recruiting_activities (
    id, candidate_id, application_id, requisition_id, activity_type, summary, created_by_user_id, created_at
  ) VALUES (
    'act-' || gen_random_uuid(),
    v_candidate_id,
    p_application_id,
    v_requisition_id,
    CASE WHEN COALESCE(p_privileged, FALSE) THEN 'STATUS_CORRECTED' ELSE 'STAGE_CHANGED' END,
    CASE
      WHEN p_note IS NULL THEN 'Stage changed: ' || v_from || ' → ' || p_to_status
      ELSE 'Stage changed: ' || v_from || ' → ' || p_to_status || ' (' || p_note || ')'
    END,
    p_actor_user_id,
    now()
  );

  RETURN jsonb_build_object(
    'fromStatus', v_from,
    'toStatus', p_to_status,
    'historyId', v_history_id,
    'reused', false
  );
END;
$$;

CREATE OR REPLACE FUNCTION reject_direct_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND current_setting('consultamerica.status_transition', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION 'Application status must change through application_status_transition';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS applications_status_transition_guard ON applications;
CREATE TRIGGER applications_status_transition_guard
  BEFORE UPDATE OF status ON applications
  FOR EACH ROW
  EXECUTE FUNCTION reject_direct_application_status_change();

-- ---------------------------------------------------------------------------
-- Offer identity and acceptance timestamps
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION protect_offer_identity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.application_id IS DISTINCT FROM OLD.application_id
     AND (
       OLD.status IN ('ACCEPTED', 'DECLINED')
       OR EXISTS (
         SELECT 1 FROM employee_profiles e WHERE e.source_offer_id = OLD.id
       )
     ) THEN
    RAISE EXCEPTION 'Accepted offer cannot be repointed to another application';
  END IF;

  IF OLD.status = 'ACCEPTED' AND NEW.status IS DISTINCT FROM 'ACCEPTED' THEN
    RAISE EXCEPTION 'Accepted offer status cannot be silently changed';
  END IF;

  IF NEW.status = 'ACCEPTED' AND OLD.status IS DISTINCT FROM 'ACCEPTED' THEN
    NEW.accepted_at := COALESCE(NEW.accepted_at, now());
  END IF;

  IF NEW.status = 'DECLINED' AND OLD.status IS DISTINCT FROM 'DECLINED' THEN
    NEW.declined_at := COALESCE(NEW.declined_at, now());
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS offers_identity_guard ON offers;
CREATE TRIGGER offers_identity_guard
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION protect_offer_identity();

-- ---------------------------------------------------------------------------
-- Employee role provisioning. Does not invent an auth profile.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION provision_employee_access(p_employee_id TEXT, p_candidate_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id TEXT;
  v_already BOOLEAN;
BEGIN
  SELECT profile_id INTO v_profile_id
    FROM candidate_profiles
   WHERE id = p_candidate_id;

  IF v_profile_id IS NULL THEN
    INSERT INTO recruiting_activities (
      id, candidate_id, activity_type, summary, created_at
    ) VALUES (
      'act-' || gen_random_uuid(),
      p_candidate_id,
      'EMPLOYEE_ROLE_PENDING',
      'Employee record created; authenticated profile not linked yet',
      now()
    );
    RETURN 'pending';
  END IF;

  UPDATE employee_profiles
     SET user_id = v_profile_id,
         updated_at = now()
   WHERE id = p_employee_id
     AND user_id IS NULL;

  SELECT EXISTS (
    SELECT 1 FROM user_roles
     WHERE user_id = v_profile_id AND role = 'EMPLOYEE'
  ) INTO v_already;

  IF NOT v_already THEN
    INSERT INTO user_roles (id, user_id, role)
    VALUES ('role-' || gen_random_uuid(), v_profile_id, 'EMPLOYEE');

    INSERT INTO recruiting_activities (
      id, candidate_id, activity_type, summary, created_by_user_id, created_at
    ) VALUES (
      'act-' || gen_random_uuid(),
      p_candidate_id,
      'EMPLOYEE_ROLE_ASSIGNED',
      'EMPLOYEE role assigned from hire transaction',
      v_profile_id,
      now()
    );
    RETURN 'assigned';
  END IF;

  RETURN 'already';
END;
$$;

-- ---------------------------------------------------------------------------
-- Hire conversion: lock, validate from database rows, one employee
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
  v_application_status TEXT;
  v_candidate_id TEXT;
  v_requisition_id TEXT;
  v_role TEXT;
BEGIN
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

  SELECT e.id, e.employee_number
    INTO v_employee_id, v_employee_number
    FROM employee_profiles e
   WHERE e.source_offer_id = p_offer_id
      OR e.source_application_id = p_application_id
   LIMIT 1;

  IF FOUND THEN
    SELECT a.id INTO v_assignment_id
      FROM job_assignments a
     WHERE a.employee_id = v_employee_id
       AND a.primary_assignment
       AND a.assignment_status = 'ACTIVE'
     ORDER BY a.start_date DESC
     LIMIT 1;

    SELECT o.id INTO v_onboarding_id
      FROM onboarding_records o
     WHERE o.employee_id = v_employee_id
     LIMIT 1;

    RETURN jsonb_build_object(
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'assignmentId', v_assignment_id,
      'onboardingId', v_onboarding_id,
      'reused', true
    );
  END IF;

  SELECT status, application_id
    INTO v_offer_status, v_offer_application_id
    FROM offers
   WHERE id = p_offer_id
   FOR UPDATE;

  IF NOT FOUND OR v_offer_application_id IS DISTINCT FROM p_application_id THEN
    RAISE EXCEPTION 'Offer % not found for application %', p_offer_id, p_application_id;
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
      phone, hire_date, original_hire_date, employment_status,
      source_application_id, source_offer_id, job_requisition_id, created_at, updated_at
    ) VALUES (
      v_employee_id, v_candidate_id, v_employee_number, p_first_name, p_last_name, p_personal_email,
      p_personal_phone, p_start_date, p_start_date, 'PRE_HIRE',
      p_application_id, p_offer_id, v_requisition_id, now(), now()
    );
  EXCEPTION WHEN unique_violation THEN
    SELECT e.id, e.employee_number
      INTO v_employee_id, v_employee_number
      FROM employee_profiles e
     WHERE e.source_offer_id = p_offer_id
        OR e.source_application_id = p_application_id
     LIMIT 1;

    RETURN jsonb_build_object(
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'reused', true
    );
  END;

  INSERT INTO employee_status_history (id, employee_id, from_status, to_status, effective_date, note, created_at)
  VALUES ('esh-' || gen_random_uuid(), v_employee_id, NULL, 'PRE_HIRE', p_start_date, 'Employee record created', now());

  INSERT INTO hr_events (id, employee_id, event_type, effective_date, summary, created_at)
  VALUES ('hre-' || gen_random_uuid(), v_employee_id, 'HIRED', p_start_date, 'Employee ' || v_employee_number || ' created', now());

  v_assignment_id := 'asg-' || gen_random_uuid();
  INSERT INTO job_assignments (
    id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
    location_id, manager_employee_id, employment_type, workplace_type, start_date,
    assignment_status, primary_assignment, change_reason, created_at, updated_at
  ) VALUES (
    v_assignment_id, v_employee_id, p_legal_entity_id, p_business_unit_id, p_department_id, p_position_id,
    p_location_id, p_manager_employee_id, p_employment_type, p_workplace_type, p_start_date,
    'ACTIVE', TRUE, 'Hire from accepted offer', now(), now()
  );

  v_onboarding_id := 'onb-' || gen_random_uuid();
  INSERT INTO onboarding_records (id, employee_id, start_date, status, created_at, updated_at)
  VALUES (v_onboarding_id, v_employee_id, p_start_date, 'NOT_STARTED', now(), now());

  INSERT INTO onboarding_tasks (id, onboarding_id, employee_id, task_type, title, description, status, created_at, updated_at)
  VALUES
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'PERSONAL_INFO', 'Complete Personal Information', 'Verify legal name, contact details, and emergency contacts.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'EMERGENCY_CONTACT', 'Add Emergency Contact', 'Provide an emergency contact name, relationship, and phone number.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'DOCUMENTS', 'Verify Documents', 'Collect required employment and identity documents.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'WORK_EMAIL', 'Create Work Email', 'Provision corporate email and directory listing.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'MANAGER', 'Assign Manager', 'Confirm reporting manager and team placement.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ORG', 'Confirm Department & Position', 'Validate department, position, and location assignment.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'POLICIES', 'Review Policies', 'Acknowledge company policies and codes of conduct.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'EQUIPMENT', 'Equipment Setup', 'Provision laptop and required tools.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ACCESS', 'System Access', 'Grant application and environment access.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ORIENTATION', 'Orientation', 'Schedule orientation with HR and the hiring manager.', 'NOT_STARTED', now(), now());

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

  INSERT INTO recruiting_activities (
    id, candidate_id, application_id, requisition_id, activity_type, summary, created_at
  ) VALUES (
    'act-' || gen_random_uuid(),
    v_candidate_id,
    p_application_id,
    v_requisition_id,
    'CANDIDATE_HIRED',
    'Candidate hired as employee ' || v_employee_number,
    now()
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

REVOKE ALL ON FUNCTION application_status_transition(TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION provision_employee_access(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION convert_accepted_offer_to_employee(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION application_status_transition(TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO service_role;
    GRANT EXECUTE ON FUNCTION provision_employee_access(TEXT, TEXT) TO service_role;
    GRANT EXECUTE ON FUNCTION convert_accepted_offer_to_employee(
      TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
    ) TO service_role;
  END IF;
END $$;

-- Interview feedback stays internal. EMPLOYEE does not grant recruiting access.
DROP POLICY IF EXISTS interview_feedback_staff ON interview_feedback;
CREATE POLICY interview_feedback_staff ON interview_feedback
  FOR ALL
  TO authenticated
  USING (is_recruiting_staff() OR is_hiring_manager())
  WITH CHECK (is_recruiting_staff() OR is_hiring_manager());
