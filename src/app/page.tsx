import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { PortfolioTabs } from "@/widgets/PortfolioTabs/PortfolioTabs";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { FadeIn } from "@/shared/ui/FadeIn";
import { formatCompactNumber } from "@/shared/lib/format";
import { getAllJsonLd } from "@/shared/lib/jsonLd";

export const metadata: Metadata = {
  title: "국민연금 13F - 미국주식 보유현황 & 매매내역 분석",
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황을 확인하세요. 분기별 매수/매도 내역, 포트폴리오 비중, Apple·Microsoft·NVIDIA 등 빅테크 투자 종목 상세 분석. 실시간 업데이트.",
  keywords: [
    "국민연금",
    "NPS",
    "13F",
    "미국주식",
    "포트폴리오",
    "SEC",
    "연기금",
    "투자",
    "주식 보유",
    "매수 매도",
    "국민연금 주식",
    "국민연금 투자 종목",
    "국민연금 애플",
    "국민연금 마이크로소프트",
    "국민연금 엔비디아",
    "기관투자자",
    "연기금 투자",
  ],
  openGraph: {
    title: "국민연금 13F - 미국주식 보유현황 & 매매내역",
    description:
      "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황. 분기별 매수/매도 내역과 포트폴리오 분석. Apple, Microsoft, NVIDIA 투자 현황 확인.",
    type: "website",
    locale: "ko_KR",
    url: "https://nps13f.com",
  },
};

async function getPortfolioData() {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data: PortfolioQuarter[] = JSON.parse(fileContent);
  return data;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const data = await getPortfolioData();
  const params = await searchParams;
  const initialTab = params.tab === "activity" ? "activity" : "holdings";

  // JSON-LD 구조화 데이터
  const jsonLdArray = getAllJsonLd(data?.[0]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-secondary text-lg">데이터가 아직 없습니다.</p>
          <p className="text-muted text-sm mt-2">SEC 13F 데이터를 수집해주세요.</p>
        </div>
      </div>
    );
  }

  const currentQuarter = data[0];

  // SEO용 주요 종목 리스트 (상위 10개)
  const topHoldings = currentQuarter.holdings
    .slice(0, 10)
    .map((h) => h.securityName)
    .join(", ");

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {jsonLdArray.map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <div className="min-h-screen bg-background text-foreground font-sans">
        <GlobalHeader />

        <main className="container mx-auto px-4 py-8" role="main">
          <FadeIn>
            {/* Hero Section - SEO 최적화 */}
            <header className="mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block">
                국민연금 미국주식 포트폴리오
              </h1>
              <p className="text-secondary max-w-3xl text-lg leading-relaxed">
                국민연금(NPS)의 SEC 13F 공시 기준 미국 주식 보유 현황입니다. 총 운용 자산:{" "}
                <span className="text-foreground font-bold text-xl">
                  ${formatCompactNumber(currentQuarter.totalValue)}
                </span>
                . 분기별 보유 종목과 매매 내역을 확인하세요.
              </p>

              {/* SEO용 숨겨진 키워드 텍스트 (스크린 리더 접근 가능) */}
              <div className="sr-only">
                <h2>
                  {currentQuarter.year}년 Q{currentQuarter.quarter} 기준 국민연금 미국주식 보유 현황
                </h2>
                <p>
                  국민연금이 보유한 주요 미국 주식: {topHoldings}. 총{" "}
                  {currentQuarter.holdings.length}개 종목 보유.
                </p>
                <p>국민연금 13F 공시자료, 연기금 투자 현황, 기관투자자 포트폴리오 분석</p>
              </div>
            </header>

            {/* Main Content */}
            <article>
              <PortfolioTabs quarters={data} initialTab={initialTab} />
            </article>
          </FadeIn>
        </main>

        {/* Footer - SEO 최적화 */}
        <footer className="border-t border-border py-8 mt-12" role="contentinfo">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted">
              © 2025 NPS 13F 트래커. 국민연금과 무관한 비공식 서비스입니다.
            </p>
            <p className="mt-2 text-xs text-muted">
              데이터 출처:{" "}
              <a
                href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=national+pension&type=13F"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                SEC Edgar 13F 공시
              </a>
              . 분기별 업데이트.
            </p>
            <p className="mt-3 text-xs text-secondary">
              제작:{" "}
              <a
                href="https://x.com/charlotteprism"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @charlotte
              </a>
            </p>

            {/* SEO용 추가 링크 (검색엔진 크롤링용) */}
            <nav className="mt-6 text-xs text-muted" aria-label="추가 정보 링크">
              <span className="mr-4">
                <a href="/?tab=holdings" className="hover:text-primary transition-colors">
                  보유종목
                </a>
              </span>
              <span className="mr-4">
                <a href="/?tab=activity" className="hover:text-primary transition-colors">
                  매매내역
                </a>
              </span>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
