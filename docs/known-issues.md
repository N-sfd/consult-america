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
