import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { MascotGuide } from "@/components/mascot-guide";
import { NavigationLoading } from "@/components/navigation-loading";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PwaRegister } from "@/components/pwa-register";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "けんゆーの熱帯果樹図鑑",
    template: "%s | けんゆーの熱帯果樹図鑑"
  },
  description: "スマホで使える熱帯果樹と品種の図鑑PWA",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "けんゆーの熱帯果樹図鑑",
    title: "けんゆーの熱帯果樹図鑑",
    description: "スマホで使える熱帯果樹と品種の図鑑PWA"
  },
  twitter: {
    card: "summary_large_image",
    title: "けんゆーの熱帯果樹図鑑",
    description: "スマホで使える熱帯果樹と品種の図鑑PWA"
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "熱帯果樹図鑑",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#142f27",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PwaRegister />
        <PageViewTracker />
        <Suspense fallback={null}>
          <NavigationLoading />
        </Suspense>
        <SiteHeader />
        <main className="safe-bottom mx-auto min-h-screen w-full max-w-5xl px-4 pb-24 sm:px-6">
          {children}
        </main>
        <MascotGuide />
        <BottomNav />
      </body>
    </html>
  );
}
