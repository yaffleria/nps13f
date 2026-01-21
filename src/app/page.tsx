import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { PortfolioTabs } from "@/widgets/PortfolioTabs/PortfolioTabs";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { FadeIn } from "@/shared/ui/FadeIn";
import { formatCompactNumber } from "@/shared/lib/format";

export const metadata: Metadata = {
  title: "국민연금 13F",
  description:
    "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황을 확인하세요. 분기별 매수/매도 내역, 포트폴리오 비중, 종목별 상세 정보를 제공합니다.",
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
  ],
  openGraph: {
    title: "국민연금 13F",
    description:
      "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황. 분기별 매수/매도 내역과 포트폴리오 분석.",
    type: "website",
    locale: "ko_KR",
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          {/* Hero Section */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block">
              국민연금 미국주식 포트폴리오
            </h1>
            <p className="text-secondary max-w-3xl text-lg leading-relaxed">
              국민연금(NPS)의 SEC 13F 공시 기준 미국 주식 보유 현황입니다. 총 운용 자산:{" "}
              <span className="text-foreground font-bold text-xl">
                ${formatCompactNumber(currentQuarter.totalValue)}
              </span>
              . 분기별 보유 종목과 매매 내역을 확인하세요.
            </p>
          </header>

          {/* Main Content: Tabbed Holdings & Activity */}
          <PortfolioTabs quarters={data} initialTab={initialTab} />
        </FadeIn>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted">
            © 2025 NPS 13F 트래커. 국민연금과 무관한 비공식 서비스입니다.
          </p>
          <p className="mt-2 text-xs text-muted">
            데이터 출처: SEC Edgar 13F 공시. 분기별 업데이트.
          </p>
          <p className="mt-3 text-xs text-secondary">
            제작:{" "}
            <a
              href="https://x.com/charlotteprism"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              @charlotte
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
