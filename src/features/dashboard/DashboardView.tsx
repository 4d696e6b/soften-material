"use client";

/* ============================================================
   DashboardView.tsx — หน้า Landing หลังเข้าสู่ระบบ (Phase 2)

   ประกอบด้วย:
   1. Hero section: ทักทายผู้ใช้
   2. Quick links: ลิงก์เร็วไปหน้าสำคัญ
   3. Status cards: บอกสถานะ Phase ต่าง ๆ

   Topbar และ Sidebar ย้ายไป AppShell.tsx แล้ว
   ============================================================ */

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

/* ---- Status badge colors ---- */
const statusStyles: Record<"done" | "current" | "upcoming", { bg: string; text: string; dot: string; label: string }> = {
  done:     { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e", label: "เสร็จแล้ว" },
  current:  { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6", label: "กำลังพัฒนา" },
  upcoming: { bg: "#fafafa", text: "#888888", dot: "#dddddd", label: "กำลังมา" },
};

/* ---- Quick Links ---- */
const QUICK_LINKS = [
  {
    href: "/courses",
    label: "รายวิชาทั้งหมด",
    description: "ดูรายวิชา Soft-En ทุกปี",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "โปรไฟล์ของฉัน",
    description: "ดูข้อมูลบัญชีและบทบาท",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DashboardView() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-8 sm:px-8">

      {/* ---- Hero: ทักทาย ---- */}
      <section className="mb-8">
        <p
          className="mb-2 text-xs font-medium tracking-widest uppercase"
          style={{ color: "var(--color-tu-yellow-dim)", fontFamily: "monospace" }}
        >
          Software Engineering · Thammasat University
        </p>

        <h1
          className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          สวัสดี, {user.name} 👋
        </h1>

        <p
          className="text-sm leading-relaxed max-w-xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          ยินดีต้อนรับสู่{" "}
          <strong style={{ color: "var(--color-text-primary)" }}>Soften Material</strong>{" "}
          — คลังเอกสารของนักศึกษา Soft-En มธ.
          คุณล็อกอินด้วย{" "}
          <span
            style={{ color: "var(--color-text-primary)", fontFamily: "monospace", fontSize: "0.8125rem" }}
          >
            {user.email}
          </span>
        </p>
      </section>

      {/* ---- Quick Links ---- */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="course-card flex items-start gap-3"
            >
              <div
                className="shrink-0 mt-0.5"
                style={{ color: "var(--color-tu-yellow)" }}
              >
                {link.icon}
              </div>
              <div>
                <p
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {link.label}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Divider ---- */}
      <div className="mb-6 h-px" style={{ background: "var(--color-border)" }} />

      {/* ---- Phase Status Cards ---- */}
      <section>
        <h2
          className="mb-4 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}
        >
          Roadmap การพัฒนา
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* ---- Phase 2 notice ---- */}
      <div
        className="mt-6 rounded-md px-4 py-3 flex items-start gap-3"
        style={{
          background: "var(--color-info-bg)",
          border: "1px solid var(--color-info-border)",
        }}
      >
        <svg
          className="shrink-0 mt-0.5"
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-info)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm" style={{ color: "var(--color-info)" }}>
          <strong>Phase 2 กำลังพัฒนา</strong> — ระบบรายวิชาและบทบาทพร้อมแล้ว
          คลังไฟล์ PDF จะเปิดให้ใช้งานใน Phase 3
        </p>
      </div>
    </div>
  );
}
