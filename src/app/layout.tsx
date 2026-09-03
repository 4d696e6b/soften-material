import "@/styles/globals.css";
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Providers from "@/app/providers";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Soften Material — คลังเอกสาร Soft-En TU",
    template: "%s | Soften Material",
  },
  description:
    "คลังเอกสารการเรียนสำหรับนักศึกษาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยธรรมศาสตร์ เข้าถึงได้เฉพาะอีเมล @dome.tu.ac.th",
  robots: "noindex, nofollow", // ไม่ให้ Search Engine index — ตามสเปก
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col"
        style={{
          background: "var(--color-bg-page)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <Providers>
          <main className="flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
