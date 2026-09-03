"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="login-form">
      {state.error && (
        <div className="login-error" role="alert">
          <p>{state.error}</p>
        </div>
      )}

      <div className="login-field">
        <label htmlFor="login-email" className="login-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className="login-input"
          placeholder="you@company.com"
        />
      </div>

      <div className="login-field">
        <label htmlFor="login-password" className="login-label">
          Password
        </label>
        <div className="login-password-wrapper">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            className="login-input login-input--password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="login-password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>

      <div className="login-forgot-row">
        <a href="#" className="login-forgot-link">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="login-submit"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
