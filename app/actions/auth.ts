"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getSupabaseServerAuthClient } from "@/app/lib/supabase/auth-server";
import { createCandidateAccount } from "@/lib/candidate/provisioning";

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await getSupabaseServerAuthClient();

  if (!supabase) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { error: "Incorrect email or password." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Your email has not been confirmed. Please check your inbox." };
    }
    return { error: "Unable to sign in. Please try again." };
  }

  const headerStore = await headers();
  const referer = headerStore.get("referer") ?? "";
  let returnTo = "/employee";

  try {
    const url = new URL(referer);
    returnTo = url.searchParams.get("returnTo") || "/employee";
  } catch {
    // invalid referer — use default
  }

  redirect(returnTo);
}

export type SignupState = { error: string | null };

/**
 * Candidate self-signup — the only self-registration path in this app.
 * Employees/staff are always provisioned by HR or hire conversion, never
 * self-registered, so this intentionally has no role selector.
 */
export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const firstName = (formData.get("firstName") as string | null)?.trim();
  const lastName = (formData.get("lastName") as string | null)?.trim();
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const confirmPassword = formData.get("confirmPassword") as string | null;

  if (!firstName || !lastName) {
    return { error: "Please enter your first and last name." };
  }

  if (!email || !password || !confirmPassword) {
    return { error: "Please fill in every field." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await getSupabaseServerAuthClient();
  if (!supabase) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists. Try signing in instead." };
    }
    return { error: "Unable to create your account. Please try again." };
  }

  if (!data.user) {
    return { error: "Unable to create your account. Please try again." };
  }

  try {
    await createCandidateAccount({
      authUserId: data.user.id,
      email,
      firstName,
      lastName,
    });
  } catch (provisionError) {
    console.error("Candidate account provisioning failed:", provisionError);
    return {
      error: "Your account was created but couldn't be fully set up. Please contact support.",
    };
  }

  // Email confirmation may be required (Supabase project setting) — if so,
  // signUp() doesn't establish a session and there's nothing to redirect
  // into yet.
  if (!data.session) {
    redirect("/login?confirmEmail=1");
  }

  redirect("/candidate");
}

export async function logout() {
  const supabase = await getSupabaseServerAuthClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
