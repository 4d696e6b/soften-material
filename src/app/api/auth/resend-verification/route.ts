import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/auth/rate-limit";
import { getAdminAuth } from "@/lib/firebase-admin";
import { sendVerificationEmail, signInWithCustomToken } from "@/lib/auth/identity";
import { getSessionUser } from "@/lib/auth/session";
import { logAuth } from "@/lib/auth/log";

export async function POST(request: Request) {
  let session;
  try {
    session = await getSessionUser();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const limited = rateLimit(
    `resend:${clientKey(request, session.user.email)}`,
    3,
    60 * 60 * 1000,
  );
  if (!limited.ok) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  if (session.record.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  const customToken = await getAdminAuth().createCustomToken(session.record.uid);
  const { idToken } = await signInWithCustomToken(customToken);
  await sendVerificationEmail(idToken);
  logAuth("verification_resent", { email: session.user.email, uid: session.user.id });

  return NextResponse.json({ ok: true });
}
