import Link from "next/link";

const DEMO_PORTALS = [
  {
    href: "/employee",
    label: "Employee Portal",
    description: "Profile, time, leave, pay, benefits, goals, and more.",
  },
  {
    href: "/manager",
    label: "Manager Portal",
    description: "Team overview, approvals, and reports.",
  },
  {
    href: "/hr/requests",
    label: "HR Service Desk",
    description: "HR requests, reports, and the audit log.",
  },
  {
    href: "/payroll",
    label: "Payroll Administration",
    description: "Payroll runs, pay periods, and reports.",
  },
  {
    href: "/app/dashboard",
    label: "Workforce App",
    description: "Recruiting, jobs, and candidate pipeline.",
  },
  {
    href: "/crm",
    label: "CRM Workspace",
    description: "Accounts, opportunities, and pipeline.",
  },
  {
    href: "/candidate",
    label: "Candidate Portal",
    description: "Application status, interviews, and documents.",
  },
];

/**
 * Shown instead of the real sign-in form when Supabase isn't configured —
 * every portal session resolver falls back to a fixed demo session in that
 * mode (see lib/self-service/session.ts and friends), so login is bypassed
 * entirely and these are the actual entry points.
 */
export default function DemoPortalLinks() {
  return (
    <>
      <div className="login-demo-note">
        <p>
          This is a demo environment — authentication isn&apos;t configured, so
          sign-in is bypassed. Choose a workspace below to continue as its
          demo user.
        </p>
      </div>

      <div className="login-demo-grid">
        {DEMO_PORTALS.map((portal) => (
          <Link key={portal.href} href={portal.href} className="login-demo-link">
            <span className="login-demo-link-label">{portal.label}</span>
            <span className="login-demo-link-desc">{portal.description}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
