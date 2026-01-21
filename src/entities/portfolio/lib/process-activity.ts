import { PortfolioQuarter, ActivityItem, StockPosition } from "../types";

export function processActivity(
  current: PortfolioQuarter,
  previous: PortfolioQuarter | undefined,
): ActivityItem[] {
  if (!previous) return [];

  const activity: ActivityItem[] = [];
  const prevMap = new Map<string, StockPosition>(previous.holdings.map((h) => [h.cusip, h]));

  current.holdings.forEach((curr) => {
    const prev = prevMap.get(curr.cusip);

    if (!prev) {

      activity.push({
        symbol: curr.symbol,
        name: curr.securityName,
        sharesChanged: curr.shares,
        percentChange: 100,
        reportedPrice: curr.value / curr.shares,
        value: curr.value,
        portfolioImpact: (curr.value / current.totalValue) * 100, 
        history: "new",
        stock: curr,
      });
    } else if (curr.shares !== prev.shares) {

      const diff = curr.shares - prev.shares;
      const pctChange = (diff / prev.shares) * 100;
      activity.push({
        symbol: curr.symbol,
        name: curr.securityName,
        sharesChanged: diff,
        percentChange: pctChange, 
        reportedPrice: curr.value / curr.shares,
        value: diff * (curr.value / curr.shares), 
        portfolioImpact: (Math.abs(diff * (curr.value / curr.shares)) / previous.totalValue) * 100, 
        history: diff > 0 ? "buy" : "sell",
        stock: curr,
      });
    }

    prevMap.delete(curr.cusip);
  });

  prevMap.forEach((prev) => {
    activity.push({
      symbol: prev.symbol,
      name: prev.securityName,
      sharesChanged: -prev.shares,
      percentChange: -100,
      reportedPrice: prev.value / prev.shares, 
      value: prev.value,
      portfolioImpact: (prev.value / previous.totalValue) * 100,
      history: "exit",
      stock: prev,
    });
  });

  return activity.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}
