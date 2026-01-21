import { PortfolioQuarter, StockPosition } from "@/entities/portfolio/types";

export interface QuarterlyInsight {
  type: "top_buy" | "top_sell" | "new_entry" | "exit" | "sector" | "summary";
  text: string;
  highlight?: string;
  change?: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function formatCompactNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return formatNumber(n);
}

interface StockChange {
  symbol: string;
  securityName: string;
  sharesChange: number;
  sharesChangePercent: number;
  currentShares: number;
  previousShares: number;
}

export function generateQuarterlyInsights(
  current: PortfolioQuarter,
  previous?: PortfolioQuarter,
): QuarterlyInsight[] {
  const insights: QuarterlyInsight[] = [];

  if (!previous) {
    insights.push({
      type: "summary",
      text: `${current.year}년 ${current.quarter}분기 국민연금은 총 ${current.holdings.length}개 종목, $${formatCompactNumber(current.totalValue / 1000)} 규모의 미국 주식을 보유하고 있습니다.`,
    });
    return insights;
  }

  // 1. 총 자산 변동
  const valueChange = ((current.totalValue - previous.totalValue) / previous.totalValue) * 100;
  insights.push({
    type: "summary",
    text: `${current.year}년 ${current.quarter}분기 총 운용액은 $${formatCompactNumber(current.totalValue / 1000)}로, 전분기 대비 ${valueChange > 0 ? "+" : ""}${valueChange.toFixed(1)}% 변동했습니다.`,
    change: valueChange,
  });

  // 2. 신규 편입 종목
  const newEntries = current.holdings.filter(
    (h) => !previous.holdings.find((p) => p.cusip === h.cusip),
  );
  if (newEntries.length > 0) {
    const topNewEntries = newEntries
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((h) => h.symbol);
    insights.push({
      type: "new_entry",
      text: `신규 편입 종목: ${topNewEntries.join(", ")}${newEntries.length > 5 ? ` 외 ${newEntries.length - 5}개` : ""}`,
      highlight: topNewEntries[0],
    });
  }

  // 3. 전량 매도 종목
  const exitedStocks = previous.holdings.filter(
    (h) => !current.holdings.find((c) => c.cusip === h.cusip),
  );
  if (exitedStocks.length > 0) {
    const topExited = exitedStocks
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((h) => h.symbol);
    insights.push({
      type: "exit",
      text: `전량 매도 종목: ${topExited.join(", ")}${exitedStocks.length > 5 ? ` 외 ${exitedStocks.length - 5}개` : ""}`,
      highlight: topExited[0],
    });
  }

  // 4. 주요 매수/매도 (비중 변화 기준)
  const stockChanges: StockChange[] = [];
  current.holdings.forEach((stock) => {
    const prevStock = previous.holdings.find((p) => p.cusip === stock.cusip);
    if (prevStock) {
      const sharesChange = stock.shares - prevStock.shares;
      const sharesChangePercent =
        prevStock.shares > 0 ? (sharesChange / prevStock.shares) * 100 : 0;
      if (Math.abs(sharesChangePercent) > 5) {
        stockChanges.push({
          symbol: stock.symbol,
          securityName: stock.securityName,
          sharesChange,
          sharesChangePercent,
          currentShares: stock.shares,
          previousShares: prevStock.shares,
        });
      }
    }
  });

  // Top 3 매수
  const topBuys = stockChanges
    .filter((s) => s.sharesChange > 0)
    .sort((a, b) => b.sharesChangePercent - a.sharesChangePercent)
    .slice(0, 3);

  if (topBuys.length > 0) {
    insights.push({
      type: "top_buy",
      text: `주요 매수: ${topBuys.map((s) => `${s.symbol} (+${s.sharesChangePercent.toFixed(0)}%)`).join(", ")}`,
      highlight: topBuys[0].symbol,
      change: topBuys[0].sharesChangePercent,
    });
  }

  // Top 3 매도
  const topSells = stockChanges
    .filter((s) => s.sharesChange < 0)
    .sort((a, b) => a.sharesChangePercent - b.sharesChangePercent)
    .slice(0, 3);

  if (topSells.length > 0) {
    insights.push({
      type: "top_sell",
      text: `주요 매도: ${topSells.map((s) => `${s.symbol} (${s.sharesChangePercent.toFixed(0)}%)`).join(", ")}`,
      highlight: topSells[0].symbol,
      change: topSells[0].sharesChangePercent,
    });
  }

  // 5. 섹터 비중 분석
  const sectorMap = new Map<string, number>();
  current.holdings.forEach((h) => {
    const sector = h.sector || "Other";
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + h.value);
  });

  const topSector = Array.from(sectorMap.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topSector) {
    const sectorPercent = (topSector[1] / current.totalValue) * 100;
    insights.push({
      type: "sector",
      text: `${topSector[0]} 섹터가 ${sectorPercent.toFixed(1)}%로 가장 높은 비중을 차지합니다.`,
      highlight: topSector[0],
    });
  }

  return insights;
}

// 단일 종목 인사이트 생성
export function generateStockInsight(
  stock: StockPosition,
  previousStock: StockPosition | undefined,
  quarterLabel: string,
): string {
  if (!previousStock) {
    return `${quarterLabel}에 ${stock.securityName}(${stock.symbol})이 국민연금 포트폴리오에 신규 편입되었습니다.`;
  }

  const sharesChange = stock.shares - previousStock.shares;
  const changePercent = (sharesChange / previousStock.shares) * 100;

  if (Math.abs(changePercent) < 1) {
    return `${quarterLabel} ${stock.symbol} 보유 수량에 큰 변동이 없습니다.`;
  }

  if (sharesChange > 0) {
    return `국민연금이 ${quarterLabel}에 ${stock.symbol}을 ${changePercent.toFixed(0)}% 추가 매수했습니다.`;
  } else {
    return `국민연금이 ${quarterLabel}에 ${stock.symbol}을 ${Math.abs(changePercent).toFixed(0)}% 매도했습니다.`;
  }
}
