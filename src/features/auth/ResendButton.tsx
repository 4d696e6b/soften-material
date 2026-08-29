"use client";

/* ============================================================
   ResendButton.tsx — ปุ่ม "ส่งอีเมลยืนยันอีกครั้ง"
   ต้องเป็น Client Component เพราะมี onClick handler
   
   TODO (Backend):
   - เรียก /api/auth/resend-verification เมื่อกดปุ่ม
   - Rate-limit ที่ server ด้วย (ตามสเปก)
   ============================================================ */

export default function ResendButton() {
  function handleResend() {
    /* TODO (Backend): fetch("/api/auth/resend-verification", { method: "POST" }) */
    alert("TODO: เรียก API ส่งอีเมลยืนยันซ้ำ");
  }

  return (
    <button
      type="button"
      id="resend-email-btn"
      onClick={handleResend}
      className="text-sm transition-colors"
      style={{ color: "var(--color-text-secondary)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
    >
      ไม่ได้รับอีเมล?{" "}
      <span style={{ color: "var(--color-tu-yellow)" }}>ส่งอีกครั้ง</span>
    </button>
  );
}
