-- ConsultAmerica Phase 4A — Employee + Manager Self-Service
-- Reuses Core HR employees / assignments. No second employee master.

CREATE TABLE IF NOT EXISTS leave_types (
  id                      TEXT PRIMARY KEY,
  code                    TEXT NOT NULL UNIQUE,
  name                    TEXT NOT NULL,
  paid                    BOOLEAN NOT NULL DEFAULT TRUE,
  requires_approval       BOOLEAN NOT NULL DEFAULT TRUE,
  allow_negative_balance  BOOLEAN NOT NULL DEFAULT FALSE,
  status                  TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE IF NOT EXISTS leave_balances (
  id               TEXT PRIMARY KEY,
  employee_id      TEXT NOT NULL REFERENCES employees(id),
  leave_type_id    TEXT NOT NULL REFERENCES leave_types(id),
  year             INTEGER NOT NULL,
  opening_balance  NUMERIC NOT NULL DEFAULT 0,
  accrued          NUMERIC NOT NULL DEFAULT 0,
  used             NUMERIC NOT NULL DEFAULT 0,
  adjusted         NUMERIC NOT NULL DEFAULT 0,
  available        NUMERIC NOT NULL DEFAULT 0,
  UNIQUE (employee_id, leave_type_id, year)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id               TEXT PRIMARY KEY,
  employee_id      TEXT NOT NULL REFERENCES employees(id),
  leave_type_id    TEXT NOT NULL REFERENCES leave_types(id),
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  hours            NUMERIC NOT NULL,
  status           TEXT NOT NULL CHECK (
    status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')
  ),
  comments         TEXT,
  submitted_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS leave_request_days (
  id                 TEXT PRIMARY KEY,
  leave_request_id   TEXT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  work_date          DATE NOT NULL,
  hours              NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS timesheets (
  id                        TEXT PRIMARY KEY,
  employee_id               TEXT NOT NULL REFERENCES employees(id),
  period_start              DATE NOT NULL,
  period_end                DATE NOT NULL,
  status                    TEXT NOT NULL CHECK (
    status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'REOPENED')
  ),
  total_hours               NUMERIC NOT NULL DEFAULT 0,
  submitted_at              TIMESTAMPTZ,
  approved_at               TIMESTAMPTZ,
  approved_by_employee_id   TEXT REFERENCES employees(id),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_timesheet_period CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS time_entries (
  id               TEXT PRIMARY KEY,
  timesheet_id     TEXT NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
  employee_id      TEXT NOT NULL REFERENCES employees(id),
  work_date        DATE NOT NULL,
  hours            NUMERIC NOT NULL CHECK (hours >= 0),
  time_type        TEXT NOT NULL CHECK (
    time_type IN ('REGULAR', 'OVERTIME', 'HOLIDAY', 'TRAINING', 'ADMIN')
  ),
  project_id       TEXT,
  task_id          TEXT,
  comments         TEXT
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id                        TEXT PRIMARY KEY,
  request_type              TEXT NOT NULL CHECK (
    request_type IN ('TIMESHEET', 'LEAVE', 'PROFILE_CHANGE', 'HR_REQUEST')
  ),
  request_id                TEXT NOT NULL,
  requester_employee_id     TEXT NOT NULL REFERENCES employees(id),
  approver_employee_id      TEXT NOT NULL REFERENCES employees(id),
  status                    TEXT NOT NULL CHECK (
    status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')
  ),
  summary                   TEXT NOT NULL,
  submitted_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acted_at                  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS approval_history (
  id                   TEXT PRIMARY KEY,
  request_type         TEXT NOT NULL,
  request_id           TEXT NOT NULL,
  action               TEXT NOT NULL CHECK (
    action IN ('SUBMITTED', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED')
  ),
  actor_employee_id    TEXT NOT NULL REFERENCES employees(id),
  comment              TEXT,
  acted_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_change_requests (
  id                          TEXT PRIMARY KEY,
  employee_id                 TEXT NOT NULL REFERENCES employees(id),
  change_type                 TEXT NOT NULL,
  current_value               TEXT NOT NULL,
  requested_value             TEXT NOT NULL,
  supporting_document_id      TEXT,
  status                      TEXT NOT NULL CHECK (
    status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')
  ),
  requested_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_employee_id     TEXT REFERENCES employees(id),
  reviewed_at                 TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS hr_requests (
  id                        TEXT PRIMARY KEY,
  employee_id               TEXT NOT NULL REFERENCES employees(id),
  request_number            TEXT NOT NULL UNIQUE,
  category                  TEXT NOT NULL,
  subject                   TEXT NOT NULL,
  description               TEXT NOT NULL,
  priority                  TEXT NOT NULL CHECK (
    priority IN ('LOW', 'NORMAL', 'HIGH')
  ),
  status                    TEXT NOT NULL CHECK (
    status IN (
      'OPEN', 'IN_PROGRESS', 'WAITING_FOR_EMPLOYEE', 'RESOLVED', 'CLOSED'
    )
  ),
  assigned_to_employee_id   TEXT REFERENCES employees(id),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at               TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS hr_request_messages (
  id                   TEXT PRIMARY KEY,
  hr_request_id        TEXT NOT NULL REFERENCES hr_requests(id) ON DELETE CASCADE,
  author_employee_id   TEXT NOT NULL REFERENCES employees(id),
  message              TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL,
  employee_id      TEXT NOT NULL REFERENCES employees(id),
  type             TEXT NOT NULL,
  title            TEXT NOT NULL,
  message          TEXT NOT NULL,
  action_url       TEXT,
  read_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_documents (
  id                 TEXT PRIMARY KEY,
  employee_id        TEXT NOT NULL REFERENCES employees(id),
  document_type      TEXT NOT NULL,
  file_name          TEXT NOT NULL,
  storage_path       TEXT NOT NULL,
  visibility         TEXT NOT NULL CHECK (
    visibility IN ('HR_ONLY', 'EMPLOYEE', 'MANAGER_AND_HR', 'PAYROLL_ONLY')
  ),
  uploaded_by        TEXT,
  uploaded_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_date     DATE,
  expiration_date    DATE,
  status             TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS document_acknowledgements (
  id               TEXT PRIMARY KEY,
  employee_id      TEXT NOT NULL REFERENCES employees(id),
  document_id      TEXT NOT NULL REFERENCES employee_documents(id),
  acknowledged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version          TEXT NOT NULL,
  ip_address       TEXT
);
