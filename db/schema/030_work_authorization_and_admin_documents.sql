-- People admin: Work Authorization + HR access to employee_documents.
--
-- Work Authorization is stored on its own table (not employee_profiles
-- columns) so the broad People/Employees list query never has to select it
-- and RLS can gate the sensitive fields independently. No immigration
-- decision logic here — authorization_type is a free-text field the UI
-- offers common examples for (US Citizen, Permanent Resident, H-1B, H-4 EAD,
-- F-1 OPT, F-1 STEM OPT, L-1, Other).

CREATE TABLE IF NOT EXISTS employee_work_authorization (
  id                          TEXT PRIMARY KEY,
  employee_id                 TEXT NOT NULL UNIQUE REFERENCES employee_profiles(id) ON DELETE CASCADE,
  authorization_type          TEXT,
  authorization_expiration_date DATE,
  verification_status         TEXT NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'EXPIRED')),
  hr_notes                    TEXT,
  updated_by_user_id          TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employee_work_authorization_employee
  ON employee_work_authorization (employee_id);

ALTER TABLE employee_work_authorization ENABLE ROW LEVEL SECURITY;

-- Employees may read their own record, but never hr_notes — enforced at the
-- application layer (this table is read through the service-role client;
-- RLS here is defense-in-depth for any future direct client access), and by
-- omitting hr_notes from the self-service selection.
DROP POLICY IF EXISTS employee_work_authorization_self ON employee_work_authorization;
CREATE POLICY employee_work_authorization_self ON employee_work_authorization
  FOR SELECT
  TO authenticated
  USING (employee_id = current_employee_id());

DROP POLICY IF EXISTS employee_work_authorization_hr ON employee_work_authorization;
CREATE POLICY employee_work_authorization_hr ON employee_work_authorization
  FOR ALL
  TO authenticated
  USING (is_hr_staff())
  WITH CHECK (is_hr_staff());

REVOKE ALL ON employee_work_authorization FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_work_authorization TO authenticated;

-- ---------------------------------------------------------------------------
-- employee_documents: 019 only granted employees SELECT on their own visible
-- documents. HR/SYSTEM_ADMIN need full access to support the People ->
-- Employee Detail -> Documents tab (upload, list, archive).
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS employee_documents_hr ON public.employee_documents;
CREATE POLICY employee_documents_hr ON public.employee_documents
  FOR ALL
  TO authenticated
  USING (is_hr_staff())
  WITH CHECK (is_hr_staff());
