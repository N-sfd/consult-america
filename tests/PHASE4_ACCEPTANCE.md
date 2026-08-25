# Phase 4 Acceptance Checklist

Manual + automated verification for ConsultAmerica Employee / Manager / HR self-service.

Automated coverage lives in `tests/` (`npm test`). Run `npm run verify:phase4` for lint + unit/acceptance tests + production build.

## Automated (Step 4.62 service flow)

- [x] Employee submits timesheet → manager sees approval → manager approves
- [x] Employee requests leave → manager approves → balance updates
- [x] Employee creates HR request → HR replies → conversation retained
- [x] Overlapping leave is rejected
- [x] Self/team access control blocks IDOR paths
- [x] Leave hour / weekday validation
- [x] Role permission matrix (employee / manager / HR)

## Employee portal (manual smoke)

- [ ] `/employee` dashboard loads with Core HR profile context
- [ ] `/employee/profile` shows assignment data
- [ ] `/employee/documents` Open uses server authorization
- [ ] `/employee/time` save draft + submit
- [ ] `/employee/leave` request + cancel eligible
- [ ] `/employee/requests` create + thread reply
- [ ] `/employee/notifications` mark read / mark all

## Manager portal (manual smoke)

- [ ] `/manager` shows team + pending counts
- [ ] `/manager/team` and `/manager/team/[id]` team-scoped only
- [ ] `/manager/approvals` unified inbox acts on time/leave/profile
- [ ] `/manager/time` and `/manager/leave` approve/reject
- [ ] `/manager/reports` team-scoped metrics only

## HR portal (manual smoke)

- [ ] `/hr/requests` queue filters + reply + status
- [ ] `/hr/reports` operational snapshot
- [ ] `/hr/audit` filter by event / role

## Quality gates

- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`

## Stop point

Phase 4 is complete for payroll readiness foundations:

Employee + Assignment + Compensation (Core HR) + Time + Leave + Approvals + Audit
