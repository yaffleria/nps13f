import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import { KakaoScript } from "@/shared/ui/KakaoScript";
import "./globals.css";

const GA_TRACKING_ID = "G-J6B01LT9W6";
const ADSENSE_PID = "ca-pub-1359213774659354";
const BASE_URL = "https://nps13f.com";

// Viewport 설정 분리 (Next.js 14+ 권장사항)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  // 기본 메타데이터
  metadataBase: new URL(BASE_URL),
  title: {
    default: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
    template: "%s | NPS 13F",
  },
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황을 확인하세요. 분기별 매수/매도 내역, 포트폴리오 비중, 종목별 상세 정보를 제공합니다. Apple, Microsoft, NVIDIA 등 주요 종목 투자 현황 분석.",
  keywords: [
    // 핵심 키워드
    "국민연금",
    "NPS",
    "13F",
    "국민연금 13F",
    "국민연금 미국주식",
    "국민연금 포트폴리오",
    // 관련 검색어
    "SEC 13F",
    "미국주식",
    "연기금 투자",
    "기관투자자",
    "국민연금 투자 종목",
    "국민연금 보유 주식",
    "국민연금 매수",
    "국민연금 매도",
    // 롱테일 키워드
    "국민연금 애플",
    "국민연금 마이크로소프트",
    "국민연금 엔비디아",
    "국민연금 테슬라",
    "국민연금 해외투자",
    "연기금 미국주식",
    "NPS 보유 종목",
    "NPS 포트폴리오",
    // 확장 키워드
    "연기금",
    "펀드",
    "기관투자",
    "국민연금 섹터",
    "국민연금 기술주",
    "국민연금 헬스케어",
    "국민연금 금융주",
    "국민연금 분기 리포트",
    "연기금 포트폴리오",
    // 영문 키워드
    "National Pension Service",
    "NPS Korea 13F",
    "Korean pension fund holdings",
    "NPS stock holdings",
  ],
  authors: [{ name: "Charlotte", url: "https://x.com/charlotteprism" }],
  creator: "Charlotte",
  publisher: "NPS 13F 트래커",
  category: "Finance",

  // 아이콘
  icons: {
    icon: [
      { url: "/nps13f-logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/nps13f-logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    apple: [{ url: "/nps13f-logo.jpg", sizes: "180x180", type: "image/jpeg" }],
  },

  // manifest
  manifest: "/manifest.json",

  // Open Graph
  openGraph: {
    title: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
    description:
      "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황. 분기별 매수/매도 내역과 포트폴리오 분석. Apple, Microsoft, NVIDIA 등 빅테크 투자 현황 확인.",
    type: "website",
    locale: "ko_KR",
    siteName: "NPS 13F",
    url: BASE_URL,
    images: [
      {
        url: "/share-banner.jpg",
        width: 1200,
        height: 630,
        alt: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NPS 13F - 국민연금 미국주식 포트폴리오",
    description:
      "국민연금의 미국 주식 보유 현황(SEC 13F)을 확인하세요. 분기별 매수/매도 내역과 포트폴리오 분석.",
    images: ["/share-banner.jpg"],
    creator: "@charlotteprism",
    site: "@charlotteprism",
  },

  // 검색엔진 설정
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 대체 URL
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ko-KR": BASE_URL,
    },
  },

  // 기타 메타
  applicationName: "NPS 13F",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // 추가 메타 정보
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        {/* 성능 최적화: DNS Prefetch & Preconnect */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />

        {/* 폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />

        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
        <KakaoScript />
        <GoogleAnalytics gaId={GA_TRACKING_ID} />
        {process.env.NODE_ENV === "production" && process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
