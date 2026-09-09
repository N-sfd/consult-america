-- Candidate portal profile depth + job match analyses.
-- Extends candidate_profiles; does not create a second candidate master.
-- Job Match is candidate assistance only — never drives hire decisions.

ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS professional_summary TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT;

COMMENT ON COLUMN candidate_profiles.professional_summary IS
  'Candidate-authored summary shown in Candidate Portal and recruiter profile.';

CREATE TABLE IF NOT EXISTS job_match_analyses (
  id                       TEXT PRIMARY KEY,
  candidate_id             TEXT NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  document_id              TEXT REFERENCES documents(id),
  job_requisition_id       TEXT REFERENCES job_requisitions(id),
  job_description_snapshot TEXT,
  result_json              JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_match_analyses_candidate
  ON job_match_analyses (candidate_id, created_at DESC);

ALTER TABLE job_match_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS job_match_analyses_self ON job_match_analyses;
CREATE POLICY job_match_analyses_self ON job_match_analyses
  FOR ALL
  TO authenticated
  USING (
    candidate_id = current_candidate_id()
  )
  WITH CHECK (
    candidate_id = current_candidate_id()
  );

DROP POLICY IF EXISTS job_match_analyses_staff ON job_match_analyses;
CREATE POLICY job_match_analyses_staff ON job_match_analyses
  FOR SELECT
  TO authenticated
  USING (is_recruiting_staff() OR is_hr_staff());

REVOKE ALL ON job_match_analyses FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON job_match_analyses TO authenticated;
