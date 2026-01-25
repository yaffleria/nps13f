import Link from "next/link";

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className = "" }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-border mt-16 ${className}`} role="contentinfo">
      <div className="container mx-auto px-6 py-10">
        {/* 메인 콘텐츠 영역 */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 주요 네비게이션 */}
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
            aria-label="푸터 메인 네비게이션"
          >
            <Link
              href="/"
              className="px-3 py-2 text-secondary hover:text-foreground transition-colors"
            >
              포트폴리오
            </Link>
            <Link
              href="/sectors"
              className="px-3 py-2 text-secondary hover:text-foreground transition-colors"
            >
              섹터분석
            </Link>
            <Link
              href="/reports"
              className="px-3 py-2 text-secondary hover:text-foreground transition-colors"
            >
              분기리포트
            </Link>
            <Link
              href="/compare"
              className="px-3 py-2 text-secondary hover:text-foreground transition-colors"
            >
              종목비교
            </Link>
          </nav>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed">
            NPS US Stock Portfolio Analysis Service based on SEC 13F Filings
          </p>

          {/* Disclaimer */}
          <p className="text-xs text-muted/70 leading-loose">
            This site is not intended for investment advice.
            <br />
            All investment decisions must be made at your own discretion and responsibility.
          </p>

          {/* Legal Pages Links */}
          <nav
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs"
            aria-label="Legal Navigation"
          >
            <Link href="/about" className="text-muted hover:text-secondary transition-colors">
              About
            </Link>
            <span className="text-muted/40">|</span>
            <Link href="/terms" className="text-muted hover:text-secondary transition-colors">
              Terms
            </Link>
            <span className="text-muted/40">|</span>
            <Link href="/privacy" className="text-muted hover:text-secondary transition-colors">
              Privacy
            </Link>
            <span className="text-muted/40">|</span>
            <Link href="/disclaimer" className="text-muted hover:text-secondary transition-colors">
              Disclaimer
            </Link>
            <span className="text-muted/40">|</span>
            <Link href="/contact" className="text-muted hover:text-secondary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <div className="pt-4 text-xs text-muted/60">
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
