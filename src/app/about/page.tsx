import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import {
  FileText,
  TrendingUp,
  PieChart,
  BarChart3,
  Shield,
  Clock,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "서비스 소개 - NPS 13F",
  description:
    "NPS 13F는 국민연금의 미국 주식 투자 현황을 SEC 13F 공시 기반으로 분석하여 제공하는 서비스입니다.",
  openGraph: {
    title: "서비스 소개 - NPS 13F",
    description: "국민연금 미국 주식 포트폴리오 분석 서비스",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  const features = [
    {
      icon: FileText,
      title: "SEC 13F 기반 데이터",
      description:
        "미국 증권거래위원회(SEC)에 공시된 공식 13F 보고서를 기반으로 정확한 보유 현황을 제공합니다.",
    },
    {
      icon: TrendingUp,
      title: "매매 내역 분석",
      description:
        "분기별 매수/매도 내역을 추적하여 국민연금의 투자 동향을 한눈에 파악할 수 있습니다.",
    },
    {
      icon: PieChart,
      title: "섹터별 분석",
      description: "기술, 헬스케어, 금융 등 섹터별 투자 비중과 변화를 시각적으로 분석합니다.",
    },
    {
      icon: BarChart3,
      title: "종목별 상세 정보",
      description: "개별 종목의 보유 현황, 분기별 변동 추이, 순위 변화 등 상세 정보를 제공합니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8" role="main">
        <FadeIn>
          <article className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <header className="mb-16 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                NPS 13F 소개
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                국민연금(National Pension Service)의 미국 주식 투자 현황을 SEC 13F 공시 자료를
                기반으로 분석하여 제공하는 서비스입니다.
              </p>
            </header>

            {/* 서비스 소개 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                서비스 소개
              </h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8 space-y-4 text-secondary leading-relaxed">
                <p>
                  <strong className="text-foreground">NPS 13F</strong>는 세계 3위 규모의 연기금인
                  국민연금의 미국 주식 투자 현황을 누구나 쉽게 확인할 수 있도록 만들어진 무료
                  서비스입니다.
                </p>
                <p>
                  미국 증권거래위원회(SEC)에 제출되는{" "}
                  <strong className="text-foreground">Form 13F</strong> 보고서를 분석하여,
                  국민연금이 어떤 미국 주식을 얼마나 보유하고 있는지, 분기마다 어떤 종목을 사고
                  팔았는지를 한눈에 볼 수 있습니다.
                </p>
                <p>
                  복잡한 SEC 공시 자료를 이해하기 쉬운 형태로 시각화하여 제공함으로써, 개인
                  투자자들이 기관투자자의 투자 동향을 참고할 수 있도록 돕습니다.
                </p>
              </div>
            </section>

            {/* 주요 기능 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">주요 기능</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-surface/30 rounded-xl border border-border p-6 hover:bg-surface/50 transition-colors"
                  >
                    <feature.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 13F란? */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Form 13F란?
              </h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8 space-y-4 text-secondary leading-relaxed">
                <p>
                  <strong className="text-foreground">Form 13F</strong>는 미국 증권거래위원회(SEC)가
                  1억 달러 이상의 자산을 운용하는 기관투자자에게 분기별로 제출을 의무화한
                  보고서입니다.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>제출 주기:</strong> 매 분기 종료 후 45일 이내
                  </li>
                  <li>
                    <strong>공개 내용:</strong> 미국 상장 주식 보유 현황 (종목명, 보유 수량, 시가
                    기준 가치)
                  </li>
                  <li>
                    <strong>제출 대상:</strong> 헤지펀드, 연기금, 뮤추얼펀드, 보험사 등 기관투자자
                  </li>
                </ul>
                <p className="mt-4">
                  13F 보고서는 공개 정보이므로 누구나 SEC EDGAR 시스템을 통해 열람할 수 있습니다.
                </p>
                <a
                  href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=national+pension+service&type=13F&dateb=&owner=include&count=40"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                >
                  SEC EDGAR에서 국민연금 13F 원본 보기
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </section>

            {/* 데이터 업데이트 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                데이터 업데이트
              </h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-foreground font-semibold">분기</th>
                        <th className="text-left py-3 px-4 text-foreground font-semibold">
                          기준일
                        </th>
                        <th className="text-left py-3 px-4 text-foreground font-semibold">
                          제출 기한
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-secondary">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">1분기 (Q1)</td>
                        <td className="py-3 px-4">3월 31일</td>
                        <td className="py-3 px-4">5월 15일</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">2분기 (Q2)</td>
                        <td className="py-3 px-4">6월 30일</td>
                        <td className="py-3 px-4">8월 14일</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4">3분기 (Q3)</td>
                        <td className="py-3 px-4">9월 30일</td>
                        <td className="py-3 px-4">11월 14일</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">4분기 (Q4)</td>
                        <td className="py-3 px-4">12월 31일</td>
                        <td className="py-3 px-4">2월 14일</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-muted">
                  * 새로운 13F 공시가 제출되면 서비스 데이터도 업데이트됩니다.
                </p>
              </div>
            </section>

            {/* 면책 조항 */}
            <section className="mb-16">
              <div className="bg-negative/10 rounded-2xl border border-negative/30 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-negative mb-4">⚠️ 투자 관련 안내</h2>
                <ul className="space-y-3 text-secondary text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-negative">•</span>본 서비스는{" "}
                    <strong>정보 제공 목적</strong>으로만 운영되며, 투자 권유, 투자 자문, 투자
                    추천을 목적으로 하지 않습니다.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-negative">•</span>
                    제공되는 정보를 근거로 한 투자 결정에 대한 책임은 전적으로 이용자 본인에게
                    있습니다.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-negative">•</span>
                    13F 데이터는 과거 시점의 보유 현황이며, 현재의 포트폴리오와 다를 수 있습니다.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-negative">•</span>
                    투자 결정 전 자격을 갖춘 금융 전문가와 상담하시기 바랍니다.
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/terms" className="text-primary hover:underline text-sm">
                    전체 이용약관 보기 →
                  </Link>
                </div>
              </div>
            </section>

            {/* 연락처 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">문의하기</h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8">
                <p className="text-secondary mb-4">
                  서비스 이용 중 문의사항이나 피드백이 있으시면 아래 채널로 연락해 주세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://x.com/charlotteprism"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X (Twitter)
                  </a>
                  <a
                    href="mailto:yaffleria@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 text-foreground border border-border rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    이메일 문의
                  </a>
                </div>
              </div>
            </section>

            {/* 하단 네비게이션 */}
            <footer className="pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  홈으로 돌아가기
                </Link>
                <span className="text-muted">|</span>
                <Link href="/privacy" className="text-primary hover:underline">
                  개인정보처리방침
                </Link>
                <span className="text-muted">|</span>
                <Link href="/terms" className="text-primary hover:underline">
                  이용약관
                </Link>
              </div>
            </footer>
          </article>
        </FadeIn>
      </main>

      <GlobalFooter />
    </div>
  );
}
