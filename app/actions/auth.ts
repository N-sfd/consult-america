"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { User } from "@supabase/supabase-js";

import { getSupabaseServerAuthClient } from "@/app/lib/supabase/auth-server";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { createCandidateAccount } from "@/lib/candidate/provisioning";
import { landingPathForRoles } from "@/lib/auth/roles";
import type { PlatformRole } from "@/types/identity";

export type LoginState = { error: string | null };

function namesFromAuthUser(
  authUser: User,
  email: string,
): { firstName: string; lastName: string } {
  const meta = authUser.user_metadata ?? {};
  const first =
    (typeof meta.first_name === "string" && meta.first_name.trim()) ||
    (typeof meta.firstName === "string" && meta.firstName.trim()) ||
    "";
  const last =
    (typeof meta.last_name === "string" && meta.last_name.trim()) ||
    (typeof meta.lastName === "string" && meta.lastName.trim()) ||
    "";
  if (first && last) return { firstName: first, lastName: last };

  const full =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    "";
  if (full.includes(" ")) {
    const [a, ...rest] = full.split(/\s+/);
    return { firstName: a, lastName: rest.join(" ") || "User" };
  }

  const local = email.split("@")[0] ?? "user";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return {
      firstName: parts[0]!.replace(/^\w/, (c) => c.toUpperCase()),
      lastName: parts[1]!.replace(/^\w/, (c) => c.toUpperCase()),
    };
  }
  return {
    firstName: local.replace(/^\w/, (c) => c.toUpperCase()) || "Candidate",
    lastName: "User",
  };
}

/**
 * Ensures profiles + candidate_profiles + CANDIDATE role exist for this auth
 * user. Self-signup can leave an auth-only orphan when provisioning fails.
 */
async function ensureCandidateProfileForAuthUser(
  authUser: User,
  email: string,
): Promise<{ roles: PlatformRole[] }> {
  const service = getSupabaseServiceClient();
  if (!service) throw new Error("Supabase is not configured");

  const { data: existingProfile } = await service
    .from("profiles")
    .select("id")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (!existingProfile) {
    const { firstName, lastName } = namesFromAuthUser(authUser, email);
    await createCandidateAccount({
      authUserId: authUser.id,
      email,
      firstName,
      lastName,
    });
  }

  const { data: profile } = await service
    .from("profiles")
    .select("id")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (!profile) throw new Error("Profile missing after provisioning");

  const { data: roleRows } = await service
    .from("user_roles")
    .select("role")
    .eq("user_id", profile.id);

  let roles = (roleRows ?? []).map((row) => row.role as PlatformRole);
  if (!roles.includes("CANDIDATE")) {
    await service.from("user_roles").insert({
      id: `${profile.id}-candidate`,
      user_id: profile.id,
      role: "CANDIDATE",
    });
    roles = [...roles, "CANDIDATE"];
  }

  return { roles };
}

async function resolvePostLoginPath(
  authUser: User,
  email: string,
  returnTo?: string | null,
) {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }

  try {
    const { roles } = await ensureCandidateProfileForAuthUser(authUser, email);
    return landingPathForRoles(roles) ?? "/candidate";
  } catch (error) {
    console.error("Post-login profile resolve failed:", error);
    return "/candidate";
  }
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("invalid login") ||
      message.includes("invalid credentials")
    ) {
      return { error: "Incorrect email or password." };
    }
    if (message.includes("email not confirmed")) {
      return {
        error:
          "Your email has not been confirmed. Please check your inbox for the confirmation link.",
      };
    }
    console.error("Sign-in failed:", error.message);
    return { error: "Unable to sign in. Please try again." };
  }

  if (!data.user) {
    return { error: "Unable to sign in. Please try again." };
  }

  const headerStore = await headers();
  const referer = headerStore.get("referer") ?? "";
  let returnTo: string | null = null;

  try {
    const url = new URL(referer);
    returnTo = url.searchParams.get("returnTo");
  } catch {
    // invalid referer — fall through to role landing
  }

  const destination = await resolvePostLoginPath(data.user, email, returnTo);
  redirect(destination);
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
  const emailRaw = formData.get("email") as string | null;
  const email = emailRaw?.trim().toLowerCase() ?? null;
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      const { data: signedIn, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !signedIn.user) {
        return {
          error:
            "An account with this email already exists. Try signing in instead.",
        };
      }

      try {
        await ensureCandidateProfileForAuthUser(signedIn.user, email);
      } catch (provisionError) {
        console.error(
          "Candidate account repair provisioning failed:",
          provisionError,
        );
        return {
          error:
            "Your account was created but couldn't be fully set up. Please contact support.",
        };
      }

      redirect("/candidate");
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
      error:
        "Your account was created but couldn't be fully set up. Please contact support.",
    };
  }

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
