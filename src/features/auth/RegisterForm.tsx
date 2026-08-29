"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { EMAIL_DOMAIN, MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { isTuEmail, normalizeEmail } from "@/lib/auth/email";
import { getFirebaseAuth, firebaseAuthMessage } from "@/lib/firebase";

interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const email = values.email.trim().toLowerCase();

  if (!email) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (!email.endsWith(EMAIL_DOMAIN)) {
    errors.email = `อนุญาตเฉพาะอีเมล ${EMAIL_DOMAIN} เท่านั้น`;
  } else if (!/^[a-zA-Z0-9._%+-]+@dome\.tu\.ac\.th$/.test(email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!values.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`;
  }

  return errors;
}

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!isTuEmail(email)) {
      setErrors({ form: "อนุญาตเฉพาะอีเมล @dome.tu.ac.th เท่านั้น" });
      setIsLoading(false);
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        values.password,
      );
      await sendEmailVerification(credential.user);
      router.push("/verify-email");
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "";
      setErrors({ form: firebaseAuthMessage(code) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.form && (
        <div
          className="mb-5 rounded-sm px-4 py-3 text-sm"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error)",
          }}
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="register-email"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          อีเมล
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="someone@dome.tu.ac.th"
          value={values.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`auth-input ${errors.email ? "error" : ""}`}
          aria-invalid={!!errors.email}
        />
        <p className="mt-1.5 text-xs" style={{ color: errors.email ? "var(--color-error)" : "var(--color-text-muted)" }}>
          {errors.email ?? "สมัครได้เฉพาะอีเมล @dome.tu.ac.th"}
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="register-password"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          รหัสผ่าน
        </label>
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="อย่างน้อย 8 ตัวอักษร"
            value={values.password}
            onChange={handleChange}
            disabled={isLoading}
            className={`auth-input pr-11 ${errors.password ? "error" : ""}`}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs" style={{ color: "var(--color-error)" }}>
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary flex items-center justify-center gap-2"
      >
        {isLoading ? "กำลังสมัคร…" : "สมัครสมาชิก"}
      </button>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="text-sm transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
        </Link>
      </div>
    </form>
  );
}
