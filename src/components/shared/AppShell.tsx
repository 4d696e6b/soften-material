"use client";

/* ============================================================
   AppShell.tsx — Layout หลักสำหรับหน้าหลัง Login (Phase 2)

   โครงสร้าง Desktop:
   ┌──────────────────────────────────────────────┐
   │  Topbar (logo + user avatar + logout)        │
   ├──────────┬───────────────────────────────────┤
   │ Sidebar  │          Content Area             │
   │ (nav)    │          (children)                │
   │          │                                   │
   └──────────┴───────────────────────────────────┘

   Mobile: Topbar + hamburger → sidebar drawer overlay
   ============================================================ */

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import TULogo from "@/components/ui/TULogo";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import { ROLE_LABELS_EN } from "@/types";
import type { UserRole } from "@/types";

/* ---- SVG Icons ---- */
function IconHome() {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ---- Navigation Items ---- */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "หน้าหลัก", icon: <IconHome /> },
  { href: "/courses", label: "รายวิชา", icon: <IconBook /> },
  { href: "/profile", label: "โปรไฟล์", icon: <IconUser /> },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "แดชบอร์ด Admin", icon: <IconShield />, adminOnly: true },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: <IconUsers />, adminOnly: true },
  { href: "/admin/courses", label: "จัดการรายวิชา", icon: <IconBook />, adminOnly: true },
];

/* ---- Helper: check if admin/moderator ---- */
function canAccessAdmin(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}

/* ---- Main Component ---- */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = MOCK_CURRENT_USER;

  function handleLogout() {
    /* TODO (Backend): fetch /api/auth/logout */
    router.push("/login");
  }

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname.startsWith(href)) return true;
    return false;
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-bg-page)" }}>

      {/* ============================================================
          TOPBAR
          ============================================================ */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: "var(--topbar-height)",
          background: "var(--color-bg-card)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-sm transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="เปิดเมนู"
          >
            {sidebarOpen ? <IconX /> : <IconMenu />}
          </button>

          <TULogo size="sm" variant="dark" />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Soften Material
          </span>

          {/* Role badge */}
          <span className={`role-badge role-badge--${user.role} hidden sm:inline-flex`}>
            {ROLE_LABELS_EN[user.role]}
          </span>
        </div>

        {/* Right: avatar + name + logout */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold select-none"
            style={{
              background: "var(--color-tu-yellow-light)",
              color: "var(--color-tu-yellow-dim)",
              border: "1.5px solid rgba(232,169,0,0.25)",
            }}
            title={user.email}
          >
            {user.initial}
          </div>

          <span
            className="hidden sm:block text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {user.name}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            id="logout-btn"
            className="text-sm px-3 py-1.5 rounded-sm transition-colors"
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
          BODY: Sidebar + Content
          ============================================================ */}
      <div className="flex flex-1 relative">

        {/* ---- Mobile overlay ---- */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ---- Sidebar ---- */}
        <aside
          className={`
            fixed lg:sticky top-(--topbar-height) z-20
            h-[calc(100dvh-var(--topbar-height))]
            flex flex-col
            transition-transform duration-200 ease-in-out
            lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{
            width: "var(--sidebar-width)",
            background: "var(--sidebar-bg)",
            borderRight: "1px solid var(--sidebar-border)",
          }}
        >
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {/* Main nav */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Admin section — show only for admin/moderator */}
            {canAccessAdmin(user.role) && (
              <>
                <div className="my-3 h-px" style={{ background: "var(--color-border)" }} />
                <p
                  className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Admin
                </p>
                {ADMIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Sidebar footer */}
          <div
            className="px-4 py-3 text-xs"
            style={{
              borderTop: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            Soft-EN รุ่นที่ 13 · มธ.
          </div>
        </aside>

        {/* ---- Main Content ---- */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
