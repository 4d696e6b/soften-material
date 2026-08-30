import { ANY_EMAIL_PATTERN, EMAIL_DOMAIN, EMAIL_PATTERN } from "@/lib/auth/constants";

export function normalizeEmail(email: unknown): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export function isTuEmail(email: string): boolean {
  return email.endsWith(EMAIL_DOMAIN) && EMAIL_PATTERN.test(email);
}

export function isValidEmail(email: string): boolean {
  return ANY_EMAIL_PATTERN.test(email);
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local.split(/[._-]+/).filter(Boolean);
  if (words.length === 0) return email;
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
