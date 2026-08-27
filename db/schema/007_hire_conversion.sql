-- ConsultAmerica Phase 3A — Accepted Offer -> Employee conversion.
-- Runs the full hire conversion as one atomic function call so a failure
-- partway through (e.g. onboarding task insert) rolls back the whole hire
-- instead of leaving a half-created employee.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE employees ADD COLUMN IF NOT EXISTS source_offer_id TEXT;

-- Idempotency: converting the same accepted offer twice must not create a
-- second employee (see convert_accepted_offer_to_employee below).
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_source_offer
  ON employees (source_offer_id)
  WHERE source_offer_id IS NOT NULL;

-- Readable employee numbers (CA-000001) generated from a real sequence
-- rather than COUNT(*) + 1, which races under concurrent hires.
CREATE SEQUENCE IF NOT EXISTS employee_number_seq;

-- Advance the sequence past any pre-existing/seeded employee numbers so a
-- fresh CREATE SEQUENCE never collides with demo data.
DO $$
DECLARE
  v_max INT;
BEGIN
  SELECT COALESCE(MAX(substring(employee_number FROM 4)::INT), 0) INTO v_max
    FROM employees
   WHERE employee_number ~ '^CA-[0-9]{6}$';

  PERFORM setval('employee_number_seq', GREATEST(v_max, 1), v_max > 0);
END;
$$;

CREATE OR REPLACE FUNCTION next_employee_number() RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'CA-' || lpad(nextval('employee_number_seq')::TEXT, 6, '0');
END;
$$;

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
  v_offer_status TEXT;
  v_application_status TEXT;
  v_person_id TEXT;
  v_employee_id TEXT;
  v_employee_number TEXT;
  v_assignment_id TEXT;
  v_onboarding_id TEXT;
BEGIN
  -- Idempotent: a repeat conversion of the same offer returns the existing result.
  SELECT e.id, e.person_id, e.employee_number
    INTO v_employee_id, v_person_id, v_employee_number
    FROM employees e
   WHERE e.source_offer_id = p_offer_id;

  IF FOUND THEN
    SELECT a.id INTO v_assignment_id
      FROM employment_assignments a
     WHERE a.employee_id = v_employee_id
       AND a.primary_assignment
       AND a.assignment_status = 'ACTIVE'
     ORDER BY a.start_date DESC
     LIMIT 1;

    SELECT o.id INTO v_onboarding_id
      FROM onboarding_records o
     WHERE o.employee_id = v_employee_id;

    RETURN jsonb_build_object(
      'personId', v_person_id,
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'assignmentId', v_assignment_id,
      'onboardingId', v_onboarding_id
    );
  END IF;

  -- 1. Validate accepted offer belongs to this application and is ACCEPTED.
  SELECT status INTO v_offer_status
    FROM offers
   WHERE id = p_offer_id AND application_id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer % not found for application %', p_offer_id, p_application_id;
  END IF;

  IF v_offer_status <> 'ACCEPTED' THEN
    RAISE EXCEPTION 'Offer % is not ACCEPTED (status=%)', p_offer_id, v_offer_status;
  END IF;

  SELECT status INTO v_application_status
    FROM applications
   WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  -- 2. Find/reuse Person by personal email; create if none exists.
  IF p_personal_email IS NOT NULL THEN
    SELECT id INTO v_person_id
      FROM people
     WHERE lower(personal_email) = lower(p_personal_email);
  END IF;

  IF v_person_id IS NULL THEN
    v_person_id := 'person-' || gen_random_uuid();
    INSERT INTO people (id, first_name, last_name, personal_email, personal_phone, created_at, updated_at)
    VALUES (v_person_id, p_first_name, p_last_name, p_personal_email, p_personal_phone, now(), now());
  END IF;

  -- 3 & 4. Create Employee (PRE_HIRE) with a server-generated employee number.
  v_employee_id := 'emp-' || gen_random_uuid();
  v_employee_number := next_employee_number();

  BEGIN
    INSERT INTO employees (
      id, person_id, employee_number, hire_date, original_hire_date,
      employment_status, source_candidate_id, source_application_id, source_offer_id,
      created_at, updated_at
    ) VALUES (
      v_employee_id, v_person_id, v_employee_number, p_start_date, p_start_date,
      'PRE_HIRE', p_candidate_id, p_application_id, p_offer_id,
      now(), now()
    );
  EXCEPTION WHEN unique_violation THEN
    -- Concurrent conversion of the same offer won the race; return its result.
    SELECT e.id, e.person_id, e.employee_number
      INTO v_employee_id, v_person_id, v_employee_number
      FROM employees e
     WHERE e.source_offer_id = p_offer_id;

    SELECT a.id INTO v_assignment_id
      FROM employment_assignments a
     WHERE a.employee_id = v_employee_id
       AND a.primary_assignment
       AND a.assignment_status = 'ACTIVE'
     ORDER BY a.start_date DESC
     LIMIT 1;

    SELECT o.id INTO v_onboarding_id
      FROM onboarding_records o
     WHERE o.employee_id = v_employee_id;

    RETURN jsonb_build_object(
      'personId', v_person_id,
      'employeeId', v_employee_id,
      'employeeNumber', v_employee_number,
      'assignmentId', v_assignment_id,
      'onboardingId', v_onboarding_id
    );
  END;

  INSERT INTO employee_status_history (id, employee_id, from_status, to_status, effective_date, note, created_at)
  VALUES ('esh-' || gen_random_uuid(), v_employee_id, NULL, 'PRE_HIRE', p_start_date, 'Employee record created', now());

  INSERT INTO hr_events (id, employee_id, event_type, effective_date, summary, created_at)
  VALUES ('hre-' || gen_random_uuid(), v_employee_id, 'HIRED', p_start_date, 'Employee ' || v_employee_number || ' created', now());

  -- 5. Create initial Employment Assignment, reusing requisition/offer org IDs as-is.
  v_assignment_id := 'asg-' || gen_random_uuid();
  INSERT INTO employment_assignments (
    id, employee_id, legal_entity_id, business_unit_id, department_id, position_id,
    location_id, manager_employee_id, employment_type, workplace_type, start_date,
    assignment_status, primary_assignment, change_reason, created_at, updated_at
  ) VALUES (
    v_assignment_id, v_employee_id, p_legal_entity_id, p_business_unit_id, p_department_id, p_position_id,
    p_location_id, p_manager_employee_id, p_employment_type, p_workplace_type, p_start_date,
    'ACTIVE', TRUE, 'Hire from accepted offer', now(), now()
  );

  INSERT INTO hr_events (id, employee_id, event_type, effective_date, summary, after_json, created_at)
  VALUES (
    'hre-' || gen_random_uuid(), v_employee_id, 'ASSIGNMENT_CHANGED', p_start_date,
    'Initial employment assignment created',
    jsonb_build_object(
      'departmentId', p_department_id,
      'positionId', p_position_id,
      'locationId', p_location_id
    )::TEXT,
    now()
  );

  -- 8 & 9. Create onboarding plan + default task checklist.
  v_onboarding_id := 'onb-' || gen_random_uuid();
  INSERT INTO onboarding_records (id, employee_id, start_date, status, created_at, updated_at)
  VALUES (v_onboarding_id, v_employee_id, p_start_date, 'NOT_STARTED', now(), now());

  INSERT INTO onboarding_tasks (id, onboarding_id, employee_id, task_type, title, description, status, created_at, updated_at)
  VALUES
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'PERSONAL_INFO', 'Complete Personal Information', 'Verify legal name, contact details, and emergency contacts.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'DOCUMENTS', 'Verify Documents', 'Collect required employment and identity documents.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'WORK_EMAIL', 'Create Work Email', 'Provision corporate email and directory listing.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'MANAGER', 'Assign Manager', 'Confirm reporting manager and team placement.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ORG', 'Confirm Department & Position', 'Validate department, position, and location assignment.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'POLICIES', 'Review Policies', 'Acknowledge company policies and codes of conduct.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'EQUIPMENT', 'Equipment Setup', 'Provision laptop and required tools.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ACCESS', 'System Access', 'Grant application and environment access.', 'NOT_STARTED', now(), now()),
    ('otask-' || gen_random_uuid(), v_onboarding_id, v_employee_id, 'ORIENTATION', 'Orientation', 'Schedule orientation with HR and the hiring manager.', 'NOT_STARTED', now(), now());

  -- 10 & 11. Move the application to HIRED and record the transition.
  UPDATE applications SET status = 'HIRED', updated_at = now() WHERE id = p_application_id;

  INSERT INTO application_status_history (id, application_id, from_status, to_status, note, created_at)
  VALUES (
    'ash-' || gen_random_uuid(), p_application_id, v_application_status, 'HIRED',
    'Converted to employee ' || v_employee_number, now()
  );

  RETURN jsonb_build_object(
    'personId', v_person_id,
    'employeeId', v_employee_id,
    'employeeNumber', v_employee_number,
    'assignmentId', v_assignment_id,
    'onboardingId', v_onboarding_id
  );
END;
$$;
