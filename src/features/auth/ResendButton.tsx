"use client";

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function ResendButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleResend() {
    if (status === "loading") return;
    const user = getFirebaseAuth().currentUser;
    if (!user) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await sendEmailVerification(user);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        id="resend-email-btn"
        onClick={handleResend}
        disabled={status === "loading"}
        className="text-sm transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        ไม่ได้รับอีเมล?{" "}
        <span style={{ color: "var(--color-tu-yellow)" }}>
          {status === "loading" ? "กำลังส่ง…" : "ส่งอีกครั้ง"}
        </span>
      </button>
      {status === "sent" && (
        <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
          ส่งอีเมลยืนยันแล้ว ตรวจสอบ inbox อีกครั้ง
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs" style={{ color: "var(--color-error)" }}>
          ส่งซ้ำไม่ได้ กรุณาเข้าสู่ระบบแล้วลองอีกครั้ง
        </p>
      )}
    </div>
  );
}
