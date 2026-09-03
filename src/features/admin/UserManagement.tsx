"use client";

/* ============================================================
   UserManagement.tsx — หน้าจัดการผู้ใช้ (Admin)
   ตาราง + dropdown เปลี่ยน role + ค้นหา
   ============================================================ */

import { useState, useMemo } from "react";
import { MOCK_USERS } from "@/lib/mock-data";
import { ROLE_LABELS_EN } from "@/types";
import type { User, UserRole } from "@/types";

const ALL_ROLES: UserRole[] = ["student", "contributor", "moderator", "admin"];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  function handleRoleChange(userId: string, newRole: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          จัดการผู้ใช้
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          ดูรายชื่อและเปลี่ยนบทบาทผู้ใช้ในระบบ ทั้งหมด {users.length} คน
        </p>
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
          placeholder="ค้นหาชื่อหรืออีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          id="user-search"
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
                <th>ผู้ใช้</th>
                <th className="hidden sm:table-cell">อีเมล</th>
                <th>บทบาท</th>
                <th className="hidden sm:table-cell">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  {/* User name + initial */}
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold select-none shrink-0"
                        style={{
                          background: "var(--color-tu-yellow-light)",
                          color: "var(--color-tu-yellow-dim)",
                          border: "1px solid rgba(232,169,0,0.2)",
                        }}
                      >
                        {user.initial}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {user.name}
                        </p>
                        {/* Show email on mobile */}
                        <p className="sm:hidden text-xs" style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email (hidden on mobile — shown inline above) */}
                  <td className="hidden sm:table-cell">
                    <span className="text-xs" style={{ fontFamily: "monospace", color: "var(--color-text-secondary)" }}>
                      {user.email}
                    </span>
                  </td>

                  {/* Role dropdown */}
                  <td>
                    <select
                      className="select-input"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      id={`role-select-${user.id}`}
                    >
                      {ALL_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS_EN[role]}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Verified status */}
                  <td className="hidden sm:table-cell">
                    {user.emailVerified ? (
                      <span className="text-xs font-medium" style={{ color: "var(--color-success)" }}>
                        ✓ ยืนยันแล้ว
                      </span>
                    ) : (
                      <span className="text-xs font-medium" style={{ color: "var(--color-warning)" }}>
                        ⏳ รอยืนยัน
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state py-8">
            <p className="text-sm">ไม่พบผู้ใช้ที่ค้นหา</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        * การเปลี่ยนบทบาทเป็น mock data เท่านั้น ยังไม่บันทึกลง database จนกว่า backend จะพร้อม
      </p>
    </div>
  );
}
