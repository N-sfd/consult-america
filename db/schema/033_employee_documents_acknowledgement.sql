-- Employee Documents convergence: /employee/documents self-service moves
-- onto the same employee_documents table + private bucket HR already uses
-- (Workforce -> People -> Employee Detail -> Documents), retiring the old
-- in-memory lib/self-service/document-store.ts. That old system supported a
-- document acknowledgement flow (policy documents: checkbox -> timestamp)
-- with no equivalent column here — add it rather than keep a second store.

ALTER TABLE employee_documents
  ADD COLUMN IF NOT EXISTS requires_acknowledgement BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMPTZ;
