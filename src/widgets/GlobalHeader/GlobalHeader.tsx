"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Calendar, GitCompareArrows } from "lucide-react";

export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="w-full flex items-center justify-between gap-6">
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
          <nav className="flex items-center gap-1">
            <Link
              href="/sectors"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:block">섹터</span>
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:block">리포트</span>
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
            >
              <GitCompareArrows className="w-4 h-4" />
              <span className="hidden sm:block">비교</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
