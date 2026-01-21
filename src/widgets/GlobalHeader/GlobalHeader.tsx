"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Calendar, GitCompareArrows, Mail } from "lucide-react";

export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/nps13f-logo.jpg"
                alt="NPS 13F Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
              국민연금 13F
            </span>
          </Link>

          {/* 네비게이션 링크 */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/sectors"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>섹터</span>
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>리포트</span>
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <GitCompareArrows className="w-4 h-4" />
              <span>비교</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://x.com/charlotteprism"
            target="_blank"
            rel="noreferrer"
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Follow on X (Twitter)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="mailto:yaffleria@gmail.com"
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Send email for feedback or reports"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
