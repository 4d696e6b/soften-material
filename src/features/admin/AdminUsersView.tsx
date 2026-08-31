"use client";

/* ============================================================
   AdminUsersView.tsx — Wrapper สำหรับ User Management + role check
   ============================================================ */

import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import AccessDenied from "@/components/shared/AccessDenied";
import UserManagement from "./UserManagement";

export default function AdminUsersView() {
  const user = MOCK_CURRENT_USER;

  if (user.role !== "admin" && user.role !== "moderator") {
    return <AccessDenied />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-8 sm:px-8">
      <UserManagement />
    </div>
  );
}
