-- ConsultAmerica Phase 4K — Audit logging foundation

CREATE TABLE IF NOT EXISTS audit_logs (
  id                    TEXT PRIMARY KEY,
  event_type            TEXT NOT NULL,
  actor_employee_id     TEXT NOT NULL REFERENCES employees(id),
  actor_role            TEXT NOT NULL CHECK (
    actor_role IN ('EMPLOYEE', 'MANAGER', 'HR')
  ),
  target_employee_id    TEXT REFERENCES employees(id),
  resource_type         TEXT,
  resource_id           TEXT,
  summary               TEXT NOT NULL,
  metadata_json         TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON audit_logs (actor_employee_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event
  ON audit_logs (event_type, created_at DESC);
