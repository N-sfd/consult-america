-- Lock down empty legacy rename leftovers so Security Advisor / RLS probes
-- stay clean. Canonical tables are candidate_profiles, employee_profiles,
-- job_assignments, jobs, and profiles.

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'candidate_addresses',
    'candidate_education',
    'candidate_experience',
    'candidates',
    'employees',
    'employment_assignments',
    'job_postings',
    'people',
    'users'
  ]
  LOOP
    IF EXISTS (
      SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public'
         AND c.relname = t
         AND c.relkind = 'r'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
    END IF;
  END LOOP;
END $$;
