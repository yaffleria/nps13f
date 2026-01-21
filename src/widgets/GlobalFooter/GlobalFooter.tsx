import Link from "next/link";

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className = "" }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-border mt-16 ${className}`}
      role="contentinfo"
    >
      <div className="container mx-auto px-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* 네비게이션 */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm mb-2" aria-label="푸터 네비게이션">
            <Link href="/" className="px-3 py-2 text-secondary hover:text-foreground transition-colors">
              포트폴리오
            </Link>
            <Link href="/sectors" className="px-3 py-2 text-secondary hover:text-foreground transition-colors">
              섹터분석
            </Link>
            <Link href="/reports" className="px-3 py-2 text-secondary hover:text-foreground transition-colors">
              분기리포트
            </Link>
            <Link href="/compare" className="px-3 py-2 text-secondary hover:text-foreground transition-colors">
              종목비교
            </Link>
          </nav>

          {/* 설명 */}
          <p className="text-sm text-muted leading-relaxed mb-1">
            SEC 13F 공시 기반 국민연금 미국 주식 포트폴리오 분석 서비스
          </p>

          {/* 면책 조항 */}
          <p className="text-xs text-muted/70 leading-loose mb-1">
            본 사이트는 투자 권유 목적이 아닙니다.<br />
            모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
          </p>

          {/* 저작권 */}
          <div className="pt-6 text-xs text-muted/60">
            <p>
              © {currentYear} NPS 13F · 
              <a
                href="https://x.com/charlotteprism"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hover:text-foreground transition-colors"
              >
                @charlotte
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

