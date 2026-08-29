"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthActionRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode") ?? "";
    const query = oobCode ? `?oobCode=${encodeURIComponent(oobCode)}` : "";

    if (mode === "resetPassword") {
      router.replace(`/reset-password${query}`);
      return;
    }
    if (mode === "verifyEmail") {
      router.replace(`/verify-email${query}`);
      return;
    }
    router.replace("/login");
  }, [router, searchParams]);

  return (
    <p className="min-h-dvh flex items-center justify-center text-sm" style={{ color: "var(--color-text-muted)" }}>
      กำลังเปิดลิงก์…
    </p>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={null}>
      <AuthActionRedirect />
    </Suspense>
  );
}
