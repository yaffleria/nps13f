import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import "./globals.css";

const GA_TRACKING_ID = "G-J6B01LT9W6";

export const metadata: Metadata = {
  title: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황을 확인하세요. 분기별 매수/매도 내역, 포트폴리오 비중, 종목별 상세 정보를 제공합니다.",
  keywords: [
    "국민연금",
    "NPS",
    "13F",
    "미국주식",
    "포트폴리오",
    "SEC",
    "연기금",
    "투자",
    "주식 보유",
    "매수 매도",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
    description:
      "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황. 분기별 매수/매도 내역과 포트폴리오 분석.",
    type: "website",
    locale: "ko_KR",
    siteName: "NPS 13F",
  },
  twitter: {
    card: "summary_large_image",
    title: "NPS 13F - 국민연금 미국주식 포트폴리오",
    description: "국민연금의 미국 주식 보유 현황(13F)을 확인하세요.",
    creator: "@charlotteprism",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nps13f.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
