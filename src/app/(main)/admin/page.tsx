/* ============================================================
   /admin — Admin Dashboard
   เฉพาะ admin เท่านั้น (route protection ตาม mock role)
   ============================================================ */

import type { Metadata } from "next";
import AdminDashboard from "@/features/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
