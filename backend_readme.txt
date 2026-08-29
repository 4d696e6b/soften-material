ใช้ทดสอบ login ระหว่างรอ backend:
  Email    : demo@dome.tu.ac.th
  Password : password123

================================================================================
  SOFTEN MATERIAL — BACKEND README (Phase 1)
  สำหรับทีม Backend อ่านก่อนเริ่มงาน
  เวอร์ชัน: 0.1 · 29 สิงหาคม 2026
================================================================================

สารบัญ
--------
1.  ภาพรวมสิ่งที่ Frontend ทำไปแล้ว
2.  โครงสร้างไฟล์ที่เกี่ยวข้อง
3.  API ที่ต้องสร้าง (Phase 1)
4.  Request / Response format ของแต่ละ endpoint
5.  Session & Cookie spec
6.  Security rules (ตามสเปก)
7.  วิธีเชื่อม Frontend กับ Backend ทีละจุด
8.  Mock data ที่ Frontend ใช้อยู่ตอนนี้ (ลบหลัง backend พร้อม)
9.  Environment variables ที่ต้องการ


================================================================================
1. ภาพรวมสิ่งที่ Frontend ทำไปแล้ว
================================================================================

Frontend Phase 1 มีหน้าพร้อมใช้งานดังนี้:

  Route               ไฟล์                                       สถานะ
  ──────────────────────────────────────────────────────────────────────
  /                   src/app/page.tsx                           redirect → /login
  /login              src/app/login/page.tsx                     ✅ พร้อม (mock)
  /forgot-password    src/app/forgot-password/page.tsx           ✅ พร้อม (mock)
  /verify-email       src/app/verify-email/page.tsx              ✅ skeleton พร้อม
  /dashboard          src/app/dashboard/page.tsx                 ✅ พร้อม (mock user)

Form components:
  src/features/auth/LoginForm.tsx          — ฟอร์ม login (email + password)
  src/features/auth/ForgotPasswordForm.tsx — ฟอร์มขอ reset link
  src/features/auth/ResendButton.tsx       — ปุ่มส่ง verify email ซ้ำ
  src/features/dashboard/DashboardView.tsx — หน้า landing หลัง login

สิ่งที่ Frontend ส่งมาให้ Backend:
  - email    : string (เต็ม เช่น "alex.jo@dome.tu.ac.th")
  - password : string (plain text — backend ต้อง hash เอง)

สิ่งที่ Frontend คาดหวังจาก Backend:
  - HTTP status code ที่ถูกต้อง (ดูส่วน 4)
  - Session cookie (httpOnly, Secure, SameSite)
  - JSON body ตาม spec ด้านล่าง


================================================================================
2. โครงสร้างไฟล์ที่เกี่ยวข้อง
================================================================================

soften-material/
├── src/
│   ├── app/
│   │   ├── login/page.tsx               ← หน้า login
│   │   ├── forgot-password/page.tsx     ← หน้า forgot password
│   │   ├── verify-email/page.tsx        ← หน้า verify email
│   │   └── dashboard/page.tsx           ← หน้า landing หลัง login
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx            ← ดู TODO (Backend) ในไฟล์นี้
│   │   │   ├── ForgotPasswordForm.tsx   ← ดู TODO (Backend) ในไฟล์นี้
│   │   │   └── ResendButton.tsx         ← ดู TODO (Backend) ในไฟล์นี้
│   │   └── dashboard/
│   │       └── DashboardView.tsx        ← ดู TODO (Backend) ในไฟล์นี้
│   │
│   └── (backend จะสร้าง)
│       └── app/api/auth/               ← Next.js Route Handlers ที่ต้องสร้าง
│           ├── login/route.ts
│           ├── logout/route.ts
│           ├── forgot-password/route.ts
│           ├── resend-verification/route.ts
│           └── me/route.ts


================================================================================
3. API ที่ต้องสร้าง (Phase 1)
================================================================================

  #   Method  Path                              เรียกจาก
  ─────────────────────────────────────────────────────────────────────────
  1   POST    /api/auth/login                   LoginForm.tsx
  2   POST    /api/auth/logout                  DashboardView.tsx
  3   POST    /api/auth/forgot-password         ForgotPasswordForm.tsx
  4   POST    /api/auth/resend-verification     ResendButton.tsx
  5   GET     /api/auth/me                      DashboardView.tsx (เพิ่มเอง)

  หมายเหตุ: ถ้าใช้ Firebase Auth / NextAuth / Lucia ฯลฯ
  บาง endpoint อาจไม่ต้องสร้างเอง แค่เชื่อม SDK ก็พอ
  แต่ path ที่ Frontend เรียกต้องตรงกัน


================================================================================
4. Request / Response format ของแต่ละ endpoint
================================================================================

────────────────────────────────────────
4.1  POST /api/auth/login
────────────────────────────────────────

Request Body (JSON):
  {
    "email":    "alex.jo@dome.tu.ac.th",   // string, required
    "password": "plaintextpassword"         // string, required
  }

Response:
  200 OK  → login สำเร็จ, set session cookie
  {
    "user": {
      "id":    "uuid",
      "name":  "Alex Jo",
      "email": "alex.jo@dome.tu.ac.th",
      "role":  "student"              // "student" | "contributor" | "moderator" | "admin"
    }
  }

  401 Unauthorized → email หรือ password ผิด
  {
    "error": "INVALID_CREDENTIALS",
    "message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
  }

  403 Forbidden → login ได้แต่ยังไม่ verify email
  {
    "error": "EMAIL_NOT_VERIFIED",
    "message": "กรุณายืนยันอีเมลก่อนเข้าใช้งาน"
  }
  (Frontend จะ redirect ไป /verify-email อัตโนมัติ)

  429 Too Many Requests → rate limit (ตามสเปก security ข้อ 5)
  {
    "error": "RATE_LIMITED",
    "message": "ลองใหม่ในอีก X นาที"
  }

Security:
  - ต้อง validate ว่า email ลงท้ายด้วย @dome.tu.ac.th ที่ server ด้วย
    (Frontend validate แล้ว แต่ Backend ต้อง validate ซ้ำ)
  - Hash password ด้วย bcrypt (cost ≥ 12) หรือ argon2
  - บันทึก login success/fail ใน auth log (ไม่เก็บ password)
  - Rate limit: ไม่เกิน 5 ครั้ง/นาที ต่อ IP หรือต่อ email


────────────────────────────────────────
4.2  POST /api/auth/logout
────────────────────────────────────────

Request: ไม่ต้อง body, แค่ส่ง cookie ไปด้วย (browser ทำให้อัตโนมัติ)

Response:
  200 OK → ลบ session cookie, redirect ไป /login
  { "ok": true }

  Frontend จะทำ router.push("/login") หลังได้ 200


────────────────────────────────────────
4.3  POST /api/auth/forgot-password
────────────────────────────────────────

Request Body (JSON):
  {
    "email": "alex.jo@dome.tu.ac.th"   // string, required
  }

Response:
  200 OK → ส่งอีเมลแล้ว (หรือไม่ส่งก็ได้ถ้า email ไม่มีในระบบ)
  { "ok": true }

  ⚠️ สำคัญมาก: Response ต้อง 200 เสมอไม่ว่า email จะมีในระบบหรือไม่
  เพื่อกัน User Enumeration Attack
  (Frontend แสดง "ส่งลิงก์แล้ว" ทุกกรณีอยู่แล้ว)

  429 Too Many Requests → rate limit
  { "error": "RATE_LIMITED" }

Backend ต้องทำ:
  - ตรวจว่า email อยู่ในระบบ
  - ถ้ามี: สร้าง reset token (random, cryptographically secure)
    เก็บใน DB พร้อม expiry (1 ชั่วโมง), one-time use
  - ส่งอีเมลไปที่ email นั้น พร้อม link:
    https://yourapp.com/reset-password?token=<token>
  - ถ้าไม่มี: ไม่ต้องทำอะไร แต่ response 200 เหมือนกัน


────────────────────────────────────────
4.4  POST /api/auth/resend-verification
────────────────────────────────────────

Request: ส่ง cookie (session ของคนที่ล็อกอินแต่ยังไม่ verify)

Response:
  200 OK → ส่ง verification email ซ้ำแล้ว
  { "ok": true }

  401 Unauthorized → ไม่มี session
  429 Too Many Requests → rate limit (ส่งซ้ำได้ไม่เกิน 3 ครั้ง/ชั่วโมง)

หมายเหตุ: Frontend อยู่ที่ /verify-email หน้านี้ยังเป็น skeleton
ต้องทำ:
  - ตรวจ session ว่าเป็นใคร
  - สร้าง verify token ใหม่ (invalidate อันเก่า)
  - ส่งอีเมลพร้อม link: https://yourapp.com/verify-email?token=<token>


────────────────────────────────────────
4.5  GET /api/auth/me
────────────────────────────────────────

ใช้โดย Dashboard เพื่อดึงข้อมูล user จริงแทน MOCK_USER

Request: ส่ง cookie ไปด้วย

Response:
  200 OK → มี session
  {
    "user": {
      "id":    "uuid",
      "name":  "Alex Jo",
      "email": "alex.jo@dome.tu.ac.th",
      "role":  "student"
    }
  }

  401 Unauthorized → ไม่มี session (Frontend ต้อง redirect ไป /login)
  { "error": "UNAUTHORIZED" }


================================================================================
5. Session & Cookie Spec
================================================================================

ชื่อ cookie: soften_session (หรือตามที่ทีมเลือก)

Attributes ที่ต้องตั้ง:
  HttpOnly  = true     (JavaScript ใน browser เข้าถึงไม่ได้)
  Secure    = true     (ส่งผ่าน HTTPS เท่านั้น — ตั้ง false ได้เฉพาะ localhost dev)
  SameSite  = "Lax"   (กัน CSRF เบื้องต้น)
  Path      = "/"
  MaxAge    = 86400    (24 ชั่วโมง หรือตามนโยบายทีม)

หลังเปลี่ยนรหัสผ่าน → ต้อง invalidate session เก่าทั้งหมด (ตามสเปก)


================================================================================
6. Security Rules (ตามสเปก docs/soften-material-dev-spec.th.md)
================================================================================

ต้องทำทุกข้อตั้งแต่ Phase 1:

  1. ✅ validate โดเมน @dome.tu.ac.th ที่ server (ไม่พึ่ง UI เท่านั้น)
  2. ✅ ทำ email เป็น lowercase + trim ก่อนเปรียบเทียบ
  3. ✅ บัญชีที่ยังไม่ verify email → ไม่ให้เข้า /dashboard (return 403)
  4. ✅ Cookie: httpOnly, Secure, SameSite
  5. ✅ Rate limit ที่ /api/auth/login, /forgot-password, /resend-verification
  6. ✅ ไม่เก็บ password ใน log
  7. ✅ ไม่มี secret ใน code — ใช้ environment variables

Frontend ทำแล้ว:
  - validate domain ใน UI (ก่อน submit)
  - แสดง error message เป็นภาษาไทย
  - กัน submit ซ้ำขณะ loading (disable ปุ่ม)
  - ไม่แสดง error ที่บอกว่า email มีในระบบหรือไม่


================================================================================
7. วิธีเชื่อม Frontend กับ Backend ทีละจุด
================================================================================

Step 1: เชื่อม LOGIN
  ไฟล์: src/features/auth/LoginForm.tsx
  หา: MOCK_USER และบล็อก if/else ด้านล่าง
  ลบ: const MOCK_USER = { ... } และ if (fullEmail === MOCK_USER.email...) ทั้งบล็อก
  แทนด้วย:
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fullEmail, password: values.password }),
    });
    if (res.status === 401) { setErrors({ form: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }); return; }
    if (res.status === 403) { router.push("/verify-email"); return; }
    if (!res.ok) throw new Error();
    router.push("/dashboard");

Step 2: เชื่อม LOGOUT
  ไฟล์: src/features/dashboard/DashboardView.tsx
  หา: function handleLogout()
  แทนด้วย:
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");

Step 3: เชื่อม FORGOT PASSWORD
  ไฟล์: src/features/auth/ForgotPasswordForm.tsx
  หา: // Stub: await new Promise(...)
  แทนด้วย:
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fullEmail }),
    });
    if (!res.ok) throw new Error();

Step 4: เชื่อม RESEND VERIFICATION
  ไฟล์: src/features/auth/ResendButton.tsx
  หา: // TODO (Backend): fetch(...)
  แทนด้วย:
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    if (!res.ok) alert("ส่งซ้ำไม่ได้ กรุณารอสักครู่");

Step 5: แทน MOCK_USER ด้วย /api/auth/me
  ไฟล์: src/features/dashboard/DashboardView.tsx
  ลบ: const MOCK_USER = { ... }
  เพิ่ม useEffect ดึง /api/auth/me และใส่ state แทน
  ถ้า 401 → router.push("/login")


================================================================================
8. Mock Data ที่ Frontend ใช้อยู่ตอนนี้
================================================================================

ใช้ทดสอบ login ระหว่างรอ backend:

  Email    : demo@dome.tu.ac.th
  Password : password123

อยู่ในไฟล์: src/features/auth/LoginForm.tsx บรรทัดประมาณ 56
  const MOCK_USER = { email: "demo@dome.tu.ac.th", password: "password123" };

Mock user สำหรับ dashboard อยู่ในไฟล์: src/features/dashboard/DashboardView.tsx บรรทัดประมาณ 24
  const MOCK_USER = {
    name: "Demo User",
    email: "demo@dome.tu.ac.th",
    role: "Student",
    initial: "D",
  };

ลบทิ้งทันทีที่ backend พร้อม


================================================================================
9. Environment Variables ที่ต้องการ
================================================================================

ดูตัวอย่างได้ที่ .env.example ในโปรเจกต์
ห้าม commit .env ที่มีค่าจริง (อยู่ใน .gitignore แล้ว)

ตัวแปรที่คาดว่าต้องใช้ (ปรับตาม stack ที่เลือก):

  # URL ของแอป
  NEXT_PUBLIC_APP_URL=https://your-app.com

  # Firebase (ถ้าใช้ Firebase Auth)
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  FIREBASE_ADMIN_SDK_JSON=          # server-side only, ไม่ NEXT_PUBLIC_

  # Database
  DATABASE_URL=

  # Session secret (ถ้าทำ session เอง)
  SESSION_SECRET=

  # Email service (Resend / Sendgrid / SMTP)
  EMAIL_FROM=noreply@dome.tu.ac.th
  RESEND_API_KEY=                   # หรือ service ที่เลือก

  # Object storage (Phase 3)
  STORAGE_BUCKET=
  STORAGE_ACCESS_KEY=
  STORAGE_SECRET_KEY=


================================================================================
ถามอะไรเพิ่มเติมได้ที่ทีม Frontend หรือดูสเปกเต็มได้ที่:
  docs/soften-material-dev-spec.th.md

================================================================================
