import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: "けんゆーの熱帯果樹図鑑",
    template: "%s | けんゆーの熱帯果樹図鑑"
  },
  description: "スマホで使える熱帯果樹と品種の図鑑PWA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "熱帯果樹図鑑",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#2f855a",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PwaRegister />
        <main className="safe-bottom mx-auto min-h-screen w-full max-w-4xl px-4 pb-24 pt-5 sm:px-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
