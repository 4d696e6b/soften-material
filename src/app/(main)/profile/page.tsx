/* ============================================================
   /profile — หน้าโปรไฟล์ผู้ใช้
   ============================================================ */

import type { Metadata } from "next";
import ProfileView from "@/features/profile/ProfileView";

export const metadata: Metadata = {
  title: "โปรไฟล์",
};

export default function ProfilePage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-8 sm:px-8">
      <ProfileView />
    </div>
  );
}
