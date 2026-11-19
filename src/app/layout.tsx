import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { VisitTracker } from "@/components/home/VisitTracker";
import "./globals.css";
import "@/styles/public.css";

const bodyFont = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const displayFont = Noto_Serif_KR({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "인천 부평 장례식장 | 근로복지공단 인천병원 장례식장",
  description:
    "근로복지공단 인천병원 장례식장. 24시간 상담·고인 이송, 투명한 요금과 품격 있는 장례 서비스를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${bodyFont.variable} ${displayFont.variable} h-full`}>
      <body className="min-h-full antialiased">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
