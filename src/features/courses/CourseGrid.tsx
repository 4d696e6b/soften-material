"use client";

/* ============================================================
   CourseGrid.tsx — รายวิชาทั้งหมด พร้อม tabs ปี + ค้นหา
   ============================================================ */

import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_COURSES, YEAR_LABELS } from "@/lib/mock-data";
import type { CourseYear } from "@/types";

/* ---- Filter tabs ---- */
type FilterTab = "all" | CourseYear;

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: 1, label: "ปี 1" },
  { value: 2, label: "ปี 2" },
  { value: 3, label: "ปี 3" },
  { value: 4, label: "ปี 4" },
];

export default function CourseGrid() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let courses = MOCK_COURSES;

    /* กรองตาม tab */
    if (activeTab !== "all") {
      courses = courses.filter((c) => c.year === activeTab);
    }

    /* กรองตาม search */
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      courses = courses.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.nameEn && c.nameEn.toLowerCase().includes(q))
      );
    }

    return courses;
  }, [activeTab, search]);

  return (
    <div>
      {/* ---- Header ---- */}
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          รายวิชาทั้งหมด
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          วิชาในหลักสูตรวิศวกรรมซอฟต์แวร์ มธ. ทั้งหมด {MOCK_COURSES.length} วิชา
        </p>
      </div>

      {/* ---- Search + Tabs ---- */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-text-muted)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหารหัสหรือชื่อวิชา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            id="course-search"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              className={`tab-btn ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Course Grid ---- */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg
            width="32" height="32" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-text-muted)"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="mt-3 text-sm">ไม่พบรายวิชาที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="course-card"
              id={`course-card-${course.code}`}
            >
              {/* Course code + year badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "var(--color-tu-yellow-dim)" }}
                >
                  {course.code}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {YEAR_LABELS[course.year]}
                  {course.isElective && " · เลือก"}
                </span>
              </div>

              {/* Course name */}
              <p
                className="font-semibold text-sm mb-1 leading-snug"
                style={{ color: "var(--color-text-primary)" }}
              >
                {course.name}
              </p>

              {/* Course name EN */}
              {course.nameEn && (
                <p
                  className="text-xs mb-2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {course.nameEn}
                </p>
              )}

              {/* File count */}
              <div className="flex items-center gap-1.5 mt-auto pt-2" style={{ borderTop: "1px solid var(--color-border)" }}>
                <svg
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="var(--color-text-muted)"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {course.fileCount} ไฟล์
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
