import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { MascotGuide } from "@/components/mascot-guide";
import { NavigationLoading } from "@/components/navigation-loading";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PwaRegister } from "@/components/pwa-register";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "けんゆーの熱帯果樹メディア",
    template: "%s | けんゆーの熱帯果樹メディア"
  },
  description: "熱帯果樹のニュース、栽培方法、研究解説と品種図鑑を届ける専門メディア",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "けんゆーの熱帯果樹メディア",
    title: "けんゆーの熱帯果樹メディア",
    description: "熱帯果樹のニュース、栽培方法、研究解説と品種図鑑を届ける専門メディア"
  },
  twitter: {
    card: "summary_large_image",
    title: "けんゆーの熱帯果樹メディア",
    description: "熱帯果樹のニュース、栽培方法、研究解説と品種図鑑を届ける専門メディア"
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

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9550629898092318";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Script async strategy="beforeInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" />
        <PwaRegister />
        <PageViewTracker />
        <Suspense fallback={null}>
          <NavigationLoading />
        </Suspense>
        <SiteHeader />
        <main className="safe-bottom mx-auto min-h-screen w-full max-w-5xl px-4 pb-24 sm:px-6">
          {children}
        </main>
        <SiteFooter />
        <MascotGuide />
        <BottomNav />
      </body>
    </html>
  );
}
