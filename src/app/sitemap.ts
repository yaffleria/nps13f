import { MetadataRoute } from "next";

const BASE_URL = "https://nps13f.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}?tab=holdings`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}?tab=activity`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // SEO를 위한 주요 키워드 기반 대체 URL (검색 엔진 색인용)
  const keywordPages: MetadataRoute.Sitemap = [
    // 국민연금 관련 검색어
    {
      url: `${BASE_URL}/#portfolio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...staticPages, ...keywordPages];
}
