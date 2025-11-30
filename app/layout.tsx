import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Playfair_Display, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-sc',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-serif-sc',
});

export const metadata: Metadata = {
  title: "明DAO - 自营交易员孵化平台",
  description: "30天筛选顶尖交易员，系统化培养，提供最高$200,000资金支持，60%-90%利润分成",
  keywords: "自营交易,交易员培训,外汇交易,加密货币,职业交易员",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body
        className={`${inter.variable} ${notoSansSC.variable} ${playfairDisplay.variable} ${notoSerifSC.variable} font-sans`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
