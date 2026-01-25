"use client";

import { Share2, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  label?: string;
}

export function ShareButton({ title, text, label = "공유하기" }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      // 현재 페이지의 OG 이미지 URL 추정 (로컬, 배포 환경 모두 대응)
      const imageUrl = `${window.location.origin}/share-banner.jpg`;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: title,
          description: text,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "자세히 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert("카카오톡 기능을 사용할 수 없습니다. 잠시 건너뛰거나 일반 공유를 이용해주세요.");
    }
  };

  return (
    <div className="flex items-center gap-2 mb-6 sm:mb-0">
      {/* 제작자 X 링크 */}
      <a
        href="https://x.com/charlotteprism"
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-background hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-secondary hover:text-foreground text-xs sm:text-sm font-medium whitespace-nowrap"
        aria-label="제작자 X(Twitter) 프로필 방문"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        @charlotte
      </a>

      {/* 기본 공유 (Web Share API) */}
      <button
        onClick={handleShare}
        className="h-10 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-background hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-secondary hover:text-foreground text-xs sm:text-sm font-medium whitespace-nowrap"
      >
        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        {label}
      </button>

      {/* 카카오톡 공유 */}
      <button
        onClick={handleKakaoShare}
        className="h-10 px-4 py-2 bg-[#FAE100] hover:bg-[#FDD835] text-[#371D1E] border border-[#FAE100] rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-bold whitespace-nowrap"
      >
        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
        카카오톡
      </button>
    </div>
  );
}
