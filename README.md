# ConsultAmerica

One Consult America **enterprise platform**, six connected modules — **CRM, ATS, HR, Employee, Payroll, Admin** — sharing identity, design tokens, security, and continuous business data, plus a public consultancy/marketing site. Candidate and Manager are **role experiences** within that platform, not separate products. Backed by Supabase (Postgres + Auth + Storage) — with one significant exception, see [Data architecture](#data-architecture).

Hire in ATS creates the HR employee; Administration governs platform workflows; Candidate Match is the recruiting intelligence layer (not a standalone AI demo) and is decision-support only — it never auto-rejects, auto-advances, or ranks candidates for a hiring decision.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Supabase credentials go in `.env.local` (see `scripts/probe-supabase.ts` / `scripts/seed-supabase.ts` for setup). Without Supabase configured, most surfaces fall back to a hardcoded demo identity for local development — see [Security](#security) for why that fallback is blocked outside development.

## Product architecture

The canonical module list lives in code, not just docs: [`lib/platforms/suite.ts`](lib/platforms/suite.ts) (`SUITE_MODULES`, marked FROZEN — don't rename/merge/split without explicit authorization). The marketing switcher (`app/platforms/page.tsx`) renders directly from it.

| Module | Role | Primary app entry |
|---|---|---|
| **CRM** | Client and opportunity lifecycle — capture through ClientFlow automation | `/crm` |
| **ATS** | Requisition to offer — accepted offers create the employee in HR | `/app/recruiting` |
| **HR** | Employee records, requests, and onboarding continuity after hire | `/hr/requests` |
| **Employee** | Self-service profile, time, and leave | `/employee` |
| **Payroll** | Runs, earnings, and deductions on the employee record created through ATS → HR | `/payroll` |
| **Admin** | Users, roles, security, and configuration — a control plane across the suite, not a second product | `/workforce/administration` (canonical; `/workforce/admin` is a compatibility redirect) |

Candidate and Manager are authenticated **experiences** of this same platform (`/candidate`, `/manager`), scoped by role, not additional top-level products.

Known naming residue from the platform's history: the ATS app shell's own page metadata still says "Workforce App" in places, and a few Admin pages carry a literal "Workforce" eyebrow instead of "Admin" — routing is correct, only some user-visible labels lag the locked taxonomy. See [`docs/known-issues.md`](docs/known-issues.md).

## Workspaces

Each route group is backed by business logic in the matching `lib/<domain>` module. This section is the map; **[`docs/DOMAIN_REFERENCE.md`](docs/DOMAIN_REFERENCE.md) has the full function-level inventory per domain** — read it instead of grepping `lib/` cold.

- **CRM / ClientFlow** (`app/(crm)`) — accounts, contacts, opportunities, and the ClientFlow client-lifecycle automation layer (Talk to Expert → email → enrollment → automation). Phase status: see [Cross-platform workflows](#cross-platform-workflows).
- **ATS / Recruiting** (`app/(workforce-app)/app/recruiting/**`, `app/jobs`, `app/(candidate)`) — requisitions, pipeline, interviews, offers, and Candidate Match (the recruiting intelligence layer — one scoring engine, shared verbatim between the candidate and recruiter surfaces, never used to auto-decide).
- **HR** (`app/(hr)`) — hire conversion, employee lifecycle, work authorization, employee numbering; feeds manager approvals and the payroll handoff.
- **Employee & Manager self-service** (`app/(employee)`, `app/(manager)`) — time, leave, expenses, benefits, compensation, performance, profile changes, HR requests, and a unified approval inbox. **Not Supabase-backed today** — see [Data architecture](#data-architecture).
- **Payroll** (`app/(payroll)`) — pay periods, runs, payslips, run lifecycle (calculate → submit → approve → lock). Same in-memory caveat as self-service.
- **Admin / Workforce Administration** (`app/(workforce)/workforce/{administration,organization,people,users,settings,system-health}`) — organization structure, user/role administration, system health, audit trail.
- **Marketing** (`app/(marketing)`) — the public consultancy site; a separate visual language from the application surfaces (see [Design system](#design-system)).

## Cross-platform workflows

Two lineages run through the whole suite (`lib/platforms/suite.ts` `SUITE_FLOWS`):

```text
People continuum:   ATS → Hire → HR → Employee → Payroll
                    (an accepted offer creates the employee — no re-entry, no status-only hire)

Client continuum:   CRM → Opportunity → ClientFlow
                    (inquiry/opportunity context stays on the contact; automation runs inside CRM)

Governance:         Admin → Users → Roles → Security → Configuration
                    (one control plane for the suite, not a separate admin product)
```

**ClientFlow** (the CRM automation layer) — [`docs/CLIENTFLOW_ROADMAP.md`](docs/CLIENTFLOW_ROADMAP.md) is the authoritative source for phase sequencing; this is a snapshot, not a substitute for it:

- **Phase 1 — RELEASED.** Talk to Expert → durable inquiry/contact persistence → Gmail welcome/ack + internal notification, both async and retryable through a durable email outbox (`crm_email_messages`: `queued` → `sent`/`failed`/`retrying`, claimed by worker id, idempotent). Schema: `036_clientflow_phase1.sql` (+ `037` production-gate hardening, `038` claim grants).
- **Phase 2A — COMPLETE.** Service enrollments (`039_clientflow_phase2a_enrollments.sql`) and service-specific templates (`040_..._templates.sql`) — templates are communication content only (sanitized `{{var}}` substitution), no delays/conditions/branching.
- **Phase 2B — COMPLETE** (automation engine only, no visual builder). `041_clientflow_phase2b_automation.sql` + `lib/clientflow/workflow-engine.ts` execute versioned, schema-validated trigger → condition → delay → branch → action primitives against durable, worker-claimed tables — not a general scripting runtime (no eval/arbitrary code/HTTP/loops).
- **Phase 2C (visual builder) and 2D (analytics/AI) remain blocked** pending explicit product authorization — do not build ahead of that gate.

## Data architecture

- **Schema:** `db/schema/*.sql` — 42 migrations (organization, identity, recruiting, HR, RLS policies, storage buckets, hire/onboarding lifecycle integrity, notifications/reporting/audit, candidate profile & job match, ClientFlow phases 1–2B). Latest: `041_clientflow_phase2b_automation.sql`. Drift checked via `npm run db:audit-drift`.
- **Supabase-backed with a silent, non-fail-fast fallback:** ATS/Recruiting, HR, and CRM each pick a Supabase or in-memory repository via `isSupabaseConfigured()` (`app/lib/supabase/server.ts`). If `NEXT_PUBLIC_SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are ever missing in a real deployment, these silently run on in-memory data instead of refusing to start — no fail-fast exists yet.
- **Not Supabase-backed at all:** the entire Employee/Manager self-service domain — time, leave, expenses, benefits, compensation, performance, profile changes, HR requests, approvals — plus payroll run status/lock and the self-service audit log. Every one of these is a module-level in-memory singleton wired into real production server actions. **This data does not survive a restart or redeploy today.** This is the single most consequential gap found in the 2026-09-21 repository audit; migrating it to Postgres is the top item in the remaining backlog. See [`docs/REPOSITORY_TRUTH_AUDIT.md`](docs/REPOSITORY_TRUTH_AUDIT.md).
- **RLS exists and is correctly enforced** (`db/schema/013_rls.sql`, `019_rls_security_pass.sql`, `025_legacy_table_rls_lockdown.sql`, `028_job_match_recruiter_access_restriction.sql`, verified by `npm run test:rls` against a real anon/authenticated client) — **but the application itself never queries through a role-respecting client.** Every Supabase-backed repository and service uses the service-role key (`getSupabaseServiceClient()`), which bypasses RLS by design. RLS would protect a leaked anon key or a future direct-DB client; it provides no defense-in-depth for today's application requests. All real authorization for end users comes from the application-layer checks described in [Security](#security).

## Security

Authorization is enforced **server-side, in code — not via a `middleware.ts` (there isn't one) and not via nav visibility.** Every role-scoped route group (Candidate, Employee, Manager, HR, Payroll, CRM/Sales, Recruiter/Admin under Workforce) gates access in its `layout.tsx` via a session/role guard (`requireHrActor`, `requirePayrollActor`, `requireManagerActor`, `getCrmSession`, `getWorkforceSession`, etc. — `lib/auth`, `lib/self-service/security.ts`, `lib/crm/session.ts`, `lib/workforce/session.ts`, `lib/candidate/security.ts`), and sensitive mutations re-check permission again inside the server action itself. Verified by direct code tracing (2026-09-21 audit) across payroll runs, HR requests, Admin user management, and ATS candidate access — the layout+action gate is real, not decorative.

**Two gaps found and fixed in this pass:**
- A segregation-of-duties bug let a manager approve or reject their **own** submitted timesheet/leave/expense/performance-review/HR-request through the manager-approval action, because the shared team-access check (`assertTeamAccess`) treats "actor is the resource owner" as authorized — a shortcut meant for a manager viewing their own record, incorrectly also satisfied "approver is the subject." Fixed with a dedicated `requireNotSelfApproval` guard now called alongside `requireTeamResource` at all nine approve/reject/return call sites (time, leave, expense, performance, and the unified approval inbox). Covered by new tests in `tests/unit/security.test.ts`.
- Every session module (`lib/workforce/session.ts`, `lib/crm/session.ts`, `lib/candidate/session.ts`, `lib/self-service/session.ts`) falls back to a hardcoded, fully-privileged demo identity (e.g. full ADMIN/RECRUITER/HR) when Supabase env vars are absent — a deliberate, banner-announced local-dev convenience, but nothing previously stopped it from silently activating in a real deployment missing those vars. Fixed with `assertDemoSessionAllowed()` (`app/lib/supabase/client.ts`), which throws in production instead of granting the demo session. Covered by `tests/unit/demo-session-guard.test.ts`.

**Known remaining gap (not fixed in this pass):** ATS recruiter/hiring-manager/HR/Admin sessions can view any candidate's full profile and documents with no scoping to "candidates in requisitions I'm assigned to" — this may be intentional (shared candidate pool visibility is common in ATS design) rather than a bug, so it needs a product decision, not a unilateral fix. See [`docs/known-issues.md`](docs/known-issues.md).

**Errors are sanitized, not silently leaked.** Server actions resolve caught errors through `toSafeMessage()` / `toActionErrorMessage()` (`lib/observability/safe-error.ts`, `lib/self-service/security.ts`): an intentionally user-facing `SafeUserError` (e.g. `SecurityError`) is returned verbatim; anything else — a raw Postgres/Supabase exception, an unexpected crash — is logged in full via `logServerError()` and replaced with a generic fallback message. This replaced several confirmed leaks (payroll actions, recruiting interview/feedback actions) where a raw driver error message could previously reach the browser. See [Design system](#design-system) for the full state-handling standard (loading/empty/permission-denied/backend-unavailable/action success-failure/retryable-failure).

## Design system

Full spec: [`docs/UI_UX_DESIGN_SPEC.md`](docs/UI_UX_DESIGN_SPEC.md). Summary:

**One visual system, three UX languages** — Marketing/Jobs (editorial, expressive), Insights (long-form reading), Application (ATS/HR/Employee/Manager/Payroll/CRM/Admin — dense, structured, task-driven, 1280–1440px workspace, **520px** deep-teal sidebar via `--workspace-sidebar-width` — deliberately widened to fully contain the brand lockup, not the 240–280px an earlier spec draft claimed).

**Shared brand tokens** (`:root` in `app/globals.css`): `--ca-teal-deep #073B4C` (primary dark/hero) · `--ca-teal-chrome #0B4655` (app chrome) · `--ca-teal #356D76` · `--ca-canvas #F5F6F1` · `--ca-ink #102F35` · `--ca-lime #C9F45A` (restrained CTA/active accent only, never section fills) · `--ca-line #D5DFDB` (borders). Helvetica Neue/Helvetica/Arial for app chrome; restrained serif for marketing headlines only.

**Shared component inventory** (`components/ui`, `components/shared`): StatusBadge, DataTable, FilterBar, FormField/FormSection, EmptyState, Drawer/Modal, ApprovalActions, PageHeader, plus the newer LoadingState/ActionBanner/BackendUnavailableState (state standardization, see spec §7.1). Some of these are under-adopted in practice — e.g. `DataTable` exists but isn't used by any page yet, and a couple of pages hand-roll a status pill instead of `StatusBadge` — tracked in [`docs/known-issues.md`](docs/known-issues.md) rather than silently left undocumented.

New UI should reference the design spec before introducing local styles; prefer refining existing components over new one-offs.

## Testing

```bash
npm run lint
npm test                  # vitest
npm run verify:phase4     # lint + test + build
```

Targeted regression suites (require `.env.local`): `test:rls`, `test:lineage`, `test:hire-lineage`, `test:onboarding-lineage`, `test:workforce-ops`, `test:payroll-rls`, `test:candidate-auth`, `test:candidate-portal`, `test:notifications`, `test:reports`, `test:admin`, `test:ats`, `test:hr`, `test:job-analyzer`, `test:audit`, `test:clientflow`, `test:clientflow-workflows`, `test:browser-qa`.

`test:browser-qa` needs a running `npm run dev`, seeded demo accounts (`npm run seed:supabase`), and installed Playwright browsers (`npx playwright install`) — it wasn't run as part of the 2026-09-21 consolidation pass for that reason; everything else in the list above was, and passed. See [`docs/known-issues.md`](docs/known-issues.md) for the (small, pre-existing, unrelated) lint failures still open.

Schema drift checks: `npm run db:audit-drift` (functions + triggers).

## Deployment / operations

Repo is configured for **both** OpenNext-on-Cloudflare-Workers (`wrangler.jsonc`, `npm run deploy`/`preview`/`upload`) and Vercel (`vercel.json`, a linked project, `npm run clientflow:vercel-env`) — **which one is authoritative for production is currently unresolved**; `docs/CLIENTFLOW_ROADMAP.md`'s operational-status section refers only to a Vercel URL, while this repo's own scripts default to Cloudflare. Resolve this before treating either deploy path as "the" production pipeline. See [`docs/known-issues.md`](docs/known-issues.md).

ClientFlow production env: 6 required vars (`GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN`, `GMAIL_FROM`, `CLIENTFLOW_INTERNAL_NOTIFY_TO`, `CLIENTFLOW_REQUIRE_GMAIL`) — see `docs/CLIENTFLOW_ROADMAP.md` for the full list and the Gmail OAuth helper.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Vitest · Playwright.

## Detailed docs

- [`docs/DOMAIN_REFERENCE.md`](docs/DOMAIN_REFERENCE.md) — function-level inventory per domain
- [`docs/CLIENTFLOW_ROADMAP.md`](docs/CLIENTFLOW_ROADMAP.md) — authoritative ClientFlow phase sequencing
- [`docs/UI_UX_DESIGN_SPEC.md`](docs/UI_UX_DESIGN_SPEC.md) — full design spec, including the UI-state standard (§7.1)
- [`docs/REPOSITORY_TRUTH_AUDIT.md`](docs/REPOSITORY_TRUTH_AUDIT.md) — 2026-09-21 documented-vs-actual audit matrix
- [`docs/known-issues.md`](docs/known-issues.md) — tracked gaps, including everything found in the audit above
