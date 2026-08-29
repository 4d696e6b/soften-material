/* ============================================================
   /dashboard — หน้าหลักหลังเข้าสู่ระบบ (Phase 1 Landing)

   ใช้ mockup user data ระหว่างพัฒนา frontend
   เมื่อ backend พร้อม → ดึงข้อมูลจริงจาก session / API
   ============================================================ */

import type { Metadata } from "next";
import DashboardView from "@/features/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "หน้าหลัก",
};

export default function DashboardPage() {
  return <DashboardView />;
}
