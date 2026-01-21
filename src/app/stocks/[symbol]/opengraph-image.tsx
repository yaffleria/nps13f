import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";

export const runtime = "nodejs";

export const alt = "국민연금 보유 종목 분석";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function getPortfolioData(): Promise<PortfolioQuarter[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default async function Image({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const data = await getPortfolioData();
  const currentQuarter = data[0];
  const stock =
    currentQuarter.holdings.find((h) => h.symbol.toUpperCase() === symbol.toUpperCase()) ||
    data
      .find((q) => q.holdings.some((h) => h.symbol.toUpperCase() === symbol.toUpperCase()))
      ?.holdings.find((h) => h.symbol.toUpperCase() === symbol.toUpperCase());

  // Font loading
  const fontData = await fetch(
    new URL(
      "https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  if (!stock) {
    return new ImageResponse(
      <div
        style={{
          background: "#111827",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: "bold" }}>NPS 13F</div>
        <div style={{ fontSize: 40, marginTop: 20 }}>Stock Not Found</div>
      </div>,
      { ...size },
    );
  }

  const actualValue = stock.value / 1000;
  const percent = (stock.value / currentQuarter.totalValue) * 100;
  const isHeld = !!currentQuarter.holdings.find(
    (h) => h.symbol.toUpperCase() === symbol.toUpperCase(),
  );

  return new ImageResponse(
    <div
      style={{
        background: "#101014",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "60px",
        justifyContent: "space-between",
        color: "white",
        fontFamily: '"Noto Sans KR"',
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              color: "#3182F6",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            NPS 국민연금 미국주식 포트폴리오
          </div>
          <div style={{ fontSize: 80, fontWeight: "bold", letterSpacing: "-0.02em" }}>
            {symbol.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#9CA3AF",
              marginTop: 5,
              maxWidth: "800px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {stock.securityName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            background: "#1F2937",
            borderRadius: "16px",
            fontSize: 24,
            color: "#E5E7EB",
            fontWeight: "bold",
          }}
        >
          {stock.sector}
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: "flex", gap: "30px", marginTop: "40px" }}>
        {/* Value Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#1F2937",
            padding: "30px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 10 }}>보유 평가액</div>
          <div style={{ fontSize: 48, fontWeight: "bold", color: "#34C759" }}>
            ${formatCompactNumber(actualValue)}
          </div>
        </div>

        {/* Percent Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#1F2937",
            padding: "30px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 10 }}>포트폴리오 비중</div>
          <div style={{ fontSize: 48, fontWeight: "bold", color: "#3182F6" }}>
            {percent.toFixed(2)}%
          </div>
        </div>

        {/* Shares Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#1F2937",
            padding: "30px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 10 }}>보유 수량</div>
          <div style={{ fontSize: 48, fontWeight: "bold" }}>{formatNumber(stock.shares)}</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          borderTop: "1px solid #374151",
          paddingTop: "30px",
        }}
      >
        <div style={{ fontSize: 24, color: "#6B7280" }}>
          {currentQuarter.year}년 {currentQuarter.quarter}분기 공시 기준
          {!isHeld && " (현재 전량 매도됨)"}
        </div>
        <div style={{ fontSize: 24, color: "#3182F6", fontWeight: "bold" }}>nps13f.com</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans KR",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
