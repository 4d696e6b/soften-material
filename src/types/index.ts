/* ============================================================
   types/index.ts — Type definitions สำหรับ Soften Material
   Phase 2: เพิ่ม User, Course, Role types
   ============================================================ */

/* ---- User & Role ---- */

export type UserRole = "student" | "contributor" | "moderator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initial: string;
  emailVerified: boolean;
  createdAt: string; // ISO date string
}

/* ---- Course ---- */

/** ปีการศึกษาของวิชา (ปี 1-4 + เลือกเสรี) */
export type CourseYear = 1 | 2 | 3 | 4;

export interface Course {
  id: string;
  code: string;       // เช่น "SF331"
  name: string;       // ชื่อวิชาภาษาไทย
  nameEn?: string;    // ชื่อวิชาภาษาอังกฤษ
  description: string;
  year: CourseYear;    // ปีที่เรียน
  semester?: 1 | 2;   // ภาคการศึกษา (optional)
  fileCount: number;   // จำนวนไฟล์ (mock = 0 ในเฟสนี้)
  isElective?: boolean; // วิชาเลือก
}

/* ---- Role display helpers ---- */

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "นักศึกษา",
  contributor: "ผู้ร่วมส่งเอกสาร",
  moderator: "ผู้ดูแลเนื้อหา",
  admin: "ผู้ดูแลระบบ",
};

export const ROLE_LABELS_EN: Record<UserRole, string> = {
  student: "Student",
  contributor: "Contributor",
  moderator: "Moderator",
  admin: "Admin",
};
