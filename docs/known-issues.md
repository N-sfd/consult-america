# Known issues

Tracked here in lieu of a GitHub issue (no `gh` CLI access in the environment
that found these). Move to a real issue/board entry when convenient.

## Pre-existing project-wide lint failures

`npm run lint` (and therefore `npm run verify:phase4`) currently fails with
4 errors, unrelated to any work in the document-acknowledgment milestone
(2026-09-10) that surfaced them — confirmed via `git diff` against the
commit before that work started. Until fixed, "project-wide lint is green"
is not a valid claim for this repo; `npx eslint <specific files>` on a
change's own touched files is the reliable substitute in the meantime.

- `app/actions/candidate-actions.ts:416` — `'jobRequisitionId' is never
  reassigned. Use 'const' instead` (`prefer-const`). Mechanical, likely
  auto-fixable with `eslint --fix`.
- `components/marketing/capability-ecosystem.tsx:134` — `Calling setState
  synchronously within an effect can trigger cascading renders`
  (`react-hooks/set-state-in-effect`), in a `useEffect(() => { setMounted(true); }, [])`
  mount-detection pattern.
- `components/platform/platform-shell.tsx:224` — same rule, in a
  `useEffect(() => { setDrawerOpen(false); }, [pathname])` route-change
  handler.
- `components/shared/relative-time.tsx:19` — same rule, in a
  `useEffect(() => { setLabel(formatRelativeTime(iso)); }, [iso])` formatter.

The three `react-hooks/set-state-in-effect` cases likely need the same fix
shape (e.g. deriving state during render / `useSyncExternalStore` instead of
`useEffect` + `setState`, per the rule's guidance), but each call site should
be checked individually before changing it — not in scope to fix opportunistically
alongside unrelated work.

## Self-service domain has no Supabase/Postgres backing (production data durability)

Found during the 2026-09-21 repository truth audit
([`docs/REPOSITORY_TRUTH_AUDIT.md`](REPOSITORY_TRUTH_AUDIT.md)). Every store
under `lib/self-service/` (time, leave, expense, benefits, compensation,
performance, profile-change, HR-request, workflow/approval) plus
`payroll-store.ts` and the self-service `audit-store.ts` is a module-level
in-memory array with no Supabase implementation at all — not a fallback, the
only implementation. They are imported directly by real production server
actions (`app/actions/time-actions.ts`, `leave-actions.ts`, `expense-actions.ts`,
`benefits-actions.ts`, `performance-actions.ts`, `hr-request-actions.ts`,
`approval-actions.ts`, `payroll-actions.ts`), so real timesheets, leave
requests, expense claims, benefits elections, performance reviews, HR
requests, approval decisions, and payroll run status/lock state do not
survive a server restart, redeploy, or scale event today. This is the
highest-priority gap surfaced by the audit; migrating this domain to
Postgres-backed repositories is real engineering work, not a doc fix.

## ATS / HR / CRM / ClientFlow Supabase fallback is silent, not fail-fast

Also from the 2026-09-21 audit. `lib/recruiting`, `lib/hr`, and `lib/crm` each
pick a Supabase-backed or in-memory repository via `isSupabaseConfigured()`
(`app/lib/supabase/server.ts`, checks `NEXT_PUBLIC_SUPABASE_URL` +
`SUPABASE_SERVICE_ROLE_KEY`); ClientFlow does the equivalent per call site in
`lib/clientflow/*`. No code path refuses to boot or logs a warning when those
env vars are absent — a misconfigured deployment would silently run on
in-memory data with no error. Fail-fast behavior (refuse/alert instead of
silently degrading) is not implemented.

## Vercel vs. Cloudflare Workers — unclear which is production

The repo is configured for both: `wrangler.jsonc` + OpenNext scripts target
Cloudflare Workers (per README's stated deployment), but `vercel.json` is
tracked in git, `.vercel/project.json` links a real Vercel project, there's a
`clientflow:vercel-env` sync script, and `docs/CLIENTFLOW_ROADMAP.md`'s entire
production operational-status section refers only to
`consultamerica-nu.vercel.app`. Needs a decision from the product owner, not
an assumption in code or docs.

## Audit log (`audit_logs`) doesn't cover the most sensitive operations

`lib/audit/audit-log.ts` writes to the real, persisted `audit_logs` table, but
is wired into only 6 call sites (HR/employee lifecycle, candidate-match,
documents, report exports). Payroll approve/lock, self-service approvals
(leave/expense/timesheet/profile-change), HR request status changes, and
ClientFlow/CRM outbound email produce no entry in `audit_logs` at all today —
payroll and self-service approvals only write to the in-memory
`lib/self-service/audit-store.ts`, which is wiped on restart. The audit
writer is also explicitly best-effort (errors on write are swallowed rather
than surfaced). See `docs/REPOSITORY_TRUTH_AUDIT.md` for the full
activity-vs-audit-event analysis.

## Shared UX primitives: `DataTable` unused, `FormSection` underused

Correction (2026-09-21): an earlier pass of this audit claimed `FormSection`
doesn't exist — it does, exported from `components/shared/form-field.tsx`
alongside `FormField` and re-exported via `components/shared/index.ts`. It
appears simply underused, not missing; usage wasn't re-audited.
`components/shared/data-table.tsx` exists but is imported by zero pages under
`app/` — Payroll's `runs` page and Admin's `workforce/payroll` oversight page
both hand-roll a `<table>` instead. `StatusBadge` is used in only 3 files;
Employee's `leave` page and both Payroll pages above hand-roll a status pill
instead.
