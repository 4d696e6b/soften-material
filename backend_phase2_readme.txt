============================================================
 BACKEND PHASE 2 README — Soften Material
 Firebase Integration Guide
============================================================

เอกสารนี้อธิบายว่า Phase 2 Frontend ทำอะไรไปบ้าง
ฟังก์ชันไหนเป็น mock ที่ต้องเชื่อม Firebase
และวิธี integrate ทีละจุด

อ้างอิง: docs/soften-material-dev-spec.th.md (เฟส 2)

============================================================
 1. สิ่งที่ Phase 2 Frontend มีแล้ว
============================================================

1.1  ระบบ Authentication (Mock)
     - Login 4 accounts: student, contributor, moderator, admin
     - Logout → เคลียร์ sessionStorage
     - AuthContext (React Context) เก็บ user state
     - ไฟล์: src/context/AuthContext.tsx

1.2  Sidebar + Topbar (AppShell)
     - แสดงเมนูตาม role ของ user
     - Student/Contributor: ไม่เห็นเมนู Admin
     - Moderator/Admin: เห็นเมนู Admin ทั้งหมด
     - ไฟล์: src/components/shared/AppShell.tsx

1.3  หน้ารายวิชา (/courses)
     - แสดงรายวิชา 12 วิชา (mock data)
     - ค้นหาตามรหัส/ชื่อ
     - กรองตามปี (1-4)
     - ไฟล์: src/features/courses/CourseGrid.tsx

1.4  หน้ารายละเอียดวิชา (/courses/[id])
     - แสดงข้อมูลรายวิชา
     - Placeholder สำหรับไฟล์ PDF (Phase 3)
     - ไฟล์: src/features/courses/CourseDetail.tsx

1.5  หน้าโปรไฟล์ (/profile)
     - แสดง: ชื่อ, อีเมล, role, สถานะยืนยันอีเมล, วันสมัคร
     - ไฟล์: src/features/profile/ProfileView.tsx

1.6  Admin Dashboard (/admin)
     - สถิติ: จำนวนผู้ใช้, จำนวนวิชา, รอยืนยัน
     - Route protection: Student/Contributor ถูกบล็อก
     - ไฟล์: src/features/admin/AdminDashboard.tsx

1.7  จัดการผู้ใช้ (/admin/users)
     - ตาราง mock users + dropdown เปลี่ยน role
     - ค้นหาตามชื่อ/อีเมล
     - ไฟล์: src/features/admin/UserManagement.tsx

1.8  จัดการรายวิชา (/admin/courses)
     - ตาราง + ปุ่มแก้ไข/ลบ
     - Modal สร้าง/แก้ไขรายวิชา
     - CRUD ทำงานกับ React state (ไม่ persist)
     - ไฟล์: src/features/admin/CourseManagement.tsx


============================================================
 2. Firebase Services ที่ต้องใช้
============================================================

Phase 2 ต้องการ Firebase 3 ตัว:

┌─────────────────────┬────────────────────────────────────┐
│ Service             │ ใช้ทำอะไร                          │
├─────────────────────┼────────────────────────────────────┤
│ Firebase Auth       │ Login/Register/Logout/Reset Pass   │
│ Cloud Firestore     │ เก็บ users, courses, roles         │
│ Firebase Admin SDK  │ Server-side: verify token, set     │
│ (Node.js)           │ custom claims (role), manage users │
└─────────────────────┴────────────────────────────────────┘

Phase 3 จะเพิ่ม:
  - Firebase Storage (เก็บไฟล์ PDF)
  - Cloud Functions (signed URL, file processing)


============================================================
 3. Firebase Setup
============================================================

3.1  สร้าง Firebase Project
     - ไปที่ console.firebase.google.com
     - สร้าง project ชื่อ "soften-material" หรือคล้ายกัน
     - เปิด Authentication → Sign-in method → Email/Password
     - เปิด Firestore Database (production mode)

3.2  ติดตั้ง Dependencies

     npm install firebase firebase-admin

3.3  ไฟล์ .env.local (ห้าม commit!)

     # Firebase Client SDK (ใช้ใน browser)
     NEXT_PUBLIC_FIREBASE_API_KEY=xxx
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=soften-material
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=soften-material.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
     NEXT_PUBLIC_FIREBASE_APP_ID=xxx

     # Firebase Admin SDK (ใช้ใน server เท่านั้น)
     FIREBASE_ADMIN_PROJECT_ID=soften-material
     FIREBASE_ADMIN_CLIENT_EMAIL=xxx@soften-material.iam.gserviceaccount.com
     FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n"

3.4  สร้างไฟล์ Firebase Config

     src/lib/firebase.ts          ← Client SDK (browser)
     src/lib/firebase-admin.ts    ← Admin SDK (server only)


============================================================
 4. ไฟล์ที่ต้องสร้างใหม่
============================================================

4.1  src/lib/firebase.ts — Firebase Client SDK Init
─────────────────────────────────────────────────────
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);


4.2  src/lib/firebase-admin.ts — Firebase Admin SDK Init
─────────────────────────────────────────────────────────
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();


============================================================
 5. Firestore Data Model
============================================================

5.1  Collection: users
─────────────────────
{
  uid: string,              // Firebase Auth UID
  email: string,            // เช่น "student@dome.tu.ac.th"
  name: string,             // ชื่อผู้ใช้
  role: "student" | "contributor" | "moderator" | "admin",
  emailVerified: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

- Document ID = Firebase Auth UID
- สร้างอัตโนมัติตอน register
- role เริ่มต้น = "student" (ตามสเปก เฟส 2)
- Admin เปลี่ยน role ได้ผ่าน API

5.2  Collection: courses
────────────────────────
{
  code: string,             // เช่น "SF331" (unique)
  name: string,             // ชื่อวิชาภาษาไทย
  nameEn: string | null,    // ชื่อวิชาภาษาอังกฤษ
  description: string,
  year: 1 | 2 | 3 | 4,
  semester: 1 | 2 | null,
  isElective: boolean,
  fileCount: number,        // อัปเดตเมื่อไฟล์ถูก published (Phase 3)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string         // UID ของ admin ที่สร้าง
}

- Document ID = auto-generated
- เฉพาะ admin สร้าง/แก้ไข/ลบได้

5.3  Firestore Security Rules
──────────────────────────────
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ผู้ใช้: อ่านตัวเองได้, admin อ่านทุกคน
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"
      );
      allow write: if false; // เขียนผ่าน Admin SDK เท่านั้น
    }

    // รายวิชา: ทุกคนที่ login อ่านได้, admin เขียนได้
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}


============================================================
 6. API Routes ที่ต้องสร้าง (Next.js Route Handlers)
============================================================

ทุก API ใช้ Firebase Admin SDK verify token ก่อนทำงาน

6.1  POST /api/auth/register
─────────────────────────────
หน้าที่: สมัครบัญชีใหม่
Body:   { email, password, name }
Logic:
  1. ตรวจว่า email ลงท้ายด้วย @dome.tu.ac.th (server-side!)
  2. สร้าง user ใน Firebase Auth
  3. สร้าง document ใน Firestore collection "users"
     - role: "student" (ค่าเริ่มต้น)
     - emailVerified: false
  4. ส่ง verification email
  5. Return: { success: true, uid }

Mock ที่ต้องลบ: ไม่มี (ยังไม่มีหน้า register จริง)


6.2  POST /api/auth/login
──────────────────────────
หน้าที่: เข้าสู่ระบบ

** สำคัญ: Firebase Auth จัดการ login ฝั่ง client ด้วย
   signInWithEmailAndPassword() แล้วส่ง ID token มา verify
   ฝั่ง server **

Client-side flow (แก้ LoginForm.tsx):
  1. เรียก signInWithEmailAndPassword(auth, email, password)
  2. ได้ ID token → ส่ง POST /api/auth/session
  3. Server verify token + ตรวจ emailVerified + ดึง role จาก Firestore
  4. สร้าง session cookie (httpOnly, Secure)
  5. Return: { user: { ... } }

Mock ที่ต้องลบ: src/context/AuthContext.tsx → ลบ MOCK_ACCOUNTS
                  แก้ login() ให้ใช้ Firebase Auth แทน


6.3  POST /api/auth/session
─────────────────────────────
หน้าที่: สร้าง session cookie จาก Firebase ID Token
Body:   { idToken }
Logic:
  1. adminAuth.verifyIdToken(idToken)
  2. ตรวจ email domain (อีกครั้งที่ server)
  3. ดึง user data จาก Firestore
  4. ตั้ง httpOnly cookie ที่มี user info
  5. Return: { user }

Mock ที่ต้องลบ: sessionStorage ใน AuthContext.tsx


6.4  POST /api/auth/logout
────────────────────────────
หน้าที่: ลบ session
Logic:
  1. ลบ session cookie
  2. Return: { success: true }

Mock ที่ต้องลบ: sessionStorage.removeItem("soften_user")


6.5  GET /api/auth/me
──────────────────────
หน้าที่: ดึงข้อมูล user ปัจจุบันจาก session cookie
Logic:
  1. อ่าน session cookie
  2. Verify + ดึง user จาก Firestore
  3. Return: { user } หรือ { user: null }

Mock ที่ต้องลบ: useAuth() ที่อ่านจาก sessionStorage


6.6  GET /api/users
────────────────────
หน้าที่: ดึงรายชื่อ users ทั้งหมด (admin only)
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. Query Firestore collection "users"
  3. Return: { users: [...] }

Mock ที่ต้องลบ: MOCK_USERS ใน src/lib/mock-data.ts


6.7  PUT /api/users/[uid]/role
──────────────────────────────
หน้าที่: เปลี่ยน role ของ user (admin only)
Body:   { role: "student" | "contributor" | "moderator" | "admin" }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. ห้ามเปลี่ยน role ตัวเอง (ป้องกัน lock-out)
  3. อัปเดต Firestore document /users/{uid}
  4. ตั้ง custom claim ใน Firebase Auth (optional แต่แนะนำ)
  5. Return: { success: true }

Mock ที่ต้องลบ: handleRoleChange() ใน UserManagement.tsx
                 (ตอนนี้แก้แค่ React state)


6.8  GET /api/courses
──────────────────────
หน้าที่: ดึงรายวิชาทั้งหมด (ต้อง login)
Logic:
  1. Verify session
  2. Query Firestore collection "courses" order by code
  3. Return: { courses: [...] }

Mock ที่ต้องลบ: MOCK_COURSES ใน src/lib/mock-data.ts


6.9  POST /api/courses
───────────────────────
หน้าที่: สร้างรายวิชาใหม่ (admin only)
Body:   { code, name, nameEn, description, year, semester, isElective }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. ตรวจว่า code ไม่ซ้ำ
  3. สร้าง document ใน Firestore
  4. Return: { course: { ... } }

Mock ที่ต้องลบ: handleSave() ใน CourseManagement.tsx (กรณี create)


6.10 PUT /api/courses/[id]
────────────────────────────
หน้าที่: แก้ไขรายวิชา (admin only)
Body:   { code, name, nameEn, description, year, semester, isElective }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. อัปเดต Firestore document
  3. Return: { course: { ... } }

Mock ที่ต้องลบ: handleSave() ใน CourseManagement.tsx (กรณี edit)


6.11 DELETE /api/courses/[id]
──────────────────────────────
หน้าที่: ลบรายวิชา (admin only)
Body:   ไม่มี
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. (Phase 3: ตรวจว่าไม่มีไฟล์ published ผูกอยู่)
  3. ลบ Firestore document
  4. Return: { success: true }

Mock ที่ต้องลบ: handleDelete() ใน CourseManagement.tsx


============================================================
 7. การ Migrate จาก Mock → Firebase ทีละขั้น
============================================================

ลำดับแนะนำ:

Step 1: Firebase Auth (Login/Logout)
──────────────────────────────────────
ไฟล์ที่แก้:
  - src/lib/firebase.ts          ← สร้างใหม่
  - src/lib/firebase-admin.ts    ← สร้างใหม่
  - src/context/AuthContext.tsx   ← แก้ login/logout
  - src/features/auth/LoginForm.tsx ← แก้ handleSubmit

สิ่งที่เปลี่ยน:
  - login(): แทน MOCK_ACCOUNTS ด้วย signInWithEmailAndPassword()
  - logout(): แทน sessionStorage.removeItem ด้วย signOut() + ลบ cookie
  - สร้าง /api/auth/session route
  - สร้าง /api/auth/logout route
  - AuthContext อ่าน user จาก /api/auth/me แทน sessionStorage

ทดสอบ:
  - Login ด้วย user ที่สร้างใน Firebase Auth Console
  - Logout แล้ว session cookie หายไป
  - Refresh หน้าแล้วยัง login อยู่ (cookie-based)


Step 2: Firestore Users + Roles
────────────────────────────────
ไฟล์ที่แก้:
  - src/features/admin/UserManagement.tsx  ← fetch จาก API
  - src/features/admin/AdminDashboard.tsx  ← fetch stats จาก API
  - src/features/profile/ProfileView.tsx   ← อ่านจาก AuthContext (ซึ่งอ่านจาก Firestore แล้ว)

สิ่งที่เปลี่ยน:
  - สร้าง /api/users route (GET list, PUT role)
  - UserManagement ใช้ fetch() ดึง users + ส่ง PUT เปลี่ยน role
  - ลบ MOCK_USERS ออกจาก mock-data.ts

ทดสอบ:
  - Admin เปลี่ยน role → refresh → role คงอยู่
  - Student เข้า /admin/users → ถูกบล็อก


Step 3: Firestore Courses
──────────────────────────
ไฟล์ที่แก้:
  - src/features/courses/CourseGrid.tsx      ← fetch จาก API
  - src/features/courses/CourseDetail.tsx     ← fetch จาก API
  - src/features/admin/CourseManagement.tsx   ← fetch + CRUD จาก API

สิ่งที่เปลี่ยน:
  - สร้าง /api/courses route (GET, POST, PUT, DELETE)
  - CourseGrid ใช้ fetch() + useEffect ดึงข้อมูล
  - CourseManagement ส่ง POST/PUT/DELETE จริง
  - ลบ MOCK_COURSES ออกจาก mock-data.ts

ทดสอบ:
  - Admin สร้างวิชาใหม่ → refresh → ยังอยู่
  - Admin ลบวิชา → refresh → หายไป
  - Student เห็นรายวิชาเหมือนกัน


============================================================
 8. Middleware — Route Protection ฝั่ง Server
============================================================

ไฟล์: src/middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // หน้าที่ต้อง login
  const protectedPaths = ["/dashboard", "/courses", "/profile", "/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // หน้า login — ถ้ามี session แล้วให้ redirect ไป dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
  ],
};

** หมายเหตุ: middleware ตรวจแค่ว่ามี session cookie
   การตรวจ role (admin-only) ทำใน API route handler
   เพราะ middleware ไม่ควร query Firestore ทุก request **


============================================================
 9. สรุป Mock → Firebase Mapping
============================================================

┌─────────────────────────────┬──────────────────────────────┐
│ Mock (ลบทิ้ง)               │ Firebase (แทนด้วย)           │
├─────────────────────────────┼──────────────────────────────┤
│ MOCK_ACCOUNTS               │ Firebase Auth users          │
│ (AuthContext.tsx)            │ + signInWithEmailAndPassword │
├─────────────────────────────┼──────────────────────────────┤
│ sessionStorage              │ httpOnly session cookie      │
│ ("soften_user")             │ + /api/auth/session          │
├─────────────────────────────┼──────────────────────────────┤
│ MOCK_CURRENT_USER           │ /api/auth/me                 │
│ (mock-data.ts)              │ → Firestore /users/{uid}     │
├─────────────────────────────┼──────────────────────────────┤
│ MOCK_USERS                  │ /api/users                   │
│ (mock-data.ts)              │ → Firestore /users           │
├─────────────────────────────┼──────────────────────────────┤
│ MOCK_COURSES                │ /api/courses                 │
│ (mock-data.ts)              │ → Firestore /courses         │
├─────────────────────────────┼──────────────────────────────┤
│ handleRoleChange() ใน state │ PUT /api/users/[uid]/role    │
│                             │ → Firestore update           │
├─────────────────────────────┼──────────────────────────────┤
│ CRUD courses ใน state       │ POST/PUT/DELETE /api/courses │
│                             │ → Firestore CRUD             │
└─────────────────────────────┴──────────────────────────────┘


============================================================
 10. ตัวแปร Environment (.env.local)
============================================================

คัดลอกไป .env.example (ไม่ใส่ค่าจริง):

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (Server Only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=


============================================================
 11. กฎความปลอดภัยที่ต้องทำ (ตามสเปก)
============================================================

[ ] อีเมล @dome.tu.ac.th ตรวจที่ server ทุกครั้ง (ไม่เชื่อ client)
[ ] session cookie เป็น httpOnly, Secure, SameSite=Lax
[ ] ต้อง verify email ก่อนเข้าคลัง (emailVerified == true)
[ ] Rate limit ที่ login, register, reset password
[ ] Admin API routes ตรวจ role ที่ server (ไม่แค่ซ่อน UI)
[ ] ไม่เชื่อ userId จาก body — ใช้ session UID เสมอ
[ ] ความลับทั้งหมดอยู่ใน .env.local (ไม่ commit)
[ ] Firebase Admin Private Key ไม่ expose ให้ client


============================================================
 12. Domain Restriction ใน Firebase Auth
============================================================

Firebase Auth ไม่มี built-in domain restriction
ต้องทำเองที่ server:

วิธีที่ 1: ตรวจใน API route (แนะนำ)
  - POST /api/auth/register → ตรวจ email.endsWith("@dome.tu.ac.th")
  - POST /api/auth/session  → ตรวจซ้ำก่อนออก cookie

วิธีที่ 2: Firebase Auth Blocking Functions (Cloud Functions)
  - beforeCreate: ถ้า email ไม่ใช่ @dome.tu.ac.th → throw error
  - วิธีนี้บล็อกที่ Firebase level เลย แม้เรียก API ตรง

แนะนำ: ใช้ทั้ง 2 วิธี (defense in depth)


============================================================
 13. ไฟล์ที่จะลบได้หลัง Migrate เสร็จ
============================================================

เมื่อ Firebase ทำงานแล้ว ลบไฟล์ mock เหล่านี้:

  src/lib/mock-data.ts           ← ข้อมูล mock ทั้งหมด
  src/context/AuthContext.tsx     ← เขียนใหม่ (ใช้ Firebase Auth)

** หมายเหตุ: AuthContext.tsx ไม่ต้องลบทั้งไฟล์
   แค่ลบ MOCK_ACCOUNTS และแก้ login/logout ให้ใช้ Firebase **


============================================================
 14. ลำดับ Priority การทำ Backend
============================================================

  Priority 1 (ต้องทำก่อน):
    - Firebase project setup
    - src/lib/firebase.ts + firebase-admin.ts
    - /api/auth/session + /api/auth/logout + /api/auth/me
    - แก้ AuthContext.tsx ใช้ Firebase Auth
    - middleware.ts (route protection)

  Priority 2:
    - /api/users (GET list) + /api/users/[uid]/role (PUT)
    - แก้ UserManagement.tsx ใช้ API

  Priority 3:
    - /api/courses (GET, POST, PUT, DELETE)
    - แก้ CourseGrid, CourseDetail, CourseManagement ใช้ API

  Priority 4 (Phase 3 prep):
    - Firebase Storage setup
    - /api/files routes
    - Signed URL generation


============================================================
  จบเอกสาร · backend_phase2_readme.txt
  Soften Material · Phase 2 Backend Guide
============================================================
