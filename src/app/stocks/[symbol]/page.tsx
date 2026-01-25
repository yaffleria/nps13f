import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortfolioQuarter, StockPosition } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { StockHistoryChart } from "@/widgets/charts/StockHistoryChart";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { FadeIn } from "@/shared/ui/FadeIn";
import { ShareButton } from "@/shared/ui/ShareButton";

import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Building2, BarChart3 } from "lucide-react";

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

async function getPortfolioData(): Promise<PortfolioQuarter[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

function getStockHistory(
  quarters: PortfolioQuarter[],
  symbol: string,
): { quarter: PortfolioQuarter; stock: StockPosition | undefined }[] {
  return quarters.map((q) => ({
    quarter: q,
    stock: q.holdings.find((h) => h.symbol.toUpperCase() === symbol.toUpperCase()),
  }));
}

function getStockInfo(quarters: PortfolioQuarter[], symbol: string) {
  for (const q of quarters) {
    const stock = q.holdings.find((h) => h.symbol.toUpperCase() === symbol.toUpperCase());
    if (stock) return stock;
  }
  return null;
}

export async function generateStaticParams() {
  const data = await getPortfolioData();
  const symbols = new Set<string>();

  data.forEach((q) => {
    q.holdings.forEach((h) => {
      symbols.add(h.symbol.toUpperCase());
    });
  });

  return Array.from(symbols).map((symbol) => ({ symbol }));
}

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const data = await getPortfolioData();
  const stock = getStockInfo(data, symbol);

  if (!stock) {
    return { title: "종목을 찾을 수 없습니다" };
  }

  const currentHolding = data[0].holdings.find(
    (h) => h.symbol.toUpperCase() === symbol.toUpperCase(),
  );
  const value = currentHolding ? currentHolding.value / 1000 : 0;

  return {
    title: `${stock.symbol} (${stock.securityName}) - 국민연금 보유 현황`,
    description: `국민연금(NPS)의 ${stock.securityName} (${stock.symbol}) 보유 현황입니다. 현재 보유액: $${formatCompactNumber(value)}. SEC 13F 공시 기반 분기별 매수/매도 내역과 포트폴리오 비중 변화를 확인하세요.`,
    keywords: [
      `국민연금 ${stock.symbol}`,
      `국민연금 ${stock.securityName}`,
      `NPS ${stock.symbol}`,
      `${stock.symbol} 국민연금 보유`,
      `${stock.securityName} 연기금`,
      "국민연금 미국주식",
      "국민연금 13F",
      stock.sector,
    ],
    openGraph: {
      title: `${stock.symbol} - 국민연금 보유 현황`,
      description: `국민연금의 ${stock.securityName} 보유 현황. 분기별 매수/매도 내역 확인.`,
      type: "article",
      locale: "ko_KR",
    },
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const data = await getPortfolioData();
  const stockInfo = getStockInfo(data, symbol);

  if (!stockInfo) {
    notFound();
  }

  const history = getStockHistory(data, symbol);
  const currentQuarter = data[0];
  const currentStock = currentQuarter.holdings.find(
    (h) => h.symbol.toUpperCase() === symbol.toUpperCase(),
  );
  const previousQuarter = data[1];
  const previousStock = previousQuarter?.holdings.find(
    (h) => h.symbol.toUpperCase() === symbol.toUpperCase(),
  );

  // 현재 보유 정보 계산
  const actualValue = currentStock ? currentStock.value / 1000 : 0;
  const shares = currentStock?.shares || 0;
  const reportedPrice = shares > 0 ? actualValue / shares : 0;
  const portfolioPercent = currentStock
    ? (currentStock.value / currentQuarter.totalValue) * 100
    : 0;

  // 변동 계산
  const prevShares = previousStock?.shares || 0;
  const sharesChange = shares - prevShares;
  const sharesChangePercent = prevShares > 0 ? ((shares - prevShares) / prevShares) * 100 : 0;

  // 히스토리에서 보유 분기 수
  const quartersHeld = history.filter((h) => h.stock).length;

  // 히스토리 통계
  const historyStats = history.reduce(
    (acc, h, i) => {
      if (!h.stock) return acc;
      const prevEntry = history[i + 1];
      const prevStock = prevEntry?.stock;

      if (!prevStock && h.stock) {
        acc.newEntries++;
      } else if (prevStock && h.stock && h.stock.shares > prevStock.shares) {
        acc.buyCount++;
      } else if (prevStock && h.stock && h.stock.shares < prevStock.shares) {
        acc.sellCount++;
      }
      return acc;
    },
    { buyCount: 0, sellCount: 0, newEntries: 0 },
  );

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${stockInfo.symbol} (${stockInfo.securityName}) - 국민연금 보유 현황`,
    description: `국민연금의 ${stockInfo.securityName} 투자 현황 분석`,
    author: {
      "@type": "Organization",
      name: "NPS 13F 트래커",
    },
    publisher: {
      "@type": "Organization",
      name: "NPS 13F",
    },
    dateModified: currentQuarter.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nps13f.com/stocks/${stockInfo.symbol}`,
    },
  };

  // BreadcrumbList JSON-LD
  const sectorSlug = stockInfo.sector ? stockInfo.sector.toLowerCase().replace(/ /g, "-") : "other";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://www.nps13f.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: stockInfo.sector || "Other",
        item: `https://www.nps13f.com/sectors/${sectorSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: stockInfo.symbol,
        item: `https://www.nps13f.com/stocks/${stockInfo.symbol}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-background text-foreground font-sans">
        <GlobalHeader />

        <main className="container mx-auto px-4 py-8">
          <FadeIn>
            {/* 뒤로가기 */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>전체 포트폴리오로 돌아가기</span>
            </Link>

            {/* 헤더 */}
            <header className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-4xl font-bold text-primary">
                      {stockInfo.symbol}
                    </h1>
                    <span className="px-3 py-1 bg-surface border border-border rounded-lg text-sm text-secondary">
                      {stockInfo.sector}
                    </span>
                    {!currentStock && (
                      <span className="px-3 py-1 bg-negative/20 text-negative rounded-lg text-sm font-medium">
                        현재 미보유
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-foreground font-medium">{stockInfo.securityName}</p>
                </div>
                <ShareButton
                  title={`${stockInfo.symbol} (${stockInfo.securityName}) - 국민연금 보유 현황`}
                  text={`국민연금의 ${stockInfo.securityName} 투자 현황을 확인해보세요.`}
                  label="이 종목 공유하기"
                />
              </div>
            </header>

            {/* 요약 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  현재 보유액
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${formatCompactNumber(actualValue)}
                </p>
                <p className="text-sm text-secondary">
                  포트폴리오 비중 {portfolioPercent.toFixed(2)}%
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">보유 수량</div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {formatNumber(shares)}주
                </p>
                {sharesChange !== 0 && (
                  <p
                    className={`text-sm flex items-center gap-1 ${sharesChange > 0 ? "text-success" : "text-negative"}`}
                  >
                    {sharesChange > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {sharesChange > 0 ? "+" : ""}
                    {formatNumber(sharesChange)}주 ({sharesChangePercent > 0 ? "+" : ""}
                    {sharesChangePercent.toFixed(1)}%)
                  </p>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">공시 가격</div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${formatNumber(reportedPrice)}
                </p>
                <p className="text-sm text-secondary">분기말 기준</p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  보유 이력
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{quartersHeld}분기</p>
                <p className="text-sm text-secondary">
                  매수 {historyStats.buyCount}회 / 매도 {historyStats.sellCount}회
                </p>
              </div>
            </div>

            {/* 차트 섹션 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                분기별 보유 현황
              </h2>
              <div className="p-6 bg-surface rounded-xl border border-border">
                <StockHistoryChart
                  symbol={stockInfo.symbol}
                  securityName={stockInfo.securityName}
                  quarters={data}
                />
              </div>
            </section>

            {/* 히스토리 테이블 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">분기별 상세 내역</h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-background/80 text-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">분기</th>
                      <th className="px-4 py-3 text-right font-medium">보유 수량</th>
                      <th className="px-4 py-3 text-right font-medium">변동</th>
                      <th className="px-4 py-3 text-right font-medium">평가액</th>
                      <th className="px-4 py-3 text-right font-medium">비중</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.slice(0, 10).map((h, i) => {
                      const prevEntry = history[i + 1];
                      const prevShares = prevEntry?.stock?.shares || 0;
                      const currentShares = h.stock?.shares || 0;
                      const change = h.stock
                        ? prevEntry?.stock
                          ? currentShares - prevShares
                          : currentShares
                        : 0;
                      const value = h.stock ? h.stock.value / 1000 : 0;
                      const percent = h.stock ? (h.stock.value / h.quarter.totalValue) * 100 : 0;

                      const isNew = h.stock && !prevEntry?.stock;
                      const isExit = !h.stock && prevEntry?.stock;

                      return (
                        <tr
                          key={`${h.quarter.year}-${h.quarter.quarter}`}
                          className="hover:bg-background/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">
                            {h.quarter.year}년 Q{h.quarter.quarter}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {h.stock ? (
                              <>
                                {formatNumber(h.stock.shares)}
                                {isNew && (
                                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-success/20 text-success rounded">
                                    신규
                                  </span>
                                )}
                              </>
                            ) : isExit ? (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-negative/20 text-negative rounded">
                                전량매도
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${
                              change > 0
                                ? "text-success"
                                : change < 0
                                  ? "text-negative"
                                  : "text-secondary"
                            }`}
                          >
                            {change !== 0 && (
                              <>
                                {change > 0 ? "+" : ""}
                                {formatNumber(change)}
                              </>
                            )}
                            {change === 0 && h.stock && !isNew && "-"}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {h.stock ? `$${formatCompactNumber(value)}` : "-"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {h.stock ? `${percent.toFixed(2)}%` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </FadeIn>
        </main>

        <GlobalFooter />
      </div>
    </>
  );
}
