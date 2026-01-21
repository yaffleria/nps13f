"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

const ADSENSE_PID = "ca-pub-1359213774659354";
const DEFAULT_AD_SLOT = "9828624569"; // 국민연금 13F 광고 단위

export function AdBanner({
  slot = DEFAULT_AD_SLOT,
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // 개발 환경에서는 광고 로드 스킵
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // 이미 로드된 경우 스킵
    if (isAdLoaded.current) {
      return;
    }

    try {
      // AdSense 스크립트가 로드되었는지 확인
      if (typeof window !== "undefined" && (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle) {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // 개발 환경 플레이스홀더
  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        className={`my-4 bg-surface/50 border border-dashed border-border rounded-lg flex items-center justify-center text-muted text-sm ${className}`}
        style={{ minHeight: "90px" }}
      >
        <span>광고 영역 (개발 환경)</span>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_PID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}

// 미리 정의된 광고 위치 컴포넌트들
export function HeaderAdBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`my-4 ${className}`}>
      <AdBanner slot={DEFAULT_AD_SLOT} format="horizontal" />
    </div>
  );
}

export function InfeedAdBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`my-6 ${className}`}>
      <AdBanner slot={DEFAULT_AD_SLOT} format="fluid" />
    </div>
  );
}

export function SidebarAdBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <AdBanner slot={DEFAULT_AD_SLOT} format="vertical" />
    </div>
  );
}
