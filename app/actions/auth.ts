"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getSupabaseServerAuthClient } from "@/app/lib/supabase/auth-server";

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

export async function logout() {
  const supabase = await getSupabaseServerAuthClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
