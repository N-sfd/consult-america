-- audit_logs.actor_role was scoped to the Phase 4K self-service actors
-- (EMPLOYEE | MANAGER | HR) only. Recruiting/People/Payroll admin actions
-- now write to this table too. Values here match the coarse-grained actor
-- roles the app's session helpers already resolve to (PortalActor.role in
-- lib/self-service/security.ts: EMPLOYEE|MANAGER|HR|PAYROLL; WorkforceRole in
-- lib/workforce/session.ts: ADMIN|RECRUITER|HR|HIRING_MANAGER) rather than
-- the finer-grained platform role names, since that's what call sites have
-- on hand.

ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_actor_role_check;

ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_actor_role_check CHECK (
  actor_role IN (
    'EMPLOYEE',
    'MANAGER',
    'HR',
    'PAYROLL',
    'RECRUITER',
    'HIRING_MANAGER',
    'ADMIN'
  )
);
