import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/shared/AuthLayout";
import VerifyEmailView from "@/features/auth/VerifyEmailView";

export const metadata: Metadata = {
  title: "ยืนยันอีเมล",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="กรุณายืนยันอีเมล" subtitle="บัญชียังไม่ยืนยันเข้าคลังไม่ได้">
      <Suspense fallback={<p className="text-sm" style={{ color: "var(--color-text-muted)" }}>กำลังโหลด…</p>}>
        <VerifyEmailView />
      </Suspense>
    </AuthLayout>
  );
}
