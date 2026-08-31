/* ============================================================
   /courses — หน้ารายวิชาทั้งหมด
   ============================================================ */

import type { Metadata } from "next";
import CourseGrid from "@/features/courses/CourseGrid";

export const metadata: Metadata = {
  title: "รายวิชา",
};

export default function CoursesPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-8 sm:px-8">
      <CourseGrid />
    </div>
  );
}
