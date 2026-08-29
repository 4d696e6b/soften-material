"use client";

/* ============================================================
   DashboardView.tsx — หน้า Landing หลังเข้าสู่ระบบ (Phase 1)

   ประกอบด้วย:
   1. Topbar: โลโก้ + ชื่อผู้ใช้ + ปุ่มออกจากระบบ
   2. Hero section: ทักทายผู้ใช้
   3. Status cards: บอกสถานะ Phase ต่าง ๆ
   4. Coming soon: บอกว่าฟีเจอร์ถัดไปกำลังมา

   ดึงผู้ใช้จาก GET /api/auth/me
   ============================================================ */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TULogo from "@/components/ui/TULogo";
import type { AuthUser } from "@/types";

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
    status: "upcoming" as const,
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
const statusStyles: Record<"done" | "upcoming", { bg: string; text: string; dot: string; label: string }> = {
  done:     { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e", label: "เสร็จแล้ว" },
  upcoming: { bg: "#fafafa", text: "#888888", dot: "#dddddd", label: "กำลังมา" },
};

function roleLabel(role: AuthUser["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function DashboardView() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const res = await fetch("/api/auth/me");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/verify-email");
        return;
      }
      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = (await res.json()) as { user: AuthUser };
      if (!cancelled) setUser(data.user);
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
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

  return (
    /* ============================================================
       Page wrapper
       ============================================================ */
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--color-bg-page)" }}
    >

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
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10 sm:px-8">

        {/* ---- Hero: ทักทาย ---- */}
        <section className="mb-10">
          {/* Eyebrow tag */}
          <p
            className="mb-3 text-xs font-medium tracking-widest uppercase"
            style={{ color: "var(--color-tu-yellow-dim)", fontFamily: "monospace" }}
          >
            Software Engineering · Thammasat University
          </p>

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
        </section>

        {/* ---- Divider ---- */}
        <div
          className="mb-8 h-px"
          style={{ background: "var(--color-border)" }}
        />

        {/* ---- Phase Status Cards ---- */}
        <section>
          <h2
            className="mb-5 text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}
          >
            Roadmap การพัฒนา
          </h2>

          {/* Grid: 1 col mobile, 2 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PHASES.map((p) => {
              const s = statusStyles[p.status];
              return (
                <div
                  key={p.phase}
                  className="rounded-[var(--radius-md)] p-5 transition-shadow"
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* Phase label + status badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {p.phase}
                    </span>
                    {/* Status badge */}
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.text }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: s.dot }}
                      />
                      {s.label}
                    </span>
                  </div>

                  {/* Title */}
                  <p
                    className="mb-1 font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {p.title}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---- Coming soon notice ---- */}
        <div
          className="mt-8 rounded-[var(--radius-md)] px-5 py-4 flex items-start gap-3"
          style={{
            background: "var(--color-tu-yellow-light)",
            border: "1px solid rgba(232,169,0,0.2)",
          }}
        >
          {/* Info icon */}
          <svg
            className="shrink-0 mt-0.5"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-tu-yellow-dim)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm" style={{ color: "var(--color-tu-yellow-dim)" }}>
            <strong>Phase 1 Frontend เสร็จแล้ว</strong> — ฟีเจอร์คลังไฟล์และรายวิชากำลังพัฒนาใน Phase ถัดไป
            ตอนนี้หน้าคลังยังว่างอยู่ รอ backend และ Phase 2 เสร็จก่อนนะ
          </p>
        </div>

      </main>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer
        className="py-4 text-center text-xs"
        style={{
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        Soften Material · Soft-EN รุ่นที่ 13 · Thammasat University
      </footer>
    </div>
  );
}
