# Domain Function Reference

Low-level function/module inventory, one section per domain. This is the
detail that used to live in README's "Functions" section — see
[`README.md`](../README.md) for the architecture-level overview and
[`REPOSITORY_TRUTH_AUDIT.md`](REPOSITORY_TRUTH_AUDIT.md) for what's actually
production-backed vs. in-memory per domain.

## Recruiting & ATS
Routes: `app/(workforce-app)/app/recruiting/**` (canonical), `app/jobs`, `app/(candidate)`. Legacy `app/(workforce)/workforce/{candidates,jobs,interviews,recruiting}` are redirect stubs to the canonical routes.

- ATS dashboard (`loadAtsDashboard` in `lib/ats/ops.ts`) — pipeline stage counts, recent applications, upcoming interviews, open offers, and recent Candidate Match runs in one view
- Interview and offer queues: `listAtsInterviews()`, `listAtsOffers()`
- Requisition & candidate repository (Supabase-backed when `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are set; silently falls back to an in-memory repository otherwise — not fail-fast, see [known issues](known-issues.md))
- Candidate stage/status state machine (`status-machine.ts`, `candidate-stage.ts`) and application stage transitions (`application-transitions.ts`), so a candidate can only move through valid pipeline states
- Candidate portal (`lib/candidate`): session/security, job listing + apply flow, profile completion tracking, self-service account provisioning
- Job Analyzer / Candidate Match — see below

## Job Analyzer (Candidate Match)
Recruiting **intelligence layer** inside the hiring lineage (Requisition → Applications → Match → Review → …), not a standalone AI demo. One deterministic scoring engine, two surfaces:

- `lib/candidate/job-match.ts` implements `analyzeJobMatch()` — a keyword-overlap heuristic (tokenizes resume + skills vs. job description, scores coverage 12–96%) returning skills found/missing, an experience-alignment note, keywords to consider, and improvement suggestions
- `lib/recruiting/candidate-match.ts` re-exports that same function for the recruiter-facing tool — explicitly one algorithm, not two independent scorers
- Explainable and decision-support only by design: source comments state it must never auto-reject, auto-advance, rank candidates, or change application status — recruiters and candidates see the same transparent breakdown, not a black-box score
- Job description ingestion (`jd-extraction.ts`): paste text, or upload PDF/DOCX/TXT (≤8MB); parse failures degrade gracefully to "paste the description instead" rather than erroring
- Wired directly into the ATS pipeline rather than living as a standalone tool: match scores appear in the applications queue (`applications-table.tsx`), the application workspace, the job detail candidates tab, and the pipeline board can re-run Candidate Match for a candidate/job pair
- Results are exportable via `app/api/exports/candidate-match-results`
- Covered by `npm run test:job-analyzer` (`scripts/job-analyzer-regression.ts`), which asserts the scoring invariants above and that all four ATS surfaces stay wired to `jd_analysis`

## HR
Routes: `app/(hr)`

- Hire conversion: `hireCandidate()` / `convertHire()` — turns an accepted candidate application into an employee record
- Direct employee creation (`createEmployeeDirect`) for hires made outside the ATS pipeline
- Employee lifecycle actions: `changeEmployeeStatusAction`, `updateEmployeeAssignment` (role/department/manager changes)
- Work authorization tracking: `upsertWorkAuthorizationAction` with a verification-status lifecycle
- Employee numbering: sequential, gap-aware IDs via `formatEmployeeNumber()` / `nextEmployeeNumber()`
- Employee profile, contact, assignment, and compensation repository (Supabase-backed when configured; same non-fail-fast in-memory fallback as ATS above)
- Feeds manager approvals and the payroll handoff downstream

## Employee & Manager Self-Service
Routes: `app/(employee)`, `app/(manager)`

One store per domain in `lib/self-service`, each with employee-side actions and a matching manager/HR approval path:

- **Time** (`time-store.ts`) — draft and submit timesheets, business-day and hours calculation, manager approve/reject/return with full approval history
- **Leave** (`leave-store.ts`) — leave balances by type, leave-hour calculation, submit/cancel requests, manager approval queue
- **Expenses** (`expense-store.ts`) — submit/cancel claims, manager approve/reject
- **Benefits** (`benefits-store.ts`) — plan catalog, elections, cancel election
- **Compensation** (`compensation-store.ts`) — active compensation lookup as of a given date, upsert
- **Performance** (`performance-store.ts`) — goals with progress tracking, review cycles, self-assessment, manager assessment, employee acknowledgment
- **Profile changes** (`profile-change-store.ts`) — employee-submitted changes routed for approve/reject
- **HR requests** (`hr-request-store.ts`) — two-way employee/HR message thread with status workflow
- Unified approval inbox across all of the above (`approval-service.ts`), a shared pending-approval/history engine (`workflow-store.ts`), and in-app notifications with per-employee read/unread state
- **Not Supabase-backed today.** Every store above (plus payroll run status/lock state and the self-service audit log) is an in-memory, module-level singleton seeded at process start — there is no Postgres table behind any of it, and it is wired into real production server actions, not just tests. Data does not survive a restart/redeploy. See [`REPOSITORY_TRUTH_AUDIT.md`](REPOSITORY_TRUTH_AUDIT.md) and [known issues](known-issues.md).

## Payroll
Routes: `app/(payroll)`

- Pay periods and payroll runs, with `calculatePayrollRun()` computing payslips for every employee in a period
- Payslip lookup per employee or per run, including "latest payslip" for self-service
- Run lifecycle: `submitRunForReview()` → `approvePayrollRun()` → `lockPayrollRun()`
- Payroll reporting via `lib/reports`, exports via `app/api/exports/payroll-run-summary`
- Same in-memory-only caveat as Self-Service above — `payroll-store.ts` has no Supabase backing

## CRM / ClientFlow
Routes: `app/(crm)`

- Accounts, contacts, and opportunities with list and detail views (`repository.ts`)
- Opportunity pipeline summary rolled up by stage (`PipelineSummary` / `PipelineStageSummary`)
- Actions: create account/contact/opportunity, move an opportunity between pipeline stages, log an activity against a record (`actions.ts`)
- **ClientFlow** (client lifecycle / automation layer): see [`CLIENTFLOW_ROADMAP.md`](CLIENTFLOW_ROADMAP.md) for authoritative phase sequencing. Current state:
  - **Phase 1 (RELEASED):** Talk to Expert → durable inquiry/contact persistence → Gmail welcome/ack + internal notification, both async and retryable through a durable email outbox. Schema: `036_clientflow_phase1.sql` (+ `037` production-gate hardening, `038` claim grants). Contact detail at `/crm/contacts/[id]` (Overview | Activity | Emails), ops queue at `/crm/emails`. `npm run test:clientflow` / `npm run clientflow:process-emails`.
  - **Phase 2A (COMPLETE):** Service enrollments (`039_clientflow_phase2a_enrollments.sql`) and service-specific templates (`040_clientflow_phase2a_templates.sql`, `lib/clientflow/templates.ts`) — templates are communication content only (subject/body/variables via `{{var}}` substitution, HTML-escaped, sanitized against injection); no delays/conditions/branching live in a template, that's a Phase 2B concern.
  - **Phase 2B (COMPLETE):** Automation engine only, no visual builder (`041_clientflow_phase2b_automation.sql`, `lib/clientflow/workflow-engine.ts`). Executes versioned, schema-validated trigger → condition → delay → branch → action primitives (`enqueue_email`, `set_enrollment_status`, `write_activity`) against durable `crm_workflow_runs`/`crm_workflow_events`/`crm_workflow_steps` tables — not a general-purpose scripting runtime (no eval/arbitrary code/HTTP/loops). Delays are DB-scheduled and worker-claimed (survive restarts), not `setTimeout`. `npm run test:clientflow-workflows` / `npm run clientflow:process-workflows`.
  - **Durable outbox architecture:** `crm_email_messages` rows move `queued` → `sent` | `failed` | `retrying` (dev: `simulated`); claimed by worker id with idempotency, so retries can't double-send. Same idempotency discipline applies to workflow step claiming.
  - Phase 2C (visual builder) and 2D (analytics/AI) remain blocked pending explicit product authorization — do not build ahead of that gate.

## Workforce Administration
Routes: `app/(workforce)/workforce/{administration,organization,people,users,settings,system-health}` — this is the **Admin** module's implementation (canonical entry: `/workforce/administration`); despite the folder name, it is not a recruiting/ATS surface (see [`REPOSITORY_TRUTH_AUDIT.md`](REPOSITORY_TRUTH_AUDIT.md) for the naming-residue gap this creates).

- `lib/workforce/operations.ts` — organization structure, user/role administration, system health
- `lib/audit/audit-log.ts` — audit trail read/write, shared by HR, workforce, and ATS surfaces (coverage gaps documented in the audit)

## Reports & Exports
- `lib/reports` — access control (`access.ts`), report queries and shared types, used by HR/manager/payroll/workforce report screens
- `lib/exports` + `app/api/exports/*` — CSV generation (`csv.ts`) and route helpers, with one export route per report: hiring pipeline, onboarding status, leave requests/report, time entries/approval status, payroll run summary, HR requests/summary, candidate match results, employee directory

## Notifications
- `lib/notifications` — email templates (`templates.ts`) and sending (`email.ts`), delivery-queue processing (`process-deliveries.ts`, run via `scripts/process-notification-deliveries.ts`)
- Per-surface unread/read state lives in `lib/self-service/notification-service.ts`

## Documents
- `lib/documents` — candidate and employee document services, employee document actions, application-document lineage tracking (immutability + audit trail)
- `lib/storage` — Supabase Storage adapters for candidate and employee documents

## Auth
- `lib/auth` — current-user resolution, role model (`roles.ts`), post-login redirect (`return-to.ts`)
- Per-surface session/permission modules (`lib/crm/session.ts`, `lib/candidate/session.ts`, `lib/workforce/session.ts`, `lib/self-service/permissions.ts` + `security.ts`) layer role-specific authorization on top of Supabase Auth, enforced by Postgres RLS where the domain is Supabase-backed (`db/schema/013_rls.sql`, `019_rls_security_pass.sql`, `025_legacy_table_rls_lockdown.sql`, `028_job_match_recruiter_access_restriction.sql`)

## Marketing
Routes: `app/(marketing)`

- `lib/marketing` — capability and industry page content, portfolio data, contact form store, stock image mapping
