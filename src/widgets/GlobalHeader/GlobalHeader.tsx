"use client";

import Link from "next/link";
import Image from "next/image";

export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/nps-logo-only.png" alt="NPS 13F Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
            국민연금 13F
          </span>
        </Link>

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
      </div>
    </header>
  );
}
