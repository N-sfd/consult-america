-- Schedule Interview is offered on every application row regardless of stage
-- (components/workforce-app/recruiting/schedule-interview-button.tsx), and
-- lib/recruiting/actions.ts's scheduleInterview() always tries to advance the
-- application straight to INTERVIEW. APPLIED could not previously transition
-- directly to INTERVIEW, so scheduling an interview for a freshly-applied
-- candidate silently left the pipeline stage stuck at APPLIED. Widen the
-- APPLIED branch the same way RECRUITER_SCREEN/HIRING_MANAGER_REVIEW already
-- allow a direct hop to INTERVIEW.

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
      WHEN 'APPLIED' THEN p_to_status IN ('REVIEW', 'RECRUITER_SCREEN', 'INTERVIEW', 'REJECTED', 'WITHDRAWN', 'CLOSED')
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
