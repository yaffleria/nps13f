"use client";

import { useEffect } from "react";

interface AdSenseBannerProps {
  className?: string;
  style?: React.CSSProperties;
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

export function AdSenseBanner({
  className,
  style,
  dataAdSlot = "YOUR_AD_SLOT_ID", // 사용자가 나중에 변경해야 함
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
}: AdSenseBannerProps) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    // 프로덕션 환경이고 슬롯 ID가 실제 값일 때만 광고 로드 시도
    if (!isDev && dataAdSlot !== "YOUR_AD_SLOT_ID") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [dataAdSlot, isDev]);

  if (isDev) {
    return (
      <div
        className={`bg-surface border border-border border-dashed rounded-xl flex items-center justify-center text-muted text-sm p-4 ${className}`}
        style={{ minHeight: "100px", ...style }}
      >
        Google AdSense Area (Dev Mode)
      </div>
    );
  }

  // 슬롯 ID가 설정되지 않았으면 아무것도 렌더링하지 않음 (레이아웃 깨짐 방지)
  if (dataAdSlot === "YOUR_AD_SLOT_ID") return null;

  return (
    <div
      className={`overflow-hidden rounded-xl bg-surface/50 ${className}`}
      style={{ minHeight: "100px", ...style }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1359213774659354"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
