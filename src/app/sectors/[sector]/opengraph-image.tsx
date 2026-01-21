import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber } from "@/shared/lib/format";

export const runtime = "nodejs";

export const alt = "국민연금 섹터별 투자 현황";
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

function getSectorFromSlug(slug: string): string | null {
  const sectorMap: Record<string, string> = {
    technology: "Technology",
    healthcare: "Healthcare",
    "financial-services": "Financial Services",
    "consumer-cyclical": "Consumer Cyclical",
    "communication-services": "Communication Services",
    industrials: "Industrials",
    "consumer-defensive": "Consumer Defensive",
    energy: "Energy",
    utilities: "Utilities",
    "real-estate": "Real Estate",
    "basic-materials": "Basic Materials",
    other: "Other",
  };
  return sectorMap[slug] || null;
}

export default async function Image({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: slug } = await params;
  const sectorName = getSectorFromSlug(slug);
  const data = await getPortfolioData();
  const currentQuarter = data[0];

  // Font loading
  const fontData = await fetch(
    new URL(
      "https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  if (!sectorName) {
    return new ImageResponse(
      <div
        style={{
          background: "#111827",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 40,
        }}
      >
        Sector Not Found
      </div>,
      { ...size },
    );
  }

  // Calculate sector stats
  const sectorHoldings = currentQuarter.holdings
    .filter((h) => h.sector === sectorName)
    .sort((a, b) => b.value - a.value);

  const totalValue = sectorHoldings.reduce((sum, h) => sum + h.value / 1000, 0);
  const percent = (totalValue / (currentQuarter.totalValue / 1000)) * 100;
  const topStocks = sectorHoldings.slice(0, 5);

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
      <div>
        <div
          style={{
            fontSize: 24,
            color: "#3182F6",
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          NPS 국민연금 섹터 분석
        </div>
        <div style={{ fontSize: 72, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          {sectorName}
        </div>
        <div style={{ fontSize: 32, color: "#9CA3AF", marginTop: 5 }}>
          {currentQuarter.year}년 {currentQuarter.quarter}분기
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
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
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 10 }}>총 투자액</div>
          <div style={{ fontSize: 48, fontWeight: "bold", color: "#34C759" }}>
            ${formatCompactNumber(totalValue)}
          </div>
        </div>
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
          <div style={{ fontSize: 24, color: "#9CA3AF", marginBottom: 10 }}>보유 종목 수</div>
          <div style={{ fontSize: 48, fontWeight: "bold" }}>{sectorHoldings.length}개</div>
        </div>
      </div>

      {/* Top Stocks List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#1F2937",
          padding: "30px",
          borderRadius: "24px",
          marginTop: "30px",
        }}
      >
        <div style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 15 }}>주요 보유 종목</div>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {topStocks.map((stock) => (
            <div
              key={stock.symbol}
              style={{
                background: "#374151",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: 24,
                fontWeight: "bold",
                color: "#E5E7EB",
              }}
            >
              {stock.symbol}
            </div>
          ))}
          {sectorHoldings.length > 5 && (
            <div
              style={{
                padding: "10px 20px",
                fontSize: 24,
                color: "#9CA3AF",
              }}
            >
              +{sectorHoldings.length - 5} more
            </div>
          )}
        </div>
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
