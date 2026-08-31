"use client";

/* ============================================================
   CourseDetail.tsx — หน้ารายละเอียดรายวิชา
   แสดงข้อมูลวิชา + placeholder สำหรับไฟล์ (Phase 3)
   ============================================================ */

import Link from "next/link";
import { MOCK_COURSES, YEAR_LABELS } from "@/lib/mock-data";

interface CourseDetailProps {
  courseId: string;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const course = MOCK_COURSES.find((c) => c.id === courseId);

  /* ---- 404: ไม่พบรายวิชา ---- */
  if (!course) {
    return (
      <div className="empty-state">
        <svg
          width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-text-muted)"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="mt-3 text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          ไม่พบรายวิชา
        </p>
        <Link
          href="/courses"
          className="mt-3 text-sm transition-colors"
          style={{ color: "var(--color-tu-yellow)" }}
        >
          ← กลับหน้ารายวิชา
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* ---- Breadcrumb ---- */}
      <div className="mb-5 flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <Link
          href="/courses"
          className="transition-colors hover:underline"
          style={{ color: "var(--color-text-muted)" }}
        >
          รายวิชา
        </Link>
        <span>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>{course.code}</span>
      </div>

      {/* ---- Course Info Card ---- */}
      <div
        className="rounded-md p-6 mb-6"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Code + Year badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-sm font-mono font-bold px-2.5 py-1 rounded-sm"
            style={{
              background: "var(--color-tu-yellow-light)",
              color: "var(--color-tu-yellow-dim)",
            }}
          >
            {course.code}
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-muted)",
            }}
          >
            {YEAR_LABELS[course.year]}
            {course.semester && ` · เทอม ${course.semester}`}
          </span>
          {course.isElective && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-info-bg)",
                color: "var(--color-info)",
              }}
            >
              วิชาเลือก
            </span>
          )}
        </div>

        {/* Name */}
        <h1
          className="text-xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {course.name}
        </h1>
        {course.nameEn && (
          <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
            {course.nameEn}
          </p>
        )}

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {course.description}
        </p>
      </div>

      {/* ---- Files Section (Placeholder for Phase 3) ---- */}
      <div
        className="rounded-md p-6"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          เอกสารในรายวิชา
        </h2>

        <div className="empty-state">
          <svg
            width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-text-muted)"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            ยังไม่มีเอกสาร
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            ระบบอัปโหลดไฟล์จะเปิดใช้งานใน Phase 3
          </p>
        </div>
      </div>
    </div>
  );
}
