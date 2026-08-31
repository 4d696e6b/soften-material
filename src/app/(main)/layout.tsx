/* ============================================================
   (main)/layout.tsx — Layout สำหรับทุกหน้าหลัง login

   ใช้ AppShell ครอบทุก page ที่อยู่ใน route group (main)
   ============================================================ */

import AppShell from "@/components/shared/AppShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
