import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { processActivity } from "@/entities/portfolio/lib/process-activity";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { generateQuarterlyInsights } from "@/shared/lib/insights";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import { ShareButton } from "@/shared/ui/ShareButton";
import { AdBanner } from "@/shared/ui/AdBanner";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  BarChart3,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface ReportPageProps {
  params: Promise<{ quarter: string }>;
}

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

export async function generateStaticParams() {
  const data = await getPortfolioData();
  return data.map((q) => ({ quarter: `${q.year}-q${q.quarter}` }));
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { quarter: slug } = await params;
  const parsed = parseQuarterSlug(slug);

  if (!parsed) {
    return { title: "리포트를 찾을 수 없습니다" };
  }

  return {
    title: `${parsed.year}년 ${parsed.quarter}분기 리포트 - 국민연금 미국주식`,
    description: `국민연금(NPS)의 ${parsed.year}년 ${parsed.quarter}분기 SEC 13F 공시 기반 미국 주식 포트폴리오 리포트. 주요 매수/매도 내역과 보유 종목 현황을 확인하세요.`,
    keywords: [
      `국민연금 ${parsed.year}년 ${parsed.quarter}분기`,
      `NPS ${parsed.year} Q${parsed.quarter}`,
      "국민연금 분기 리포트",
      "연기금 분기별 투자",
    ],
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { quarter: slug } = await params;
  const parsed = parseQuarterSlug(slug);

  if (!parsed) {
    notFound();
  }

  const data = await getPortfolioData();
  const quarterIndex = data.findIndex(
    (q) => q.year === parsed.year && q.quarter === parsed.quarter,
  );

  if (quarterIndex === -1) {
    notFound();
  }

  const currentQuarter = data[quarterIndex];
  const previousQuarter = data[quarterIndex + 1];

  const activity = processActivity(currentQuarter, previousQuarter);
  const buys = activity.filter((a) => a.sharesChanged > 0);
  const sells = activity.filter((a) => a.sharesChanged < 0);

  // 통계 계산
  const totalValue = currentQuarter.totalValue / 1000;
  const prevValue = previousQuarter ? previousQuarter.totalValue / 1000 : null;
  const valueChange = prevValue ? ((totalValue - prevValue) / prevValue) * 100 : null;

  // 섹터별 비중
  const sectorMap = new Map<string, number>();
  currentQuarter.holdings.forEach((h) => {
    const sector = h.sector || "Other";
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + h.value / 1000);
  });
  const sectorData = Array.from(sectorMap.entries())
    .map(([name, value]) => ({ name, value, percent: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value);

  // 상위 10개 종목
  const topHoldings = currentQuarter.holdings
    .map((h) => ({
      symbol: h.symbol,
      name: h.securityName,
      value: h.value / 1000,
      percent: (h.value / currentQuarter.totalValue) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 인사이트 생성
  const insights = generateQuarterlyInsights(currentQuarter, previousQuarter);

  // BreadcrumbList JSON-LD
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
        name: "분기별 리포트",
        item: "https://www.nps13f.com/reports",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${parsed.year}년 ${parsed.quarter}분기`,
        item: `https://www.nps13f.com/reports/${slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: `국민연금 ${parsed.year}년 ${parsed.quarter}분기 투자 리포트`,
    datePublished: currentQuarter.date,
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
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>리포트 목록으로 돌아가기</span>
            </Link>

            <header className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
                      {parsed.year}년 {parsed.quarter}분기 리포트
                    </h1>
                  </div>
                  <p className="text-secondary text-lg">
                    공시일:{" "}
                    {new Date(currentQuarter.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ShareButton
                  title={`국민연금 ${parsed.year}년 ${parsed.quarter}분기 리포트`}
                  text={`국민연금의 ${parsed.year}년 ${parsed.quarter}분기 상세 투자 리포트를 확인해보세요.`}
                  label="이 리포트 공유하기"
                />
              </div>
            </header>

            {/* 요약 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />총 운용액
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${formatCompactNumber(totalValue)}
                </p>
                {valueChange !== null && (
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      valueChange > 0 ? "text-success" : "text-negative"
                    }`}
                  >
                    {valueChange > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {valueChange > 0 ? "+" : ""}
                    {valueChange.toFixed(1)}% 전분기 대비
                  </p>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <Briefcase className="w-4 h-4" />
                  보유 종목
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {currentQuarter.holdings.length}개
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <Plus className="w-4 h-4" />
                  매수/신규
                </div>
                <p className="text-xl sm:text-2xl font-bold text-success">{buys.length}건</p>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                  <Minus className="w-4 h-4" />
                  매도
                </div>
                <p className="text-xl sm:text-2xl font-bold text-negative">{sells.length}건</p>
              </div>
            </div>

            {/* 인사이트 카드 */}
            {insights.length > 0 && (
              <div className="mb-8 p-5 bg-surface/50 rounded-2xl border border-border">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  이번 분기 주요 하이라이트
                </h2>
                <ul className="space-y-2">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-secondary">
                      {insight.type === "top_buy" ? (
                        <TrendingUp className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      ) : insight.type === "top_sell" ? (
                        <TrendingDown className="w-4 h-4 text-negative mt-0.5 shrink-0" />
                      ) : insight.type === "new_entry" ? (
                        <Plus className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      ) : insight.type === "exit" ? (
                        <Minus className="w-4 h-4 text-negative mt-0.5 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 shrink-0" />
                      )}
                      <span>{insight.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 광고 배너 */}
            <div className="mb-8">
              <AdBanner slot="REPORT_HEADER_AD" format="horizontal" />
            </div>

            {/* 상위 10개 종목 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">상위 10개 보유 종목</h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-background/80 text-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">순위</th>
                      <th className="px-4 py-3 text-left font-medium">티커</th>
                      <th className="px-4 py-3 text-left font-medium">종목명</th>
                      <th className="px-4 py-3 text-right font-medium">비중</th>
                      <th className="px-4 py-3 text-right font-medium">평가액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topHoldings.map((stock, i) => (
                      <tr key={stock.symbol} className="hover:bg-background/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-primary">{i + 1}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {stock.symbol}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-foreground max-w-48 truncate">
                          {stock.name}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {stock.percent.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          ${formatCompactNumber(stock.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 주요 매수 */}
            {buys.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  주요 매수 종목 (상위 10개)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buys.slice(0, 10).map((item) => (
                    <Link
                      key={item.stock.cusip}
                      href={`/stocks/${item.symbol}`}
                      className="p-4 bg-surface rounded-xl border border-border hover:border-success/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary">{item.symbol}</span>
                        {item.history === "new" && (
                          <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded font-medium">
                            신규 편입
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary truncate mb-2">{item.name}</p>
                      <p className="text-success font-medium">
                        +{formatNumber(item.sharesChanged)}주
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 주요 매도 */}
            {sells.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-negative" />
                  주요 매도 종목 (상위 10개)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sells.slice(0, 10).map((item) => (
                    <Link
                      key={item.stock.cusip}
                      href={`/stocks/${item.symbol}`}
                      className="p-4 bg-surface rounded-xl border border-border hover:border-negative/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary">{item.symbol}</span>
                        {item.history === "exit" && (
                          <span className="px-2 py-0.5 bg-negative/20 text-negative text-xs rounded font-medium">
                            전량 매도
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary truncate mb-2">{item.name}</p>
                      <p className="text-negative font-medium">
                        {formatNumber(item.sharesChanged)}주
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 섹터 비중 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">섹터별 비중</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectorData.slice(0, 8).map((sector) => (
                  <Link
                    key={sector.name}
                    href={`/sectors/${sector.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-all"
                  >
                    <p className="font-medium text-foreground mb-1">{sector.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {sector.percent.toFixed(1)}%
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden mt-2">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(sector.percent * 2, 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <div className="sr-only">
              <h2>
                국민연금 {parsed.year}년 {parsed.quarter}분기 투자 요약
              </h2>
              <p>
                국민연금은 {parsed.year}년 {parsed.quarter}분기에 총 $
                {formatCompactNumber(totalValue)}의 미국 주식을 보유하고 있습니다. 이 분기에{" "}
                {buys.length}건의 매수와 {sells.length}건의 매도가 있었습니다.
              </p>
            </div>
          </FadeIn>
        </main>

        <GlobalFooter />
      </div>
    </>
  );
}
