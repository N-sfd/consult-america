"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signup, type SignupState } from "@/app/actions/auth";

const initialState: SignupState = { error: null };

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="login-form">
      {state.error && (
        <div className="login-error" role="alert">
          <p>{state.error}</p>
        </div>
      )}

      <div className="login-field-row">
        <div className="login-field">
          <label htmlFor="signup-first-name" className="login-label">
            First name
          </label>
          <input
            id="signup-first-name"
            type="text"
            name="firstName"
            autoComplete="given-name"
            required
            className="login-input"
          />
        </div>

        <div className="login-field">
          <label htmlFor="signup-last-name" className="login-label">
            Last name
          </label>
          <input
            id="signup-last-name"
            type="text"
            name="lastName"
            autoComplete="family-name"
            required
            className="login-input"
          />
        </div>
      </div>

      <div className="login-field">
        <label htmlFor="signup-email" className="login-label">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className="login-input"
          placeholder="you@example.com"
        />
      </div>

      <div className="login-field">
        <label htmlFor="signup-password" className="login-label">
          Password
        </label>
        <div className="login-password-wrapper">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
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

      <div className="login-field">
        <label htmlFor="signup-confirm-password" className="login-label">
          Confirm password
        </label>
        <input
          id="signup-confirm-password"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          className="login-input"
        />
      </div>

      <button type="submit" disabled={isPending} className="login-submit">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
