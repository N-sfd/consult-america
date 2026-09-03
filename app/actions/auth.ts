"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerAuthClient } from "@/app/lib/supabase/auth-server";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { landingPathForRoles } from "@/lib/auth/roles";

export type LoginState = {
  error: string | null;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await getSupabaseServerAuthClient();
  if (!supabase) {
    return { error: "Sign-in isn't configured yet. Try again later." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Incorrect email or password." };
  }

  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser) {
    return {
      error: "Your account isn't provisioned for a portal yet. Contact an admin.",
    };
  }

  const landingPath = landingPathForRoles(platformUser.roles);
  if (!landingPath) {
    return { error: "No portal is available for your account yet." };
  }

  redirect(landingPath);
}

export async function logout() {
  const supabase = await getSupabaseServerAuthClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
