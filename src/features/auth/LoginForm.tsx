"use client";

/* ============================================================
   LoginForm.tsx — ฟอร์มเข้าสู่ระบบ

   Mockup credentials (ใช้ระหว่างพัฒนา frontend):
     Email    : demo@dome.tu.ac.th
     Password : password123
   เมื่อ backend พร้อม → ลบ MOCK_USER ออกแล้วเชื่อม API จริง

   Fields:
   1. อีเมล @dome.tu.ac.th (type="email", full address)
   2. รหัสผ่าน พร้อมปุ่มแสดง/ซ่อน
   3. ลิงก์ "ลืมรหัสผ่าน?"
   4. ปุ่ม "เข้าสู่ระบบ"

   หมายเหตุ backend:
   - ส่ง email เต็ม เช่น demo@dome.tu.ac.th ไปที่ API
   - Server ต้อง validate domain ด้วย (ไม่ trust UI เท่านั้น)
   ============================================================ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const EMAIL_DOMAIN = "@dome.tu.ac.th";

/* ---- Mockup user สำหรับ frontend dev (ลบออกเมื่อ backend พร้อม) ---- */
const MOCK_USER = {
  email: "demo@dome.tu.ac.th",
  password: "password123",
};

/* ---- Validate ก่อน submit ---- */
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const email = values.email.trim().toLowerCase();
  if (!email) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (!email.endsWith(EMAIL_DOMAIN)) {
    errors.email = `อีเมลต้องลงท้ายด้วย ${EMAIL_DOMAIN}`;
  } else if (!/^[a-zA-Z0-9._%+-]+@dome\.tu\.ac\.th$/.test(email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!values.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (values.password.length < 8) {
    errors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  }

  return errors;
}

/* ---- Main Component ---- */
export default function LoginForm() {
  const router = useRouter();

  /* State ของ form */
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* อัปเดต field + เคลียร์ error */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  /* Submit handler */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* 1. Validate ก่อน */
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const email = values.email.trim().toLowerCase();

    /* ============================================================
       MOCKUP LOGIN — ใช้ระหว่างพัฒนา frontend
       เปรียบเทียบกับ MOCK_USER แทน API จริง

       TODO (Backend): ลบ block นี้ทิ้ง แล้วแทนด้วย:
         fetch("/api/auth/login", { method: "POST", ... })
       ดูรายละเอียดใน backend_readme.txt หัวข้อ 7 Step 1
       ============================================================ */
    if (email === MOCK_USER.email && values.password === MOCK_USER.password) {
      /* ถูกต้อง → ไปหน้า dashboard */
      router.push("/dashboard");
    } else {
      /* ผิด → แสดง error */
      setErrors({ form: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      setIsLoading(false);
    }
  }

  /* ---- Render ---- */
  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ============================================================
          Form-level error banner (เช่น credentials ผิด)
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
          placeholder บอก format ชัดเจน เช่น demo@dome.tu.ac.th
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
          placeholder="demo@dome.tu.ac.th"
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
            ใช้อีเมลโดเมน @dome.tu.ac.th เท่านั้น
          </p>
        )}
      </div>

      {/* ============================================================
          Field 2: รหัสผ่าน พร้อมปุ่มแสดง/ซ่อน
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

          {/* ปุ่มแสดง/ซ่อนรหัสผ่าน */}
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          >
            {/* Eye icon — กดเพื่อแสดงรหัสผ่าน */}
            {!showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              /* Eye-off icon — กดเพื่อซ่อนรหัสผ่าน */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

      {/* ============================================================
          ลิงก์ "ลืมรหัสผ่าน?" — ขวาล่างของ password field
          ============================================================ */}
      <div className="mb-6 flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tu-yellow)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          ลืมรหัสผ่าน?
        </Link>
      </div>

      {/* ============================================================
          ปุ่มเข้าสู่ระบบ
          - disabled ระหว่าง submit เพื่อกัน double submit
          ============================================================ */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary flex items-center justify-center gap-2"
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

    </form>
  );
}
