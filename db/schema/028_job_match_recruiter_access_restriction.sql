-- Job Match is candidate-side coaching data, not a recruiter signal.
-- Recruiting/HR staff must not automatically receive read access to it.

DROP POLICY IF EXISTS job_match_analyses_staff ON job_match_analyses;
