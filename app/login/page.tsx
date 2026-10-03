import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import BrandLogo from "@/components/brand/brand-logo";
import DemoPortalLinks from "@/components/auth/demo-portal-links";
import LoginForm from "@/components/auth/login-form";
import {
  isCandidateReturnTo,
  sanitizeReturnTo,
} from "@/lib/auth/return-to";

type SearchParams = Promise<{
  confirmEmail?: string;
  returnTo?: string;
}>;

type PlatformContext = {
  title: string;
  eyebrow: string;
  headline: ReactNode;
  supporting: string;
  capabilities: string[];
  cardHeading: string;
  accessLabel: string;
};

const DEFAULT_PLATFORM: PlatformContext = {
  title: "Platform Sign In | Consult America",
  eyebrow: "Consult America Platform",
  headline: (
    <>
      One platform.
      <br />
      Connected work.
    </>
  ),
    supporting:
      "Sign in to access the Consult America enterprise platform across customer, recruiting, people, employee, payroll and administrative workflows.",
    capabilities: [
      "CRM & ClientFlow",
      "ATS & Recruiting",
      "HR & Requests",
      "Employee",
      "Payroll",
      "Administration",
    ],
  cardHeading: "Sign in to the platform",
  accessLabel: "Need platform access?",
};

function platformContextFor(returnTo: string | null): PlatformContext {
  if (!returnTo) return DEFAULT_PLATFORM;

  if (returnTo.startsWith("/hr")) {
    return {
      ...DEFAULT_PLATFORM,
      title: "HR Sign In | Consult America",
      headline: (
        <>
          Continue to HR.
          <br />
          Requests &amp; people.
        </>
      ),
      supporting:
        "Sign in to open HR Requests and people operations — continuous with ATS hire lineage.",
      capabilities: ["Requests", "People operations", "Onboarding continuity", "Shared suite chrome"],
      cardHeading: "Sign in to continue to HR",
    };
  }

  if (returnTo.startsWith("/app/") || returnTo.startsWith("/app")) {
    return {
      ...DEFAULT_PLATFORM,
      title: "ATS Sign In | Consult America",
      headline: (
        <>
          Continue to ATS.
          <br />
          Recruiting.
        </>
      ),
      supporting:
        "Sign in to open Recruiting — jobs, pipeline, interviews, and hire lineage into HR.",
      capabilities: ["Jobs & pipeline", "Interviews & offers", "Candidate Match", "Hire → HR"],
      cardHeading: "Sign in to continue to ATS",
    };
  }

  if (
    returnTo.startsWith("/workforce/administration") ||
    returnTo.startsWith("/workforce/admin") ||
    returnTo.startsWith("/workforce/users") ||
    returnTo.startsWith("/workforce/audit") ||
    returnTo.startsWith("/workforce/settings") ||
    returnTo.startsWith("/workforce/system-health")
  ) {
    return {
      ...DEFAULT_PLATFORM,
      title: "Admin Sign In | Consult America",
      headline: (
        <>
          Continue to Admin.
          <br />
          Workforce Administration.
        </>
      ),
      supporting:
        "Sign in to govern users, roles, security, and configuration across the suite.",
      capabilities: ["Users & access", "Roles & security", "Audit", "Configuration"],
      cardHeading: "Sign in to continue to Admin",
    };
  }

  if (returnTo.startsWith("/crm")) {
    return {
      ...DEFAULT_PLATFORM,
      title: "CRM Sign In | Consult America",
      headline: (
        <>
          Continue to CRM.
          <br />
          Pipeline &amp; ClientFlow.
        </>
      ),
      supporting:
        "Sign in to accounts, opportunities, and ClientFlow on the contact continuum.",
      capabilities: ["Accounts & contacts", "Opportunities", "ClientFlow", "Email delivery"],
      cardHeading: "Sign in to continue to CRM",
    };
  }

  if (returnTo.startsWith("/payroll")) {
    return {
      ...DEFAULT_PLATFORM,
      title: "Payroll Sign In | Consult America",
      headline: (
        <>
          Continue to Payroll.
          <br />
          Runs &amp; earnings.
        </>
      ),
      supporting: "Sign in to payroll runs on the employee continuum from ATS → HR.",
      capabilities: ["Payroll runs", "Earnings", "Deductions", "Employee pay"],
      cardHeading: "Sign in to continue to Payroll",
    };
  }

  if (returnTo.startsWith("/employee")) {
    return {
      ...DEFAULT_PLATFORM,
      title: "Employee Sign In | Consult America",
      headline: (
        <>
          Continue to Employee.
          <br />
          Self-service.
        </>
      ),
      supporting: "Sign in to profile, time, leave, and requests on shared people data.",
      capabilities: ["Profile", "Time & leave", "Documents", "HR requests"],
      cardHeading: "Sign in to continue to Employee",
    };
  }

  return DEFAULT_PLATFORM;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo ?? null);
  const candidate = isCandidateReturnTo(returnTo);
  const platform = platformContextFor(returnTo);

  return {
    title: {
      absolute: candidate
        ? "Candidate Sign In | Consult America"
        : platform.title,
    },
    description: candidate
      ? "Sign in to the Consult America Candidate Portal to manage applications, interviews, offers, profile, and documents."
      : platform.supporting,
  };
}

const candidateCapabilities = [
  "Applications",
  "Interviews & offers",
  "Profile & documents",
  "Job Match",
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const demoMode = !isSupabaseBrowserConfigured();
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo ?? null);
  const candidate = isCandidateReturnTo(returnTo);
  const platform = platformContextFor(returnTo);
  const confirmEmail = params.confirmEmail;
  const signupHref = `/signup${
    returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
  }`;

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-inner">
          <BrandLogo variant="full" context="login" href="/" priority />
          <Link href="/" className="login-back-link flex items-center gap-1">
            Back to Consult America
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className={`login-main ${demoMode && !candidate ? "login-main--chooser" : ""}`}>
        {demoMode && !candidate ? (
          <div className="login-chooser-wrap">
            <DemoPortalLinks />
          </div>
        ) : (
          <>
            <div className="login-grid">
              <div className="login-brand-panel">
                <div className="login-brand-content">
                  {candidate ? (
                    <>
                      <p className="login-eyebrow">Consult America Careers</p>
                      <h1 className="login-brand-headline">Candidate Portal</h1>
                      <p className="login-brand-supporting">
                        Manage your applications, interviews, offers, profile
                        and documents in one secure place.
                      </p>
                      <ul className="login-capability-list">
                        {candidateCapabilities.map((item) => (
                          <li key={item} className="login-capability-item">
                            <span
                              className="login-capability-dot"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="login-eyebrow">{platform.eyebrow}</p>
                      <h1 className="login-brand-headline">{platform.headline}</h1>
                      <p className="login-brand-supporting">{platform.supporting}</p>
                      <ul className="login-module-grid">
                        {platform.capabilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <ol className="login-flow" aria-label="Connected modules">
                        {["CRM", "ATS", "HR", "Employee", "Payroll"].map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      <p className="login-flow-admin">Administration governs the platform.</p>
                    </>
                  )}

                  <div className="login-brand-visual">
                    <div className="login-visual-sage-panel" aria-hidden="true" />
                    <div className="login-visual-arch">
                      <Image
                        src="/company/office-workstations.png"
                        alt="Consult America office workstations"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 420px"
                      />
                    </div>
                    <div className="login-bg-arc" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="login-card-wrapper">
                <div className="login-card">
                  <div className="login-card-mark" aria-hidden="true">
                    <BrandLogo variant="mark" context="login" href={null} />
                  </div>

                  {candidate ? (
                    <h2 className="login-card-heading">
                      Sign in to Candidate Portal
                    </h2>
                  ) : (
                    <>
                      <p className="login-eyebrow">{platform.eyebrow}</p>
                      <h2 className="login-card-heading">{platform.cardHeading}</h2>
                    </>
                  )}

                  {confirmEmail === "1" && (
                    <div
                      className="login-error"
                      role="status"
                      style={{ background: "#F1F7F6", borderColor: "#CFE3E0" }}
                    >
                      <p style={{ color: "#245350" }}>
                        Account created — check your email to confirm it before
                        signing in.
                      </p>
                    </div>
                  )}

                  {demoMode && candidate ? (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-[var(--ca-text-secondary,#5A6F73)]">
                        This preview opens the Candidate Portal without a password. Live sign-in is used when the platform is connected.
                      </p>
                      <Link href="/candidate" className="login-submit">
                        Continue to portal
                      </Link>
                    </div>
                  ) : (
                    <LoginForm returnTo={returnTo} />
                  )}

                  {candidate ? (
                    <div className="login-card-help">
                      <span>New candidate?</span>
                      <Link href={signupHref} className="login-help-link">
                        Create an account →
                      </Link>
                    </div>
                  ) : (
                    <div className="login-card-help">
                      <span>Need help accessing the platform?</span>
                      <a
                        href="mailto:info@consultamerica.com"
                        className="login-help-link"
                      >
                        Contact support →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="login-mobile-brand">
              {candidate ? (
                <>
                  <p className="login-eyebrow">Consult America Careers</p>
                  <h1
                    className="login-brand-headline"
                    style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                  >
                    Candidate Portal
                  </h1>
                  <p className="login-brand-supporting" style={{ marginTop: 8 }}>
                    Manage your applications, interviews, offers, profile and
                    documents in one secure place.
                  </p>
                </>
              ) : (
                <>
                  <p className="login-eyebrow">{platform.eyebrow}</p>
                  <h1
                    className="login-brand-headline"
                    style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                  >
                    {platform.cardHeading}
                  </h1>
                  <p className="login-brand-supporting" style={{ marginTop: 8 }}>
                    Use your authorized Consult America account to continue.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
