import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import BrandLogo from "@/components/brand/brand-logo";
import DemoPortalLinks from "@/components/auth/demo-portal-links";
import LoginForm from "@/components/auth/login-form";
import {
  isCandidateReturnTo,
  sanitizeReturnTo,
} from "@/lib/auth/return-to";
import { stockImage } from "@/lib/marketing/stock-images";

type SearchParams = Promise<{
  confirmEmail?: string;
  returnTo?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo ?? null);
  const candidate = isCandidateReturnTo(returnTo);

  return {
    // Absolute avoids nested "Sign In | … | Consult America" brand duplication.
    title: {
      absolute: candidate
        ? "Candidate Sign In | Consult America"
        : "Workforce Sign In | Consult America",
    },
    description: candidate
      ? "Sign in to the Consult America Candidate Portal to manage applications, interviews, offers, profile, and documents."
      : "Sign in to Consult America Workforce — employee workspace, time, leave, documents, and internal services.",
  };
}

const workforceCapabilities = [
  "Employee profile",
  "Time & leave",
  "Workforce documents",
  "Manager workflows",
];

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
  const confirmEmail = params.confirmEmail;
  const signupHref = `/signup${
    returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
  }`;

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-inner">
          <BrandLogo variant="compact" context="login" href="/" priority />
          <Link href="/" className="login-back-link flex items-center gap-1">
            Back to Consult America
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className={`login-main ${demoMode ? "login-main--chooser" : ""}`}>
        {demoMode ? (
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
                      <p className="login-eyebrow">Consult America Workforce</p>
                      <h1 className="login-brand-headline">
                        Work connected.
                        <br />
                        People supported.
                      </h1>
                      <p className="login-brand-supporting">
                        Access your employee workspace, workforce information,
                        time, leave, documents and internal services from one
                        secure place.
                      </p>
                      <ul className="login-capability-list">
                        {workforceCapabilities.map((item) => (
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
                  )}

                  <div className="login-brand-visual">
                    <div className="login-visual-sage-panel" aria-hidden="true" />
                    <div className="login-visual-arch">
                      <Image
                        src={stockImage("careersHero", { w: 800, q: 85 })}
                        alt="Consult America team collaboration"
                        fill
                        className="object-cover"
                        sizes="320px"
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
                      <p className="login-eyebrow">Consult America Workforce</p>
                      <h2 className="login-card-heading">
                        Sign in to Workforce
                      </h2>
                      <p className="login-card-supporting">
                        Use your authorized Consult America account to continue.
                      </p>
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

                  <LoginForm returnTo={returnTo} />

                  {candidate ? (
                    <div className="login-card-help">
                      <span>New candidate?</span>
                      <Link href={signupHref} className="login-help-link">
                        Create an account →
                      </Link>
                    </div>
                  ) : (
                    <div className="login-card-help">
                      <span>Need Workforce access?</span>
                      <a
                        href="mailto:support@consultamerica.net"
                        className="login-help-link"
                      >
                        Contact support →
                      </a>
                    </div>
                  )}

                  <div className="login-card-help">
                    <span>Need help signing in?</span>
                    <a
                      href="mailto:support@consultamerica.net"
                      className="login-help-link"
                    >
                      Contact support →
                    </a>
                  </div>
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
                  <p className="login-eyebrow">Consult America Workforce</p>
                  <h1
                    className="login-brand-headline"
                    style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                  >
                    Sign in to Workforce
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
