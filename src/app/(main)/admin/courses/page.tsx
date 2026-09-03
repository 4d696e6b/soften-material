/* ============================================================
   /admin/courses — จัดการรายวิชา
   เฉพาะ admin เท่านั้น
   ============================================================ */

import type { Metadata } from "next";
import AdminCoursesView from "@/features/admin/AdminCoursesView";

export const metadata: Metadata = {
  title: "จัดการรายวิชา",
};

export default function AdminCoursesPage() {
  return <AdminCoursesView />;
}
