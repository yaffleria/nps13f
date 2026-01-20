import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // Use nodejs runtime to read fs

async function getTopBuy() {
  try {
    const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    if (!data || data.length < 2) return "TSLA"; // Fallback

    const current = data[0];
    const prev = data[1];
    const prevMap = new Map(prev.holdings.map((h: any) => [h.cusip, h]));

    let maxNetFlow = -Infinity;
    let topSymbol = "Unknown";

    current.holdings.forEach((h: any) => {
      const prevH = prevMap.get(h.cusip);
      const prevShares = prevH ? prevH.shares : 0;
      const flow = (h.shares - prevShares) * (h.value / h.shares);
      if (flow > maxNetFlow) {
        maxNetFlow = flow;
        topSymbol = h.symbol;
      }
    });
    return topSymbol;
  } catch {
    return "NPS";
  }
}

export async function GET() {
  const topPick = await getTopBuy();

  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "40px",
      }}
    >
      <div style={{ fontSize: 30, color: "#60a5fa", marginBottom: 20 }}>
        NPS 13F Tracker
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 70,
            fontWeight: 900,
            background: "linear-gradient(to right, #60a5fa, #a78bfa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          국 국민연금,
        </span>
        <span style={{ fontSize: 60, marginTop: 10 }}>
          이번 분기{" "}
          <span style={{ color: "#4ade80", fontWeight: "bold" }}>
            {topPick}
          </span>{" "}
          풀매수! 🚀
        </span>
      </div>
      <div style={{ marginTop: 40, fontSize: 24, color: "#9ca3af" }}>
        실시간 포트폴리오 변동 확인하기
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
