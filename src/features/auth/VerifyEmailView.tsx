"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { applyActionCode } from "firebase/auth";
import ResendButton from "@/features/auth/ResendButton";
import { useAuth } from "@/context/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase";

type Status = "pending" | "verifying" | "verified" | "invalid";

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseUser } = useAuth();
  const oobCode = searchParams.get("oobCode") ?? searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>(oobCode ? "verifying" : "pending");

  useEffect(() => {
    if (!oobCode) return;

    let cancelled = false;

    async function verify() {
      try {
        await applyActionCode(getFirebaseAuth(), oobCode);
        await getFirebaseAuth().currentUser?.reload();
        if (cancelled) return;
        setStatus("verified");
        window.setTimeout(() => router.push("/dashboard"), 1200);
      } catch {
        if (!cancelled) setStatus("invalid");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [oobCode, router]);

  return (
    <div className="text-center py-4">
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: "var(--color-tu-yellow-glow)",
          border: "1px solid rgba(245,197,24,0.25)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-tu-yellow)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      {status === "verifying" && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          กำลังยืนยันอีเมล…
        </p>
      )}

      {status === "verified" && (
        <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
          ยืนยันอีเมลแล้ว กำลังเข้าสู่คลัง…
        </p>
      )}

      {status === "invalid" && (
        <>
          <p className="mb-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            ลิงก์ยืนยันหมดอายุหรือถูกใช้ไปแล้ว
          </p>
          <ResendButton />
        </>
      )}

      {status === "pending" && (
        <>
          <p className="mb-1 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            กรุณายืนยันอีเมล
          </p>
          <p className="mb-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            ส่งลิงก์ไปที่
          </p>
          <p
            className="mb-4 text-sm font-medium break-all"
            style={{ color: "var(--color-text-primary)", fontFamily: "monospace" }}
          >
            {firebaseUser?.email ?? "@dome.tu.ac.th"}
          </p>
          <p className="mb-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
            มธ. มักกรองเมลจาก Firebase ไว้ในสแปม หรือบล็อก — ตรวจทั้งสองที่ แล้วกดส่งอีกครั้ง
          </p>
          <ResendButton />
          <div className="mt-5">
            <Link href="/login" className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              ← กลับหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
