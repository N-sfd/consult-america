import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import LoginForm from "@/components/auth/login-form";
import { stockImage } from "@/lib/marketing/stock-images";

export const metadata: Metadata = {
  title: "Sign In | Consult America Workforce",
  description:
    "Sign in to Consult America Workforce — employee workspace, time, leave, documents, and internal services.",
};

const capabilities = [
  "Employee profile",
  "Time & leave",
  "Workforce documents",
  "Manager workflows",
];

export default function LoginPage() {
  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-inner">
          <ConsultAmericaLogo lockup="horizontal" maxHeight="72px" maxWidth="380px" href="/" />
          <Link href="/" className="login-back-link flex items-center gap-1">
            Back to Consult America
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="login-main">
        <div className="login-grid">
          {/* Left brand panel */}
          <div className="login-brand-panel">
            <div className="login-brand-content">
              <p className="login-eyebrow">Consult America Workforce</p>
              <h1 className="login-brand-headline">
                Work connected.
                <br />
                People supported.
              </h1>
              <p className="login-brand-supporting">
                Access your employee workspace, workforce information,
                time, leave, documents and internal services from one secure place.
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

          {/* Right login card */}
          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-card-logo">
                <ConsultAmericaLogo lockup="horizontal" maxHeight="72px" maxWidth="380px" href={undefined} />
              </div>

              <h2 className="login-card-heading">Sign in to Workforce</h2>
              <p className="login-card-supporting">
                Use your authorized Consult America account to continue.
              </p>

              <LoginForm />

              <div className="login-card-help">
                <span>Need help signing in?</span>
                <a href="mailto:support@consultamerica.net" className="login-help-link">
                  Contact support →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: show brand context above card */}
        <div className="login-mobile-brand">
          <p className="login-eyebrow">Consult America Workforce</p>
          <h1 className="login-brand-headline" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>
            Sign in to Workforce
          </h1>
          <p className="login-brand-supporting" style={{ marginTop: 8 }}>
            Use your authorized Consult America account to continue.
          </p>
        </div>
      </main>
    </div>
  );
}
