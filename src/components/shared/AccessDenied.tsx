"use client";

/* ============================================================
   AccessDenied.tsx — แสดงเมื่อผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้
   ============================================================ */

import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="access-denied">
      {/* Shield icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full mb-4"
        style={{
          background: "var(--color-error-bg)",
          border: "1.5px solid var(--color-error-border)",
        }}
      >
        <svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-error)"
          strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      </div>

      <h2
        className="text-lg font-bold mb-1"
        style={{ color: "var(--color-text-primary)" }}
      >
        ไม่มีสิทธิ์เข้าถึง
      </h2>
      <p
        className="text-sm mb-5 max-w-xs"
        style={{ color: "var(--color-text-secondary)" }}
      >
        คุณไม่มีสิทธิ์เข้าถึงหน้านี้ หน้านี้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น
      </p>

      <Link
        href="/dashboard"
        className="btn-secondary"
      >
        ← กลับหน้าหลัก
      </Link>
    </div>
  );
}
