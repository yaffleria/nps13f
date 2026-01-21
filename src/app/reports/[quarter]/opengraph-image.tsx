import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber } from "@/shared/lib/format";

export const runtime = "nodejs";

export const alt = "국민연금 분기별 투자 리포트";
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

function parseQuarterSlug(slug: string): { year: number; quarter: number } | null {
  const match = slug.match(/^(\d{4})-q(\d)$/);
  if (!match) return null;
  return { year: parseInt(match[1]), quarter: parseInt(match[2]) };
}

export default async function Image({ params }: { params: Promise<{ quarter: string }> }) {
  const { quarter: slug } = await params;
  const parsed = parseQuarterSlug(slug);
  const data = await getPortfolioData();

  // Font loading
  const fontData = await fetch(
    new URL(
      "https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  if (!parsed) {
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
        Quarter Not Found
      </div>,
      { ...size },
    );
  }

  const report = data.find((q) => q.year === parsed.year && q.quarter === parsed.quarter);

  if (!report) {
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
        Data Not Found
      </div>,
      { ...size },
    );
  }

  const totalValue = report.totalValue / 1000;
  const topStocks = report.holdings.slice(0, 6);

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
          NPS 국민연금 미국주식
        </div>
        <div style={{ fontSize: 72, fontWeight: "bold", letterSpacing: "-0.02em" }}>
          {parsed.year}년 {parsed.quarter}분기 투자 리포트
        </div>
        <div style={{ fontSize: 32, color: "#9CA3AF", marginTop: 5 }}>
          공시일: {new Date(report.date).toLocaleDateString("ko-KR")}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", gap: "30px", marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#1F2937",
            padding: "40px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: "#9CA3AF", marginBottom: 10 }}>총 운용 자산(AUM)</div>
          <div style={{ fontSize: 64, fontWeight: "bold", color: "#34C759" }}>
            ${formatCompactNumber(totalValue)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#1F2937",
            padding: "40px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <div style={{ fontSize: 28, color: "#9CA3AF", marginBottom: 10 }}>총 보유 종목</div>
          <div style={{ fontSize: 64, fontWeight: "bold" }}>{report.holdings.length}개</div>
        </div>
      </div>

      {/* Top Holdings Preview */}
      <div style={{ marginTop: "30px" }}>
        <div style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 15 }}>Top Holdings</div>
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
