import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/auth/rate-limit";
import { isTuEmail, normalizeEmail } from "@/lib/auth/email";
import { sendPasswordResetEmail } from "@/lib/auth/identity";
import { logAuth } from "@/lib/auth/log";

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return NextResponse.json({ ok: true });
  }

  const email = normalizeEmail(body.email);
  const limited = rateLimit(`forgot:${clientKey(request, email)}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  if (email && isTuEmail(email)) {
    try {
      await sendPasswordResetEmail(email);
      logAuth("forgot_password_sent", { email });
    } catch {
      logAuth("forgot_password_skipped", { email });
    }
  }

  return NextResponse.json({ ok: true });
}
