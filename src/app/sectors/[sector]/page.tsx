import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import { ShareButton } from "@/shared/ui/ShareButton";
import { AdBanner } from "@/shared/ui/AdBanner";
import { ArrowLeft, Building2, TrendingUp, TrendingDown } from "lucide-react";

interface SectorPageProps {
  params: Promise<{ sector: string }>;
}

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

export async function generateStaticParams() {
  const sectors = [
    "technology",
    "healthcare",
    "financial-services",
    "consumer-cyclical",
    "communication-services",
    "industrials",
    "consumer-defensive",
    "energy",
    "utilities",
    "real-estate",
    "basic-materials",
    "other",
  ];
  return sectors.map((sector) => ({ sector }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { sector: sectorSlug } = await params;
  const sectorName = getSectorFromSlug(sectorSlug);

  if (!sectorName) {
    return { title: "섹터를 찾을 수 없습니다" };
  }

  return {
    title: `${sectorName} 섹터 - 국민연금 미국주식 보유 현황`,
    description: `국민연금(NPS)의 ${sectorName} 섹터 미국 주식 보유 현황입니다. SEC 13F 공시 기반 분기별 종목 리스트와 비중 변화를 확인하세요.`,
    keywords: [
      `국민연금 ${sectorName}`,
      `NPS ${sectorName}`,
      `연기금 ${sectorName}`,
      "국민연금 미국주식",
      "국민연금 섹터",
    ],
    openGraph: {
      title: `${sectorName} 섹터 - 국민연금 보유 현황`,
      description: `국민연금의 ${sectorName} 섹터 투자 현황 분석.`,
    },
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { sector: sectorSlug } = await params;
  const sectorName = getSectorFromSlug(sectorSlug);

  if (!sectorName) {
    notFound();
  }

  const data = await getPortfolioData();
  const currentQuarter = data[0];
  const previousQuarter = data[1];

  // 현재 분기 섹터 종목
  const sectorHoldings = currentQuarter.holdings
    .filter((h) => h.sector === sectorName)
    .map((h) => {
      const actualValue = h.value / 1000;
      const prevStock = previousQuarter?.holdings.find((p) => p.cusip === h.cusip);
      const prevShares = prevStock?.shares || 0;
      const sharesChange = h.shares - prevShares;

      return {
        ...h,
        actualValue,
        reportedPrice: actualValue / h.shares,
        percent: (h.value / currentQuarter.totalValue) * 100,
        sharesChange,
        isNew: !prevStock,
      };
    })
    .sort((a, b) => b.actualValue - a.actualValue);

  const totalSectorValue = sectorHoldings.reduce((sum, h) => sum + h.actualValue, 0);
  const sectorPercent = (totalSectorValue / (currentQuarter.totalValue / 1000)) * 100;

  // 전분기 대비 변화
  const prevSectorValue =
    previousQuarter?.holdings
      .filter((h) => h.sector === sectorName)
      .reduce((sum, h) => sum + h.value / 1000, 0) || 0;
  const valueChange = totalSectorValue - prevSectorValue;
  const valueChangePercent = prevSectorValue > 0 ? (valueChange / prevSectorValue) * 100 : 0;

  // 신규 편입/전량 매도 종목
  const newStocks = sectorHoldings.filter((h) => h.isNew);
  const exitedStocks = previousQuarter
    ? previousQuarter.holdings
        .filter(
          (h) =>
            h.sector === sectorName && !currentQuarter.holdings.find((c) => c.cusip === h.cusip),
        )
        .map((h) => ({ symbol: h.symbol, name: h.securityName }))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `국민연금 ${sectorName} 섹터 투자 현황`,
    description: `국민연금의 ${sectorName} 섹터 미국 주식 보유 현황 분석`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-foreground font-sans">
        <GlobalHeader />

        <main className="container mx-auto px-4 py-8">
          <FadeIn>
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>섹터 목록으로 돌아가기</span>
            </Link>

            <header className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl sm:text-4xl font-bold text-foreground">{sectorName}</h1>
                  </div>
                  <p className="text-secondary text-lg">
                    {currentQuarter.year}년 {currentQuarter.quarter}분기 기준 국민연금의{" "}
                    {sectorName} 섹터 보유 현황
                  </p>
                </div>
                <ShareButton
                  title={`국민연금 ${sectorName} 섹터 분석`}
                  text={`${currentQuarter.year}년 ${currentQuarter.quarter}분기 국민연금의 ${sectorName} 섹터 보유 현황을 확인해보세요.`}
                  label="이 섹터 공유하기"
                />
              </div>
            </header>

            {/* 요약 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-surface rounded-xl border border-border">
                <p className="text-secondary text-sm mb-1">총 보유액</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${formatCompactNumber(totalSectorValue)}
                </p>
                {valueChange !== 0 && (
                  <p
                    className={`text-sm flex items-center gap-1 ${valueChange > 0 ? "text-success" : "text-negative"}`}
                  >
                    {valueChange > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {valueChange > 0 ? "+" : ""}
                    {valueChangePercent.toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <p className="text-secondary text-sm mb-1">포트폴리오 비중</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  {sectorPercent.toFixed(2)}%
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <p className="text-secondary text-sm mb-1">보유 종목 수</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {sectorHoldings.length}개
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <p className="text-secondary text-sm mb-1">이번 분기 변동</p>
                <div className="flex items-center gap-2">
                  {newStocks.length > 0 && (
                    <span className="px-2 py-0.5 bg-success/20 text-success text-sm rounded">
                      +{newStocks.length} 신규
                    </span>
                  )}
                  {exitedStocks.length > 0 && (
                    <span className="px-2 py-0.5 bg-negative/20 text-negative text-sm rounded">
                      -{exitedStocks.length} 매도
                    </span>
                  )}
                  {newStocks.length === 0 && exitedStocks.length === 0 && (
                    <span className="text-secondary">변동 없음</span>
                  )}
                </div>
              </div>
            </div>

            {/* 광고 배너 */}
            <div className="mb-8">
              <AdBanner slot="9828624569" format="horizontal" />
            </div>

            {/* 종목 테이블 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">{sectorName} 섹터 보유 종목</h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-background/80 text-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">티커</th>
                      <th className="px-4 py-3 text-left font-medium">종목명</th>
                      <th className="px-4 py-3 text-right font-medium">비중</th>
                      <th className="px-4 py-3 text-right font-medium">보유 수량</th>
                      <th className="px-4 py-3 text-right font-medium">평가액</th>
                      <th className="px-4 py-3 text-right font-medium">변동</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sectorHoldings.map((stock) => (
                      <tr key={stock.cusip} className="hover:bg-background/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            className="font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            {stock.symbol}
                            {stock.isNew && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-success/20 text-success rounded">
                                신규
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground max-w-48 truncate">
                          {stock.securityName}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium">{stock.percent.toFixed(2)}%</span>
                            <div className="h-1 w-16 rounded-full bg-border overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(stock.percent * 5, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">{formatNumber(stock.shares)}</td>
                        <td className="px-4 py-3 text-right font-bold">
                          ${formatCompactNumber(stock.actualValue)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            stock.sharesChange > 0
                              ? "text-success"
                              : stock.sharesChange < 0
                                ? "text-negative"
                                : "text-secondary"
                          }`}
                        >
                          {stock.sharesChange !== 0 && (
                            <>
                              {stock.sharesChange > 0 ? "+" : ""}
                              {formatNumber(stock.sharesChange)}
                            </>
                          )}
                          {stock.sharesChange === 0 && "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SEO용 숨겨진 텍스트 */}
            <div className="sr-only">
              <h2>국민연금 {sectorName} 섹터 투자 요약</h2>
              <p>
                국민연금은 {sectorName} 섹터에 총 ${formatCompactNumber(totalSectorValue)}를
                투자하고 있으며, 이는 전체 포트폴리오의 {sectorPercent.toFixed(2)}%에 해당합니다.
                {sectorHoldings.slice(0, 5).map((s) => ` ${s.securityName},`)} 등{" "}
                {sectorHoldings.length}개 종목을 보유하고 있습니다.
              </p>
            </div>
          </FadeIn>
        </main>

        <GlobalFooter />
      </div>
    </>
  );
}
