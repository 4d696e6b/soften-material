"use client";

/* ============================================================
   DashboardView.tsx — หน้า Landing / Home หลังเข้าสู่ระบบ (Phase 2)
   
   ปรับแต่งเนื้อหาหน้าหลักแยกตามบทบาท (Role-Specific Home):
   - Student     : ค้นหาเอกสาร, ลิงก์วิชาตามชั้นปี, ดูวิชาทั้งหมด
   - Contributor : อัปโหลดฉบับร่าง, สถิติการส่งไฟล์, แนวทางการแชร์
   - Moderator   : คิวรอตรวจสอบ, ตรวจสอบเนื้อหา, กฎการอนุมัติ
   - Admin       : สถิติระบบรวม, จัดการผู้ใช้, จัดการรายวิชา
   ============================================================ */

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLE_LABELS_EN } from "@/types";
import { MOCK_COURSES } from "@/lib/mock-data";

/* ---- Phase roadmap สำหรับแสดงใน dashboard ---- */
const PHASES = [
  {
    phase: "Phase 1",
    title: "ยืนยันตัวตน",
    description: "Login / Register / Forgot Password ด้วยอีเมล @dome.tu.ac.th",
    status: "done" as const,
  },
  {
    phase: "Phase 2",
    title: "รายวิชาและบทบาท",
    description: "รายวิชา SF-xxx, โปรไฟล์, จัดการผู้ใช้ และ role-based access",
    status: "current" as const,
  },
  {
    phase: "Phase 3",
    title: "อัปโหลดและอ่าน PDF",
    description: "คลังไฟล์ PDF, metadata, preview ในเบราว์เซอร์, ดาวน์โหลดปลอดภัย",
    status: "upcoming" as const,
  },
  {
    phase: "Phase 4",
    title: "ความปลอดภัยขั้นสูง",
    description: "MFA, audit log, ลายน้ำ, จำกัดดาวน์โหลด",
    status: "upcoming" as const,
  },
  {
    phase: "Phase 5",
    title: "ค้นหาและฟีเจอร์การเรียน",
    description: "ค้นหา, ตัวกรอง, บุ๊กมาร์ก, ประวัติ, ขอไฟล์",
    status: "upcoming" as const,
  },
];

const statusStyles: Record<"done" | "current" | "upcoming", { bg: string; text: string; dot: string; label: string }> = {
  done:     { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e", label: "เสร็จแล้ว" },
  current:  { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6", label: "กำลังพัฒนา" },
  upcoming: { bg: "#fafafa", text: "#888888", dot: "#dddddd", label: "กำลังมา" },
};

export default function DashboardView() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-8 sm:px-8">

      {/* ---- Hero Section: ทักทาย + แสดง Role ---- */}
      <section className="mb-8 p-6 rounded-lg border" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`role-badge role-badge--${user.role}`}>
                {ROLE_LABELS[user.role]} ({ROLE_LABELS_EN[user.role]})
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                Soft-En TU
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              ยินดีต้อนรับ, {user.name} 👋
            </h1>

            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              เข้าสู่ระบบด้วย{" "}
              <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/5" style={{ color: "var(--color-text-primary)" }}>
                {user.email}
              </code>
              {" — "}
              {user.role === "student" && "ค้นหาและเข้าถึงเอกสารการเรียน ข้อสอบเก่า และชีทสรุปสำหรับนักศึกษา Soft-En"}
              {user.role === "contributor" && "ร่วมแบ่งปันชีทสรุปและเอกสารการเรียนเพื่อช่วยเพื่อนๆ ในสาขา"}
              {user.role === "moderator" && "ตรวจสอบคุณภาพและความถูกต้องของเอกสารก่อนเผยแพร่สู่คลังรวม"}
              {user.role === "admin" && "ควบคุมดูแลระบบ จัดการสิทธิ์ผู้ใช้งาน และโครงสร้างหลักสูตรรายวิชา"}
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <Link href="/profile" className="btn-secondary text-xs">
              ดูโปรไฟล์
            </Link>
            <Link href="/courses" className="btn-primary text-xs text-center">
              ดูรายวิชาทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          ROLE-SPECIFIC SECTIONS
          ============================================================ */}

      {/* 1. STUDENT VIEW */}
      {user.role === "student" && (
        <section className="mb-8 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
              เข้าถึงรายวิชาตามชั้นปี
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((year) => {
                const count = MOCK_COURSES.filter((c) => c.year === year).length;
                return (
                  <Link
                    key={year}
                    href="/courses"
                    className="course-card p-4 rounded-md text-center hover:border-[var(--color-tu-yellow)]"
                  >
                    <p className="text-lg font-bold" style={{ color: "var(--color-tu-yellow-dim)" }}>
                      ชั้นปีที่ {year}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {count} รายวิชา
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-md border" style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
              💡 คำแนะนำสำหรับนักศึกษา
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              เอกสารในระบบจะแสดงเฉพาะไฟล์ที่ผ่านการตรวจสอบ (Published) แล้วเท่านั้น หากต้องการร่วมส่งเอกสาร สามารถติดต่อ Admin เพื่อปรับสิทธิ์เป็น <strong>Contributor</strong> ได้
            </p>
          </div>
        </section>
      )}

      {/* 2. CONTRIBUTOR VIEW */}
      {user.role === "contributor" && (
        <section className="mb-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>0</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>ไฟล์ที่ฉันอัปโหลด</p>
            </div>
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-info)" }}>0</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>รอตรวจสอบ (Pending)</p>
            </div>
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>0</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>เผยแพร่แล้ว (Published)</p>
            </div>
          </div>

          <div className="p-5 rounded-md border" style={{ background: "var(--color-info-bg)", borderColor: "var(--color-info-border)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-info)" }}>
              🚀 ระบบอัปโหลดเอกสาร (Phase 3)
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-info)" }}>
              ในฐานะ <strong>Contributor</strong> คุณจะสามารถอัปโหลดไฟล์ PDF ฉบับร่าง พร้อมระบุวิชาและประเภทเอกสาร (ชีทสรุป, ข้อสอบเก่า, แบบฝึกหัด) ได้ใน Phase 3
            </p>
          </div>
        </section>
      )}

      {/* 3. MODERATOR VIEW */}
      {user.role === "moderator" && (
        <section className="mb-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-warning)" }}>0</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>คิวรอตรวจสอบ</p>
            </div>
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>12</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>รายวิชาในระบบ</p>
            </div>
            <div className="p-4 rounded-md border text-center" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>พร้อม</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>สถานะสิทธิ์ตรวจเอกสาร</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/admin" className="btn-primary text-xs">
              ไปยังหน้า Admin Dashboard
            </Link>
            <Link href="/courses" className="btn-secondary text-xs">
              ตรวจสอบรายวิชา
            </Link>
          </div>
        </section>
      )}

      {/* 4. ADMIN VIEW */}
      {user.role === "admin" && (
        <section className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/admin/users" className="course-card p-4 rounded-md">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-info)" }}>
                จัดการผู้ใช้
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                4 บัญชี Mock
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                กำหนด Role: Student, Contributor, Moderator, Admin
              </p>
            </Link>

            <Link href="/admin/courses" className="course-card p-4 rounded-md">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-tu-yellow-dim)" }}>
                จัดการรายวิชา
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                12 รายวิชา
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                เพิ่ม / แก้ไข / ลบ รายวิชา Soft-En
              </p>
            </Link>

            <Link href="/admin" className="course-card p-4 rounded-md">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-success)" }}>
                ภาพรวมระบบ
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                Admin Overview
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                สถิติและสถานะการเข้าถึง
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* ---- Divider ---- */}
      <div className="mb-8 h-px" style={{ background: "var(--color-border)" }} />

      {/* ---- Roadmap Status ---- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}
          >
            Roadmap การพัฒนาระบบ
          </h2>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            สเปก: docs/soften-material-dev-spec.th.md
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHASES.map((p) => {
            const s = statusStyles[p.status];
            return (
              <div
                key={p.phase}
                className="rounded-md p-4 transition-shadow"
                style={{
                  background: "var(--color-bg-card)",
                  border: `1px solid ${p.status === "current" ? "var(--color-info-border)" : "var(--color-border)"}`,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {p.phase}
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.text }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: s.dot }}
                    />
                    {s.label}
                  </span>
                </div>

                <p
                  className="mb-0.5 text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {p.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
