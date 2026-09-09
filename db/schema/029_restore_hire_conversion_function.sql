-- Repair: convert_accepted_offer_to_employee() had drifted back to its
-- pre-rename (007_hire_conversion.sql) body — it inserted into the legacy
-- `employees`/`people`/`employment_assignments` tables (all still present
-- as empty leftovers) instead of the canonical `employee_profiles`/
-- `job_assignments`. Any INSERT INTO employee_status_history it made then
-- failed employee_status_history_employee_id_fkey, since that FK targets
-- employee_profiles(id), not employees(id) — the employee row it had just
-- created lived in the wrong table.
--
-- This migration does not change the design: it reissues the exact function
-- body already established in 022_employee_onboarding_handoff.sql (reuse by
-- source_offer_id/source_application_id, 'reused' vs new-hire result shape,
-- ensure_employee_onboarding/provision_employee_access/resolve_hire_manager/
-- log_hire_audit_once helpers, application_status_transition for the HIRED
-- move). CREATE OR REPLACE is idempotent — on an environment where 022 is
-- already correctly live, this is a no-op.

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

REVOKE ALL ON FUNCTION convert_accepted_offer_to_employee(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION convert_accepted_offer_to_employee(
      TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
    ) TO service_role;
  END IF;
END $$;
