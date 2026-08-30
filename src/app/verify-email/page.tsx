/* ============================================================
   /verify-email — หน้ายืนยันอีเมล (skeleton สำหรับ Phase 1)
   
   Flow หลังสมัครสมาชิก:
   1. ผู้ใช้สมัครด้วย @dome.tu.ac.th
   2. ระบบส่งอีเมลยืนยัน
   3. ถ้าล็อกอินแล้วแต่ยังไม่ verify → redirect มาหน้านี้
   4. ผู้ใช้กดลิงก์ในอีเมล → ระบบ verify แล้ว redirect ไป dashboard
   
   หมายเหตุ backend:
   - Token ใน URL (เช่น /verify-email?token=xxx) ต้อง validate ที่ server
   - Token ควรใช้ครั้งเดียวและหมดอายุใน 24 ชั่วโมง
   ============================================================ */

import type { Metadata } from "next";
import AuthLayout from "@/components/shared/AuthLayout";
import ResendButton from "@/features/auth/ResendButton";

export const metadata: Metadata = {
  title: "ยืนยันอีเมล",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="ยืนยันอีเมลของคุณ"
      subtitle="ตรวจสอบ inbox ของอีเมล @dome.tu.ac.th"
    >
      {/* ============================================================
          TODO (Phase 1 Backend):
          - ถ้ามี ?token= ใน URL → ส่งไป verify API
          - ถ้าไม่มี token → แสดงหน้า "กรุณาตรวจสอบอีเมล" พร้อม
            ปุ่ม "ส่งอีเมลยืนยันอีกครั้ง"
          ============================================================ */}
      <div className="text-center py-4">
        {/* Email icon */}
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: "var(--color-tu-yellow-glow)",
            border: "1px solid rgba(245,197,24,0.25)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-tu-yellow)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <p
          className="mb-1 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          ส่งอีเมลยืนยันแล้ว
        </p>
        <p
          className="mb-6 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          กรุณากดลิงก์ในอีเมลเพื่อยืนยันตัวตนก่อนเข้าใช้งานคลัง
        </p>

        {/* ปุ่มส่งอีเมลซ้ำ — Client Component แยก */}
        <ResendButton />
      </div>
    </AuthLayout>
  );
}
