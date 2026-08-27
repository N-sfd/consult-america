-- Employee-editable contact fields: mailing address + emergency contact.
-- Additive to people (004_core_hr.sql) — supports Employee Self-Service
-- "My Profile" edit drawer (Preferred Name / Personal Email / Phone /
-- Address / Emergency Contact are employee-editable; everything else on
-- the employee record requires an HR request).

ALTER TABLE people
  ADD COLUMN IF NOT EXISTS mailing_address TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
