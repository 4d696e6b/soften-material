"use client";

/* ============================================================
   LoginForm.tsx — ฟอร์มเข้าสู่ระบบ

   Fields:
   1. อีเมล @dome.tu.ac.th (type="email", full address)
   2. รหัสผ่าน พร้อมปุ่มแสดง/ซ่อน
   3. ลิงก์ "ลืมรหัสผ่าน?"
   4. ปุ่ม "เข้าสู่ระบบ"
   5. ลิงก์ "สมัครสมาชิก"
   6. ปุ่ม Quick Mock Logins ตามบทบาท (สำหรับทดสอบ)

   รองรับทั้ง Firebase Auth และ Mock Users
   ============================================================ */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, firebaseAuthMessage } from "@/lib/firebase";
import { ALLOW_ANY_EMAIL, EMAIL_DOMAIN, MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { isTuEmail, isValidEmail, normalizeEmail } from "@/lib/auth/email";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

/* ---- Types ---- */
interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

/* ---- Validate ก่อน submit ---- */
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const email = values.email.trim().toLowerCase();
  if (!email) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (ALLOW_ANY_EMAIL) {
    if (!isValidEmail(email)) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  } else if (!email.endsWith(EMAIL_DOMAIN)) {
    errors.email = `อีเมลต้องลงท้ายด้วย ${EMAIL_DOMAIN}`;
  } else if (!isTuEmail(email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!values.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`;
  }

  return errors;
}

export default function LoginForm() {
  const router = useRouter();
  const { user, isInitialized, login, loginAsRole, mockAccounts } = useAuth();

  /* State ของ form */
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ถ้า login อยู่แล้ว ให้ redirect ไป dashboard */
  useEffect(() => {
    if (isInitialized && user) {
      router.replace("/dashboard");
    }
  }, [isInitialized, user, router]);

  /* อัปเดต field + เคลียร์ error */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const email = normalizeEmail(values.email);

    /* 1. ลอง Mock Auth ก่อนเพื่อความสะดวกรวดเร็วในการทดสอบ */
    const mockResult = login(email, values.password);
    if (mockResult.success) {
      setIsLoading(false);
      router.push("/dashboard");
      return;
    }

    /* 2. ถ้าไม่ใช่ mock account ให้ยืนยันตัวตนผ่าน Firebase Auth */
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        values.password,
      );

      if (!credential.user.emailVerified && !ALLOW_ANY_EMAIL) {
        router.push("/verify-email");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "";
      setErrors({ form: firebaseAuthMessage(code) || mockResult.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    } finally {
      setIsLoading(false);
    }
  }

  /* Quick login by role */
  function handleQuickLogin(role: UserRole) {
    setIsLoading(true);
    const result = loginAsRole(role);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrors({ form: "ไม่สามารถเข้าสู่ระบบด่วนได้" });
    }
    setIsLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {/* ============================================================
            Form-level error banner
            ============================================================ */}
        {errors.form && (
          <div
            className="mb-5 rounded-[var(--radius-sm)] px-4 py-3 text-sm"
            style={{
              background: "var(--color-error-bg)",
              border: "1px solid var(--color-error-border)",
              color: "var(--color-error)",
            }}
            role="alert"
            aria-live="assertive"
          >
            {errors.form}
          </div>
        )}

        {/* ============================================================
            Field 1: อีเมล @dome.tu.ac.th
            ============================================================ */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            อีเมล
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={ALLOW_ANY_EMAIL ? "student@dome.tu.ac.th" : "demo@dome.tu.ac.th"}
            value={values.email}
            onChange={handleChange}
            disabled={isLoading}
            className={`auth-input ${errors.email ? "error" : ""}`}
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            aria-invalid={!!errors.email}
          />

          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs" style={{ color: "var(--color-error)" }}>
              {errors.email}
            </p>
          ) : (
            <p id="email-hint" className="mt-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {ALLOW_ANY_EMAIL
                ? "ใช้อีเมลโดเมน @dome.tu.ac.th หรืออีเมลทดสอบ"
                : "ใช้อีเมลโดเมน @dome.tu.ac.th เท่านั้น"}
            </p>
          )}
        </div>

        {/* ============================================================
            Field 2: รหัสผ่าน
            ============================================================ */}
        <div className="mb-2">
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            รหัสผ่าน
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`auth-input pr-11 ${errors.password ? "error" : ""}`}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {!showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs" style={{ color: "var(--color-error)" }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* ลืมรหัสผ่าน */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center justify-center gap-2 w-full"
          id="login-submit-btn"
        >
          {isLoading ? (
            <>
              <span
                className="animate-spin inline-block w-4 h-4 rounded-full border-2"
                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#ffffff" }}
                aria-hidden="true"
              />
              กำลังเข้าสู่ระบบ…
            </>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>

        {/* สมัครสมาชิก */}
        <div className="mt-5 text-center">
          <Link
            href="/register"
            className="text-sm transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            ยังไม่มีบัญชี? สมัครสมาชิก
          </Link>
        </div>
      </form>

      {/* ---- Quick One-Click Mock Logins ---- */}
      <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--color-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
          คลิกเข้าสู่ระบบด่วนตามบทบาท (Mock Users)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {mockAccounts.map((acc) => {
            const role = acc.user.role;
            const roleThai: Record<UserRole, string> = {
              student: "นักศึกษา",
              contributor: "ผู้ส่งเอกสาร",
              moderator: "ผู้ตรวจเนื้อหา",
              admin: "ผู้ดูแลระบบ",
            };
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setValues({ email: acc.email, password: acc.password });
                  handleQuickLogin(role);
                }}
                disabled={isLoading}
                className="text-left p-2.5 rounded-md border transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "var(--color-bg-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {roleThai[role]}
                  </span>
                  <span className={`role-badge role-badge--${role} text-[10px] px-1.5 py-0.5`}>
                    {role}
                  </span>
                </div>
                <p className="text-[11px] font-mono truncate" style={{ color: "var(--color-text-muted)" }}>
                  {acc.email}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-center" style={{ color: "var(--color-text-muted)" }}>
          รหัสผ่านสำหรับทุกบัญชี: <code className="font-mono px-1 py-0.5 rounded bg-black/5">password123</code>
        </p>
      </div>
    </div>
  );
}
