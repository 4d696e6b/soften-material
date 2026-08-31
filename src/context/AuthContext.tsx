"use client";

/* ============================================================
   AuthContext.tsx — จัดการสถานะ login/logout (Mock)

   Mock users:
     student@dome.tu.ac.th  → Student (นักศึกษา)
     con@dome.tu.ac.th      → Contributor (ผู้ส่งเอกสาร)
     mod@dome.tu.ac.th      → Moderator (ผู้ตรวจเนื้อหา)
     admin@dome.tu.ac.th    → Admin (ผู้ดูแลระบบ)

   ทุกคนใช้ password: password123

   เมื่อ backend Firebase พร้อม → แทนด้วย Firebase Auth
   ============================================================ */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserRole } from "@/types";

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
      initial: "ST",
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
      initial: "CB",
      emailVerified: true,
      createdAt: "2026-08-05T00:00:00Z",
    },
  },
  {
    email: "mod@dome.tu.ac.th",
    password: "password123",
    user: {
      id: "u-003",
      name: "ผู้ตรวจเนื้อหา ทดสอบ",
      email: "mod@dome.tu.ac.th",
      role: "moderator",
      initial: "MD",
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
      initial: "AD",
      emailVerified: true,
      createdAt: "2026-08-01T00:00:00Z",
    },
  },
];

/* ---- Context type ---- */
interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  loginAsRole: (role: UserRole) => { success: boolean };
  logout: () => void;
  mockAccounts: typeof MOCK_ACCOUNTS;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitialized: false,
  login: () => ({ success: false }),
  loginAsRole: () => ({ success: false }),
  logout: () => {},
  mockAccounts: MOCK_ACCOUNTS,
});

const STORAGE_KEY = "soften_user";

/* ---- Provider ---- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /* Restore from localStorage/sessionStorage on client mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      /* ignore parsing error */
    } finally {
      setIsInitialized(true);
    }
  }, []);

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    } catch {
      /* ignore storage error */
    }

    return { success: true };
  }, []);

  const loginAsRole = useCallback((role: UserRole) => {
    const account = MOCK_ACCOUNTS.find((a) => a.user.role === role);
    if (!account) return { success: false };

    setUser(account.user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    } catch {
      /* ignore storage error */
    }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore storage error */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitialized,
        login,
        loginAsRole,
        logout,
        mockAccounts: MOCK_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---- Hook ---- */
export function useAuth() {
  return useContext(AuthContext);
}

export { MOCK_ACCOUNTS };
