import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";
import { Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "문의하기 - NPS 13F",
  description:
    "NPS 13F 서비스에 대한 문의, 피드백, 버그 리포트 등을 보내주세요. 빠른 시간 내에 답변드리겠습니다.",
  openGraph: {
    title: "문의하기 - NPS 13F",
    description: "NPS 13F 서비스에 대한 문의 및 피드백",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "이메일",
      description: "서비스 관련 문의, 제안, 버그 리포트 등",
      link: "mailto:yaffleria@gmail.com",
      linkText: "yaffleria@gmail.com",
      responseTime: "보통 1-2일 내 답변",
      isExternal: false,
    },
    {
      icon: MessageCircle,
      title: "X",
      description: "빠른 문의, 실시간 업데이트 확인",
      link: "https://x.com/charlotteprism",
      linkText: "@charlotteprism",
      responseTime: "보통 몇 시간 내 답변",
      isExternal: true,
    },
  ];

  const faqItems = [
    {
      question: "데이터는 얼마나 자주 업데이트되나요?",
      answer:
        "SEC 13F 보고서는 분기별로 제출됩니다. 새로운 공시가 발표되면 빠르게 데이터를 업데이트합니다. 보통 제출 후 1-2일 내에 반영됩니다.",
    },
    {
      question: "특정 종목에 대한 정보를 추가해 주실 수 있나요?",
      answer:
        "국민연금이 13F 보고서에 공시한 모든 종목은 자동으로 서비스에 반영됩니다. 국민연금이 보유하지 않은 종목은 표시되지 않습니다.",
    },
    {
      question: "데이터 오류를 발견했어요.",
      answer:
        "데이터 정확성은 저에게 매우 중요합니다. 오류를 발견하시면 이메일이나 X DM으로 알려주세요. 빠르게 확인 후 수정하겠습니다.",
    },
    {
      question: "광고 또는 협업 문의는 어떻게 하나요?",
      answer: "비즈니스 관련 문의는 이메일(yaffleria@gmail.com)로 연락 주세요.",
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
                문의하기
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                NPS 13F 서비스에 대한 문의, 피드백, 제안 사항을 보내주세요.
                <br />
                빠른 시간 내에 답변드리겠습니다.
              </p>
            </header>

            {/* Contact Methods */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">연락 방법</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target={method.isExternal ? "_blank" : undefined}
                    rel={method.isExternal ? "noopener noreferrer" : undefined}
                    className="group bg-surface/30 rounded-2xl border border-border p-6 sm:p-8 hover:bg-surface/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                          {method.title}
                          {method.isExternal && <ExternalLink className="w-4 h-4 text-muted" />}
                        </h3>
                        <p className="text-secondary text-sm mb-3">{method.description}</p>
                        <p className="text-primary font-medium group-hover:underline">
                          {method.linkText}
                        </p>
                        <p className="text-muted text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {method.responseTime}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* What to Include */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                문의 시 포함하면 좋은 정보
              </h2>
              <div className="bg-surface/50 rounded-2xl border border-border p-6 sm:p-8">
                <ul className="space-y-4 text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">버그 리포트의 경우:</strong> 발생한 페이지
                      URL, 브라우저 종류, 스크린샷(가능하다면)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">데이터 오류의 경우:</strong> 해당 종목
                      또는 페이지, 예상되는 올바른 값, SEC 원본 링크(가능하다면)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <strong className="text-foreground">기능 제안의 경우:</strong> 원하시는 기능에
                      대한 상세한 설명, 사용 사례
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">자주 묻는 질문</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-surface/30 rounded-xl border border-border overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface/50 transition-colors">
                      <span className="font-medium text-foreground pr-4">{item.question}</span>
                      <span className="text-muted group-open:rotate-180 transition-transform">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-secondary leading-relaxed">{item.answer}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Response Notice */}
            <section className="mb-16">
              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 sm:p-8 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">응답 시간 안내</h3>
                <p className="text-secondary text-sm leading-relaxed max-w-xl mx-auto">
                  문의하신 내용은 최대한 빠르게 확인하고 답변드리겠습니다. 일반적으로 이메일은
                  1-2일, X는 몇 시간 내에 답변을 드립니다. 업무 외 시간이나 주말에는 답변이 다소
                  지연될 수 있는 점 양해 부탁드립니다.
                </p>
              </div>
            </section>

            {/* Footer Navigation */}
            <footer className="pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  홈으로 돌아가기
                </Link>
                <span className="text-muted">|</span>
                <Link href="/about" className="text-primary hover:underline">
                  서비스 소개
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
