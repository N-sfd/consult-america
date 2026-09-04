-- ConsultAmerica CRM Workspace — accounts, contacts, opportunities, activities.
-- Independent of the recruiting/ATS "candidate" pipeline — this is the
-- sales-side customer/opportunity model for the CRM Workspace app.

ALTER TABLE user_roles
  DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_role_check CHECK (
    role IN (
      'SUPER_ADMIN', 'HR_ADMIN', 'HR_SPECIALIST', 'RECRUITER',
      'HIRING_MANAGER', 'PAYROLL_ADMIN', 'MANAGER', 'EMPLOYEE', 'CANDIDATE',
      'SALES_REP', 'SALES_MANAGER'
    )
  );

CREATE TABLE IF NOT EXISTS crm_accounts (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  industry        TEXT NOT NULL,
  website         TEXT,
  tier            TEXT NOT NULL CHECK (
    tier IN ('STRATEGIC', 'ENTERPRISE', 'MID_MARKET')
  ),
  status          TEXT NOT NULL CHECK (
    status IN ('PROSPECT', 'ACTIVE', 'CHURNED')
  ),
  owner_user_id   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id              TEXT PRIMARY KEY,
  account_id      TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  title           TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id                    TEXT PRIMARY KEY,
  account_id            TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  stage                 TEXT NOT NULL CHECK (
    stage IN (
      'DISCOVER', 'QUALIFY', 'ENGAGE', 'PROPOSE', 'CLOSED_WON', 'CLOSED_LOST'
    )
  ),
  amount                NUMERIC NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'USD',
  probability            INTEGER NOT NULL DEFAULT 0 CHECK (
    probability BETWEEN 0 AND 100
  ),
  expected_close_date    DATE,
  owner_user_id          TEXT NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id                TEXT PRIMARY KEY,
  account_id        TEXT NOT NULL REFERENCES crm_accounts(id) ON DELETE CASCADE,
  opportunity_id    TEXT REFERENCES crm_opportunities(id) ON DELETE CASCADE,
  contact_id        TEXT REFERENCES crm_contacts(id) ON DELETE SET NULL,
  type              TEXT NOT NULL CHECK (
    type IN ('NOTE', 'CALL', 'MEETING', 'EMAIL', 'TASK')
  ),
  subject           TEXT NOT NULL,
  body              TEXT,
  due_date          TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_by_user_id TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_account_id ON crm_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_account_id ON crm_opportunities(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_crm_activities_account_id ON crm_activities(account_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_opportunity_id ON crm_activities(opportunity_id);
