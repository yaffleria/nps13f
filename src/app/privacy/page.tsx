import { Metadata } from "next";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { GlobalFooter } from "@/widgets/GlobalFooter/GlobalFooter";
import { FadeIn } from "@/shared/ui/FadeIn";

export const metadata: Metadata = {
  title: "개인정보처리방침 - NPS 13F",
  description: "NPS 13F 개인정보처리방침. 개인정보 수집, 이용, 보호에 관한 정책을 안내합니다.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
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
                개인정보처리방침
              </h1>
              <p className="text-secondary">
                시행일: {effectiveDate} | 최종 수정일: {currentDate}
              </p>
            </header>

            <div className="space-y-10 text-secondary leading-relaxed">
              {/* 개요 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">1. 개요</h2>
                <p>
                  NPS 13F (이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보
                  보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을
                  준수합니다.
                </p>
                <p className="mt-3">
                  본 개인정보처리방침은 서비스 이용 시 수집되는 개인정보의 항목, 수집 및 이용 목적,
                  보유 기간, 제3자 제공, 이용자의 권리 등에 대해 안내합니다.
                </p>
              </section>

              {/* 수집하는 개인정보 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  2. 수집하는 개인정보 항목
                </h2>
                <p>
                  서비스는 별도의 회원가입 없이 이용 가능하며, 다음과 같은 정보가 자동으로 수집될 수
                  있습니다:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>자동 수집 정보:</strong> IP 주소, 브라우저 유형, 운영체제, 방문 일시,
                    페이지 열람 기록, 쿠키, 접속 로그
                  </li>
                  <li>
                    <strong>기기 정보:</strong> 기기 식별자, 화면 해상도, 언어 설정
                  </li>
                </ul>
              </section>

              {/* 개인정보 수집 및 이용 목적 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  3. 개인정보 수집 및 이용 목적
                </h2>
                <p>수집된 정보는 다음의 목적으로 이용됩니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>서비스 제공 및 운영</li>
                  <li>서비스 이용 통계 분석 및 개선</li>
                  <li>부정 이용 방지 및 서비스 안정성 확보</li>
                  <li>맞춤형 광고 제공 (제3자 광고 서비스 이용 시)</li>
                </ul>
              </section>

              {/* 쿠키 및 추적 기술 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  4. 쿠키(Cookie) 및 추적 기술
                </h2>
                <p>
                  서비스는 이용자 경험 개선 및 통계 분석을 위해 쿠키를 사용합니다. 쿠키는 웹사이트가
                  이용자의 브라우저에 저장하는 작은 텍스트 파일입니다.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  4.1 사용되는 서비스
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> 웹사이트 트래픽 분석 및 이용 패턴 파악
                    <br />
                    <span className="text-sm text-muted">
                      자세한 내용:{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google 개인정보처리방침
                      </a>
                    </span>
                  </li>
                  <li>
                    <strong>Google AdSense:</strong> 맞춤형 광고 제공
                    <br />
                    <span className="text-sm text-muted">
                      자세한 내용:{" "}
                      <a
                        href="https://policies.google.com/technologies/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google 광고 정책
                      </a>
                    </span>
                  </li>
                  <li>
                    <strong>Vercel Analytics:</strong> 웹사이트 성능 모니터링
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.2 쿠키 관리</h3>
                <p>
                  이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 단,
                  쿠키를 비활성화할 경우 일부 서비스 기능이 제한될 수 있습니다.
                </p>
              </section>

              {/* 개인정보 보유 기간 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  5. 개인정보 보유 및 이용 기간
                </h2>
                <p>
                  자동 수집되는 접속 로그 및 이용 기록은 서비스 운영 및 분석 목적으로 수집일로부터
                  <strong> 1년간</strong> 보관 후 파기됩니다.
                </p>
                <p className="mt-3">
                  단, 관련 법령에 의해 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.
                </p>
              </section>

              {/* 제3자 제공 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">6. 개인정보의 제3자 제공</h2>
                <p>
                  서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의
                  경우에는 예외로 합니다:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>
                    법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라
                    수사기관의 요구가 있는 경우
                  </li>
                </ul>
              </section>

              {/* 광고 관련 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">7. 온라인 맞춤형 광고</h2>
                <p>
                  서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를 사용하여
                  이용자의 관심사에 기반한 맞춤형 광고를 표시할 수 있습니다.
                </p>
                <p className="mt-3">
                  맞춤형 광고를 원하지 않는 경우, Google의{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    광고 설정
                  </a>
                  에서 비활성화할 수 있습니다.
                </p>
              </section>

              {/* 이용자의 권리 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">8. 이용자의 권리</h2>
                <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>개인정보 열람 요청</li>
                  <li>개인정보 정정 요청</li>
                  <li>개인정보 삭제 요청</li>
                  <li>개인정보 처리 정지 요청</li>
                </ul>
                <p className="mt-4">위 권리 행사는 아래 연락처를 통해 요청하실 수 있습니다.</p>
              </section>

              {/* 개인정보 보호책임자 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">9. 개인정보 보호 및 문의</h2>
                <p>
                  개인정보 처리에 관한 업무를 총괄하며, 관련 문의사항은 아래로 연락해 주시기
                  바랍니다:
                </p>
                <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
                  <p>
                    <strong>이메일:</strong> yaffleria@gmail.com
                  </p>
                  <p className="mt-2">
                    <strong>문의 채널:</strong>{" "}
                    <a
                      href="https://x.com/charlotteprism"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      X (Twitter) @charlotteprism
                    </a>
                  </p>
                </div>
              </section>

              {/* 아동 보호 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">10. 아동의 개인정보 보호</h2>
                <p>
                  본 서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 의도적으로 만 14세 미만
                  아동의 개인정보를 수집하지 않습니다. 만약 만 14세 미만 아동의 개인정보가 수집된
                  사실을 인지하게 되면, 해당 정보를 즉시 삭제하겠습니다.
                </p>
              </section>

              {/* 개정 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  11. 개인정보처리방침의 변경
                </h2>
                <p>
                  본 개인정보처리방침은 법령, 정책 또는 서비스 변경 사항을 반영하기 위해 수정될 수
                  있습니다. 변경 시 웹사이트 공지사항을 통해 안내하며, 변경된 방침은 공지 후 7일
                  후부터 효력이 발생합니다.
                </p>
              </section>

              {/* 국제 이용자 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">12. 국제 이용자 안내</h2>
                <p>
                  본 서비스는 대한민국에서 운영되며, 대한민국 법률의 적용을 받습니다. 해외에서
                  서비스를 이용하는 경우, 귀하의 정보가 대한민국의 서버에 저장 및 처리될 수 있음을
                  인지하시기 바랍니다.
                </p>
              </section>
            </div>

            {/* 하단 네비게이션 */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary hover:underline">
                  홈으로 돌아가기
                </Link>
                <span className="text-muted">|</span>
                <Link href="/terms" className="text-primary hover:underline">
                  이용약관
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
