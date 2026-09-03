/* ============================================================
   /admin/users — จัดการผู้ใช้
   เฉพาะ admin เท่านั้น
   ============================================================ */

import type { Metadata } from "next";
import AdminUsersView from "@/features/admin/AdminUsersView";

export const metadata: Metadata = {
  title: "จัดการผู้ใช้",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
