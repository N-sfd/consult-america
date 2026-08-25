# ConsultAmerica UI/UX Design Specification

Single design system for public marketing, Insights, Jobs, ATS, HR, Employee Portal, and Payroll.

---

## 1. Product surfaces

| Surface | UX language | Primary users |
|---------|-------------|---------------|
| **Marketing** | Editorial · large · expressive · story-driven | Prospects, candidates |
| **Insights** | Long-form editorial · reading-first · G&CO-like article craft | Prospects, practitioners |
| **Jobs / Careers** | Marketing + conversion (still editorial) | Candidates |
| **Application** (ATS / HR / Employee / Manager / Payroll) | Structured · dense · fast · operational · task-driven | Recruiters, HR, employees, managers |

**Rule:** Never put dramatic marketing layouts inside ATS/HR/Payroll. Never put dense SaaS chrome on the public homepage.

---

## 2. Brand tokens (shared)

```text
--ca-black / --ca-navy     #05070d
--ca-white                 #ffffff
--ca-off-white             #f4f4f4
--ca-blue                  #3b82f6
--ca-blue-hover            #2563eb
--ca-app-bg                #F4F6F8   (internal portals)
--ca-app-sidebar           #071A2F
--ca-ink-dark              #0B1220   (light surfaces)
```

Typography base: Helvetica Neue / Helvetica / Arial (marketing + app).  
Avoid decorative display fonts that fight the consultancy tone.

Reduce: rounded cards, multi-layer shadows, gradients, icon grids.  
Prefer: typography, thin rules, whitespace, large visual blocks, asymmetrical grids.

---

## 3. Marketing layout

```text
Max width          1440px
Desktop gutters    64–96px (clamp)
Section rhythm     64–96px (tighten from oversized stacks)
Hero type          72–104px equivalent (clamp display)
Grids              12-col; editorial 4/8 and 5/7 splits
```

Homepage composition remains one story arc per section: brand/capability first, then proof, then careers/insights.

Hover: underline growth, blue accent, restrained motion (200–350ms). No glow stacks.

---

## 4. Insights / article layout

```text
Reading column     720–780px
Sticky TOC         ~280px (desktop)
Section spacing    120–160px between major blocks
Body text          18–20px
Line height        1.7–1.8
Diagrams / images  may break wider than body copy
```

### Article page structure

1. Header — category, large title, last updated, scroll cue  
2. Article body + sticky “On this page”  
3. Section dividers (thin rules)  
4. Optional diagram / image blocks (fuller width)  
5. Mid-article ConsultAmerica CTA  
6. Remaining sections  
7. FAQ  
8. Related insights  
9. Site footer  

Pull quotes: large type, thin rule, restrained accent — not cards.

CTA block: typography + two actions (`Explore …` / `Let’s Talk`), no heavy card chrome.

---

## 5. Application (ATS / HR / Portal / Payroll)

```text
Workspace width    1280–1440px
Sidebar            240–280px navy
Base type          16px
Table / status     12–16px uppercase labels
Spacing scale      8 / 12 / 16 / 24
Surfaces           #F4F6F8 canvas, white work panels, thin borders
```

Patterns:

- Compact navigation  
- Clear tables and status chips  
- High-density forms  
- Strong empty states  
- Drawers / modals for actions (prefer over page jumps when acting)  
- Explicit approval workflows (approve / reject / return + required comments)

Do **not** reuse Insights reading column or marketing hero type here.

---

## 6. Component inventory (future modules)

Shared across app surfaces:

- StatusBadge  
- DataTable  
- FilterBar  
- FormField / FormSection  
- EmptyState  
- Drawer / Modal  
- ApprovalActions  
- PageHeader (title + description + primary action)

Marketing / Insights:

- Section / SectionLabel  
- EditorialRule  
- InsightToc  
- PullQuote  
- ArticleCta  
- RelatedInsights  

---

## 7. Responsive rules

| Breakpoint | Marketing | Insights | App |
|------------|-----------|----------|-----|
| < 768px | stacked sections, larger type slightly reduced | TOC collapses above body | sidebar → horizontal / drawer nav |
| ≥ 1024px | 12-col editorial | sticky TOC | fixed sidebar |

Mobile app: task-first (Time, Leave, Approvals) — not a compressed desktop sidebar.

---

## 8. Phase guidance

- **Phase 1–2 public / jobs:** Marketing + Insights tokens  
- **Phase 2–5 ATS / HR / Portal / Payroll:** Application tokens only  
- New modules must reference this spec before inventing local styles  

---

## 9. Quality bar

- One visual system, three UX languages  
- Brand color continuity without layout bleed  
- Lint / build / Phase 4 verify scripts remain green  
- Prefer refine-in-place over redesign-from-scratch  
