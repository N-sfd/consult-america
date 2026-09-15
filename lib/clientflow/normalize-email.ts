/** Canonical email normalization — keep in sync with SQL normalize_email(). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized || normalized.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function firstNameFromDisplayName(name: string): string {
  const part = name.trim().split(/\s+/)[0];
  return part || "there";
}
