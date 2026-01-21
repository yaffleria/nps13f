import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO 최적화: 이미지 최적화 및 외부 도메인 허용
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },

  // 압축 활성화 (Vercel 배포 시 자동이지만 명시적으로 설정)
  compress: true,

  // 보안 헤더 (SEO에도 긍정적 영향)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // 정적 자산 캐싱 (성능 향상 → SEO 긍정적)
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)\\.(js|css)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // 리다이렉트 (오래된 URL이나 대체 URL 처리)
  async redirects() {
    return [
      // www 리다이렉트 (SEO 중복 콘텐츠 방지)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.nps13f.com",
          },
        ],
        destination: "https://nps13f.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
