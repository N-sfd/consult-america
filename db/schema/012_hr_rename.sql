-- Unified ATS/HR data foundation, step 3 — HR domain.
-- people + employees collapse into employee_profiles (identity/contact
-- fields only, matching the new spec) with a real FK to candidate_profiles
-- replacing the old unconstrained source_candidate_id, and a real link to
-- profiles replacing the old unconstrained profiles.employee_id. employee
-- job_title/department/manager/location stay on their own time-bounded
-- table (renamed job_assignments) rather than flattened onto
-- employee_profiles, so promotions/transfers keep history instead of
-- overwriting a single current-job snapshot.
--
-- Uses ALTER TABLE ... RENAME (not CREATE + DROP) throughout specifically so
-- the ~16 self-service tables (leave, timesheets, HR requests,
-- notifications, documents, ...) that FK to employees(id)/
-- employment_assignments(id) keep working untouched — Postgres preserves
-- inbound FK constraints across a table rename; it does NOT preserve them
-- across a drop-and-recreate, which is why this isn't written as
-- "CREATE TABLE employee_profiles ... DROP TABLE employees".

ALTER TABLE employees RENAME TO employee_profiles;

ALTER TABLE employee_profiles
  ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS preferred_name TEXT,
  ADD COLUMN IF NOT EXISTS personal_email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS mailing_address TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

ALTER TABLE employee_profiles RENAME COLUMN source_candidate_id TO candidate_id;

DO $$
BEGIN
  ALTER TABLE employee_profiles
    ADD CONSTRAINT fk_employee_profiles_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END;
$$;

-- Backfill the merged-in people fields.
UPDATE employee_profiles ep
   SET first_name = p.first_name,
       last_name = p.last_name,
       preferred_name = p.preferred_name,
       personal_email = p.personal_email,
       phone = p.personal_phone,
       mailing_address = p.mailing_address,
       emergency_contact_name = p.emergency_contact_name,
       emergency_contact_relationship = p.emergency_contact_relationship,
       emergency_contact_phone = p.emergency_contact_phone
  FROM people p
 WHERE p.id = ep.person_id
   AND ep.first_name IS NULL;

ALTER TABLE employee_profiles
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL;

-- Backfill user_id from the old reverse link (profiles.employee_id) before
-- dropping it, same pattern as candidate_profiles.profile_id in 011.
UPDATE employee_profiles ep
   SET user_id = pr.id
  FROM profiles pr
 WHERE pr.employee_id = ep.id
   AND ep.user_id IS NULL;

ALTER TABLE profiles DROP COLUMN IF EXISTS employee_id;

ALTER TABLE employee_profiles DROP COLUMN IF EXISTS person_id;

CREATE INDEX IF NOT EXISTS idx_employee_profiles_candidate ON employee_profiles(candidate_id);

DROP TABLE IF EXISTS people;

-- --- job_assignments (was employment_assignments) ---------------------------
-- Simple rename — its own FK to employees(id) (now employee_profiles(id) by
-- the rename above) and every table FK'ing to it (compensation_records.
-- assignment_id) keep working without any further changes.

ALTER TABLE employment_assignments RENAME TO job_assignments;

-- --- convert_accepted_offer_to_employee (007_hire_conversion.sql) ----------
-- The `people` table is gone and `employees`/`employment_assignments` are
-- renamed, so the function body (which references them by literal SQL
-- identifier — invisible to TypeScript) must be rewritten, not just left in
-- place. No more separate "find or create Person" step: employee_profiles
-- holds identity fields directly. Also folds in the one true onboarding-task
-- checklist (types/hr.ts::DEFAULT_ONBOARDING_TASKS) instead of the
-- previously-drifted 9-task literal that was missing EMERGENCY_CONTACT.
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
  v_application_status TEXT;
BEGIN
  -- Idempotent: a repeat conversion of the same offer returns the existing result.
  SELECT e.id, e.employee_number
    INTO v_employee_id, v_employee_number
    FROM employee_profiles e
   WHERE e.source_offer_id = p_offer_id;

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
     WHERE o.employee_id = v_employee_id;

    RETURN jsonb_build_object(
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

  -- 2 & 3. Create employee_profiles (PRE_HIRE) with a server-generated employee number.
  v_employee_id := 'emp-' || gen_random_uuid();
  v_employee_number := next_employee_number();

  BEGIN
    INSERT INTO employee_profiles (
      id, candidate_id, employee_number, first_name, last_name, personal_email,
      phone, hire_date, original_hire_date, employment_status,
      source_application_id, source_offer_id, created_at, updated_at
    ) VALUES (
      v_employee_id, p_candidate_id, v_employee_number, p_first_name, p_last_name, p_personal_email,
      p_personal_phone, p_start_date, p_start_date, 'PRE_HIRE',
      p_application_id, p_offer_id, now(), now()
    );
  EXCEPTION WHEN unique_violation THEN
    -- Concurrent conversion of the same offer won the race; return its result.
    SELECT e.id, e.employee_number
      INTO v_employee_id, v_employee_number
      FROM employee_profiles e
     WHERE e.source_offer_id = p_offer_id;

    SELECT a.id INTO v_assignment_id
      FROM job_assignments a
     WHERE a.employee_id = v_employee_id
       AND a.primary_assignment
       AND a.assignment_status = 'ACTIVE'
     ORDER BY a.start_date DESC
     LIMIT 1;

    SELECT o.id INTO v_onboarding_id
      FROM onboarding_records o
     WHERE o.employee_id = v_employee_id;

    RETURN jsonb_build_object(
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

  -- 4. Create initial job assignment, reusing requisition/offer org IDs as-is.
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

  -- 5. Create onboarding plan + the canonical default task checklist
  -- (types/hr.ts::DEFAULT_ONBOARDING_TASKS — 10 tasks, includes EMERGENCY_CONTACT).
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

  -- 6 & 7. Move the application to HIRED and record the transition.
  UPDATE applications SET status = 'HIRED', updated_at = now() WHERE id = p_application_id;

  INSERT INTO application_status_history (id, application_id, from_status, to_status, note, created_at)
  VALUES (
    'ash-' || gen_random_uuid(), p_application_id, v_application_status, 'HIRED',
    'Converted to employee ' || v_employee_number, now()
  );

  RETURN jsonb_build_object(
    'employeeId', v_employee_id,
    'employeeNumber', v_employee_number,
    'assignmentId', v_assignment_id,
    'onboardingId', v_onboarding_id
  );
END;
$$;
