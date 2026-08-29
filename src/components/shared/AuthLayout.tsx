"use client";

/* ============================================================
   AuthLayout.tsx — Layout ครอบหน้า Login / Forgot / Verify
   
   โครงสร้าง (Desktop):
   ┌─────────────────────────────────────────────────┐
   │  Left panel (branding)  │  Right panel (form)   │
   │  hidden on mobile       │  full width mobile    │
   └─────────────────────────────────────────────────┘
   
   โครงสร้าง (Mobile):
   ┌─────────────────────┐
   │   Form (full width) │
   └─────────────────────┘
   ============================================================ */

import TULogo from "@/components/ui/TULogo";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (

    <div className="min-h-dvh flex">

      <div
        className="hidden lg:flex lg:w-120 xl:w-140 shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "var(--color-tu-yellow)" }}
      >
        {/* Decoration: วงกลมซ้อนกัน */}
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "#ffffff" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: "#C8102E" }}
          aria-hidden="true"
        />

        {/* Logo + ชื่อ (บนสุด) */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <TULogo size="md" variant="light" />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: "rgba(0,0,0,0.7)" }}
            >
              Soften Material
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl xl:text-5xl font-bold leading-tight mb-4"
            style={{ color: "#111111" }}
          >
            คลังเอกสาร<br />Software Engineer TU
          </h1>
          <p
            className="text-base leading-relaxed max-w-[300px]"
            style={{ color: "rgba(0,0,0,0.65)" }}
          >
            ชีทสรุป ข้อสอบเก่า แบบฝึกหัด จากพี่ๆ เพื่อนๆ Soft-EN รวมไว้ในที่เดียว
            สำหรับนักศึกษาวิศวกรรมซอฟต์แวร์ มธ. เท่านั้น
          </p>
        </div>

        {/* Footer ของ Left Panel */}
        <div className="relative z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["ชีทสรุป", "ข้อสอบเก่า", "แบบฝึกหัด"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(0,0,0,0.08)",
                  color: "rgba(0,0,0,0.65)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>
            เว็บไซต์จัดทำโดย Soft-EN รุ่นที่ 13
          </p>
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL — Form area
          - พื้นหลังขาว
          - ตรงกลางแนวตั้ง, มี max-width สำหรับ form
          ============================================================ */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-5 py-12 sm:px-8 relative"
        style={{ background: "var(--color-bg-page)" }}
      >
        {/* ---- Mobile-only Header (โลโก้ แสดงเฉพาะ < lg) ---- */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-2 text-center">
          <TULogo size="md" variant="dark" />
          <div>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}
            >
              Thammasat · Software Engineering
            </p>
            <p
              className="text-base font-semibold mt-0.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Soften Material
            </p>
          </div>
        </div>

        {/* ---- Form Card ---- */}
        <div className="w-full max-w-[440px] animate-fade-in-up">

          {/* Card */}
          <div
            className="rounded-[var(--radius-lg)] p-8 sm:p-10"
            style={{
              background: "var(--color-bg-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Header ของ Card */}
            <div className="mb-7">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form content */}
            {children}
          </div>

          {/* Footer hint */}
          <p
            className="mt-5 text-center text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Login ด้วยโดเมน {" "}
            <span style={{ color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
              @dome.tu.ac.th
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
