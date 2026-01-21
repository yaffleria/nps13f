import { FAQItem } from "@/shared/ui/FAQSection";

// 종목별 FAQ 생성 유틸리티
export function generateStockFAQ(
  symbol: string,
  securityName: string,
  shares: number,
  value: number,
  portfolioPercent: number,
  sharesChange: number,
  quarterLabel: string,
): FAQItem[] {
  const formatNumber = (n: number) => n.toLocaleString("ko-KR");
  const formatValue = (n: number) => {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    return formatNumber(n);
  };

  const changeDescription =
    sharesChange > 0
      ? `${formatNumber(sharesChange)}주 추가 매수`
      : sharesChange < 0
        ? `${formatNumber(Math.abs(sharesChange))}주 매도`
        : "변동 없음";

  return [
    {
      question: `국민연금이 ${securityName}(${symbol})을 얼마나 보유하고 있나요?`,
      answer: `${quarterLabel} 기준, 국민연금은 ${securityName}(${symbol})을 ${formatNumber(shares)}주, 약 $${formatValue(value)} 규모로 보유하고 있습니다.`,
    },
    {
      question: `국민연금이 최근 ${symbol}을 매수했나요, 매도했나요?`,
      answer: `${quarterLabel} 기준 전분기 대비 ${changeDescription}했습니다. SEC 13F 공시는 분기별로 업데이트됩니다.`,
    },
    {
      question: `국민연금 포트폴리오에서 ${symbol} 비중은 얼마인가요?`,
      answer: `${symbol}은 국민연금 미국 주식 포트폴리오의 약 ${portfolioPercent.toFixed(2)}%를 차지하고 있습니다.`,
    },
    {
      question: `국민연금의 ${symbol} 투자 내역은 어디서 확인하나요?`,
      answer: `국민연금의 미국 주식 투자 내역은 SEC 13F 공시를 통해 분기별로 공개됩니다. 이 페이지에서 최신 보유 현황과 분기별 변동 내역을 확인하실 수 있습니다.`,
    },
  ];
}
