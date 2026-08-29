import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/auth/rate-limit";
import { isTuEmail, normalizeEmail } from "@/lib/auth/email";
import {
  IdentityToolkitError,
  isInvalidCredential,
  signInWithPassword,
} from "@/lib/auth/identity";
import { createSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { getAdminAuth } from "@/lib/firebase-admin";
import { toAuthUser } from "@/lib/auth/user";
import { logAuth } from "@/lib/auth/log";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "ข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    );
  }

  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "กรุณากรอกอีเมลและรหัสผ่าน" },
      { status: 400 },
    );
  }

  if (!isTuEmail(email)) {
    return NextResponse.json(
      { error: "INVALID_EMAIL", message: "อีเมลต้องลงท้ายด้วย @dome.tu.ac.th" },
      { status: 400 },
    );
  }

  const limited = rateLimit(`login:${clientKey(request, email)}`, 5, 60_000);
  if (!limited.ok) {
    const minutes = Math.max(1, Math.ceil(limited.retryAfterSec / 60));
    return NextResponse.json(
      { error: "RATE_LIMITED", message: `ลองใหม่ในอีก ${minutes} นาที` },
      { status: 429 },
    );
  }

  try {
    const signedIn = await signInWithPassword(email, password);
    const record = await getAdminAuth().getUser(signedIn.localId);
    const session = await createSessionCookie(signedIn.idToken);
    await setSessionCookie(session);

    if (!record.emailVerified) {
      logAuth("login_unverified", { email, uid: record.uid });
      return NextResponse.json(
        {
          error: "EMAIL_NOT_VERIFIED",
          message: "กรุณายืนยันอีเมลก่อนเข้าใช้งาน",
        },
        { status: 403 },
      );
    }

    logAuth("login_success", { email, uid: record.uid });
    return NextResponse.json({ user: toAuthUser(record) });
  } catch (error) {
    if (error instanceof IdentityToolkitError && isInvalidCredential(error.code)) {
      logAuth("login_failed", { email, reason: error.code });
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    if (error instanceof IdentityToolkitError && error.code === "TOO_MANY_ATTEMPTS_TRY_LATER") {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "ลองใหม่ในอีก 1 นาที" },
        { status: 429 },
      );
    }

    logAuth("login_error", { email });
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
