"use client";

/* ============================================================
<<<<<<< HEAD
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
=======
   DashboardView.tsx — หน้า Landing หลังเข้าสู่ระบบ (Phase 1)

   ประกอบด้วย:
   1. Topbar: โลโก้ + ชื่อผู้ใช้ + ปุ่มออกจากระบบ
   2. Hero section: ทักทายผู้ใช้
   3. Status cards: บอกสถานะ Phase ต่าง ๆ
   4. Coming soon: บอกว่าฟีเจอร์ถัดไปกำลังมา

   ผู้ใช้มาจาก Firebase Auth
   ============================================================ */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import TULogo from "@/components/ui/TULogo";
import { useAuth } from "@/context/AuthProvider";
import { toAuthUser } from "@/lib/auth/user";
import { getFirebaseAuth } from "@/lib/firebase";
import type { AuthUser } from "@/types";
>>>>>>> af73d6d8406ee3d2b1c2683df1df7e52ac5bc934

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

function roleLabel(role: AuthUser["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function DashboardView() {
<<<<<<< HEAD
  const { user, isInitialized } = useAuth();

  /* กรณี Auth ยังโหลดไม่เสร็จ ให้แสดง Skeleton loading */
  if (!isInitialized || !user) {
    return (
      <div className="w-full max-w-5xl mx-auto px-5 py-16 flex flex-col items-center justify-center gap-3">
        <span
          className="animate-spin inline-block w-8 h-8 rounded-full border-2"
          style={{ borderColor: "rgba(0,0,0,0.1)", borderTopColor: "var(--color-tu-yellow)" }}
          aria-hidden="true"
        />
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>กำลังโหลดข้อมูล…</p>
      </div>
    );
  }

  const role = user.role || "student";
  const roleThai = ROLE_LABELS[role] || "นักศึกษา";
  const roleEnglish = ROLE_LABELS_EN[role] || "Student";
=======
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login");
      return;
    }
    if (!firebaseUser.emailVerified) {
      router.replace("/verify-email");
      return;
    }

    let cancelled = false;
    toAuthUser(firebaseUser).then((mapped) => {
      if (!cancelled) setUser(mapped);
    });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser, loading, router]);

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    router.push("/login");
  }

  if (!user) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "var(--color-bg-page)", color: "var(--color-text-muted)" }}
      >
        กำลังโหลด…
      </div>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";
>>>>>>> af73d6d8406ee3d2b1c2683df1df7e52ac5bc934

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-8 sm:px-8">

<<<<<<< HEAD
      {/* ---- Hero Section: ทักทาย + แสดง Role ---- */}
      <section className="mb-8 p-6 rounded-lg border" style={{ background: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`role-badge role-badge--${role}`}>
                {roleThai} ({roleEnglish})
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
              {role === "student" && "ค้นหาและเข้าถึงเอกสารการเรียน ข้อสอบเก่า และชีทสรุปสำหรับนักศึกษา Soft-En"}
              {role === "contributor" && "ร่วมแบ่งปันชีทสรุปและเอกสารการเรียนเพื่อช่วยเพื่อนๆ ในสาขา"}
              {role === "moderator" && "ตรวจสอบคุณภาพและความถูกต้องของเอกสารก่อนเผยแพร่สู่คลังรวม"}
              {role === "admin" && "ควบคุมดูแลระบบ จัดการสิทธิ์ผู้ใช้งาน และโครงสร้างหลักสูตรรายวิชา"}
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
=======
      {/* ============================================================
          TOPBAR — ติดบนสุด
          แสดงโลโก้, ชื่อโปรเจกต์, avatar และปุ่ม logout
          ============================================================ */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 sm:px-8"
        style={{
          background: "var(--color-bg-card)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Left: Logo + name */}
        <div className="flex items-center gap-3">
          <TULogo size="sm" variant="dark" />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Soften Material
          </span>
          {/* ป้ายบทบาทของผู้ใช้ */}
          <span
            className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "var(--color-tu-yellow-light)",
              color: "var(--color-tu-yellow-dim)",
            }}
          >
            {roleLabel(user.role)}
          </span>
        </div>

        {/* Right: Avatar + logout */}
        <div className="flex items-center gap-3">
          {/* Avatar วงกลมตัวอักษรย่อ */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold select-none"
            style={{
              background: "var(--color-tu-yellow-light)",
              color: "var(--color-tu-yellow-dim)",
              border: "1.5px solid rgba(232,169,0,0.25)",
            }}
            title={user.email}
          >
            {initial}
          </div>

          {/* ชื่อผู้ใช้ (ซ่อนบน mobile เล็ก) */}
          <span
            className="hidden sm:block text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {user.name}
          </span>

          {/* ปุ่มออกจากระบบ */}
          <button
            type="button"
            onClick={handleLogout}
            id="logout-btn"
            className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors"
            style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-tu-red)";
              e.currentTarget.style.borderColor = "var(--color-tu-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            ออกจากระบบ
          </button>
>>>>>>> af73d6d8406ee3d2b1c2683df1df7e52ac5bc934
        </div>
      </section>

      {/* ============================================================
          ROLE-SPECIFIC SECTIONS
          ============================================================ */}

      {/* 1. STUDENT VIEW */}
      {role === "student" && (
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
                    className="course-card p-4 rounded-md text-center hover:border-tu-yellow"
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

<<<<<<< HEAD
          <div className="p-4 rounded-md border" style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
              💡 คำแนะนำสำหรับนักศึกษา
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              เอกสารในระบบจะแสดงเฉพาะไฟล์ที่ผ่านการตรวจสอบ (Published) แล้วเท่านั้น หากต้องการร่วมส่งเอกสาร สามารถติดต่อ Admin เพื่อปรับสิทธิ์เป็น <strong>Contributor</strong> ได้
            </p>
          </div>
=======
          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            สวัสดี, {user.name} 👋
          </h1>

          {/* Sub */}
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ยินดีต้อนรับสู่{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>Soften Material</strong>{" "}
            — คลังเอกสารของนักศึกษา Soft-En มธ.
            คุณล็อกอินด้วย{" "}
            <span
              style={{ color: "var(--color-text-primary)", fontFamily: "monospace", fontSize: "0.875rem" }}
            >
              {user.email}
            </span>
          </p>
>>>>>>> af73d6d8406ee3d2b1c2683df1df7e52ac5bc934
        </section>
      )}

      {/* 2. CONTRIBUTOR VIEW */}
      {role === "contributor" && (
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
      {role === "moderator" && (
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
      {role === "admin" && (
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
