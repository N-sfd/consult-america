import type { Metadata } from "next";
import Link from "next/link";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | ConsultAmerica Workforce",
  description:
    "Sign in to ConsultAmerica Workforce — recruiting, people, time, and approvals.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--ca-app-bg)] text-[var(--ca-app-ink)]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5">
          <ConsultAmericaLogo variant="light" size="compact" showTagline={false} />
          <Link
            href="/"
            className="text-sm text-black/45 transition-colors hover:text-[var(--ca-blue)]"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[520px] px-5 py-12 lg:py-16">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-black/40">
          Workforce Login
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[var(--ca-app-ink)] md:text-5xl">
          Enter Workforce
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-black/55">
          A different environment from the corporate site—built for recruiting,
          people operations, time, leave, and approvals.
        </p>

        <LoginForm />
      </main>
    </div>
  );
}
