/* ============================================================
   TULogo.tsx — โลโก้ย่อ Thammasat Software Engineering
   - variant "light": แสดงบนพื้นสีเหลือง (left branding panel)
   - variant "dark": แสดงบนพื้นขาว (mobile header)
   ============================================================ */

interface TULogoProps {
  size?: "sm" | "md" | "lg";
  /** "light" = บนพื้นสีเหลือง, "dark" = บนพื้นขาว */
  variant?: "light" | "dark";
}

const sizes = {
  sm: { outer: "w-8 h-8",   text: "text-xs" },
  md: { outer: "w-10 h-10", text: "text-xs" },
  lg: { outer: "w-13 h-13", text: "text-sm" },
};

export default function TULogo({ size = "md", variant = "dark" }: TULogoProps) {
  const s = sizes[size];

  /* สีตาม variant */
  const bg        = variant === "light" ? "rgba(0,0,0,0.12)" : "var(--color-bg-secondary, #f4f4f4)";
  const border    = variant === "light" ? "rgba(0,0,0,0.18)" : "var(--color-border)";
  const barLeft   = variant === "light" ? "rgba(200,16,46,0.8)" : "var(--color-tu-red)";
  const barRight  = variant === "light" ? "rgba(0,0,0,0.5)"     : "var(--color-tu-yellow)";
  const textColor = variant === "light" ? "rgba(0,0,0,0.75)"    : "var(--color-tu-yellow)";

  return (
    /* Container สี่เหลี่ยมจัตุรัส มุมมน */
    <div
      className={`${s.outer} relative flex items-center justify-center rounded-sm overflow-hidden shrink-0`}
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      {/* แถบซ้าย: สีแดง TU */}
      <div className="absolute left-0 top-0 h-full w-0.75" style={{ background: barLeft }} />
      {/* แถบขวา: สีเหลือง TU */}
      <div className="absolute right-0 top-0 h-full w-0.75" style={{ background: barRight }} />
      {/* ตัวอักษร SE ตรงกลาง */}
      <span
        className={`${s.text} font-bold tracking-tight select-none`}
        style={{ color: textColor, fontFamily: "monospace" }}
      >
        SE
      </span>
    </div>
  );
}
