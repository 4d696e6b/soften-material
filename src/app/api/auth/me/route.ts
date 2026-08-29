import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (!session.record.emailVerified) {
      return NextResponse.json(
        {
          error: "EMAIL_NOT_VERIFIED",
          message: "กรุณายืนยันอีเมลก่อนเข้าใช้งาน",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ user: session.user });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}
