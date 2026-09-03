/* ============================================================
   /courses/[id] — หน้ารายละเอียดรายวิชา
   ============================================================ */

import type { Metadata } from "next";
import CourseDetail from "@/features/courses/CourseDetail";

export const metadata: Metadata = {
  title: "รายวิชา",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-8 sm:px-8">
      <CourseDetail courseId={id} />
    </div>
  );
}
