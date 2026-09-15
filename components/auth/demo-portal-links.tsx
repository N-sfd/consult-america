import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  ClipboardList,
  UserCircle2,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";

import { DEMO_WORKSPACES } from "@/components/platform/platform-nav";

const ICONS = {
  employee: UserCircle2,
  manager: Users,
  hr: ClipboardList,
  payroll: Wallet,
  workforce: Briefcase,
  crm: Building2,
  candidate: Workflow,
} as const;

/**
 * Shown instead of the real sign-in form when Supabase isn't configured.
 * Demo sessions are resolved per portal layout — these links are the entry points.
 */
export default function DemoPortalLinks() {
  return (
    <div className="ca-chooser">
      <div className="ca-chooser-panel">
        <div className="ca-chooser-panel-inner">
          <p className="ca-chooser-kicker">Consult America Platform</p>
          <h1 className="ca-chooser-title">
            One connected platform
            <br />
            for people, operations
            <br />
            and growth.
          </h1>
          <p className="ca-chooser-copy">
            CRM, ATS, HR, Employee, Payroll, and Admin — modules of one
            operating system, not separate products.
          </p>
        </div>
      </div>

      <div className="ca-chooser-body">
        <h2 className="ca-chooser-heading">Explore the platform</h2>
        <p className="ca-chooser-supporting">
          Select a module to preview the shared suite chrome.
        </p>

        <div className="ca-chooser-grid">
          {DEMO_WORKSPACES.map((portal) => {
            const Icon = ICONS[portal.id];
            return (
              <Link key={portal.href} href={portal.href} className="ca-chooser-card">
                <span className="ca-chooser-icon">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="ca-chooser-card-title block">{portal.label}</span>
                  <span className="ca-chooser-card-desc block">{portal.description}</span>
                </span>
                <ArrowUpRight className="ca-chooser-arrow h-4 w-4 shrink-0" aria-hidden />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
