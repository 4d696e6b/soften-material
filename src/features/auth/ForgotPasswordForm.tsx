"use client";

/* ============================================================
   ForgotPasswordForm.tsx — ฟอร์มขอรีเซ็ตรหัสผ่าน
   
   Flow:
   1. ผู้ใช้พิมพ์ส่วนหน้า @ เช่น "john.doe"
   2. ระบบสร้างอีเมลเต็ม john.doe@dome.tu.ac.th แล้วส่ง link
   3. แสดง success state — บอกให้ตรวจ inbox
   
   Security notes สำหรับ Backend:
   - ต้อง rate-limit endpoint นี้ (ตามสเปก)
   - Response ควร 200 เสมอ ไม่ว่าอีเมลจะมีในระบบหรือไม่
     เพื่อกัน user enumeration attack
   - Reset token หมดอายุใน 1 ชั่วโมง ใช้ได้ครั้งเดียว
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { isTuEmail, normalizeEmail } from "@/lib/auth/email";

type Step = "idle" | "loading" | "success";
const EMAIL_DOMAIN = "@dome.tu.ac.th";

function validateEmail(email: string): string | undefined {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return "กรุณากรอกอีเมล";
  if (!trimmed.endsWith(EMAIL_DOMAIN)) return `อีเมลต้องลงท้ายด้วย ${EMAIL_DOMAIN}`;
  if (!/^[a-zA-Z0-9._%+-]+@dome\.tu\.ac\.th$/.test(trimmed)) return "รูปแบบอีเมลไม่ถูกต้อง";
  return undefined;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [step, setStep] = useState<Step>("idle");

  const fullEmail = email.trim().toLowerCase();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    setFieldError(undefined);
    setFormError(undefined);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) { setFieldError(error); return; }

    setStep("loading");
    setFormError(undefined);

    try {
      if (isTuEmail(normalizeEmail(fullEmail))) {
        await sendPasswordResetEmail(getFirebaseAuth(), fullEmail);
      }
      setStep("success");
    } catch {
      setStep("success");
    }
  }

  /* ============================================================
     Success State
     ============================================================ */
  if (step === "success") {
    return (
      <div className="text-center py-2">
        {/* Checkmark icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "var(--color-tu-yellow-light)",
            border: "1.5px solid rgba(232,169,0,0.3)",
          }}
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-tu-yellow)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="mb-1 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว
        </p>
        <p className="mb-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          ตรวจสอบอีเมล
        </p>
        <p
          className="mb-6 text-sm font-medium break-all"
          style={{ color: "var(--color-text-primary)", fontFamily: "monospace" }}
        >
          {fullEmail}
        </p>
        <p className="mb-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
          ลิงก์จะหมดอายุใน 1 ชั่วโมง
        </p>

        <Link
          href="/login"
          className="text-sm transition-colors"
          style={{ color: "var(--color-tu-yellow)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tu-yellow-dim)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-tu-yellow)")}
        >
          ← กลับหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  /* ============================================================
     Form State
     ============================================================ */
  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Form-level error */}
      {formError && (
        <div
          className="mb-5 rounded-sm px-4 py-3 text-sm"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error)",
          }}
          role="alert"
        >
          {formError}
        </div>
      )}

      {/* Field: อีเมลเต็ม */}
      <div className="mb-6">
        <label
          htmlFor="forgot-email"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          อีเมล
        </label>

        {/* Email input */}
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="alex.jo@dome.tu.ac.th"
          value={email}
          onChange={handleChange}
          disabled={step === "loading"}
          className={`auth-input ${fieldError ? "error" : ""}`}
          aria-describedby={fieldError ? "forgot-email-error" : "forgot-email-hint"}
          aria-invalid={!!fieldError}
        />

        {fieldError ? (
          <p id="forgot-email-error" className="mt-1.5 text-xs" style={{ color: "var(--color-error)" }}>
            {fieldError}
          </p>
        ) : (
          <p id="forgot-email-hint" className="mt-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            ลิงก์รีเซ็ตจะส่งไปที่อีเมล @dome.tu.ac.th ที่ลงทะเบียนไว้
          </p>
        )}
      </div>

      {/* ปุ่ม Submit */}
      <button
        type="submit"
        disabled={step === "loading"}
        className="btn-primary flex items-center justify-center gap-2"
        id="forgot-password-submit-btn"
      >
        {step === "loading" ? (
          <>
            <span
              className="animate-spin inline-block w-4 h-4 rounded-full border-2"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#ffffff" }}
              aria-hidden="true"
            />
            กำลังส่งลิงก์…
          </>
        ) : (
          "ส่งลิงก์รีเซ็ตรหัสผ่าน"
        )}
      </button>

      {/* ลิงก์กลับ Login */}
      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="text-sm transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tu-yellow)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          ← กลับหน้าเข้าสู่ระบบ
        </Link>
      </div>

    </form>
  );
}
