-- Candidate portal: add nullable location to structured experience records.

ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS location TEXT;

COMMENT ON COLUMN experiences.location IS
  'Candidate-authored city/state or remote label for this role. Nullable.';
