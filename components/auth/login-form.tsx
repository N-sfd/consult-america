"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import { login, type LoginState } from "@/app/actions/auth";

const fieldClass =
  "mt-1.5 h-10 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-10 border border-black/10 bg-white p-5">
      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
        Sign in
      </p>

      <label className="mt-4 block text-sm font-medium text-[var(--ca-app-ink)]">
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-[var(--ca-app-ink)]">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </label>

      {state.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 inline-flex items-center gap-2 bg-[var(--ca-app-sidebar-bg)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Signing in…" : "Sign in"}
        {!isPending && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
