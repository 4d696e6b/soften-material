import type { UserRecord } from "firebase-admin/auth";
import type { AuthUser, UserRole } from "@/types";
import { nameFromEmail } from "@/lib/auth/email";

const ROLES: UserRole[] = ["student", "contributor", "moderator", "admin"];

function asRole(value: unknown): UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : "student";
}

export function toAuthUser(record: UserRecord): AuthUser {
  const email = record.email ?? "";
  return {
    id: record.uid,
    name: record.displayName || nameFromEmail(email),
    email,
    role: asRole(record.customClaims?.role),
  };
}
