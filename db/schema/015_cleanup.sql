-- Cleanup pass following the profiles/candidate_profiles/employee_profiles
-- rebuild (010-012): drop columns and tables that are now dead weight so the
-- schema matches exactly what the app reads and writes.

-- candidates.person_id / candidates.employee_id were unconstrained "Phase 3
-- bridge" stubs from the original 002_recruiting.sql — never read or
-- written by any repository code, and fully superseded by the real,
-- FK-backed relationship columns added in 011/012:
--   candidate_profiles.profile_id  -> profiles(id)
--   employee_profiles.candidate_id -> candidate_profiles(id)
ALTER TABLE candidate_profiles
  DROP COLUMN IF EXISTS person_id,
  DROP COLUMN IF EXISTS employee_id;

-- candidate_addresses (002_recruiting.sql) has zero repository support —
-- no code has ever read or written it — and isn't part of the target
-- schema. Drop it rather than carry an unused table forward.
DROP TABLE IF EXISTS candidate_addresses;
