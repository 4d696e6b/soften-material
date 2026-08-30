"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { sendAppVerificationEmail } from "@/lib/auth/verification";
import { getFirebaseAuth, firebaseAuthMessage } from "@/lib/firebase";

export default function ResendButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>();

  async function handleResend() {
    if (status === "loading") return;
    const user = getFirebaseAuth().currentUser;
    if (!user) {
      setStatus("error");
      setMessage("กรุณาเข้าสู่ระบบก่อน แล้วกดส่งอีกครั้ง");
      return;
    }

    setStatus("loading");
    setMessage(undefined);
    try {
      await sendAppVerificationEmail(user);
      setStatus("sent");
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "";
      setStatus("error");
      setMessage(firebaseAuthMessage(code));
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
          ส่งแล้ว ตรวจ inbox และโฟลเดอร์สแปม จาก noreply@ โปรเจกต์ Firebase
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs" style={{ color: "var(--color-error)" }}>
          {message ?? "ส่งซ้ำไม่ได้ กรุณาลองใหม่"}
        </p>
      )}
    </div>
  );
}
