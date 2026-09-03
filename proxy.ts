import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { updateSupabaseSession } from "@/app/lib/supabase/middleware";

/**
 * Route protection for every real portal. Deliberately the "cheap" check
 * only — does a valid session cookie exist — never role/user_roles lookups.
 * Role-specific authorization happens in each portal's layout.tsx via
 * requireXActor() (lib/self-service/security.ts) / getWorkforceSession(),
 * matching Next's own guidance that Proxy shouldn't be the sole line of
 * defense. (candidate) will be appended here once Phase 2 adds that portal.
 */
const PROTECTED_PREFIXES = [
  "/employee",
  "/manager",
  "/hr",
  "/payroll",
  "/app",
  "/workforce",
  "/dashboard",
];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);

  // Demo mode: Supabase auth isn't configured, so there's no session to
  // check — every portal stays reachable exactly like before this phase.
  if (!isSupabaseBrowserConfigured()) return response;

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const returnTo =
      request.nextUrl.searchParams.get("returnTo") ||
      request.nextUrl.searchParams.get("next") ||
      "/employee";
    return NextResponse.redirect(new URL(returnTo, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
