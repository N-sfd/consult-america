import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import BrandLogo from "@/components/brand/brand-logo";
import SignupForm from "@/components/auth/signup-form";
import { stockImage } from "@/lib/marketing/stock-images";

export const metadata: Metadata = {
  title: "Create Account | Consult America Careers",
  description:
    "Create a Consult America candidate account to apply for roles and track your applications.",
};

const capabilities = [
  "Apply to open roles",
  "Track application status",
  "Upcoming interviews",
  "Manage your profile & documents",
];

export default function SignupPage() {
  const demoMode = !isSupabaseBrowserConfigured();

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

      <main className="login-main">
        <div className="login-grid">
          <div className="login-brand-panel">
            <div className="login-brand-content">
              <p className="login-eyebrow">Consult America Careers</p>
              <h1 className="login-brand-headline">
                Build your career.
                <br />
                Track every step.
              </h1>
              <p className="login-brand-supporting">
                Create a candidate account to apply for open roles and follow
                your applications from submission through offer.
              </p>

              <ul className="login-capability-list">
                {capabilities.map((item) => (
                  <li key={item} className="login-capability-item">
                    <span className="login-capability-dot" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

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

              <h2 className="login-card-heading">
                {demoMode ? "Explore the demo" : "Create your candidate account"}
              </h2>
              <p className="login-card-supporting">
                {demoMode
                  ? "Demo mode is on — sign-up is bypassed. Visit the candidate portal directly from the sign-in page."
                  : "Employee and internal staff accounts are provisioned by ConsultAmerica — this signup is for job candidates only."}
              </p>

              {demoMode ? (
                <div className="login-card-help" style={{ marginTop: 24 }}>
                  <Link href="/login" className="login-help-link">
                    ← Back to sign in
                  </Link>
                </div>
              ) : (
                <>
                  <SignupForm />

                  <div className="login-card-help">
                    <span>Already have an account?</span>
                    <Link href="/login" className="login-help-link">
                      Sign in →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="login-mobile-brand">
          <p className="login-eyebrow">Consult America Careers</p>
          <h1
            className="login-brand-headline"
            style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
          >
            Create your candidate account
          </h1>
          <p className="login-brand-supporting" style={{ marginTop: 8 }}>
            Apply for roles and track your applications in one place.
          </p>
        </div>
      </main>
    </div>
  );
}
