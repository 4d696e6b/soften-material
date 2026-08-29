export type UserRole = "student" | "contributor" | "moderator" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
