-- Unified ATS/HR data foundation, step 1 — identity.
-- Renames `users` to `profiles` (the "shared account identity" table in the
-- profiles -> candidate_profiles -> applications -> jobs chain), renames the
-- SUPER_ADMIN role to SYSTEM_ADMIN (same "platform administration" concept,
-- just matching the new naming), and adds the RLS helper functions later
-- migrations/policies depend on.
--
-- profiles.employee_id / profiles.candidate_id are intentionally NOT dropped
-- here — 011_recruiting_rename.sql and 012_hr_rename.sql use them to backfill
-- the new forward FKs (candidate_profiles.profile_id, employee_profiles.user_id)
-- before dropping them at the end of each of those files. Do not drop early.

ALTER TABLE users RENAME TO profiles;

ALTER TABLE user_roles
  DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_role_check CHECK (
    role IN (
      'SYSTEM_ADMIN', 'HR_ADMIN', 'HR_SPECIALIST', 'RECRUITER',
      'HIRING_MANAGER', 'PAYROLL_ADMIN', 'MANAGER', 'EMPLOYEE', 'CANDIDATE',
      'SALES_REP', 'SALES_MANAGER'
    )
  );

UPDATE user_roles SET role = 'SYSTEM_ADMIN' WHERE role = 'SUPER_ADMIN';

-- Resolves the calling request's `profiles.id` from its Supabase Auth
-- identity. SECURITY DEFINER so RLS policies (which run as the querying
-- role, not the table owner) can still read `profiles` to make this lookup.
CREATE OR REPLACE FUNCTION current_profile_id() RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid();
$$;

-- Does the calling request's profile hold the given platform role?
CREATE OR REPLACE FUNCTION current_user_has_role(p_role TEXT) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM user_roles ur
      JOIN profiles p ON p.id = ur.user_id
     WHERE p.auth_user_id = auth.uid()
       AND ur.role = p_role
  );
$$;
