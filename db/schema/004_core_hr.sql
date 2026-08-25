-- ConsultAmerica Phase 3A — Core HR Data Model
-- Person → Employee → Employment Assignment
-- Hire conversion from Phase 2 must reuse/create Person, never duplicate.

CREATE TABLE IF NOT EXISTS people (
  id                TEXT PRIMARY KEY,
  first_name        TEXT NOT NULL,
  middle_name       TEXT,
  last_name         TEXT NOT NULL,
  preferred_name    TEXT,
  personal_email    TEXT,
  personal_phone    TEXT,
  date_of_birth     DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_people_personal_email
  ON people (lower(personal_email))
  WHERE personal_email IS NOT NULL;

CREATE TABLE IF NOT EXISTS employees (
  id                      TEXT PRIMARY KEY,
  person_id               TEXT NOT NULL REFERENCES people(id),
  employee_number         TEXT NOT NULL UNIQUE,
  hire_date               DATE NOT NULL,
  original_hire_date      DATE NOT NULL,
  employment_status       TEXT NOT NULL CHECK (
    employment_status IN (
      'PRE_HIRE', 'ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'
    )
  ),
  termination_date        DATE,
  termination_reason      TEXT,
  work_email              TEXT,
  work_phone              TEXT,
  source_candidate_id     TEXT,
  source_application_id   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_termination_after_hire CHECK (
    termination_date IS NULL OR termination_date >= hire_date
  )
);

CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_person ON employees(person_id);

CREATE TABLE IF NOT EXISTS employment_assignments (
  id                      TEXT PRIMARY KEY,
  employee_id             TEXT NOT NULL REFERENCES employees(id),
  legal_entity_id         TEXT NOT NULL REFERENCES legal_entities(id),
  business_unit_id        TEXT NOT NULL REFERENCES business_units(id),
  department_id           TEXT NOT NULL REFERENCES departments(id),
  position_id             TEXT NOT NULL REFERENCES positions(id),
  location_id             TEXT NOT NULL REFERENCES locations(id),
  manager_employee_id     TEXT REFERENCES employees(id),
  employment_type         TEXT NOT NULL CHECK (
    employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY')
  ),
  workplace_type          TEXT NOT NULL CHECK (
    workplace_type IN ('REMOTE', 'HYBRID', 'ONSITE')
  ),
  start_date              DATE NOT NULL,
  end_date                DATE,
  assignment_status       TEXT NOT NULL CHECK (
    assignment_status IN ('ACTIVE', 'ENDED', 'CANCELLED')
  ),
  primary_assignment      BOOLEAN NOT NULL DEFAULT TRUE,
  change_reason           TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_assignment_dates CHECK (
    end_date IS NULL OR end_date >= start_date
  ),
  CONSTRAINT chk_manager_not_self CHECK (
    manager_employee_id IS NULL OR manager_employee_id <> employee_id
  )
);

CREATE INDEX IF NOT EXISTS idx_assignments_employee
  ON employment_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_assignments_primary
  ON employment_assignments(employee_id, primary_assignment)
  WHERE primary_assignment = TRUE AND assignment_status = 'ACTIVE';

CREATE TABLE IF NOT EXISTS employee_status_history (
  id                   TEXT PRIMARY KEY,
  employee_id          TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  from_status          TEXT,
  to_status            TEXT NOT NULL,
  effective_date       DATE NOT NULL,
  changed_by_user_id   TEXT,
  note                 TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_events (
  id                   TEXT PRIMARY KEY,
  employee_id          TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  event_type           TEXT NOT NULL,
  effective_date       DATE NOT NULL,
  summary              TEXT NOT NULL,
  before_json          TEXT,
  after_json           TEXT,
  created_by_user_id   TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_records (
  id                   TEXT PRIMARY KEY,
  employee_id          TEXT NOT NULL UNIQUE REFERENCES employees(id),
  start_date           DATE NOT NULL,
  status               TEXT NOT NULL CHECK (
    status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')
  ),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id                   TEXT PRIMARY KEY,
  onboarding_id        TEXT NOT NULL REFERENCES onboarding_records(id) ON DELETE CASCADE,
  employee_id          TEXT NOT NULL REFERENCES employees(id),
  task_type            TEXT NOT NULL,
  title                TEXT NOT NULL,
  description          TEXT,
  assigned_to_user_id  TEXT,
  due_date             DATE,
  status               TEXT NOT NULL CHECK (
    status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE')
  ),
  completed_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compensation_records (
  id                   TEXT PRIMARY KEY,
  employee_id          TEXT NOT NULL REFERENCES employees(id),
  assignment_id        TEXT NOT NULL REFERENCES employment_assignments(id),
  compensation_type    TEXT NOT NULL CHECK (compensation_type IN ('SALARY', 'HOURLY')),
  annual_salary        NUMERIC,
  hourly_rate          NUMERIC,
  currency             TEXT NOT NULL DEFAULT 'USD',
  effective_start_date DATE NOT NULL,
  effective_end_date   DATE,
  reason               TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_compensation_dates CHECK (
    effective_end_date IS NULL OR effective_end_date >= effective_start_date
  )
);

-- Link candidates to people once converted (Phase 2 bridge).
-- candidates.person_id / candidates.employee_id already reserved in 002_recruiting.sql
