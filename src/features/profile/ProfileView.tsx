"use client";

/* ============================================================
   ProfileView.tsx — หน้าโปรไฟล์ผู้ใช้
   แสดงข้อมูลบัญชี, บทบาท, สถานะอีเมล
   ============================================================ */

import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, ROLE_LABELS_EN } from "@/types";

export default function ProfileView() {
  const { user } = useAuth();

  if (!user) return null;

  const fields = [
    { label: "ชื่อ", value: user.name },
    { label: "อีเมล", value: user.email, mono: true },
    {
      label: "บทบาท",
      value: `${ROLE_LABELS[user.role]} (${ROLE_LABELS_EN[user.role]})`,
      badge: true,
    },
    { label: "สถานะอีเมล", value: user.emailVerified ? "ยืนยันแล้ว ✓" : "ยังไม่ยืนยัน", verified: user.emailVerified },
    { label: "สมัครเมื่อ", value: new Date(user.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }) },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          โปรไฟล์ของฉัน
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          ข้อมูลบัญชีและบทบาทของคุณในระบบ
        </p>
      </div>

      {/* ---- Profile Card ---- */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header with avatar */}
        <div
          className="p-6 flex items-center gap-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Large avatar */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold select-none shrink-0"
            style={{
              background: "var(--color-tu-yellow-light)",
              color: "var(--color-tu-yellow-dim)",
              border: "2px solid rgba(232,169,0,0.25)",
            }}
          >
            {user.initial}
          </div>
          <div>
            <p className="font-semibold text-lg" style={{ color: "var(--color-text-primary)" }}>
              {user.name}
            </p>
            <span className={`role-badge role-badge--${user.role}`}>
              {ROLE_LABELS_EN[user.role]}
            </span>
          </div>
        </div>

        {/* Info rows */}
        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {fields.map((field) => (
            <div
              key={field.label}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0"
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider sm:w-40 shrink-0"
                style={{ color: "var(--color-text-muted)" }}
              >
                {field.label}
              </span>
              <span
                className="text-sm"
                style={{
                  color: field.verified === false ? "var(--color-warning)" : "var(--color-text-primary)",
                  fontFamily: field.mono ? "monospace" : "inherit",
                }}
              >
                {field.badge ? (
                  <span className={`role-badge role-badge--${user.role}`}>
                    {field.value}
                  </span>
                ) : (
                  field.value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Note ---- */}
      <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
        การเปลี่ยนบทบาทต้องติดต่อผู้ดูแลระบบ (Admin)
      </p>
    </div>
  );
}
