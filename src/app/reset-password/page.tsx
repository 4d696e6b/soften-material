import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/shared/AuthLayout";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "ตั้งรหัสผ่านใหม่",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="ตั้งรหัสผ่านใหม่" subtitle="หลังเปลี่ยนรหัสผ่าน เซสชันเก่าจะใช้ไม่ได้">
      <Suspense fallback={<p className="text-sm" style={{ color: "var(--color-text-muted)" }}>กำลังโหลด…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
