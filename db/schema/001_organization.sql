-- ConsultAmerica Phase 2A — Shared Organization Reference Data
-- Consumed by Recruiting, Core HR, and Payroll.

CREATE TABLE IF NOT EXISTS legal_entities (
  id               TEXT PRIMARY KEY,
  code             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  country          TEXT NOT NULL,
  tax_identifier   TEXT,
  status           TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_units (
  id               TEXT PRIMARY KEY,
  legal_entity_id  TEXT NOT NULL REFERENCES legal_entities(id),
  code             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  description      TEXT,
  status           TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id                   TEXT PRIMARY KEY,
  business_unit_id     TEXT NOT NULL REFERENCES business_units(id),
  code                 TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  description          TEXT,
  manager_employee_id  TEXT,
  status               TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
  effective_start_date DATE NOT NULL,
  effective_end_date   DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS positions (
  id               TEXT PRIMARY KEY,
  department_id    TEXT NOT NULL REFERENCES departments(id),
  code             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  job_family       TEXT,
  job_level        TEXT,
  employment_type  TEXT NOT NULL CHECK (
    employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY')
  ),
  status           TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id               TEXT PRIMARY KEY,
  code             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  address_line_1   TEXT,
  address_line_2   TEXT,
  city             TEXT,
  state            TEXT,
  postal_code      TEXT,
  country          TEXT NOT NULL,
  timezone         TEXT,
  status           TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
