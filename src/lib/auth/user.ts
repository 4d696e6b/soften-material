import type { User } from "firebase/auth";
import type { AuthUser, UserRole } from "@/types";
import { nameFromEmail } from "@/lib/auth/email";

const ROLES: UserRole[] = ["student", "contributor", "moderator", "admin"];

function asRole(value: unknown): UserRole {
  return typeof value === "string" && ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : "student";
}

export async function toAuthUser(user: User): Promise<AuthUser> {
  const token = await user.getIdTokenResult();
  const email = user.email ?? "";
  return {
    id: user.uid,
    name: user.displayName || nameFromEmail(email),
    email,
    role: asRole(token.claims.role),
  };
}
