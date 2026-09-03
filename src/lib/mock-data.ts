/* ============================================================
   lib/mock-data.ts — Mock data กลางสำหรับ Phase 2

   ลบออกทั้งไฟล์เมื่อ backend พร้อม
   เปลี่ยน role ของ MOCK_CURRENT_USER เพื่อทดสอบ
   ============================================================ */

import type { User, Course } from "@/types";

/* ---- Current user (เปลี่ยน role ตรงนี้เพื่อทดสอบ) ---- */
export const MOCK_CURRENT_USER: User = {
  id: "u-001",
  name: "Demo User",
  email: "demo@dome.tu.ac.th",
  role: "admin",     // ← เปลี่ยนเป็น "student" | "contributor" | "moderator" | "admin" เพื่อทดสอบ
  initial: "D",
  emailVerified: true,
  createdAt: "2026-08-01T00:00:00Z",
};

/* ---- Mock users สำหรับหน้า admin ---- */
export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: "u-002",
    name: "สมชาย ใจดี",
    email: "somchai.ja@dome.tu.ac.th",
    role: "student",
    initial: "ส",
    emailVerified: true,
    createdAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "u-003",
    name: "นิดา แก้วกล้า",
    email: "nida.ka@dome.tu.ac.th",
    role: "contributor",
    initial: "น",
    emailVerified: true,
    createdAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "u-004",
    name: "อรุณ สว่างวงศ์",
    email: "arun.sa@dome.tu.ac.th",
    role: "moderator",
    initial: "อ",
    emailVerified: true,
    createdAt: "2026-08-12T00:00:00Z",
  },
  {
    id: "u-005",
    name: "ปิยะ รักเรียน",
    email: "piya.ra@dome.tu.ac.th",
    role: "student",
    initial: "ป",
    emailVerified: true,
    createdAt: "2026-08-15T00:00:00Z",
  },
  {
    id: "u-006",
    name: "จันทร์ ศรีสุข",
    email: "chan.sr@dome.tu.ac.th",
    role: "student",
    initial: "จ",
    emailVerified: false,
    createdAt: "2026-08-20T00:00:00Z",
  },
  {
    id: "u-007",
    name: "กมล ประเสริฐ",
    email: "kamol.pr@dome.tu.ac.th",
    role: "contributor",
    initial: "ก",
    emailVerified: true,
    createdAt: "2026-08-22T00:00:00Z",
  },
  {
    id: "u-008",
    name: "วิภา ชาญชัย",
    email: "wipa.ch@dome.tu.ac.th",
    role: "student",
    initial: "ว",
    emailVerified: true,
    createdAt: "2026-08-25T00:00:00Z",
  },
];

/* ---- Mock courses (ตัวอย่างวิชาจริง Soft-En TU) ---- */
export const MOCK_COURSES: Course[] = [
  {
    id: "c-001",
    code: "SF211",
    name: "โครงสร้างข้อมูลและอัลกอริทึม",
    nameEn: "Data Structures and Algorithms",
    description: "ศึกษาโครงสร้างข้อมูลพื้นฐาน เช่น array, linked list, stack, queue, tree, graph และอัลกอริทึมที่เกี่ยวข้อง",
    year: 2,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-002",
    code: "SF221",
    name: "ระบบปฏิบัติการ",
    nameEn: "Operating Systems",
    description: "หลักการทำงานของระบบปฏิบัติการ การจัดการกระบวนการ หน่วยความจำ และระบบไฟล์",
    year: 2,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-003",
    code: "SF231",
    name: "ระบบฐานข้อมูล",
    nameEn: "Database Systems",
    description: "การออกแบบฐานข้อมูลเชิงสัมพันธ์ SQL, normalization, transaction management",
    year: 2,
    semester: 2,
    fileCount: 0,
  },
  {
    id: "c-004",
    code: "SF331",
    name: "วิศวกรรมซอฟต์แวร์",
    nameEn: "Software Engineering",
    description: "กระบวนการพัฒนาซอฟต์แวร์ Agile, Scrum, การวิเคราะห์ความต้องการ, การออกแบบระบบ",
    year: 3,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-005",
    code: "SF341",
    name: "เครือข่ายคอมพิวเตอร์",
    nameEn: "Computer Networks",
    description: "หลักการสื่อสารข้อมูล โปรโตคอล TCP/IP, OSI model, network security",
    year: 3,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-006",
    code: "SF342",
    name: "การพัฒนาแอปพลิเคชันบนเว็บ",
    nameEn: "Web Application Development",
    description: "การพัฒนาเว็บแอปทั้ง frontend และ backend ด้วยเทคโนโลยีสมัยใหม่",
    year: 3,
    semester: 2,
    fileCount: 0,
  },
  {
    id: "c-007",
    code: "SF351",
    name: "ปัญญาประดิษฐ์",
    nameEn: "Artificial Intelligence",
    description: "พื้นฐาน AI, machine learning, neural networks และการประยุกต์ใช้งาน",
    year: 3,
    semester: 2,
    fileCount: 0,
  },
  {
    id: "c-008",
    code: "SF111",
    name: "พื้นฐานการเขียนโปรแกรม",
    nameEn: "Introduction to Programming",
    description: "หลักการเขียนโปรแกรมเบื้องต้น ตัวแปร ลูป เงื่อนไข ฟังก์ชัน",
    year: 1,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-009",
    code: "SF121",
    name: "การเขียนโปรแกรมเชิงวัตถุ",
    nameEn: "Object-Oriented Programming",
    description: "OOP concepts: class, inheritance, polymorphism, encapsulation ด้วยภาษา Java",
    year: 1,
    semester: 2,
    fileCount: 0,
  },
  {
    id: "c-010",
    code: "SF431",
    name: "โครงงานวิศวกรรมซอฟต์แวร์ 1",
    nameEn: "Software Engineering Project I",
    description: "โครงงานปริญญานิพนธ์ ภาค 1 — การวิเคราะห์ปัญหา ออกแบบระบบ และวางแผนโครงการ",
    year: 4,
    semester: 1,
    fileCount: 0,
  },
  {
    id: "c-011",
    code: "SF432",
    name: "โครงงานวิศวกรรมซอฟต์แวร์ 2",
    nameEn: "Software Engineering Project II",
    description: "โครงงานปริญญานิพนธ์ ภาค 2 — การพัฒนา ทดสอบ และนำเสนอผลงาน",
    year: 4,
    semester: 2,
    fileCount: 0,
  },
  {
    id: "c-012",
    code: "SF361",
    name: "การทดสอบซอฟต์แวร์",
    nameEn: "Software Testing",
    description: "เทคนิคการทดสอบซอฟต์แวร์ unit testing, integration testing, automated testing",
    year: 3,
    semester: 2,
    fileCount: 0,
    isElective: true,
  },
];

/* ---- Helper: ชื่อปีแบบไทย ---- */
export const YEAR_LABELS: Record<number, string> = {
  1: "ปี 1",
  2: "ปี 2",
  3: "ปี 3",
  4: "ปี 4",
};
