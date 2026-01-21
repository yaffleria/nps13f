import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber } from "@/shared/lib/format";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { FadeIn } from "@/shared/ui/FadeIn";
import { Calendar, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

async function getPortfolioData(): Promise<PortfolioQuarter[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export const metadata: Metadata = {
  title: "분기별 리포트 - 국민연금 미국주식 포트폴리오",
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 분기별 미국 주식 포트폴리오 리포트. 각 분기의 보유 현황, 매수/매도 내역을 확인하세요.",
  keywords: [
    "국민연금 분기별",
    "국민연금 2024",
    "국민연금 리포트",
    "NPS 분기 보고서",
    "연기금 분기별 투자",
  ],
};

export default async function ReportsPage() {
  const data = await getPortfolioData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "국민연금 분기별 리포트",
    description: "국민연금의 분기별 미국 주식 투자 현황 리포트 모음",
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
                분기별 리포트
              </h1>
              <p className="text-secondary text-lg">
                국민연금의 SEC 13F 공시 기반 분기별 미국 주식 포트폴리오 현황
              </p>
            </header>

            <div className="space-y-4">
              {data.map((quarter, index) => {
                const prevQuarter = data[index + 1];
                const valueChange = prevQuarter
                  ? ((quarter.totalValue - prevQuarter.totalValue) / prevQuarter.totalValue) * 100
                  : 0;
                const holdingsChange = prevQuarter
                  ? quarter.holdings.length - prevQuarter.holdings.length
                  : 0;

                // 신규 편입/전량 매도 계산
                const newStocks = prevQuarter
                  ? quarter.holdings.filter(
                      (h) => !prevQuarter.holdings.find((p) => p.cusip === h.cusip),
                    ).length
                  : quarter.holdings.length;
                const exitedStocks = prevQuarter
                  ? prevQuarter.holdings.filter(
                      (h) => !quarter.holdings.find((c) => c.cusip === h.cusip),
                    ).length
                  : 0;

                const slug = `${quarter.year}-q${quarter.quarter}`;

                return (
                  <Link
                    key={slug}
                    href={`/reports/${slug}`}
                    className="block group p-6 bg-surface rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {quarter.year}년 {quarter.quarter}분기
                          </h2>
                          <p className="text-secondary text-sm">
                            공시일: {new Date(quarter.date).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="text-center">
                          <p className="text-xs text-secondary mb-1">총 운용액</p>
                          <p className="font-bold text-foreground">
                            ${formatCompactNumber(quarter.totalValue / 1000)}
                          </p>
                          {prevQuarter && (
                            <p
                              className={`text-xs flex items-center justify-center gap-0.5 ${
                                valueChange > 0
                                  ? "text-success"
                                  : valueChange < 0
                                    ? "text-negative"
                                    : "text-secondary"
                              }`}
                            >
                              {valueChange > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {valueChange > 0 ? "+" : ""}
                              {valueChange.toFixed(1)}%
                            </p>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-secondary mb-1">보유 종목</p>
                          <p className="font-bold text-foreground">{quarter.holdings.length}개</p>
                          {holdingsChange !== 0 && (
                            <p
                              className={`text-xs ${
                                holdingsChange > 0 ? "text-success" : "text-negative"
                              }`}
                            >
                              {holdingsChange > 0 ? "+" : ""}
                              {holdingsChange}
                            </p>
                          )}
                        </div>

                        <div className="text-center min-w-20">
                          <p className="text-xs text-secondary mb-1">변동</p>
                          <div className="flex items-center justify-center gap-2">
                            {newStocks > 0 && (
                              <span className="px-1.5 py-0.5 bg-success/20 text-success text-xs rounded">
                                +{newStocks}
                              </span>
                            )}
                            {exitedStocks > 0 && (
                              <span className="px-1.5 py-0.5 bg-negative/20 text-negative text-xs rounded">
                                -{exitedStocks}
                              </span>
                            )}
                            {newStocks === 0 && exitedStocks === 0 && index !== data.length - 1 && (
                              <span className="text-secondary text-xs">-</span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="sr-only">
              <h2>국민연금 분기별 투자 현황</h2>
              <p>
                국민연금의 SEC 13F 공시에 따른 분기별 미국 주식 투자 현황입니다.
                {data.slice(0, 3).map((q) => ` ${q.year}년 ${q.quarter}분기,`)} 등의 리포트를 확인할
                수 있습니다.
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
