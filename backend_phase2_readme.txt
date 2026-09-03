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
     - Logout → เคลียร์ session
     - AuthContext (React Context) เก็บ user state
     - ไฟล์: src/context/AuthContext.tsx

1.2  Sidebar + Topbar (AppShell)
     - แสดงเมนูตาม role ของ user
     - Student/Contributor: ไม่เห็นเมนู Admin
     - Moderator/Admin: เห็นเมนู Admin ทั้งหมด
     - ไฟล์: src/components/shared/AppShell.tsx

1.3  หน้าหลักแยกตาม Role (/dashboard)
     - Student: รายวิชาตามชั้นปี, คำแนะนำนักศึกษา
     - Contributor: สถิติการส่งไฟล์, ขั้นตอนการอัปโหลด Draft
     - Moderator: คิวรอตรวจ, กฎการอนุมัติเอกสาร
     - Admin: สถิติระบบ, ทางลัดจัดการผู้ใช้และรายวิชา
     - ไฟล์: src/features/dashboard/DashboardView.tsx

1.4  หน้ารายวิชา (/courses)
     - แสดงรายวิชา 12 วิชา (mock data)
     - ค้นหาตามรหัส/ชื่อ
     - กรองตามปี (1-4)
     - ไฟล์: src/features/courses/CourseGrid.tsx

1.5  หน้ารายละเอียดวิชา (/courses/[id])
     - แสดงข้อมูลรายวิชา
     - Placeholder สำหรับไฟล์ PDF (Phase 3)
     - ไฟล์: src/features/courses/CourseDetail.tsx

1.6  หน้าโปรไฟล์ (/profile)
     - แสดง: ชื่อ, อีเมล, role, สถานะยืนยันอีเมล, วันสมัคร
     - ไฟล์: src/features/profile/ProfileView.tsx

1.7  Admin Dashboard (/admin)
     - สถิติ: จำนวนผู้ใช้, จำนวนวิชา, รอยืนยัน
     - Route protection: Student/Contributor ถูกบล็อก
     - ไฟล์: src/features/admin/AdminDashboard.tsx

1.8  จัดการผู้ใช้ (/admin/users)
     - ตาราง mock users + dropdown เปลี่ยน role
     - ค้นหาตามชื่อ/อีเมล
     - ไฟล์: src/features/admin/UserManagement.tsx

1.9  จัดการรายวิชา (/admin/courses)
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
 4. Firestore Data Model
============================================================

4.1  Collection: users
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

4.2  Collection: courses
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


============================================================
 5. API Routes ที่ต้องสร้าง (Next.js Route Handlers)
============================================================

ทุก API ใช้ Firebase Admin SDK verify token ก่อนทำงาน

5.1  POST /api/auth/register
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


5.2  POST /api/auth/session
─────────────────────────────
หน้าที่: สร้าง session cookie จาก Firebase ID Token
Body:   { idToken }
Logic:
  1. adminAuth.verifyIdToken(idToken)
  2. ตรวจ email domain (อีกครั้งที่ server)
  3. ดึง user data จาก Firestore
  4. ตั้ง httpOnly cookie ที่มี user info
  5. Return: { user }


5.3  POST /api/auth/logout
────────────────────────────
หน้าที่: ลบ session cookie
Logic:
  1. ลบ session cookie
  2. Return: { success: true }


5.4  GET /api/auth/me
──────────────────────
หน้าที่: ดึงข้อมูล user ปัจจุบันจาก session cookie
Logic:
  1. อ่าน session cookie
  2. Verify + ดึง user จาก Firestore
  3. Return: { user } หรือ { user: null }


5.5  GET /api/users
────────────────────
หน้าที่: ดึงรายชื่อ users ทั้งหมด (admin only)
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. Query Firestore collection "users"
  3. Return: { users: [...] }


5.6  PUT /api/users/[uid]/role
──────────────────────────────
หน้าที่: เปลี่ยน role ของ user (admin only)
Body:   { role: "student" | "contributor" | "moderator" | "admin" }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. ห้ามเปลี่ยน role ตัวเอง
  3. อัปเดต Firestore document /users/{uid}
  4. Return: { success: true }


5.7  GET /api/courses
──────────────────────
หน้าที่: ดึงรายวิชาทั้งหมด (ต้อง login)
Logic:
  1. Verify session
  2. Query Firestore collection "courses" order by code
  3. Return: { courses: [...] }


5.8  POST /api/courses
───────────────────────
หน้าที่: สร้างรายวิชาใหม่ (admin only)
Body:   { code, name, nameEn, description, year, semester, isElective }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. ตรวจว่า code ไม่ซ้ำ
  3. สร้าง document ใน Firestore
  4. Return: { course: { ... } }


5.9  PUT /api/courses/[id]
────────────────────────────
หน้าที่: แก้ไขรายวิชา (admin only)
Body:   { code, name, nameEn, description, year, semester, isElective }
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. อัปเดต Firestore document
  3. Return: { course: { ... } }


5.10 DELETE /api/courses/[id]
──────────────────────────────
หน้าที่: ลบรายวิชา (admin only)
Logic:
  1. Verify session → ตรวจว่า role == "admin"
  2. ลบ Firestore document
  3. Return: { success: true }


============================================================
 6. สรุป Mock → Firebase Mapping
============================================================

┌─────────────────────────────┬──────────────────────────────┐
│ Mock (ลบทิ้ง)               │ Firebase (แทนด้วย)           │
├─────────────────────────────┼──────────────────────────────┤
│ MOCK_ACCOUNTS               │ Firebase Auth users          │
│ (AuthContext.tsx)            │ + signInWithEmailAndPassword │
├─────────────────────────────┼──────────────────────────────┤
│ localStorage/sessionStorage │ httpOnly session cookie      │
│ ("soften_user")             │ + /api/auth/session          │
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
 7. ความปลอดภัยที่ต้องตรวจ (ตามสเปก)
============================================================

[ ] อีเมล @dome.tu.ac.th ตรวจที่ server ทุกครั้ง (ไม่เชื่อ client)
[ ] session cookie เป็น httpOnly, Secure, SameSite=Lax
[ ] ต้อง verify email ก่อนเข้าคลัง (emailVerified == true)
[ ] Rate limit ที่ login, register, reset password
[ ] Admin API routes ตรวจ role ที่ server (ไม่แค่ซ่อน UI)
[ ] ไม่เชื่อ userId จาก body — ใช้ session UID เสมอ
[ ] ความลับทั้งหมดอยู่ใน .env.local (ไม่ commit)


============================================================
  จบเอกสาร · backend_phase2_readme.txt
  Soften Material · Phase 2 Backend Guide
============================================================
