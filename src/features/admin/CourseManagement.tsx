"use client";

/* ============================================================
   CourseManagement.tsx — หน้าจัดการรายวิชา (Admin)
   ตาราง + modal สร้าง/แก้ไขรายวิชา
   ============================================================ */

import { useState, useMemo } from "react";
import { MOCK_COURSES, YEAR_LABELS } from "@/lib/mock-data";
import type { Course, CourseYear } from "@/types";

/* ---- Form data ---- */
interface CourseFormData {
  code: string;
  name: string;
  nameEn: string;
  description: string;
  year: CourseYear;
  semester: "" | "1" | "2";
  isElective: boolean;
}

const EMPTY_FORM: CourseFormData = {
  code: "",
  name: "",
  nameEn: "",
  description: "",
  year: 1,
  semester: "",
  isElective: false,
};

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormData>(EMPTY_FORM);

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.trim().toLowerCase();
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [courses, search]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(course: Course) {
    setForm({
      code: course.code,
      name: course.name,
      nameEn: course.nameEn || "",
      description: course.description,
      year: course.year,
      semester: course.semester ? String(course.semester) as "1" | "2" : "",
      isElective: course.isElective || false,
    });
    setEditingId(course.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.code.trim() || !form.name.trim()) return;

    if (editingId) {
      /* Edit */
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: form.code.trim().toUpperCase(),
                name: form.name.trim(),
                nameEn: form.nameEn.trim() || undefined,
                description: form.description.trim(),
                year: form.year,
                semester: form.semester ? (Number(form.semester) as 1 | 2) : undefined,
                isElective: form.isElective,
              }
            : c
        )
      );
    } else {
      /* Create */
      const newCourse: Course = {
        id: `c-new-${Date.now()}`,
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        nameEn: form.nameEn.trim() || undefined,
        description: form.description.trim(),
        year: form.year,
        semester: form.semester ? (Number(form.semester) as 1 | 2) : undefined,
        fileCount: 0,
        isElective: form.isElective,
      };
      setCourses((prev) => [newCourse, ...prev]);
    }

    setShowModal(false);
  }

  function handleDelete(courseId: string) {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold mb-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            จัดการรายวิชา
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            เพิ่ม แก้ไข หรือลบรายวิชาในระบบ
          </p>
        </div>
        <button
          type="button"
          className="btn-primary btn-sm"
          style={{ width: "auto" }}
          onClick={openCreate}
          id="add-course-btn"
        >
          + เพิ่มรายวิชา
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
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
          id="admin-course-search"
        />
      </div>

      {/* Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>รหัสวิชา</th>
                <th>ชื่อวิชา</th>
                <th className="hidden sm:table-cell">ปี</th>
                <th className="hidden sm:table-cell">ไฟล์</th>
                <th style={{ textAlign: "right" }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course.id}>
                  <td>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: "var(--color-tu-yellow-dim)" }}
                    >
                      {course.code}
                    </span>
                  </td>
                  <td>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {course.name}
                    </p>
                    {course.nameEn && (
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {course.nameEn}
                      </p>
                    )}
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {YEAR_LABELS[course.year]}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {course.fileCount}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => openEdit(course)}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state py-8">
            <p className="text-sm">ไม่พบรายวิชาที่ค้นหา</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        * การเปลี่ยนแปลงเป็น mock data เท่านั้น ยังไม่บันทึกลง database
      </p>

      {/* ============================================================
          Modal: Create/Edit Course
          ============================================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3
                className="font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {editingId ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="ปิด"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body flex flex-col gap-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  รหัสวิชา *
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="เช่น SF331"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  style={{ fontSize: "0.8125rem" }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  ชื่อวิชา (ไทย) *
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="เช่น วิศวกรรมซอฟต์แวร์"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ fontSize: "0.8125rem" }}
                />
              </div>

              {/* Name EN */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  ชื่อวิชา (อังกฤษ)
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="เช่น Software Engineering"
                  value={form.nameEn}
                  onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                  style={{ fontSize: "0.8125rem" }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  คำอธิบาย
                </label>
                <textarea
                  className="auth-input"
                  rows={3}
                  placeholder="คำอธิบายรายวิชา"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ fontSize: "0.8125rem", resize: "vertical" }}
                />
              </div>

              {/* Year + Semester */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    ปีที่เรียน *
                  </label>
                  <select
                    className="select-input w-full"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) as CourseYear }))}
                  >
                    <option value={1}>ปี 1</option>
                    <option value={2}>ปี 2</option>
                    <option value={3}>ปี 3</option>
                    <option value={4}>ปี 4</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                    ภาคเรียน
                  </label>
                  <select
                    className="select-input w-full"
                    value={form.semester}
                    onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value as "" | "1" | "2" }))}
                  >
                    <option value="">ไม่ระบุ</option>
                    <option value="1">เทอม 1</option>
                    <option value="2">เทอม 2</option>
                  </select>
                </div>
              </div>

              {/* Elective */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isElective}
                  onChange={(e) => setForm((f) => ({ ...f, isElective: e.target.checked }))}
                  className="accent-tu-yellow"
                />
                <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  วิชาเลือก
                </span>
              </label>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ width: "auto" }}
                onClick={handleSave}
                disabled={!form.code.trim() || !form.name.trim()}
              >
                {editingId ? "บันทึก" : "เพิ่มรายวิชา"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
