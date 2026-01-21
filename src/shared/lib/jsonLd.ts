import { PortfolioQuarter } from "@/entities/portfolio/types";

const BASE_URL = "https://nps13f.com";

// Organization JSON-LD
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NPS 13F 트래커",
    url: BASE_URL,
    logo: `${BASE_URL}/nps13f-logo.jpg`,
    description: "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 포트폴리오 분석 서비스",
    foundingDate: "2025",
    sameAs: ["https://x.com/charlotteprism"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://x.com/charlotteprism",
    },
  };
}

// WebSite JSON-LD for sitelinks searchbox
export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NPS 13F - 국민연금 미국주식 포트폴리오 트래커",
    alternateName: ["국민연금 13F", "NPS 포트폴리오", "국민연금 미국주식"],
    url: BASE_URL,
    description: "국민연금(NPS)의 SEC 13F 공시 기반 미국 주식 보유 현황을 확인하세요.",
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: "NPS 13F 트래커",
      url: BASE_URL,
    },
  };
}

// Dataset JSON-LD for financial data
export function getDatasetJsonLd(latestQuarter?: PortfolioQuarter) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "국민연금 SEC 13F 보유 현황",
    description:
      "국민연금(National Pension Service of Korea)의 미국 증권거래위원회(SEC) 13F 분기별 보유 주식 데이터",
    url: BASE_URL,
    license: "https://www.sec.gov/about/copyright",
    creator: {
      "@type": "Organization",
      name: "U.S. Securities and Exchange Commission",
      url: "https://www.sec.gov",
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl: `${BASE_URL}`,
      encodingFormat: "text/html",
    },
    temporalCoverage: latestQuarter
      ? `${latestQuarter.year} Q${latestQuarter.quarter}`
      : "2024/2025",
    spatialCoverage: {
      "@type": "Place",
      name: "United States",
    },
    keywords: [
      "국민연금",
      "NPS",
      "13F",
      "SEC",
      "미국주식",
      "포트폴리오",
      "연기금",
      "주식투자",
      "기관투자자",
    ],
  };
}

// FAQPage JSON-LD for common questions
export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "국민연금 13F란 무엇인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "13F는 미국 증권거래위원회(SEC)에 제출하는 분기별 보고서로, 운용 자산이 1억 달러 이상인 기관투자자가 보유한 미국 주식을 공시합니다. 국민연금(NPS)도 미국 주식을 보유하고 있어 매 분기 13F 보고서를 제출합니다.",
        },
      },
      {
        "@type": "Question",
        name: "국민연금은 어떤 미국 주식을 보유하고 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "국민연금은 Apple(AAPL), Microsoft(MSFT), Amazon(AMZN), NVIDIA(NVDA) 등 주요 빅테크 기업을 포함한 수백 개의 미국 주식을 보유하고 있습니다. 자세한 보유 현황은 NPS 13F 사이트에서 확인할 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "13F 데이터는 얼마나 자주 업데이트되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SEC 13F 보고서는 분기별로 제출됩니다. 각 분기 종료 후 45일 이내에 제출되며, 본 사이트는 최신 공시 데이터를 반영하여 업데이트됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "국민연금 투자 정보를 어디서 확인할 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NPS 13F 사이트(nps13f.com)에서 국민연금의 미국 주식 보유 현황, 분기별 매수/매도 내역, 포트폴리오 비중 등을 무료로 확인할 수 있습니다.",
        },
      },
    ],
  };
}

// BreadcrumbList JSON-LD
export function getBreadcrumbJsonLd(items: { name: string; url: string }[] = []) {
  const defaultItems = [{ name: "홈", url: BASE_URL }];
  const allItems = [...defaultItems, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FinancialProduct JSON-LD (for better financial search results)
export function getFinancialServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "NPS 13F 포트폴리오 트래커",
    description:
      "국민연금의 SEC 13F 공시 데이터를 분석하여 미국 주식 보유 현황을 제공하는 무료 서비스",
    url: BASE_URL,
    areaServed: {
      "@type": "Country",
      name: "South Korea",
    },
    serviceType: "Investment Analysis",
    provider: {
      "@type": "Organization",
      name: "NPS 13F 트래커",
    },
  };
}

// 모든 JSON-LD를 합친 결과
export function getAllJsonLd(latestQuarter?: PortfolioQuarter) {
  return [
    getOrganizationJsonLd(),
    getWebsiteJsonLd(),
    getDatasetJsonLd(latestQuarter),
    getFaqJsonLd(),
    getBreadcrumbJsonLd(),
    getFinancialServiceJsonLd(),
  ];
}
