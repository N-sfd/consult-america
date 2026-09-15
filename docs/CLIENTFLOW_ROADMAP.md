# ClientFlow Implementation Roadmap

**Status**

| Phase | State |
|-------|--------|
| **Phase 1** | **RELEASED ✅** — Production env synced + redeployed (signed-in CRM / Admin / HR / ATS spot-check below) |
| **Phase 2A** | **COMPLETE ✅** (enrollments + service-specific templates) |
| **Phase 2B** | **COMPLETE ✅** (automation engine — no builder) |
| **Phase 2C+** | **BLOCKED BY SEQUENCE** |

**ClientFlow** is the client lifecycle and automation layer of the Consult America platform — not a contact database, not an email marketing tool, and not a standalone AI page.

Progression:

```text
capture → communicate → enroll → automate → measure → assist with AI
```

This mirrors ATS design philosophy: **intelligence belongs inside the business workflow**.

---

## Architectural principle (lock now)

| ClientFlow is | ClientFlow is not |
|---------------|-------------------|
| Website → inquiry → contact → email → timeline | A giant `leads` table |
| Durable lead capture with retryable email | Email-first (lose lead if Gmail fails) |
| Reusable entities for later automation | A visual workflow builder in Phase 1 |
| CRM workspace evolution on the Consult America platform | A disconnected “ClientFlow app” |

**Hard gate:** Do **not** build the visual workflow builder until Phase 1’s lead-to-email transaction is reliable in production (inquiry always saved; email queued/sent/failed/retrying with logs).

---

## Relationship to today’s CRM

The existing CRM workspace (`/crm` — accounts, contacts, opportunities) is the UI shell ClientFlow grows into. Phase 1 does not replace CRM chrome; it establishes the **Talk to Expert vertical slice** and the reusable data model underneath. Opportunities/pipeline can continue; inquiries and service enrollments become the client-lifecycle spine.

### Phase 1 entity map (reuse first)

| Roadmap name | Decision |
|--------------|----------|
| companies | **Reuse** `crm_accounts` (+ `name_normalized`) |
| contacts | **Extend** `crm_contacts` (`email_normalized` UNIQUE, consent/last inquiry) |
| users | **Reuse** `profiles` + sales roles (`is_sales_staff`) |
| activities | **Extend** `crm_activities` (`SYSTEM` type, `inquiry_id`, metadata) |
| opportunities | Unchanged |
| inquiries | **New** `crm_inquiries` |
| services | **New** `crm_services` (catalog) |
| email_templates | **New** `crm_email_templates` |
| email_messages | **New** `crm_email_messages` (outbox) |
| workflow_* | **New** minimal fixed Talk to Expert definition/runs/events — **no builder** |
| service_enrollments | **Phase 2A** `crm_service_enrollments` |

Migration: `db/schema/036_clientflow_phase1.sql` (+ `037`/`038` production-gate hardening).

---

## Phase 1 — Talk to Expert → ClientFlow

**Goal:** First production vertical slice.

```text
Consult America Website
        ↓
Talk to Expert
        ↓
ClientFlow (DB transaction)
        ↓
Gmail welcome/ack (async)
        ↓
Internal team notification (async)
        ↓
Email + Automation Event logs
        ↓
ClientFlow activity timeline
```

### Website capture

The Talk to Expert form must create/update:

| Field / concern | Requirement |
|-----------------|-------------|
| Contact | Find or create; **dedupe primarily by normalized email** |
| Inquiry / Lead | Always created after successful DB write |
| Requested service | Captured (or “General” if unset) |
| Company | Name (and company record when resolvable) |
| Message | Free text |
| Source page | URL / path of submission |
| Campaign / UTM | When available |
| Consent / status | Explicit |
| Timestamps | Created / updated |

### Automation sequence (after DB success)

```text
Talk to Expert submitted
        ↓
Validate + normalize
        ↓
Find/Create Contact
        ↓
Create Inquiry
        ↓
Determine requested service
        ↓
Send Gmail welcome/acknowledgment   ← async / retryable
        ↓
Notify Consult America team         ← async / retryable
        ↓
Write Email + Automation Event logs
        ↓
ClientFlow activity timeline
```

### Non-negotiable: email failure must not lose the lead

1. **Commit inquiry (+ contact) first** in one reliable transaction.  
2. **Enqueue** welcome email and internal notification afterward.  
3. Delivery states for outbound messages: `queued` → `sent` | `failed` | `retrying` (dev may use `simulated`).  
4. Retries are safe and idempotent; operators can see failures on the contact timeline and Emails tab.

### Phase 1 data model (reusable entities — no giant leads table)

Establish now:

| Entity | Role |
|--------|------|
| `contacts` | People; email-normalized identity |
| `companies` | Organizations |
| `inquiries` | Talk to Expert (and later) inbound intents |
| `services` | Oracle, AI & Data, App Engineering, etc. |
| `service_enrollments` | Stub/optional in Phase 1; required in Phase 2 |
| `email_templates` | At least one general welcome template |
| `email_messages` | Outbound/inbound log + delivery state |
| `workflow_definitions` | Schema only / minimal “Talk to Expert” definition — **no builder UI** |
| `workflow_runs` | Instance of a run for an inquiry |
| `workflow_events` | Step outcomes for audit/timeline |
| `activities` | Unified timeline feed |
| `users` | Platform users (team notify, ownership) |

### Contact detail (target IA — may land partially in Phase 1)

Operational center tabs:

```text
Overview | Services | Activity | Emails | Workflows | Notes
```

Example timeline:

```text
Talk to Expert submitted
  → AI & Data selected
  → Welcome email sent
  → Internal team notified
  → Follow-up scheduled
  → Consultation booked
```

### Phase 1 exit criteria

**Code / logic (validated):** inquiry persistence, contact reuse, concurrency-safe dedupe, atomic email queue + claim, console ≠ sent, failure survival, ACL on claim RPC.

**Production integration:** Gate `npm run test:clientflow-gate` — all checks PASS (live Gmail welcome + internal notify, outage survival, exactly-once retry, contact reuse, concurrency).

```text
CLIENTFLOW PHASE 1 — RELEASED
────────────────────────────────
✓ Inquiry persisted
✓ Existing contact reused
✓ Concurrent submissions safe
✓ Email queued atomically
✓ Console != sent
✓ Gmail provider authenticated
✓ Client welcome delivered
✓ Internal notification delivered
✓ Failed mail survives/retries
✓ Retry sends exactly once
✓ CRM activity correct
✓ CRM email history correct
✓ No PII/secrets in logs
```

Still ensure the same six required env vars are present in **Vercel Production** and redeployed. Manual spot-check: `/crm/contacts/[id]` Activity + Emails, `/crm/emails`.

**Operational status:**

| Item | Status |
|------|--------|
| Six required vars in Vercel Production | **DONE** (synced from local; redeployed) |
| Production redeploy | **DONE** — https://consultamerica-nu.vercel.app |
| Signed-in platform UI spot-check | **ACTION REQUIRED** — auth-gated routes 307→`/login`; after sign-in verify CRM/ATS/HR/Admin + module switcher |
| Production redeploy of suite freeze | **PENDING DEPLOY** — ship this commit to clear live `/platforms/ats` 410 |

Suggested signed-in checks (production). For each applicable module verify:
authentication · authorization · workspace/module switching · direct URL load · refresh ·
responsive layout · session persistence · logout.

**Do not** land module-switcher destinations on marketing `/platforms/*` pages.

**CRM** — Contact → Activity / Emails  
`https://consultamerica-nu.vercel.app/crm/contacts/cont-43b17fb7-398b-4b34-85ec-29cc4ec8175c?tab=activity`  
also `?tab=emails`, `/crm/emails`, `/crm/templates`

**ATS** — Recruiting  
`/app/recruiting` · `/app/recruiting/jobs` · `/app/recruiting/applications`

**HR** — Requests  
`/hr/requests` · `/workforce/people`

**Admin** — Workforce Administration (canonical)  
`/workforce/administration` → loads Admin control plane  
`/workforce/users` · `/workforce/audit`

**Admin redirect** (compatibility only — not the canonical URL)  
`/workforce/admin` → must redirect to `/workforce/administration`

Shared expectation: Platform modules switcher lists CRM · ATS · HR · Employee · Payroll · Admin with shared chrome and brand tokens; Applications mega menu stays marketing discovery; Company portals stay authenticated destinations.

Helper: `npx tsx --env-file=.env.local scripts/clientflow-vercel-env-sync.ts`

#### Architectural lock — templates vs workflows

| Concern | Lives in |
|---------|----------|
| What to say (subject/body/variables) | `crm_email_templates` |
| When to send / conditions / delays / branching / enrollment transitions | Workflows (Phase 2B+) — **not** in templates |

Templates describe communication; workflows decide when communication happens.

#### Production env (`.env.local` + Vercel Production)

**Required (6):**

```text
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_FROM=
CLIENTFLOW_INTERNAL_NOTIFY_TO=   # role mailbox (sales/intake), not personal
CLIENTFLOW_REQUIRE_GMAIL=true
```

**Optional (7th):** `CLIENTFLOW_OWNER_USER_ID=` — only if you want automatic CRM ownership assignment.

OAuth helper (from `consult_americ/`): `npm run clientflow:gmail-oauth`  
(redirect `http://127.0.0.1:8765/oauth2callback`, scope `gmail.send`).

---

## Phase 2 — After Phase 1 RELEASED

Do **not** start with the visual workflow builder. Sequence:

| Slice | Capability |
|-------|------------|
| **2A** | Service enrollment → template selection → service-specific email |
| **2B** | Triggers + conditions + delays → reusable automations |
| **2C** | Visual workflow builder |
| **2D** | Analytics + AI |

### Phase 2A — Service enrollment

**Start only when Phase 1 is RELEASED.**

Enrollment expresses the **relationship** with Consult America, not merely a lead row.

Example services:

- Oracle Transformation  
- AI & Data  
- Application Engineering  
- CRM & Customer Experience  
- Managed Services  

Enrollment lifecycle:

```text
Interested → Qualified → Discovery → Proposal → Active → Completed
```

Automation becomes **service-aware** via `service_enrollments` linked to contacts/companies/inquiries.

### Phase 2A exit criteria

- [x] Inquiry can create/update an enrollment for a service  
- [x] Contact **Services** tab shows enrollments + state  
- [x] Enrollment state changes write activities  
- [x] Service-specific welcome/notify templates can be selected and sent *(client ack is service-aware; internal notify remains operational and separate)*

### Phase 2B — Triggers, conditions, delays

**Status: COMPLETE ✅** (automation engine only; no visual builder).

**Authorized brief implemented.** Engine executes permitted primitives from versioned `workflow_definitions.config` with strict schema validation. Not a general-purpose scripting runtime (no eval, arbitrary JS/SQL, JSONPath, HTTP actions, loops, or user-authored code).

**“2 business days”** = Monday–Friday only (UTC calendar advancement). No holiday engine. `run_at` is stored as an absolute timestamp at schedule time so restarts cannot reinterpret the delay.

Phase 1 operational debt remains open and is **not** closed by 2B completion: Vercel Production env parity + redeploy + manual signed-in CRM / Admin / HR / ATS UI spot-check.

#### Scope (authorize against this)

**Triggers (2B only):**

| Trigger | Source |
|---------|--------|
| `inquiry_created` | Talk to Expert / inquiry persist |
| `enrollment_status_changed` | Services tab / enrollment RPC |
| `email_sent` / `email_failed` | Existing outbox worker outcomes |

Defer: open/click tracking, calendar, inbound reply parsing.

**Conditions (2B only):** `service.key`, `enrollment.status`, `inquiry.source_channel`.  
Defer: arbitrary expression languages / JSONPath.

**Actions (2B only):**

| Action | Rule |
|--------|------|
| `enqueue_email(template_key)` | Must use existing durable outbox (claim / retry / exactly-once) |
| `set_enrollment_status` | Must append CRM activity (never overwrite history) |
| `write_activity` | Unified `crm_activities` timeline |

Defer: webhooks, Slack, opportunity create, arbitrary HTTP.

**Delays:** Durable scheduled steps (`run_at` + worker claim). Not in-request `setTimeout`. Same idempotency discipline as email outbox.

**Branches:** Single if/else on one condition per step.  
Defer: nested graphs, loops, parallel joins (2C).

**Config surface:** Versioned JSON in `workflow_definitions.config` plus at least one seeded automation (not TypeScript-only).  
Inspect/audit via existing CRM surfaces; **no** builder UI in 2B.

#### Reference automation to prove in 2B

```text
Trigger: inquiry_created
  → Condition: service = Oracle?
        YES → Delay 2 business days
             → Action: enqueue Oracle follow-up template (existing outbox)
             → Action: write activity
        NO  → Delay 2 business days
             → Action: enqueue General follow-up template
             → Action: write activity
```

Also prove: `enrollment_status_changed` (e.g. Interested → Qualified) can branch to an internal notify or activity without a second email stack.

#### Phase 2B exit criteria

- [x] Workflow steps persisted as run events (trigger / condition / delay / action)
- [x] Delay survives process restart (DB-scheduled, worker-claimed)
- [x] Actions only enqueue via existing email outbox (no second sender)
- [x] Service-aware branch proven (Oracle vs General)
- [x] Idempotent: duplicate trigger / overlapping workers do not double-send
- [x] Failures visible on contact Activity + workflow events; inquiry/enrollment never lost
- [x] At least one automation defined in `workflow_definitions.config` (not hardcoded only in TS)
- [x] No builder UI

**Authorization gate:** ~~Implement 2B only after product explicitly accepts this brief.~~ Accepted and implemented.

#### Hard non-goals (still locked out of 2B)

| Do not build | Why |
|--------------|-----|
| Visual workflow builder | Phase 2C |
| eval / arbitrary JS / SQL / JSONPath / HTTP / loops / user code | Not a scripting runtime |
| Analytics dashboards / AI assist | Phase 2D |
| Open/click ESP / marketing drips | Lifecycle automation, not ESP creep |
| Delays/conditions inside `crm_email_templates` | Architectural lock |

### Phase 2C — Visual workflow builder

**Status: BLOCKED BY SEQUENCE** — only after 2B engine reliability (now met) and explicit product authorization.

**2C must not invent workflow behavior.** It becomes a safe graphical authoring UI for the proven 2B configuration model:

```text
2B ENGINE                    2C BUILDER
─────────                    ──────────
Trigger        ←──────────── Trigger node
Condition      ←──────────── Condition node
Action         ←──────────── Action node
Delay          ←──────────── Delay node
Branch         ←──────────── Branch connection

Validated config  ←───────── Save/Publish
Versioning         ←──────── Version UI
Runtime            ←──────── Run monitoring
```

Builder is a product surface on `workflow_definitions` / `workflow_runs` / `workflow_events`.

### Phase 2D — Analytics + AI

Keep ClientFlow as CRM automation — not a Zapier/n8n clone.

Measure real workflows (not demo KPI cards):

- Inquiry volume  
- Service demand  
- Response time  
- Email delivery / open / click (where available)  
- Conversion  
- Workflow success / failure  
- Enrollment funnel  
- Time from inquiry → consultation  

Put AI **in** ClientFlow communications — not a separate AI demo page:

- Draft reply from contact + inquiry + service context  
- Rewrite tone  
- Summarize conversation  
- Recommend next email  
- Personalize an approved template  
- Suggest follow-up timing  

**Human approval required** for externally generated sales/client communications (initially).

### Phase 2D exit criteria

- [ ] Dashboards backed by inquiry / enrollment / email / workflow data  
- [ ] AI assist on Emails / Activity with approval gate  

---

## Explicit non-goals (until gated)

| Do not build yet | Until |
|------------------|--------|
| Visual workflow builder | Phase 2B complete + explicit 2C authorization |
| Standalone “AI ClientFlow” page | Phase 2D, in-workflow only |
| Marketing blast / drip product | ClientFlow is lifecycle, not ESP feature-creep |
| One mega `leads` table | Never — use entities above |

---

## Suggested build order

1. ~~Schema + Talk to Expert persist + queue + CRM visibility~~ (Phase 1 RELEASED; **ops debt open**)  
2. ~~Phase 2A enrollments + service-specific email~~  
3. ~~Phase 2B automation engine~~  
4. Phase 2C visual builder (blocked until authorized)  
5. Phase 2D analytics/AI 
