"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { confirmPasswordReset, signOut } from "firebase/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { getFirebaseAuth, firebaseAuthMessage } from "@/lib/firebase";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") ?? searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`);
      return;
    }
    if (password !== confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const auth = getFirebaseAuth();
      await confirmPasswordReset(auth, oobCode, password);
      await signOut(auth);
      setDone(true);
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "";
      setError(firebaseAuthMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  if (!oobCode) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          เปิดลิงก์จากอีเมลรีเซ็ตรหัสผ่านเพื่อตั้งรหัสใหม่
        </p>
        <Link href="/forgot-password" className="text-sm" style={{ color: "var(--color-tu-yellow)" }}>
          ขอลิงก์อีกครั้ง
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <p className="text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
        เปลี่ยนรหัสผ่านแล้ว กำลังกลับไปหน้าเข้าสู่ระบบ…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="mb-5 rounded-sm px-4 py-3 text-sm"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          รหัสผ่านใหม่
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(undefined);
          }}
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setError(undefined);
          }}
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? "กำลังบันทึก…" : "ตั้งรหัสผ่านใหม่"}
      </button>
    </form>
  );
}
