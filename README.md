# ConsultAmerica

Next.js platform combining a public consultancy/marketing site with a full internal workforce suite — ATS/recruiting, HR, employee & manager self-service, payroll, and CRM — backed by Supabase (Postgres + Auth + Storage).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Supabase credentials go in `.env.local` (see `scripts/probe-supabase.ts` / `scripts/seed-supabase.ts` for setup).

## Functions

The app is organized as role-scoped route groups under `app/`, each backed by business logic in the matching `lib/<domain>` module.

### Recruiting & ATS
`app/(workforce)/workforce/{candidates,jobs,interviews,recruiting}`, `app/jobs`, `app/(candidate)`

- `lib/recruiting` — requisition repository (Supabase-backed, with an in-memory double for tests), candidate stage/status state machine (`status-machine.ts`, `candidate-stage.ts`), application stage transitions, job description extraction (`jd-extraction.ts`), and Candidate Match (`candidate-match.ts`, `candidate-match-actions.ts`) — AI-assisted candidate/job fit scoring surfaced inside the ATS pipeline
- `lib/ats/ops.ts` — pipeline operations shared across ATS screens
- `lib/candidate` — candidate portal session/security, job-match surfacing, profile completion, account provisioning

### HR
`app/(hr)`

- `lib/hr` — HR request actions, employee-number assignment (`employee-number.ts`), repository with Supabase and in-memory implementations; feeds manager approvals and payroll handoff

### Employee & Manager Self-Service
`app/(employee)`, `app/(manager)`

- `lib/self-service` — one store per domain: time, leave, expenses, benefits, compensation, performance, profile changes, HR requests, payroll view — plus a shared approval/workflow engine (`approval-service.ts`, `workflow-store.ts`), session, permissions, security, and surface-scoped notification/reporting services

### Payroll
`app/(payroll)`

- Pay periods, runs, earnings/deductions, and employee pay read through `lib/self-service/payroll-store.ts` and `lib/hr`; payroll reporting via `lib/reports`

### CRM
`app/(crm)`

- `lib/crm` — accounts/contacts/opportunities repository (Supabase and in-memory), actions, session handling

### Workforce Administration
`app/(workforce)/workforce/{administration,organization,people,users,settings,system-health}`

- `lib/workforce/operations.ts` — organization structure, user/role administration, system health
- `lib/audit/audit-log.ts` — audit trail read/write, shared by HR, workforce, and ATS surfaces

### Reports & Exports
- `lib/reports` — access control (`access.ts`), report queries and shared types, used by HR/manager/payroll/workforce report screens
- `lib/exports` + `app/api/exports/*` — CSV generation (`csv.ts`) and route helpers, with one export route per report: hiring pipeline, onboarding status, leave requests/report, time entries/approval status, payroll run summary, HR requests/summary, candidate match results, employee directory

### Notifications
- `lib/notifications` — email templates (`templates.ts`) and sending (`email.ts`), delivery-queue processing (`process-deliveries.ts`, run via `scripts/process-notification-deliveries.ts`)
- Per-surface unread/read state lives in `lib/self-service/notification-service.ts`

### Documents
- `lib/documents` — candidate and employee document services, employee document actions, application-document lineage tracking (immutability + audit trail)
- `lib/storage` — Supabase Storage adapters for candidate and employee documents

### Auth
- `lib/auth` — current-user resolution, role model (`roles.ts`), post-login redirect (`return-to.ts`)
- Per-surface session/permission modules (`lib/crm/session.ts`, `lib/candidate/session.ts`, `lib/workforce/session.ts`, `lib/self-service/permissions.ts` + `security.ts`) layer role-specific authorization on top of Supabase Auth, enforced by Postgres RLS (`db/schema/013_rls.sql`, `019_rls_security_pass.sql`, `025_legacy_table_rls_lockdown.sql`, `028_job_match_recruiter_access_restriction.sql`)

### Marketing
`app/(marketing)`

- `lib/marketing` — capability and industry page content, portfolio data, contact form store, stock image mapping

Data model lives in `db/schema/*.sql` (36 migrations: organization, identity, recruiting, HR, RLS policies, storage buckets, hire/onboarding lifecycle integrity, notifications/reporting/audit, candidate profile & job match). Drift and RLS are checked continuously — see [Testing](#testing).

## Design

Full spec: [`docs/UI_UX_DESIGN_SPEC.md`](docs/UI_UX_DESIGN_SPEC.md). Summary:

**One visual system, three UX languages** — never mix them:

- **Marketing / Jobs** — editorial, expressive, story-driven; 12-col grid, 1440px max width, large display type (72–104px hero clamp), restrained motion.
- **Insights (articles)** — long-form reading experience; 720–780px reading column, sticky table of contents, 18–20px body copy, 1.7–1.8 line height.
- **Application (ATS / HR / Employee / Manager / Payroll)** — dense, structured, task-driven; 1280–1440px workspace, 240–280px navy sidebar, 16px base type, compact tables/status chips, drawers/modals over page navigation, explicit approve/reject/return workflows.

**Shared brand tokens** (`--ca-*`, see `app/lib` / `components/brand`, styles in `styles/`):

```
--ca-black / --ca-navy   #05070d
--ca-white               #ffffff
--ca-off-white           #f4f4f4
--ca-blue                #3b82f6
--ca-blue-hover          #2563eb
--ca-app-bg              #F4F6F8   (internal portals)
--ca-app-sidebar         #071A2F
--ca-ink-dark            #0B1220   (light surfaces)
```

Typography: Helvetica Neue / Helvetica / Arial across marketing and app — no decorative display fonts. Visual language favors typography, thin rules, whitespace, and asymmetrical grids over rounded cards, gradients, or icon grids.

**Shared component inventory** (`components/ui`, `components/shared`): StatusBadge, DataTable, FilterBar, FormField/FormSection, EmptyState, Drawer/Modal, ApprovalActions, PageHeader. Marketing/Insights adds Section, EditorialRule, InsightToc, PullQuote, ArticleCta, RelatedInsights.

New UI should reference the design spec before introducing local styles; prefer refining existing components over new one-offs.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Vitest · Playwright · deployed via OpenNext on Cloudflare Workers.

## Testing

```bash
npm run lint
npm test                  # vitest
npm run verify:phase4     # lint + test + build
```

Targeted regression suites (require `.env.local`): `test:rls`, `test:lineage`, `test:hire-lineage`, `test:onboarding-lineage`, `test:workforce-ops`, `test:payroll-rls`, `test:candidate-auth`, `test:candidate-portal`, `test:notifications`, `test:reports`, `test:admin`, `test:ats`, `test:hr`, `test:job-analyzer`, `test:audit`, `test:browser-qa`.

Schema drift checks: `npm run db:audit-drift` (functions + triggers).
