"use client";

/* ============================================================
   AuthContext.tsx — จัดการสถานะ login/logout (Mock)

   Mock users:
     student@dome.tu.ac.th  → Student
     con@dome.tu.ac.th      → Contributor
     mod@dome.tu.ac.th      → Moderator
     admin@dome.tu.ac.th    → Admin

   ทุกคนใช้ password: password123

   ลบออกเมื่อ backend พร้อม → แทนด้วย session จริง
   ============================================================ */

import { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@/types";

/* ---- Mock users ---- */
const MOCK_ACCOUNTS: { email: string; password: string; user: User }[] = [
  {
    email: "student@dome.tu.ac.th",
    password: "password123",
    user: {
      id: "u-001",
      name: "นักศึกษา ทดสอบ",
      email: "student@dome.tu.ac.th",
      role: "student",
      initial: "น",
      emailVerified: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
  },
  {
    email: "con@dome.tu.ac.th",
    password: "password123",
    user: {
      id: "u-002",
      name: "ผู้ส่งเอกสาร ทดสอบ",
      email: "con@dome.tu.ac.th",
      role: "contributor",
      initial: "ผ",
      emailVerified: true,
      createdAt: "2026-08-05T00:00:00Z",
    },
  },
  {
    email: "mod@dome.tu.ac.th",
    password: "password123",
    user: {
      id: "u-003",
      name: "ผู้ดูแล ทดสอบ",
      email: "mod@dome.tu.ac.th",
      role: "moderator",
      initial: "ด",
      emailVerified: true,
      createdAt: "2026-08-10T00:00:00Z",
    },
  },
  {
    email: "admin@dome.tu.ac.th",
    password: "password123",
    user: {
      id: "u-004",
      name: "ผู้ดูแลระบบ ทดสอบ",
      email: "admin@dome.tu.ac.th",
      role: "admin",
      initial: "A",
      emailVerified: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
  },
];

/* ---- Context type ---- */
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => ({ success: false }),
  logout: () => {},
});

/* ---- Provider ---- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    /* Restore from sessionStorage if available */
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem("soften_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();

    /* ตรวจโดเมน */
    if (!normalized.endsWith("@dome.tu.ac.th")) {
      return { success: false, error: "อีเมลต้องลงท้ายด้วย @dome.tu.ac.th" };
    }

    /* ค้นหา mock account */
    const account = MOCK_ACCOUNTS.find(
      (a) => a.email === normalized && a.password === password
    );

    if (!account) {
      return { success: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }

    setUser(account.user);
    try {
      sessionStorage.setItem("soften_user", JSON.stringify(account.user));
    } catch { /* ignore */ }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem("soften_user");
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---- Hook ---- */
export function useAuth() {
  return useContext(AuthContext);
}

/* ---- Export mock accounts for display ---- */
export { MOCK_ACCOUNTS };
