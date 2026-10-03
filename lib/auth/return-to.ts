/**
 * Safe post-login redirect targets.
 * Never trust an arbitrary ?returnTo= value as an open redirect.
 */

const APPROVED_PREFIXES = [
  "/candidate",
  "/employee",
  "/manager",
  "/hr",
  "/payroll",
  "/workforce",
  "/crm",
  "/app",
  "/dashboard",
] as const;

export function isCandidateReturnTo(returnTo: string | null | undefined): boolean {
  if (!returnTo) return false;
  return returnTo === "/candidate" || returnTo.startsWith("/candidate/");
}

export function returnToAllowedForRoles(
  path: string,
  roles: string[],
): boolean {
  const has = (...names: string[]) => names.some((role) => roles.includes(role));
  if (has("SYSTEM_ADMIN")) return true;
  if (path.startsWith("/candidate")) return has("CANDIDATE");
  if (path.startsWith("/hr")) return has("HR_ADMIN", "HR_SPECIALIST");
  if (path.startsWith("/payroll")) return has("PAYROLL_ADMIN");
  if (path.startsWith("/manager")) return has("MANAGER");
  if (path.startsWith("/employee")) return has("EMPLOYEE", "MANAGER", "HR_ADMIN", "HR_SPECIALIST");
  if (path.startsWith("/crm")) return has("SALES_REP", "SALES_MANAGER");
  if (path.startsWith("/app")) return has("RECRUITER", "HIRING_MANAGER");
  if (
    path.startsWith("/workforce/administration") ||
    path.startsWith("/workforce/admin") ||
    path.startsWith("/workforce/users") ||
    path.startsWith("/workforce/audit") ||
    path.startsWith("/workforce/settings") ||
    path.startsWith("/workforce/system-health")
  ) {
    return false;
  }
  if (path.startsWith("/workforce")) return has("HR_ADMIN", "HR_SPECIALIST", "RECRUITER");
  return false;
}

export function isWorkforceReturnTo(returnTo: string | null | undefined): boolean {
  if (!returnTo) return false;
  return (
    returnTo === "/employee" ||
    returnTo.startsWith("/employee/") ||
    returnTo === "/manager" ||
    returnTo.startsWith("/manager/") ||
    returnTo === "/hr" ||
    returnTo.startsWith("/hr/") ||
    returnTo === "/payroll" ||
    returnTo.startsWith("/payroll/") ||
    returnTo === "/workforce" ||
    returnTo.startsWith("/workforce/") ||
    returnTo === "/crm" ||
    returnTo.startsWith("/crm/") ||
    returnTo === "/app" ||
    returnTo.startsWith("/app/") ||
    returnTo === "/dashboard" ||
    returnTo.startsWith("/dashboard/")
  );
}

/**
 * Returns a validated internal path, or null when the value is unsafe / unknown.
 * Only the pathname (no host, protocol, or scheme-relative URL) is accepted.
 */
export function sanitizeReturnTo(returnTo: string | null | undefined): string | null {
  if (!returnTo) return null;

  let value = returnTo.trim();
  if (!value) return null;

  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }

  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("://")) return null;
  if (value.includes("\\")) return null;
  if (/\s/.test(value)) return null;

  const pathOnly = value.split(/[?#]/)[0] ?? "";
  if (!pathOnly.startsWith("/") || pathOnly.startsWith("//")) return null;
  if (pathOnly.includes("..")) return null;

  const allowed = APPROVED_PREFIXES.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`),
  );
  if (!allowed) return null;

  return pathOnly;
}
