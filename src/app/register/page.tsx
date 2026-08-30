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
      subtitle="ชั่วคราว: สมัครด้วยอีเมลใดก็ได้เพื่อทดสอบยืนยันเมล"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
