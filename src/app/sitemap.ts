import { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioQuarter } from "@/entities/portfolio/types";

const BASE_URL = "https://www.nps13f.com";

async function getPortfolioData(): Promise<PortfolioQuarter[]> {
  const filePath = path.join(process.cwd(), "src/shared/data/sec-data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolioData();

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(data[0].date),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sectors`,
      lastModified: new Date(data[0].date),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/reports`,
      lastModified: new Date(data[0].date),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(data[0].date),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // 법적 페이지 (애드센스 필수)
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 개별 종목 페이지
  const symbolSet = new Set<string>();
  data.forEach((q) => {
    q.holdings.forEach((h) => {
      symbolSet.add(h.symbol.toUpperCase());
    });
  });

  const stockPages: MetadataRoute.Sitemap = Array.from(symbolSet).map((symbol) => ({
    url: `${BASE_URL}/stocks/${symbol}`,
    lastModified: new Date(data[0].date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 섹터 페이지
  const sectors = [
    "technology",
    "healthcare",
    "financial-services",
    "consumer-cyclical",
    "communication-services",
    "industrials",
    "consumer-defensive",
    "energy",
    "utilities",
    "real-estate",
    "basic-materials",
    "other",
  ];

  const sectorPages: MetadataRoute.Sitemap = sectors.map((sector) => ({
    url: `${BASE_URL}/sectors/${sector}`,
    lastModified: new Date(data[0].date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 분기별 리포트 페이지
  const reportPages: MetadataRoute.Sitemap = data.map((q) => ({
    url: `${BASE_URL}/reports/${q.year}-q${q.quarter}`,
    lastModified: new Date(q.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...stockPages, ...sectorPages, ...reportPages];
}
