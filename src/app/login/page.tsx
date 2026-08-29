/* ============================================================
   /login — หน้าเข้าสู่ระบบ
   
   ใช้ AuthLayout เป็น wrapper (พื้นหลัง + card)
   ใช้ LoginForm component สำหรับ form ทั้งหมด
   
   หมายเหตุ Next.js:
   - หน้านี้ไม่ต้องเป็น "use client" เพราะ AuthLayout และ LoginForm
     จัดการ client-side เองแล้ว
   - Metadata ถูก override ด้วย export const metadata
   ============================================================ */

import type { Metadata } from "next";
import AuthLayout from "@/components/shared/AuthLayout";
import LoginForm from "@/features/auth/LoginForm";

/* SEO Metadata สำหรับหน้า Login */
export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description: "เข้าสู่ระบบ Soften Material ด้วยอีเมลโดเมน dome.tu.ac.th",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="เข้าสู่ระบบ"
      subtitle="ใช้อีเมลที่มีโดเมน dome.tu.ac.th และรหัสผ่านสำนักทะเบียน"
    >
      <LoginForm />
    </AuthLayout>
  );
}
