-- ConsultAmerica Phase 2A — Roles & Permissions (schema only; auth later)

CREATE TABLE IF NOT EXISTS users (
  id               TEXT PRIMARY KEY,
  email            TEXT NOT NULL UNIQUE,
  display_name     TEXT NOT NULL,
  employee_id      TEXT,
  candidate_id     TEXT,
  status           TEXT NOT NULL CHECK (
    status IN ('ACTIVE', 'INACTIVE', 'INVITED')
  ),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role             TEXT NOT NULL CHECK (
    role IN (
      'SUPER_ADMIN', 'HR_ADMIN', 'HR_SPECIALIST', 'RECRUITER',
      'HIRING_MANAGER', 'PAYROLL_ADMIN', 'MANAGER', 'EMPLOYEE', 'CANDIDATE'
    )
  ),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id               TEXT PRIMARY KEY,
  role             TEXT NOT NULL,
  permission       TEXT NOT NULL,
  UNIQUE (role, permission)
);
