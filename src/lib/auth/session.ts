import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";
import { getAdminAuth } from "@/lib/firebase-admin";
import { toAuthUser } from "@/lib/auth/user";

export async function createSessionCookie(idToken: string) {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SEC * 1000,
  });
}

export async function setSessionCookie(value: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionCookie() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function getSessionUser() {
  const session = await getSessionCookie();
  if (!session) return null;

  const decoded = await getAdminAuth().verifySessionCookie(session, true);
  const record = await getAdminAuth().getUser(decoded.uid);
  return { decoded, record, user: toAuthUser(record) };
}
