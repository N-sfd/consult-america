-- Candidate saved jobs + tailored proposal drafts (AI Job Analyzer).
-- Assistance only — never drives hire decisions.

CREATE TABLE IF NOT EXISTS candidate_saved_jobs (
  id                 TEXT PRIMARY KEY,
  candidate_id       TEXT NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_requisition_id TEXT NOT NULL REFERENCES job_requisitions(id) ON DELETE CASCADE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, job_requisition_id)
);

CREATE INDEX IF NOT EXISTS idx_candidate_saved_jobs_candidate
  ON candidate_saved_jobs (candidate_id, created_at DESC);

ALTER TABLE candidate_saved_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS candidate_saved_jobs_self ON candidate_saved_jobs;
CREATE POLICY candidate_saved_jobs_self ON candidate_saved_jobs
  FOR ALL
  TO authenticated
  USING (candidate_id = current_candidate_id())
  WITH CHECK (candidate_id = current_candidate_id());

DROP POLICY IF EXISTS candidate_saved_jobs_staff ON candidate_saved_jobs;
CREATE POLICY candidate_saved_jobs_staff ON candidate_saved_jobs
  FOR SELECT
  TO authenticated
  USING (is_recruiting_staff() OR is_hr_staff());

REVOKE ALL ON candidate_saved_jobs FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON candidate_saved_jobs TO authenticated;

CREATE TABLE IF NOT EXISTS candidate_proposal_drafts (
  id                 TEXT PRIMARY KEY,
  candidate_id       TEXT NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_requisition_id TEXT REFERENCES job_requisitions(id) ON DELETE SET NULL,
  job_title          TEXT NOT NULL,
  body               TEXT NOT NULL,
  match_score        INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_proposal_drafts_candidate
  ON candidate_proposal_drafts (candidate_id, created_at DESC);

ALTER TABLE candidate_proposal_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS candidate_proposal_drafts_self ON candidate_proposal_drafts;
CREATE POLICY candidate_proposal_drafts_self ON candidate_proposal_drafts
  FOR ALL
  TO authenticated
  USING (candidate_id = current_candidate_id())
  WITH CHECK (candidate_id = current_candidate_id());

DROP POLICY IF EXISTS candidate_proposal_drafts_staff ON candidate_proposal_drafts;
CREATE POLICY candidate_proposal_drafts_staff ON candidate_proposal_drafts
  FOR SELECT
  TO authenticated
  USING (is_recruiting_staff() OR is_hr_staff());

REVOKE ALL ON candidate_proposal_drafts FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON candidate_proposal_drafts TO authenticated;
