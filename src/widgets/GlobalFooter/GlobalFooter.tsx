import Link from "next/link";

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className = "" }: GlobalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-border py-8 mt-12 ${className}`}
      role="contentinfo"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted">
          © {currentYear} NPS 13F 트래커. SEC 공개 데이터 기반 분석 서비스입니다.
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

        {/* 네비게이션 링크 */}
        <nav className="mt-6 text-xs text-muted" aria-label="사이트 네비게이션">
          <span className="mr-4">
            <Link href="/?tab=holdings" className="hover:text-primary transition-colors">
              보유종목
            </Link>
          </span>
          <span className="mr-4">
            <Link href="/?tab=activity" className="hover:text-primary transition-colors">
              매매내역
            </Link>
          </span>
          <span className="mr-4">
            <Link href="/sectors" className="hover:text-primary transition-colors">
              섹터분석
            </Link>
          </span>
          <span className="mr-4">
            <Link href="/reports" className="hover:text-primary transition-colors">
              분기리포트
            </Link>
          </span>
          <span>
            <Link href="/compare" className="hover:text-primary transition-colors">
              종목비교
            </Link>
          </span>
        </nav>
      </div>
    </footer>
  );
}

