/* ============================================================
   /forgot-password — หน้าขอรีเซ็ตรหัสผ่าน
   
   ใช้ AuthLayout เป็น wrapper เหมือนหน้า Login
   ใช้ ForgotPasswordForm ที่มี 2-step (form → success)
   ============================================================ */

import type { Metadata } from "next";
import AuthLayout from "@/components/shared/AuthLayout";
import ForgotPasswordForm from "@/features/auth/ForgotPasswordForm";

/* SEO Metadata */
export const metadata: Metadata = {
  title: "ลืมรหัสผ่าน",
  description: "ขอลิงก์รีเซ็ตรหัสผ่านสำหรับบัญชี Soften Material",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="ลืมรหัสผ่าน?"
      subtitle="ส่งลิงก์ได้เฉพาะอีเมล @dome.tu.ac.th ที่ลงทะเบียนแล้ว"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
