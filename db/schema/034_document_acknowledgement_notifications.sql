-- Document acknowledgment notifications: when HR uploads an employee_documents
-- row with requires_acknowledgement = true (and the employee can actually see
-- it), notify the employee through the same event/outbox pipeline every other
-- domain event already uses (024_notifications_reporting_audit.sql), rather
-- than inventing a second one. INSERT-only: acknowledgment is only ever set
-- at upload time today (no edit path), matching that scope decision.

ALTER TABLE workforce_events DROP CONSTRAINT IF EXISTS workforce_events_event_type_check;

ALTER TABLE workforce_events ADD CONSTRAINT workforce_events_event_type_check CHECK (
  event_type IN (
    'TIMESHEET_SUBMITTED', 'TIMESHEET_APPROVED', 'TIMESHEET_REJECTED',
    'LEAVE_SUBMITTED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'LEAVE_CANCELLED',
    'HR_REQUEST_CREATED', 'HR_REQUEST_ASSIGNED', 'HR_REQUEST_COMMENTED', 'HR_REQUEST_RESOLVED',
    'ONBOARDING_TASK_ASSIGNED', 'ONBOARDING_COMPLETED',
    'OFFER_SENT', 'OFFER_ACCEPTED',
    'EMPLOYEE_HIRED',
    'PAYROLL_RUN_READY', 'PAYROLL_RUN_COMPLETED',
    'DOCUMENT_ACKNOWLEDGEMENT_REQUIRED'
  )
);

CREATE OR REPLACE FUNCTION notify_document_acknowledgement_required() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id TEXT;
  v_employee_profile TEXT;
BEGIN
  SELECT user_id INTO v_employee_profile FROM employee_profiles WHERE id = NEW.employee_id;

  v_event_id := emit_workforce_event(
    'DOCUMENT_ACKNOWLEDGEMENT_REQUIRED', 'employee_document', NEW.id,
    employee_user_id(NEW.uploaded_by), NEW.employee_id, v_employee_profile,
    jsonb_build_object('documentType', NEW.document_type, 'fileName', NEW.file_name)
  );
  PERFORM create_notification(
    v_employee_profile, v_event_id, 'DOCUMENT_ACKNOWLEDGEMENT_REQUIRED',
    'Document requires your acknowledgment',
    initcap(replace(NEW.document_type, '_', ' ')) || ' requires your acknowledgment.',
    'employee_document', NEW.id
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS employee_documents_notify_acknowledgement ON employee_documents;
CREATE TRIGGER employee_documents_notify_acknowledgement
  AFTER INSERT ON employee_documents
  FOR EACH ROW
  WHEN (NEW.requires_acknowledgement = true AND NEW.visibility IN ('EMPLOYEE', 'MANAGER_AND_HR'))
  EXECUTE FUNCTION notify_document_acknowledgement_required();
