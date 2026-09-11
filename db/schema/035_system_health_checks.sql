-- System health: the drift-audit scripts (audit-function-drift.ts,
-- audit-trigger-drift.ts) connect via raw pg/DATABASE_URL and only ever
-- print to stdout — but the app itself reads everything through the
-- Supabase client and deploys to Cloudflare (@opennextjs/cloudflare), where
-- a live raw-Postgres connection in a request path is not something to
-- introduce casually. So the scripts keep doing the actual drift
-- computation exactly as before; this table just gives them somewhere to
-- persist the result, so /workforce/system-health can read the last known
-- status through the same safe, ordinary Supabase-client path every other
-- real-data page already uses.

CREATE TABLE IF NOT EXISTS system_health_checks (
  id            TEXT PRIMARY KEY,
  check_name    TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('OK', 'DRIFT', 'ERROR')),
  summary       TEXT NOT NULL,
  details       JSONB,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_health_checks_name
  ON system_health_checks (check_name, checked_at DESC);

ALTER TABLE system_health_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS system_health_checks_admin ON system_health_checks;
CREATE POLICY system_health_checks_admin ON system_health_checks
  FOR SELECT
  TO authenticated
  USING (is_hr_staff());

REVOKE ALL ON system_health_checks FROM anon;
GRANT SELECT ON system_health_checks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON system_health_checks TO service_role;
