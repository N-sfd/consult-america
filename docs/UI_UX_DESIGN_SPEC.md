# ConsultAmerica UI/UX Design Specification

Single brand system for public marketing, Insights, Jobs, ATS, HR, Employee Portal, Payroll, and CRM — with **unequal visual density** by surface.

---

## 0. Platform model

**CONSULT AMERICA** — one enterprise platform. Multiple workspaces. Shared identity, data, intelligence, security, and workflows.

Workspaces (Recruiting/Workforce, HR, Payroll, CRM, Employee, Manager, Candidate, Administration) are not separate products. They share:

- Header / navigation logic, logo, typography, ivory/white/charcoal/burgundy tokens
- Buttons, forms, tables, status patterns, notifications, search, profile, permissions
- Continuous business data (Hire → Employee; Admin governs ATS/HR/CRM workflows)

| Lineage | Stages |
|---------|--------|
| Recruiting | Requisition → Applications → AI Candidate Match → Human Review → Interview → Offer → Hire |
| HR | Hire → Employee Record → Onboarding → Documents → Benefits/Payroll → Performance |
| CRM | Prospect → Account → Opportunity → Contract → Customer |
| Administration | Users → Roles → Security → Workflows → Audit → Configuration |

**Hire continuity:** Marking HIRED must create the Employee via `convertHire` / `hireCandidate`. Status-only HIRED is blocked. Candidate Match is the recruiting intelligence layer (not a standalone AI demo); scores are advisory.

**Density still differs:** Marketing communicates brand; operational workspaces communicate workflow. Same brand, not equal visual density.

---

## 1. Core density rule

**Marketing communicates the brand. ATS communicates the workflow.**

Both must unmistakably look like Consult America (deep teal, canvas/mist neutrals, lime accent, shared logo, type, buttons, spacing, borders). They must **not** have equal visual density.

| Density | Surfaces | Allowed |
|---------|----------|---------|
| **Expressive** | Homepage, Capabilities, Industries, Careers, Jobs **landing**/detail browse | Cinematic photography (cool/teal-graded), shaped/masked images, layered motion, editorial layouts, larger type, deep-teal→mist hero gradients |
| **Calm / operational** | Candidate **Apply**, Candidate Portal, ATS Pipeline / Match / Interviews / Offers, HR, Payroll, CRM, Employee/Manager self-service, Administration | Canvas/white work surfaces, teal chrome, lime active states, clear status colors, restrained shadows, **minimal decorative animation** |

Once a candidate enters an operational workflow (Apply → Profile → Match → Human Review → Interview → Offer), decorative motion reduces substantially. The UI must make the next action obvious.

**Canonical hiring lineage (preserve):**  
Requisition → Applications → Candidate Match → Human Review → Interview → Offer → Hire → Employee  

HR operates on the employee created from hire. Administration governs these workflows — it must not feel like a disconnected product.

**Rule:** Never put dramatic marketing layouts inside ATS/HR/Payroll/CRM/Apply. Never put dense SaaS chrome on the public homepage.

---

## 2. Product surfaces

| Surface | UX language | Primary users |
|---------|-------------|---------------|
| **Marketing** | Editorial · large · expressive · story-driven | Prospects, candidates |
| **Insights** | Long-form editorial · reading-first | Prospects, practitioners |
| **Jobs landing / Careers** | Marketing + conversion (still editorial) | Candidates |
| **Apply + Application portals** | Structured · dense · fast · operational · task-driven | Candidates, recruiters, HR, employees, managers |

---

## 3. Brand tokens (shared)

```text
--ca-teal-deep / primary dark     #073B4C
--ca-teal-chrome / app chrome     #0B4655
--ca-teal / secondary             #356D76
--ca-teal-soft                    #86AEB2
--ca-mist / pale transitional     #D7E2E1
--ca-canvas / main warm bg        #F5F6F1
--ca-white                        #ffffff
--ca-ink / primary text           #102F35
--ca-lime / interactive accent    #C9F45A
--ca-lime-soft                    #EAF7BD
--ca-line / borders               #D5DFDB
```

**Accent rule:** Lime is for CTAs, active indicators, badges, progress, and small graphic details only (~3–5%). Do not fill large sections with lime. Burgundy is retired as the brand accent.

Typography: Helvetica Neue / Helvetica / Arial for app chrome.  
Marketing may use restrained display (serif) for headlines only — **never** on operational page titles.

Shared: logo lockup, lime CTAs (dark ink on lime), deep-teal chrome, white/canvas panels, ink body text, mist borders.

App shell: deep teal sidebar (`#0B4655`), canvas work surface, lime active rail / selected states.

Reduce on app surfaces: multi-layer shadows, glow, decorative motion, oversized hero type, shaped photo masks.

---

## 4. Marketing layout (expressive)

```text
Max width          1440px
Desktop gutters    64–96px (clamp)
Section rhythm     64–96px
Hero type          72–104px equivalent (clamp display)
Grids              12-col; editorial 4/8 and 5/7 splits
Motion             transform/opacity only; clipped; respect prefers-reduced-motion
Imagery            Arch / clipped / layered editorial system; ProductFrame for UI screenshots (geometric)
```

---

## 5. Insights / article layout

```text
Reading column     720–780px
Sticky TOC         ~280px (desktop)
Body text          18–20px / line-height 1.7–1.8
```

Do not reuse Insights reading column or marketing hero type inside Application surfaces.

---

## 6. Application (calm operational)

```text
Workspace width    1280–1440px
Sidebar            240–280px deep teal (#0B4655)
Base type          14–16px sans
Table / status     11–12px uppercase chips (StatusBadge)
Spacing            8 / 12 / 16 / 24
Surfaces           #F5F6F1 canvas, white panels, thin #D5DFDB borders
Shadow             single subtle elevation or none
Motion             none decorative; 150–200ms color/opacity for UI feedback only
Active             lime rail / selected (#C9F45A / #EAF7BD)
```

Patterns:

- `PageHeader` + clear primary action  
- Compact nav; drawers/modals for actions  
- `DataTable` / `FilterBar` / `EmptyState` / `ApprovalActions`  
- Explicit approve / reject / return + comments  
- Status colors that encode stage (applied → review → interview → offer → hired)

CSS hooks: `.experience-marketing` (expressive) vs `.experience-app` (calm).  
Jobs browse may use `.experience-careers` (editorial). Apply must use `.experience-app`.

---

## 7. Component inventory

Shared app: StatusBadge, DataTable, FilterBar, FormField/FormSection, EmptyState, Drawer/Modal, ApprovalActions, PageHeader.

Marketing: Section/SectionLabel, EditorialImage, ArchImage, ClippedImage, ProductFrame, InsightToc, PullQuote, ArticleCta.

---

## 8. Responsive rules

| Breakpoint | Marketing | App |
|------------|-----------|-----|
| < 768px | stacked sections; hide moving arcs | sidebar → drawer; task-first mobile |
| ≥ 1024px | 12-col editorial | fixed navy sidebar |

---

## 9. Quality bar

- One platform, multiple workspaces — shared chrome and continuous data  
- One brand, two densities  
- Brand color continuity without layout bleed  
- Prefer refine-in-place over redesign-from-scratch  
- Preserve hiring lineage and Hire→Employee continuity  
- Candidate Match as embedded recruiting intelligence (advisory scores)  
