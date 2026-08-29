import type { Metadata } from "next";
import AuthLayout from "@/components/shared/AuthLayout";
import RegisterForm from "@/features/auth/RegisterForm";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
  description: "สมัคร Soften Material ด้วยอีเมล @dome.tu.ac.th",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="สมัครสมาชิก"
      subtitle="ใช้ได้เฉพาะอีเมล @dome.tu.ac.th และต้องยืนยันอีเมลก่อนเข้าคลัง"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
