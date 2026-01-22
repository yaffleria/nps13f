import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "이용약관 - NPS 13F",
  description: "NPS 13F 서비스 이용약관. 서비스 이용 조건, 면책사항, 저작권 등에 관한 안내입니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  const currentDate = "2026년 1월 22일";
  const effectiveDate = "2026년 1월 22일";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8" role="main">
        <FadeIn>
          <article className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <header className="mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                이용약관
              </h1>
              <p className="text-secondary">
                시행일: {effectiveDate} | 최종 수정일: {currentDate}
              </p>
            </header>

            <div className="space-y-10 text-secondary leading-relaxed">
              {/* 제1조 목적 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제1조 (목적)</h2>
                <p>
                  본 약관은 NPS 13F (이하 &quot;서비스&quot;)가 제공하는 웹사이트 서비스의 이용조건
                  및 절차, 이용자와 서비스 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                  목적으로 합니다.
                </p>
              </section>

              {/* 제2조 용어의 정의 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제2조 (용어의 정의)</h2>
                <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>&quot;서비스&quot;</strong>: NPS 13F가 제공하는 국민연금 미국 주식
                    포트폴리오 정보 제공 웹사이트 및 관련 부가 서비스를 의미합니다.
                  </li>
                  <li>
                    <strong>&quot;이용자&quot;</strong>: 본 약관에 따라 서비스가 제공하는 서비스를
                    이용하는 자를 의미합니다.
                  </li>
                  <li>
                    <strong>&quot;콘텐츠&quot;</strong>: 서비스에 게시된 텍스트, 이미지, 그래프,
                    데이터 등 모든 형태의 정보를 의미합니다.
                  </li>
                </ul>
              </section>

              {/* 제3조 약관의 효력 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  제3조 (약관의 효력 및 변경)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.</li>
                  <li>
                    서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수
                    있으며, 변경 시 적용일자 및 변경사유를 명시하여 서비스 내에 공지합니다.
                  </li>
                  <li>변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.</li>
                  <li>
                    이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단할 수 있습니다.
                    변경된 약관 시행일 이후에도 서비스를 계속 이용하는 경우, 변경된 약관에 동의한
                    것으로 간주합니다.
                  </li>
                </ol>
              </section>

              {/* 제4조 서비스의 내용 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제4조 (서비스의 내용)</h2>
                <p>서비스는 다음과 같은 정보를 제공합니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>미국 증권거래위원회(SEC) 13F 공시 기반 국민연금(NPS) 미국 주식 보유 현황</li>
                  <li>분기별 포트폴리오 변동 내역 및 매매 동향</li>
                  <li>섹터별 투자 분석 정보</li>
                  <li>개별 종목 투자 현황</li>
                  <li>기타 관련 정보 및 분석 자료</li>
                </ul>
              </section>

              {/* 제5조 서비스 이용 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제5조 (서비스 이용)</h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>서비스는 별도의 회원가입 없이 누구나 무료로 이용할 수 있습니다.</li>
                  <li>
                    서비스 이용 시간은 연중무휴, 1일 24시간을 원칙으로 합니다. 다만, 시스템 점검
                    등의 사유로 서비스가 일시 중단될 수 있습니다.
                  </li>
                  <li>
                    서비스는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경할 수
                    있습니다.
                  </li>
                </ol>
              </section>

              {/* 제6조 면책조항 - 투자 관련 (중요) */}
              <section className="bg-surface/50 p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold text-negative mb-4">
                  제6조 (투자 관련 면책조항) ⚠️ 중요
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>
                      본 서비스는 투자 권유, 투자 자문 또는 투자 추천을 목적으로 하지 않습니다.
                    </strong>
                  </li>
                  <li>
                    서비스에서 제공하는 모든 정보는 SEC 13F 공시 자료를 기반으로 한
                    <strong>정보 제공 목적</strong>일 뿐이며, 특정 종목의 매수, 매도, 보유를
                    권유하거나 추천하는 것이 아닙니다.
                  </li>
                  <li>
                    서비스에서 제공하는 정보를 근거로 한 투자 결정에 대한 책임은 전적으로 이용자
                    본인에게 있습니다.
                  </li>
                  <li>
                    서비스는 제공된 정보의 정확성, 완전성, 적시성을 보장하지 않으며, 정보의 오류,
                    누락, 지연으로 인한 손해에 대해 책임을 지지 않습니다.
                  </li>
                  <li>
                    이용자는 투자 결정을 내리기 전에 자격을 갖춘 금융 전문가와 상담할 것을
                    권장합니다.
                  </li>
                  <li>과거의 투자 성과가 미래의 수익을 보장하지 않습니다.</li>
                </ol>
              </section>

              {/* 제7조 데이터 출처 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  제7조 (데이터 출처 및 한계)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    서비스에서 제공하는 데이터는 미국 증권거래위원회(SEC)에 공시된 Form 13F 보고서를
                    기반으로 합니다.
                  </li>
                  <li>
                    13F 보고서는 분기 종료 후 45일 이내에 제출되므로, 표시되는 정보는 실시간 보유
                    현황이 아닌 과거 시점의 데이터입니다.
                  </li>
                  <li>
                    13F 보고서에는 1억 달러 이상의 자산을 운용하는 기관투자자의 미국 상장 주식 보유
                    현황만 포함되며, 모든 투자 자산이 공개되는 것은 아닙니다.
                  </li>
                  <li>
                    데이터 수집 및 처리 과정에서 오류가 발생할 수 있으며, 서비스는 이에 대해 책임을
                    지지 않습니다.
                  </li>
                </ol>
              </section>

              {/* 제8조 저작권 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  제8조 (저작권 및 지적재산권)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    서비스의 디자인, 로고, 소프트웨어, 그래픽, 분석 방법론 등에 대한 저작권 및
                    지적재산권은 서비스 운영자에게 있습니다.
                  </li>
                  <li>
                    SEC 13F 공시 데이터 자체는 공공 정보이며, 누구나 자유롭게 접근할 수 있습니다.
                  </li>
                  <li>
                    이용자는 서비스에서 제공하는 정보를 개인적인 용도로만 사용할 수 있으며, 상업적
                    목적으로 복제, 배포, 전송, 출판하는 것은 금지됩니다.
                  </li>
                </ol>
              </section>

              {/* 제9조 이용자의 의무 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제9조 (이용자의 의무)</h2>
                <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>서비스의 운영을 방해하는 행위</li>
                  <li>서비스를 통해 얻은 정보를 상업적 목적으로 무단 이용하는 행위</li>
                  <li>타인의 권리를 침해하거나 명예를 훼손하는 행위</li>
                  <li>해킹, 악성코드 유포 등 서비스의 보안을 위협하는 행위</li>
                  <li>자동화된 수단을 이용한 대량의 데이터 수집 행위</li>
                  <li>기타 관련 법령 및 본 약관을 위반하는 행위</li>
                </ul>
              </section>

              {/* 제10조 서비스 제한 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  제10조 (서비스 제한 및 중지)
                </h2>
                <p>서비스는 다음의 경우 서비스 제공을 제한하거나 중지할 수 있습니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>시스템 정기점검, 서버 증설 및 교체, 네트워크 불안정 등의 기술적 사유</li>
                  <li>천재지변, 전쟁, 폭동 등 불가항력적 사유</li>
                  <li>데이터 제공 원천(SEC)의 서비스 중단 또는 변경</li>
                  <li>기타 서비스 운영상 합리적인 사유</li>
                </ul>
              </section>

              {/* 제11조 광고 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제11조 (광고)</h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    서비스는 서비스 제공과 관련하여 서비스 화면 내에 광고를 게재할 수 있습니다.
                  </li>
                  <li>
                    서비스에 게재된 광고를 통하여 이루어지는 광고주와 이용자 간의 거래에 대해
                    서비스는 책임을 지지 않습니다.
                  </li>
                </ol>
              </section>

              {/* 제12조 손해배상 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">제12조 (손해배상의 제한)</h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    서비스는 무료로 제공되는 서비스와 관련하여 이용자에게 발생한 어떠한 손해에
                    대해서도 책임을 지지 않습니다.
                  </li>
                  <li>
                    서비스가 제공하는 정보의 이용으로 발생하는 투자 손실, 기회비용 손실, 데이터 손실
                    등에 대해 서비스는 책임을 지지 않습니다.
                  </li>
                </ol>
              </section>

              {/* 제13조 준거법 및 관할 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  제13조 (준거법 및 관할법원)
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>본 약관의 해석 및 적용에 관하여는 대한민국 법률을 적용합니다.</li>
                  <li>
                    서비스 이용과 관련하여 발생한 분쟁에 관하여는 민사소송법상의 관할법원에
                    제소합니다.
                  </li>
                </ol>
              </section>

              {/* 부칙 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">부칙</h2>
                <p>본 약관은 {effectiveDate}부터 시행됩니다.</p>
              </section>
            </div>

            {/* 하단 네비게이션 */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  홈으로 돌아가기
                </Link>
                <span className="text-muted">|</span>
                <Link href="/privacy" className="text-primary hover:underline">
                  개인정보처리방침
                </Link>
                <span className="text-muted">|</span>
                <Link href="/about" className="text-primary hover:underline">
                  서비스 소개
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
