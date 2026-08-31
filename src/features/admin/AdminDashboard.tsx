"use client";

/* ============================================================
   AdminDashboard.tsx — แดชบอร์ดสำหรับ Admin
   แสดงภาพรวมระบบ + ลิงก์จัดการ
   ============================================================ */

import Link from "next/link";
import { MOCK_CURRENT_USER, MOCK_USERS, MOCK_COURSES } from "@/lib/mock-data";
import AccessDenied from "@/components/shared/AccessDenied";

export default function AdminDashboard() {
  const user = MOCK_CURRENT_USER;

  /* Route protection: ต้องเป็น admin เท่านั้น */
  if (user.role !== "admin" && user.role !== "moderator") {
    return <AccessDenied />;
  }

  const stats = [
    {
      label: "ผู้ใช้ทั้งหมด",
      value: MOCK_USERS.length,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      href: "/admin/users",
      color: "var(--color-info)",
    },
    {
      label: "รายวิชาทั้งหมด",
      value: MOCK_COURSES.length,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      ),
      href: "/admin/courses",
      color: "var(--color-tu-yellow-dim)",
    },
    {
      label: "รอยืนยันอีเมล",
      value: MOCK_USERS.filter((u) => !u.emailVerified).length,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      href: "/admin/users",
      color: "var(--color-warning)",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-8 sm:px-8">
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          แดชบอร์ดผู้ดูแลระบบ
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          ภาพรวมระบบ Soften Material
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="course-card flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-sm shrink-0"
              style={{
                background: `color-mix(in srgb, ${stat.color} 10%, transparent)`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div
        className="rounded-md p-5"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          การจัดการ
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/admin/users"
            className="btn-secondary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            จัดการผู้ใช้
          </Link>
          <Link
            href="/admin/courses"
            className="btn-secondary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            จัดการรายวิชา
          </Link>
        </div>
      </div>
    </div>
  );
}
