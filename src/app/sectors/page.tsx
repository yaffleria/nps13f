import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber } from "@/shared/lib/format";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { FadeIn } from "@/shared/ui/FadeIn";
import { AdBanner } from "@/shared/ui/AdBanner";
import { ArrowRight, Building2 } from "lucide-react";

async function getPortfolioData(): Promise<PortfolioQuarter[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

interface SectorSummary {
  name: string;
  slug: string;
  stockCount: number;
  totalValue: number;
  percent: number;
  topStocks: { symbol: string; name: string; value: number }[];
}

function getSectorSummaries(data: PortfolioQuarter[]): SectorSummary[] {
  const currentQuarter = data[0];
  const sectorMap = new Map<string, SectorSummary>();

  currentQuarter.holdings.forEach((stock) => {
    const sector = stock.sector || "Other";
    const existing = sectorMap.get(sector);
    const actualValue = stock.value / 1000;

    if (existing) {
      existing.stockCount++;
      existing.totalValue += actualValue;
      existing.topStocks.push({
        symbol: stock.symbol,
        name: stock.securityName,
        value: actualValue,
      });
    } else {
      sectorMap.set(sector, {
        name: sector,
        slug: sector.toLowerCase().replace(/\s+/g, "-"),
        stockCount: 1,
        totalValue: actualValue,
        percent: 0,
        topStocks: [{ symbol: stock.symbol, name: stock.securityName, value: actualValue }],
      });
    }
  });

  const totalPortfolioValue = currentQuarter.totalValue / 1000;

  const summaries = Array.from(sectorMap.values()).map((s) => ({
    ...s,
    percent: (s.totalValue / totalPortfolioValue) * 100,
    topStocks: s.topStocks.sort((a, b) => b.value - a.value).slice(0, 5),
  }));

  return summaries.sort((a, b) => b.totalValue - a.totalValue);
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: "from-blue-500 to-cyan-500",
  Healthcare: "from-green-500 to-emerald-500",
  "Financial Services": "from-yellow-500 to-amber-500",
  "Consumer Cyclical": "from-pink-500 to-rose-500",
  "Communication Services": "from-purple-500 to-violet-500",
  Industrials: "from-orange-500 to-red-500",
  "Consumer Defensive": "from-teal-500 to-green-500",
  Energy: "from-red-500 to-orange-500",
  Utilities: "from-sky-500 to-blue-500",
  "Real Estate": "from-indigo-500 to-purple-500",
  "Basic Materials": "from-amber-500 to-yellow-500",
  Other: "from-gray-500 to-slate-500",
};

export const metadata: Metadata = {
  title: "섹터별 분석 - 국민연금 미국주식 포트폴리오",
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 섹터별 미국 주식 보유 현황. 기술주, 헬스케어, 금융 등 섹터별 비중과 주요 종목을 확인하세요.",
  keywords: [
    "국민연금 섹터",
    "국민연금 기술주",
    "국민연금 헬스케어",
    "국민연금 금융주",
    "NPS 섹터 분석",
    "연기금 섹터 비중",
  ],
};

export default async function SectorsPage() {
  const data = await getPortfolioData();
  const sectors = getSectorSummaries(data);
  const currentQuarter = data[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "국민연금 섹터별 투자 현황",
    description: "국민연금의 미국 주식 투자를 섹터별로 분석한 페이지",
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
            <header className="mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block">
                섹터별 투자 현황
              </h1>
              <p className="text-secondary text-lg">
                {currentQuarter.year}년 {currentQuarter.quarter}분기 기준 국민연금의 섹터별 미국
                주식 보유 현황
              </p>
            </header>

            {/* 광고 배너 */}
            <div className="mb-6">
              <AdBanner slot="9828624569" format="horizontal" />
            </div>

            {/* 섹터 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector) => (
                <Link
                  key={sector.slug}
                  href={`/sectors/${sector.slug}`}
                  className="group p-6 bg-surface rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-linear-to-br ${SECTOR_COLORS[sector.name] || SECTOR_COLORS.Other} flex items-center justify-center`}
                      >
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {sector.name}
                        </h2>
                        <p className="text-sm text-secondary">{sector.stockCount}개 종목</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary text-sm">총 보유액</span>
                      <span className="font-bold text-foreground">
                        ${formatCompactNumber(sector.totalValue)}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-secondary text-sm">포트폴리오 비중</span>
                        <span className="font-medium text-primary">
                          {sector.percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full bg-linear-to-r ${SECTOR_COLORS[sector.name] || SECTOR_COLORS.Other} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(sector.percent * 2, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-secondary mb-2">대표 종목</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sector.topStocks.slice(0, 4).map((stock) => (
                          <span
                            key={stock.symbol}
                            className="px-2 py-1 bg-background rounded text-xs font-medium text-foreground"
                          >
                            {stock.symbol}
                          </span>
                        ))}
                        {sector.topStocks.length > 4 && (
                          <span className="px-2 py-1 bg-background rounded text-xs text-secondary">
                            +{sector.stockCount - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* SEO용 숨겨진 텍스트 */}
            <div className="sr-only">
              <h2>국민연금 섹터별 투자 현황 요약</h2>
              <p>
                국민연금은 {sectors.length}개 섹터에 분산 투자하고 있습니다.
                {sectors.slice(0, 3).map((s) => ` ${s.name} 섹터에 ${s.percent.toFixed(1)}%,`)}
                등으로 구성되어 있습니다.
              </p>
            </div>
          </FadeIn>
        </main>

        <footer className="border-t border-border py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted">
              © 2025 NPS 13F 트래커. SEC 공개 데이터 기반 분석 서비스입니다.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
