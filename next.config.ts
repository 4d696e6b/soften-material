import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * อนุญาต 127.0.0.1 เป็น dev origin
   * Next.js 16 บล็อก cross-origin requests จาก 127.0.0.1 โดย default
   * ถ้าเบราว์เซอร์เปิดผ่าน 127.0.0.1 แทน localhost → JS chunks โหลดไม่ได้
   * → form ทำงานไม่ได้เลย (ไม่มี client-side JS)
   */
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  /*
   * reactCompiler: true — ปิดไว้ก่อน
   * React Compiler ยังเป็น experimental อาจทำให้ async form handlers
   * และ state updates ทำงานผิดปกติได้
   */
  // reactCompiler: true,
};

export default nextConfig;
