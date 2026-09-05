import { NextResponse, type NextRequest } from "next/server";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { updateSupabaseSession } from "@/app/lib/supabase/middleware";

/**
 * Cheap session-cookie gate for real portals. Role authorization still
 * happens in each portal layout via require*Actor / get*Session.
 * Demo mode (Supabase not configured) leaves all portals open.
 */
const PROTECTED_PREFIXES = [
  "/employee",
  "/manager",
  "/hr",
  "/payroll",
  "/app",
  "/workforce",
  "/dashboard",
  "/candidate",
  "/crm",
];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);

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

  // Logged-in users hitting /login: honor returnTo, else stay on login so
  // the client can resolve role landing after session cookies settle.
  // Server login action redirects via landingPathForRoles.
  if (pathname === "/login" && user) {
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
